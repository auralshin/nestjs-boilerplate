import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import {
  ApiTags,
  ApiHeader,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiOperation,
} from '@nestjs/swagger';
import { TokenAuthDto } from './dto/token.dto';
import { UserAndSupportRoleGuard } from '../role/role.guard';
import { AuthRequest } from './request.interface';
import { Response } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a user' })
  @ApiBody({ type: RegisterAuthDto })
  @ApiResponse({
    status: 200,
    description: 'Sends Email to the email provided in the body',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  register(@Body() registerAuth: RegisterAuthDto) {
    return this.authService.register(registerAuth);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiBody({ type: LoginAuthDto })
  @ApiResponse({
    status: 200,
    description: 'Sends Email to the email provided in the body',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  login(@Body() LoginAuth: LoginAuthDto) {
    return this.authService.login(LoginAuth);
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validate a user' })
  @ApiBody({ type: TokenAuthDto })
  @ApiResponse({
    status: 200,
    description: 'send boolean true or false',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  validate(@Body() token: TokenAuthDto) {
    return this.authService.validateUser(token.token);
  }

  @Get('validate')
  @ApiOperation({ summary: 'Validate a user' })
  @UseGuards(UserAndSupportRoleGuard)
  validateMagicLink(@Req() req: AuthRequest, @Res() res: Response) {
    return this.authService.validateMagicLink(req, res);
  }

  @Post('logout/:id')
  @ApiOperation({ summary: 'Logout a user' })
  @ApiResponse({
    status: 200,
    description: 'Logout successful',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  logout(@Param('id') id: string, @Res() res: Response) {
    return this.authService.logout(id, res);
  }
}
