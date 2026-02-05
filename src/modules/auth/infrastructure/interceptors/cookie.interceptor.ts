import { Injectable, NestInterceptor, ExecutionContext, CallHandler} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CookieInterceptor implements NestInterceptor {

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    const response = context.switchToHttp().getResponse();

     return next.handle().pipe( tap((data) => { //data is whatever the controller returns.

      //Set Refresh Token as HTTP Only Cookie In Login Request
      if (data?.refresh_token) response.cookie('refresh_token', data.refresh_token,
      {
        httpOnly: true,
        secure: false,
        sameSite: 'strict' as const,
        maxAge: 60 * 60 * 1000,
      });

      delete data.refresh_token;

       //Clear Cookie on Logout Request
       if (data?.logout) response.clearCookie('refresh_token');
      
    }))

  }
}
