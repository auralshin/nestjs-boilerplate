import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthRequest } from './request.interface';
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: AuthRequest, res: Response, next: any) {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return next();
    }
    const [scheme, token] = authorizationHeader.split(' ');
    if (scheme !== 'Bearer') {
      return next();
    }
    const user = await this.authService.validateUser(token);
    if (!user) {
      return next();
    }
    req.user = user;
    next();
  }
}
