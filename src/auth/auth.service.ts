import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateEntity } from './entities/create.entity';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { MailerService } from '@nestjs-modules/mailer';
import { Model } from 'mongoose';
import { User } from '../user/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { AuthRequest } from './request.interface';
import { randomBytes } from 'crypto';
import axios from 'axios';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UserDocument } from '../user/types/user.type';

/**
 * AuthService handles authentication and authorization logic in the application.
 * It provides methods for user registration, login, token generation, validation,
 * and refreshing tokens. It also integrates with other services like UserService,
 * OrgService, MailerService, and AwsSecretService to perform various tasks.
 */
@Injectable()
export class AuthService extends JwtService {
  private CLIENT_APP_URL;
  private ADMIN_APP_URL;
  /**
   * Creates an instance of AuthService.
   * @param jwtService - An instance of the JwtService provided by @nestjs/jwt.
   * @param userService - An instance of the UserService.
   * @param orgService - An instance of the OrgService.
   * @param mailerService - An instance of the MailerService.
   * @param awsSecretService - An instance of the AwsSecretService.
   * @param userModel - The Mongoose Model for the User schema.
   */
  constructor(
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    @Inject(MailerService) private mailerService: MailerService,
    @InjectModel('User') private userModel: Model<User>,
  ) {
    super();
    this.loadSecret();
  }

  /**
   * Loads secret values from the AwsSecretService.
   * It sets the CLIENT_APP_URL and ADMIN_APP_URL properties.
   */
  async loadSecret() {
    this.CLIENT_APP_URL = await this.awsSecretService.getValue(
      KeysName.CLIENT_APP_URL,
    );
    this.ADMIN_APP_URL = await this.awsSecretService.getValue(
      KeysName.ADMIN_APP_URL,
    );
  }
  /**
   * Loads secret values from the ConfigService.
   * It sets the CLIENT_APP_URL and ADMIN_APP_URL properties.
   */

  /**
   * Generates a magic link for authentication based on the user's role.
   * @param token - The access token used in the magic link.
   * @param role - The user's role.
   * @returns The generated magic link.
   * @throws UnauthorizedException if the user role is not recognized.
   */
  async createMagicLink(token: string, role: string) {
    await this.loadSecret();

    if (role === 'operator' || role === 'admin' || role === 'onboarder') {
      const magicLink = `${this.CLIENT_APP_URL}/auth?token=${token}`; // setup a config for local, staging and prod
      return magicLink;
    } else if (role === 'superadmin' || role === 'support') {
      const magicLink = `${this.ADMIN_APP_URL}/auth?token=${token}`; // setup a config for local, staging and prod
      return magicLink;
    } else {
      throw new UnauthorizedException('User Role not recognised');
    }
  }
  /**
   * Authenticates a user based on their login credentials.
   * @param loginAuthDto - The login information provided by the user.
   * @returns A promise that resolves to a string or void.
   * @throws NotFoundException if the user email is not associated with an organization.
   */

  async login(loginAuthDto: LoginAuthDto): Promise<string | void> {
    await this.loadSecret();
    const { email } = loginAuthDto;
    const user = await this.userService.findByEmailForRegister(email);
    if (user) {
      return this.sendMagicLink(user, user.role);
    }
    throw new NotFoundException('User email provided is not available');
  }
  async checkDisposableEmail(email: string): Promise<boolean> {
    const res = axios.get(`https://open.kickbox.com/v1/disposable/${email}`);
    return (await res).data.disposable;
  }

