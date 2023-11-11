// api-key-validation.middleware.ts
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { KeysName } from '../KeyName';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyValidationMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.headers['x-api-key'] as string;
    const validApiKey = await this.configService.get<string>(KeysName.API_KEY);

    if (apiKey && apiKey === validApiKey) {
      next();
    } else {
      throw new UnauthorizedException('Invalid API key');
    }
  }
}
