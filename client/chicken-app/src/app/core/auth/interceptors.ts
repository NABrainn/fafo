import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const jwt = localStorage.getItem('token') || '';
    const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${jwt}`)
    });    
    return next(authReq);
}