  /**
   * Registers a new user and their associated organization.
   * @param registerAuthDto - The registration information provided by the user.
   * @returns A promise that resolves to a string or void.
   * @throws BadRequestException if the user email or organization already exists.
   */
  async register(registerAuthDto: RegisterAuthDto): Promise<string | void> {
    try {
      await this.loadSecret();
      const { email, orgName } = registerAuthDto;
      const disposable = await this.checkDisposableEmail(email);
      if (disposable) {
        throw new BadRequestException('Disposable email not allowed');
      }
      const user = await this.userService.findByEmailForRegister(email);
      const org = await this.orgService.findByNameForRegister(orgName);
      if (user || org) {
        throw new BadRequestException('User email or Org already exist');
      }
      const newOrgObject = {
        orgName: orgName,
        orgType: registerAuthDto.orgType,
        accountType: registerAuthDto.accountType,
        TFID: this.generateTFID(orgName),
      };

      const newOrg = await this.orgService.create(newOrgObject);
      const registerUserData: CreateEntity = {
        role: 'onboarder',
        orgID: newOrg._id,
        email: email,
        orgName: orgName,
        title: registerAuthDto.title,
        firstName: registerAuthDto.firstName,
        lastName: registerAuthDto.lastName,
        mobileNumber: registerAuthDto.mobileNumber,
        language: registerAuthDto.language,
        residentialCountry: registerAuthDto.residentialCountry.country,
        residentialCountryIso2: registerAuthDto.residentialCountry.isoCode2,
        residentialCountryIso3: registerAuthDto.residentialCountry.isoCode3,
        phoneCode: registerAuthDto.residentialCountry.countryCode,
        accountType: registerAuthDto.accountType,
      };
      const createdUser = await this.userService.create(registerUserData);
      return this.sendMagicLink(createdUser, createdUser.role);
    } catch (err) {
      throw new BadRequestException(`Register User : ${err}`);
    }
  }
  /**
   * Sends a magic link to the user's email for authentication.
   * @param user - The user to whom the magic link will be sent.
   * @param role - The user's role.
   * @returns A promise that resolves to a string.
   */
  private async sendMagicLink(
    user: UserDocument,
    role: string,
  ): Promise<string> {
    await this.loadSecret();
    const { magicToken } = this.generateMagicToken(user);
    const magicLink = await this.createMagicLink(magicToken, role);
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Subject',
      template: 'magicLinkAuth',
      context: {
        magicLink,
        firstName: user.firstName || user.email.split('@')[0].split('.')[0],
        lastName: user.lastName || '',
      },
    });
    return 'Emailed';
  }

  /**
   *Validates a user's token and retrieves the user's information.
   *@param token - The user's access token.
   *@returns A promise that resolves to the user document.
   *@throws UnauthorizedException if the token is invalid.
   */
  async validateUser(token: string) {
    await this.loadSecret();

    try {
      const { email } = await this.jwtService.verify(token);
      console.log(token);
      const user = await this.userService.findByEmailForRegister(email);
      if (user) {
        const { accessToken, refreshToken } = this.generateTokens(user);
        user.refreshToken = refreshToken;
        user.accessToken = accessToken;
        await user.save();
        return user.populate({
          path: 'orgID',
          select:
            'TFID orgName orgType countryOfIncorporation accountType status',
        });
      }
      return null;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async validateMagicLink(req: AuthRequest, res: Response) {
    await this.loadSecret();

    try {
      const user = req.user;
      if (user) {
        // remove redundant

        res.cookie('accessToken', user.accessToken, {
          httpOnly: true,
          sameSite: 'none',
          secure: true,
        });
        res.cookie('refreshToken', user.refreshToken, {
          httpOnly: true,
          sameSite: 'none',
          secure: true,
        });
        const populatedUser = await user.populate([
          {
            path: 'orgID',
            select:
              'TFID orgName orgType countryOfIncorporation accountType status walletAddress',
            populate: {
              path: 'wallex',
              select: 'wallexId accountId KYCStatus',
            },
          },
          {
            path: 'identificationDocs',
            select: 'fileName fileType fileS3Url _updatedAt _createdAt',
          },
          {
            path: 'residencialAddressProof',
            select: 'fileName fileType fileS3Url _updatedAt _createdAt',
          },
          {
            path: 'OtherDocs',
            select: 'fileName fileType fileS3Url _updatedAt _createdAt',
          },
        ]);
        res.status(200).send(populatedUser);
      }
      return null;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
  /**
   * Validates a refresh token and checks if it belongs to a valid user.
   * @param payload - The payload of the refresh token.
   * @returns A boolean indicating whether the refresh token is valid.
   */
  async validateToken(payload: any, isRefreshToken: boolean) {
    try {
      await this.loadSecret();
      const { token } = payload;
      const decodedToken = await this.jwtService.verify(token);

      // If we're expecting an access token and the token has the `isRefreshToken` field, it's invalid
      if (!isRefreshToken && decodedToken.hasOwnProperty('isRefreshToken')) {
        return false;
      }

      // If we're expecting a refresh token and the token doesn't have the `isRefreshToken` field, it's invalid
      if (isRefreshToken && !decodedToken.isRefreshToken) {
        return false;
      }

      const { email } = decodedToken;
      const user = await this.userService.findByEmail(email);

      if (user) {
        return true;
      }
      return false;
    } catch (error) {
      // Log the error and rethrow it or throw a new error
      return false;
    }
  }

  async validateAccessToken(payload: any) {
    return await this.validateToken(payload, false);
  }

  async validateRefreshToken(payload: any) {
    return await this.validateToken(payload, true);
  }

  /**
   * Logs out a user by deleting their refresh token from the database.
   * @param userId - The ID of the user.
   */
  async logout(userId: string, res: Response): Promise<void> {
    await this.loadSecret();

    await this.userService.deleteRefreshToken(userId);
    await this.userService.deleteAccessToken(userId);
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    res.status(201).send({
      message: 'Logged out successfully',
    });
  }
  /**
   * Adds superadmin users to the application.
   * @param emails - An array of email addresses for the superadmin users.
   * @throws BadRequestException if the user email already exists.
   */
  async addSuperAdmin(emails: string[]) {
    await this.loadSecret();

    emails.forEach((email) => {
      const user = this.userModel.findOne({ email }).exec();
      if (!user) {
        const registerUserData = {
          role: 'superadmin',
          email: email,
        };
        this.userModel.create(registerUserData);
      } else {
        throw new BadRequestException('User email already exist');
      }
    });
  }

  /**
   * Adds support users to the application.
   * @param emails - An array of email addresses for the support users.
   */
  async addSupport(emails: string[]) {
    await this.loadSecret();

    emails.forEach((email) => {
      const user = this.userModel.findOne({ email }).exec();
      if (!user) {
        const registerUserData = {
          role: 'support',
          email: email,
        };
        this.userModel.create(registerUserData);
      }
    });
  }
  /**
   * Generates access and refresh tokens for a user.
   * @param user - The user for whom tokens will be generated.
   * @returns An object containing the access and refresh tokens.
   */
  generateTokens(
    user: UserDocument,
    flag = true,
  ): {
    accessToken: string;
    refreshToken: string;
  } {
    const payload = { email: user.email, role: user.role, userId: user.id };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '3h',
    });
    let refreshToken = null;
    if (flag) {
      const refreshTokenPayload = { ...payload, isRefreshToken: true };
      refreshToken = this.jwtService.sign(refreshTokenPayload, {
        expiresIn: '7d',
      });
    }

    return { accessToken, refreshToken };
  }

  generateMagicToken(user: UserDocument): { magicToken: string } {
    const payload = { email: user.email, role: user.role, userId: user.id };
    const magicToken = this.jwtService.sign(payload, {
      expiresIn: '1d',
    });
    return { magicToken };
  }

  /**
   * Refreshes an access token using a refresh token.
   * @param refreshToken - The refresh token.
   * @returns An object containing the new access token.
   * @throws UnauthorizedException if the refresh token is invalid.
   */
  async refreshToken(
    refreshToken: string,
    flag = false,
  ): Promise<UserDocument> {
    try {
      const decoded = await this.jwtService.verify(refreshToken);
      if (!decoded.isRefreshToken) {
        throw new UnauthorizedException('Invalid token');
      }

      const user = await this.userService.findById(decoded.userId);
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      let updatedUser;
      if (flag) {
        const { accessToken, refreshToken } = this.generateTokens(user, flag);
        updatedUser = await this.userModel.findByIdAndUpdate(
          user._id,
          {
            accessToken,
            refreshToken,
          },
          {
            new: true,
          },
        );
      } else {
        const { accessToken } = this.generateTokens(user, flag);
        updatedUser = await this.userModel.findByIdAndUpdate(
          user._id,
          {
            accessToken,
          },
          {
            new: true,
          },
        );
      }
      return updatedUser;
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
