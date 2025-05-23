import {HttpEvent, HttpHandlerFn, HttpRequest} from "@angular/common/http";
import {Observable} from 'rxjs';
import {inject} from '@angular/core';
import {AuthService} from './auth/auth.service';

export function csrfInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);
  const csrfReq = req.clone({
    headers:req.headers.set("X-CSRF-Token",  authService.csrfToken())
  });
  return next(csrfReq);
}


