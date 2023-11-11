import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import axios from 'axios';
import { KeysName } from '../KeyName';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CaptchaService {
  private RECAPTCHA_SECRET_KEY;
  constructor(@Inject(ConfigService) private configService: ConfigService) {}

  async loadSecret() {
    this.RECAPTCHA_SECRET_KEY = await this.configService.get<string>(
      KeysName.GOOGLE_CAPTCHA,
    );
  }

  async verifyCaptcha(captchaResponse: string): Promise<boolean> {
    await this.loadSecret();
    console.log(this.RECAPTCHA_SECRET_KEY);

    try {
      const url = 'https://www.google.com/recaptcha/api/siteverify';
      const params = new URLSearchParams();
      params.append('secret', this.RECAPTCHA_SECRET_KEY);
      params.append('response', captchaResponse);

      const response = await axios.post(url, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      console.log(response.data.score);
      if (response.data.score > 0.5) {
        return true;
      } else {
        throw new BadRequestException('Kindly reload the page and try again');
      }
    } catch (error) {
      throw new BadRequestException(`Kindly reload the page and try again`);
    }
  }
}
