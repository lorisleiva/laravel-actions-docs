# Add validation to your controllers

One way to add validation to your controllers is to inject a `FormRequest` in your `asController` method just as you would do in a controller.

```php
public function asController(MyFormRequest $request)
{
    // Authorization and validation defined in MyFormRequest was successful.
}
```

However, that means yet another class, that is tightly coupled to this action, has to be created somewhere else in your application — typically in `app/Http/Requests`.

This is why Laravel Actions provides a special request class called `ActionRequest`.

An `ActionRequest` is a special `FormRequest` class that allows you to **define your authorization and validation directly within your action**. It will look for specific methods within your action and delegate to them when it needs to.

```php
use Lorisleiva\Actions\ActionRequest;

public function asController(ActionRequest $request)
{
    // Authorization and validation defined in this class was successful.
}
```

This page documents these special methods that you may implement to define your authorization and validation.

## Authorization

Just like in a `FormRequest`, you may implement the `authorize` method that returns `true` if and only if the use is authorized to see access this action.

```php
public function authorize(ActionRequest $request): bool
{
    return $request->user()->role === 'author';
}
```

Instead of returning a boolean, you may also return gate responses to provide a more detailed response.

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

Just like in a `FormRequest`, it will return a `Illuminate\Auth\Access\AuthorizationException` if authorization fails. You may provide your own authorization failure logic by implementing the `getAuthorizationFailure` method.

```php
public function getAuthorizationFailure(): Response
{
    throw new MyCustomAuthorizationException();
}
```

## Adding validation rules

TODO: rules
TODO: $request->validated()

## Custom validation logic

TODO
withValidator
afterValidator
getValidator

## Prepare for validation

TODO
prepareForValidation

## Custom validation messages

TODO
getValidationMessages
getValidationAttributes

## Custom validation failure

TODO
getValidationRedirect
getValidationErrorBag
getValidationFailure
