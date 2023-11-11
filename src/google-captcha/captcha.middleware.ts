import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CaptchaService } from './captcha.service';

@Injectable()
export class CaptchaMiddleware implements NestMiddleware {
  constructor(private readonly captchaService: CaptchaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const captchaResponse = req.headers['g-captcha-response'];
    if (!captchaResponse) {
      throw new BadRequestException('Missing CAPTCHA response');
    }

    const isValid = await this.captchaService.verifyCaptcha(
      captchaResponse.toString(),
    );

    if (!isValid) {
      throw new BadRequestException('Invalid CAPTCHA');
    }

    next();
  }
}
