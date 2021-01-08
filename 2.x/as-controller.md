---
sidebarDepth: 2
---

# As controller

## Method provided
*Lists all methods provided by the trait.*

### `__invoke`
Executes the action by delegating immediately to the `handle` method.

```php
$action($someArguments);

// Equivalent to:
$action->handle($someArguments);
```

Whilst this method is not actually used, it has to be defined on the action in order to register the action as an invokable controller. When missing, Laravel will throw an exception warning us that we're trying to register a class as an invokable controller without the `__invoke` method. The truth is, the controller will actually be an instance of `ControllerDecorator` but the framework doesn't know that yet.

```php
// Illuminate\Routing\RouteAction

protected static function makeInvokable($action)
{
    if (! method_exists($action, '__invoke')) {
        throw new UnexpectedValueException("Invalid route action: [{$action}].");
    }

    return $action.'@__invoke';
}
```

If you need to use the `__invoke` method for something else, you may [override it](https://stackoverflow.com/a/11939306/11440277) with anything you want. The only requirement is that an `__invoke` method has to exists.

```php
class MyAction
{
    use AsAction {
        __invoke as protected invokeFromLaravelActions;
    }

    public function __invoke()
    {
        // ...
    }
}
```

## Method used
*Lists all methods recognised and used by the `ControllerDecorator` and `ActionRequest`.*

### `asController`
Called when used as an invokable controller. Uses the `handle` method directly when no `asController` method exists.

```php
public function asController(User $user, Request $request): Response
{
    $article = $this->handle(
        $user,
        $request->get('title'),
        $request->get('body')
    );

    return redirect()->route('articles.show', [$article]);
}
```

### `jsonResponse`
Called after the `asController` method when the request expects JSON. The first argument is the return value of the `asController` method and the second argument is the request itself.

```php
public function jsonResponse(Article $article, Request $request): ArticleResource
{
    return new ArticleResource($article);
}
```

### `htmlResponse`
Called after the `asController` method when the request expects HTML. The first argument is the return value of the `asController` method and the second argument is the request itself.

```php
public function htmlResponse(Article $article, Request $request): Response
{
    return redirect()->route('articles.show', [$article]);
}
```

### `getControllerMiddleware`
Adds controller middleware directly in the action.

```php
public function getControllerMiddleware(): array
{
    return ['auth', MyCustomMiddleware::class];
}
```

### `routes`
Defines some routes directly in your action.

```php
public static function routes(Router $router)
{
    $router->get('author/{author}/articles', static::class);
}
```

For this to work, you need to call `Actions::registerRoutes` on a service provider.

```php
use Lorisleiva\Actions\Facades\Actions;

// Register routes from actions in "app/Actions" (default).
Actions::registerRoutes();

// Register routes from actions in "app/MyCustomActionsFolder".
Actions::registerRoutes('app/MyCustomActionsFolder');

// Register routes from actions in multiple folders.
Actions::registerRoutes([
    'app/Authentication',
    'app/Billing',
    'app/TeamManagement',
]);
```

### `prepareForValidation`
Called right before authorization and validation is resolved.

```php
public function prepareForValidation(ActionRequest $request): void
{
    $request->merge(['some' => 'additional data']);
}
```

### `authorize`
Defines authorization logic for the controller.

```php
public function authorize(ActionRequest $request): bool
{
    return $request->user()->role === 'author';
}
```

You may also return gate responses instead of booleans.

```php
use use Illuminate\Auth\Access\Response;

public function authorize(ActionRequest $request): Response
{
    if ($request->user()->role !== 'author') {
        return Response::deny('You must be an author to create a new article.');
    }

    return Respone::allow();
}
```

### `rules`
Provides the validation rules for the controller.

```php
public function rules(): array
{
    return [
        'title' => ['required', 'min:8'],
        'body' => ['required', IsValidMarkdown::class],
    ];
}
```

### `withValidator`
Adds custom validation logic to the existing validator.

```php
use Illuminate\Validation\Validator;

public function withValidator(Validator $validator, ActionRequest $request): void
{
    $validator->after(function (Validator $validator) use ($request) {
        if (! Hash::check($request->get('current_password'), $request->user()->password)) {
            $validator->errors()->add('current_password', 'Wrong password.');
        }
    });
}
```

### `afterValidator`
Adds an `after` callback to the existing validator. The example below is equivalent to the example provided in the `withValidator` method.

```php
use Illuminate\Validation\Validator;

public function afterValidator(Validator $validator, ActionRequest $request): void
{
    if (! Hash::check($request->get('current_password'), $request->user()->password)) {
        $validator->errors()->add('current_password', 'Wrong password.');
    }
}
```

### `getValidator`
Defines your own validator instead of the default one generated using `rules`, `withValidator`, etc.

```php
use Illuminate\Validation\Factory;
use Illuminate\Validation\Validator;

public function getValidator(Factory $factory, ActionRequest $request): Validator
{
    return $factory->make($request->only('title', 'body'), [
        'title' => ['required', 'min:8'],
        'body' => ['required', IsValidMarkdown::class],
    ]);
}
```

### `getValidationData`
Defines the data that should be used for validation. Defaults to: `$request->all()`.

```php
public function getValidationData(ActionRequest $request): array
{
    return $request->all();
}
```

### `getValidationMessages`
Customises the messages of your validation rules.

```php
public function getValidationMessages(): array
{
    return [
        'title.required' => 'Looks like you forgot the title.',
        'body.required' => 'Is that really all you have to say?',
    ];
}
```

### `getValidationAttributes`
Provides some human-friendly mapping to your request attributes.

```php
public function getValidationAttributes(): array
{
    return [
        'title' => 'headline',
        'body' => 'content',
    ];
}
```

### `getValidationRedirect`
Customises the redirect URL when validation fails. Defaults to redirecting back to the previous page.

```php
public function getValidationRedirect(UrlGenerator $url): string
{
    return $url->to('/my-custom-redirect-url');
}
```

### `getValidationErrorBag`
Customises the validator's error bag when validation fails. Defaults to: `default`.

```php
public function getValidationErrorBag(): string
{
    return 'my_custom_error_bag';
}
```

### `getValidationFailure`
Overrides the validation failure altogether. Defaults to: `ValidationException`.

```php
public function getValidationFailure(): void
{
    throw new MyCustomValidationException();
}
```

### `getAuthorizationFailure`
Overrides the authorization failure. Defaults to: `AuthorizationException`.

```php
public function getAuthorizationFailure(): void
{
    throw new MyCustomAuthorizationException();
}
```
