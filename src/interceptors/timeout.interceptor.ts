import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  RequestTimeoutException,
  BadRequestException,
} from '@nestjs/common';
import { Observable, TimeoutError, throwError } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const timeoutValue = Number(request.headers.timeout) || 10000;

    return next.handle().pipe(
      timeout(timeoutValue),
      catchError((err) => {
        if (err) {
          throw new RequestTimeoutException('TimeOut Error');
        }
        throw new BadRequestException(`${err}`);
      }),
    );
  }
}
