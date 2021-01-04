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

Just like in a `FormRequest`, it will return an `AuthorizationException` if authorization fails. You may provide your own authorization failure logic by implementing the `getAuthorizationFailure` method.

```php
public function getAuthorizationFailure(): void
{
    throw new MyCustomAuthorizationException();
}
```

## Adding validation rules

TODO

```php
public function rules(): array
{
    return [
        'title' => ['required', 'min:8'],
        'body' => ['required', IsValidMarkdown::class],
    ];
}
```

TODO

```php
public function asController(ActionRequest $request)
{
    $request->validated();
}
```

## Custom validation logic

TODO

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

TODO

```php
use Illuminate\Validation\Validator;

public function afterValidator(Validator $validator, ActionRequest $request): void
{
    if (! Hash::check($request->get('current_password'), $request->user()->password)) {
        $validator->errors()->add('current_password', 'Wrong password.');
    }
}
```

TODO

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

## Prepare for validation

TODO

```php
public function prepareForValidation(ActionRequest $request): void
{
    $request->merge(['some' => 'additional data']);
}
```

## Custom validation messages

TODO

```php
public function getValidationMessages(): array
{
    return [
        'title.required' => 'Looks like you forgot the title.',
        'body.required' => 'Is that really all you have to say?',
    ];
}
```

TODO

```php
public function getValidationAttributes(): array
{
    return [
        'title' => 'headline',
        'body' => 'content',
    ];
}
```

## Custom validation failure

Just like in a `FormRequest`, it will return an `ValidationException` if validation fails. This exception will, by default, redirect to the previous page and use the `default` error bag on the validator. You may customise both of these behaviours by implementing the `getValidationRedirect` and `getValidationErrorBag` methods respectively.

```php
use Illuminate\Routing\UrlGenerator;

public function getValidationRedirect(UrlGenerator $url): string
{
    return $url->to('/my-custom-redirect-url');
}

public function getValidationErrorBag(): string
{
    return 'my_custom_error_bag';
}
```

Alternatively, you may override the validation failure that is being thrown altogether by implementing the `getValidationFailure` method.

```php
public function getValidationFailure(): void
{
    throw new MyCustomValidationException();
}
```

TODO: Transition with next page
