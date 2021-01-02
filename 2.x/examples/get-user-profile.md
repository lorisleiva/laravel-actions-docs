# Get user profile

## Definition

A simple action used to retrieve a user's profile either via HTML or JSON.

```php
class GetUserProfile
{
    use AsAction;

    public function asController(User $user, Request $request): User
    {
        if ($request->expectsJson()) {
            return new UserProfileResource($user);
        }

        return view('users.show', compact('user'));
    }
}
```

Since we're only planning on using this action as a controller, we can use the `handle` method directly and the arguments will be resolved just like an invokable controller.

Additionally, we can use the helper method `htmlResponse` and `jsonResponse` to avoid that common if statement.

The action below is equivalent to the one above.

```php
class GetUserProfile
{
    use AsAction;

    public function handle(User $user): User
    {
        return $user;
    }

    public function htmlResponse(User $user)
    {
        return view('users.show', compact('user'));
    }

    public function jsonResponse(User $user)
    {
        return new UserProfileResource($user);
    }
}
```

## Registering the controller

To use as a controller simply register the action in your routes file.

```php
Route::get('users/{user}', GetUserProfile::class);
```

## Adding middleware

Instead of defining the middleware where you define the route, you can add them directly in the action like so:

```php
class GetUserProfile
{
    use AsAction;

    public function getControllerMiddleware(): array
    {
        return ['auth', MyCustomMiddleware::class];
    }

    // ...
}
```
