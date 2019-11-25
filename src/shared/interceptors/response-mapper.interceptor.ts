import { Injectable, NestInterceptor, ExecutionContext, CallHandler, GatewayTimeoutException } from '@nestjs/common';
import { Observable, throwError, empty, from } from 'rxjs';
import { map, catchError, flatMap } from 'rxjs/operators';


@Injectable()
export class ResponseMapperInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        let errors = []
        return next
            .handle()
            .pipe(
                // catchError(err=>{
                //     errors.push(err)
                //     return from([null]);
                // }),
                map(data => ({ 
                    data: data, 
                    // errors: errors
                 }))
            );
    }
}