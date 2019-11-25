import { UseInterceptors, applyDecorators, CacheInterceptor, CacheKey} from "@nestjs/common";

export function UseCache(key? : string) {
    if (key == undefined)
    return applyDecorators(
        UseInterceptors(CacheInterceptor)
    );
    else
    return applyDecorators(
        CacheKey(key),
        UseInterceptors(CacheInterceptor)
    );
       
}