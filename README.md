# Nest.js Showcase
This showcase's objective is to present how easy it is to create great applications with Nest with some of its main features.

## About Nest.js
Nest provides an application architecture which allows developers and teams to create highly testable, scalable, loosely coupled, modular and easily maintainable applications.

Nest.js makes use and encourages the use of well-known design patterns like Dependancy Injection, Object Oriented Programming, Functional Programming and Functional Reactive Programming

Under the hood, Nest makes use of robust HTTP Server frameworks like  [Express](https://expressjs.com/)  (the default) and optionally can be configured to use  [Fastify](https://github.com/fastify/fastify)  as well!

Nest provides a level of abstraction above these common Node.js frameworks (Express/Fastify), but also exposes their APIs directly to the developer. This allows developers the freedom to use the all of the third-party libraries which are available for the underlying platform.

# Modules
Modules are classes that group together different features and bring them together to form the app.
![](https://docs.nestjs.com/assets/Modules_1.png)


Each module has the following: 

 - Providers
 - Controllers
 - Imports *(import other modules)*
 - Exports *(export Providers for modules that depend on this one)*
  
 Modules chain together to form the final app. When a module imports another one, its Controllers are linked together to share requests, and it gets access to all of its exported Providers.
> You can find more information about **modules** [here](https://docs.nestjs.com/modules)

# Controllers
Controllers are responsible for handling incoming  **requests**  and returning  **responses**  to the client.
To create a controller, use the `@Controller()` with the route prefix decorator and add functions to the class for specific routes.
```typescript
@Controller('cats')
export class CatsController {
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
  @Post(':id')
  findOne(@Param('id', ParseUUIDPipe) id): string {
    return 'This action returns a cat with the following id:' + id;
  }
}
```
To add a controller into the app, add it to its respective Module.
```typescript
@Module({
  controllers: [CatsController],
})
export class CatsModule {}
```


> You can find more information about **Controllers** [here](https://docs.nestjs.com/controllers)

# Providers
Providers are classes that can be injected into others when needed. Example of Provider classes are Services, DAOs (Data Access Object), Passport Strategies, Pipes, etc.
To declare a Provider simply annotate it with the `@Injectable()` decorator.
Providers are injected into classes that depend on them by the Nest framework.
To have a dependency injected, simply add it to your constructor:
```typescript
//cats.controller.ts
constructor(private readonly catsService: CatsService) {}
```
If the module that the depending is in uses the Provider, or it is a global Provider, Nest will resolve the `catsService` by creating and returning an instance of `CatsService` (or returning the existing instance if it has already been requested elsewhere). This dependency is resolved and passed to your controller's constructor.


To add a provider into the app, add it to its respective Module. To allow it to be accessed by other modules, add it to the exports list.
```typescript
@Module({
  providers: [CatsProvider],
  exports: [CatsProvider],
})
export class CatsModule {}
```

> There are many other ways to inject **Providers**, you can find more information about providers [here](https://docs.nestjs.com/providers).


## Middleware
Middleware is a function which is called  **before**  the route handler. Middleware functions have access to the  [request](http://expressjs.com/en/4x/api.html#req)  and  [response](http://expressjs.com/en/4x/api.html#res)  objects, and the  `next()`  middleware function in the application’s request-response cycle. The  **next**  middleware function is commonly denoted by a variable named  `next`.
Nest middleware are, by default, equivalent to  [express](http://expressjs.com/en/guide/using-middleware.html)  middleware. 
You implement custom Nest middleware in either a function, or in a class with an  `@Injectable()`  decorator. The class should implement the  `NestMiddleware`  interface, while the function does not have any special requirements.

```typescript
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    console.log('Request:'+req);
    next();
  }
}
```
> You can find more information about **Middleware** [here](https://docs.nestjs.com/middleware).


## Pipes
Pipes operate on the  `arguments`  being processed by a  [controller route handler](https://docs.nestjs.com/controllers#route-parameters). Nest interposes a pipe just before a method is invoked, and the pipe receives the arguments destined for the method. Any transformation or validation operation takes place at that time, after which the route handler is invoked with any (potentially) transformed arguments.

Pipes have two typical use cases:

-   **transformation**: transform input data to the desired output
-   **validation**: evaluate input data and if valid, simply pass it through unchanged; otherwise, throw an exception when the data is incorrect
A pipe is a class annotated with the  `@Injectable()`  decorator. Pipes should implement the  `PipeTransform`  interface.

```typescript
@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException('Validation failed');
    }
    return val;
  }
}
```


To use a pipe, you can add it to a Module, add it to a controller function with the UsePipes decorator, or use it to validate controller input parameters.
```typescript
@Module({
  providers: [{
	provide:  APP_PIPE,
	useClass:  ValidationPipe
  }],
})
export class CatsModule {}
```
```typescript
@Post()
@UsePipes(ValidationPipe)
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

```typescript
@Get(':id')
byUserId(@Param('id', ParseIntPipe) id : number){
  return this.usersService.getUserById(id);
}
```

> You can find more information about **Pipes** [here](https://docs.nestjs.com/pipes).

## Guards
Guards have a  **single responsibility**. They determine whether a given request will be handled by the route handler or not, depending on certain conditions (like permissions, roles, ACLs, etc.) present at run-time. This is often referred to as  **authorization**.

Guards  have access to the  `ExecutionContext`  instance, and know exactly what's going to be executed next. They're designed to let you interpose processing logic at exactly the right point in the request/response cycle, and to do so declaratively. This helps keep your code DRY and declarative.

Guards are executed  **after**  each middleware, but  **before**  any interceptor or pipe.

A guard class must be annotated with the  `@Injectable()`  decorator. Guards should implement the  `CanActivate`  interface.
```typescript
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return validateRequest(request);
  }
}
```
Authorization is a great use case for Guards because specific routes should be available only when the caller (usually a specific authenticated user) has sufficient permissions. The guard can get the users roles from the request, and get the roles associated to the route, to then decide if the user is authorized or not.
>

To use a guard you can add it to a Module or add it to a controller function with the UseGuards decorator.
```typescript
@Module({
  providers: [{
	provide:  APP_GUARD,
	useClass:  RolesGuard
  }],
})
export class CatsModule {}
```
```typescript
@UseGuards(RolesGuard)
@Get('')
getAllUsers(){
  return this.usersService.getUsers();
}
```

> You can find more information about **Guards** [here](https://docs.nestjs.com/guards).

## Interceptors
Interceptors allows you to intercept the request/response cycle and:

-   bind  **extra logic**  before / after method execution
-   **transform**  the result returned from a function
-   **transform**  the exception thrown from a function
-   **extend**  the basic function behavior
-   completely  **override**  a function depending on specific conditions (e.g., for caching purposes)
 
 Interceptors implement the NestInterceptor interface and have a method `inercept()` that recieves two parameters: ExecutionContext (that provides additional details about the current execution process) and CallHandler (which you can use to invoke the route handler method at some point in your interceptor).
```typescript
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');

    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() => console.log(`After... ${Date.now() - now}ms`)),
      );
  }
}
```
This means that the `intercept()` method effectively **wraps** the request/response stream. As a result, you may implement custom logic **both before and after** the execution of the final route handler.


To use a interceptor you can add it to a Module or add it to a controller function with the UseInterceptors decorator.
```typescript
@Module({
  providers: [{
	provide:  APP_FILTER,
	useClass:  CacheInterceptor
  }],
})
export class CatsModule {}
```
```typescript
@UseInterceptors(CacheInterceptor)
@Get('')
getAllUsers(){
  return this.usersService.getUsers();
}
```


> You can find more information about **Interceptors** [here](https://docs.nestjs.com/interceptors).

## Custom exceptions
If you create customized exceptions instead of using Nest's built-in HTTP Exceptions, it's good practice to create your own **exceptions hierarchy**, where your custom exceptions inherit from the base `HttpException` class. With this approach, Nest will recognize your exceptions, and automatically take care of the error responses
```typescript
export class ForbiddenException extends HttpException {
  constructor() {
    super('Forbidden', HttpStatus.FORBIDDEN);
  }
}
```

## Exception filters
Nest comes with a built-in  **exceptions layer**  which is responsible for processing all unhandled exceptions across an application. When an exception is not handled by your application code, it is caught by this layer, which then automatically sends an appropriate user-friendly response.

While the base (built-in) exception filter can automatically handle many cases for you, you may want **full control** over the exceptions layer.

**Exception filters** let you control the exact flow of control and the content of the response sent back to the client.

Filters must implement the ExceptionFilter interface and use the decorator `@Catch()`, that allows you to chosse what type of exception to filter.

The ExceptionFilter requires the method `catch()`, that provides two parameters:
 - HttpException gives you the exception that was caught
 - ArgumentsHost allows you to access the underlying platform, and get information such as the Request and Response objects. 
```typescript
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }
}
```
## Authentication

There are many ways to make authentication work, with use of middleware or guards, third party libraries or both.
The example in the documentation uses the Passport.js module for authentication and custom guards for Authorization.  
The final authentication project in this repository lets you use decorators like this:

*AppModule.ts*
```typescript
@Module({
  imports: [UsersModule, AuthModule], //import authentication module
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
}
```
*UserService.ts*
```typescript
@AuthRoles('USER', 'EDITOR', 'ANON') //custom decorator that activates guard that checks jwt token and also adds roles to restrict access to this route
@Get()
users(@Query() query){
	return this.usersService.getUsers(query);
}
```
> Lean more about [Authentication](https://docs.nestjs.com/techniques/authentication) and [Authorization](https://docs.nestjs.com/guards)
