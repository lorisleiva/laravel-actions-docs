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

You may implement the `rules` method to provide the rules to validate against the request data.

```php
public function rules(): array
{
    return [
        'title' => ['required', 'min:8'],
        'body' => ['required', IsValidMarkdown::class],
    ];
}
```

You may then use the `validated` method inside your `asController` method to access the request data that went through your validation rules.

```php
public function asController(ActionRequest $request)
{
    $request->validated();
}
```

## Custom validation logic

In addition to your validation `rules`, you may provide the `withValidator` method to provide custom validation logic.

It works just like in a `FormRequest` and provides the validator as a first argument allowing you to add "after validation callbacks".

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

Very often, when you use `withValidator`, you just want to add a `after` callback on the validator.

Laravel Actions conveniently allows you to implement the `afterValidator` method directly to avoid the nested callback.

```php
use Illuminate\Validation\Validator;

public function afterValidator(Validator $validator, ActionRequest $request): void
{
    if (! Hash::check($request->get('current_password'), $request->user()->password)) {
        $validator->errors()->add('current_password', 'Wrong password.');
    }
}
```

Alternatively, if you want full control over the validator that will be generated, you may implement the `getValidator` method instead.

Implementing this method will ignore any other validation methods such as `rules`, `withValidator` and `afterValidator`.

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

Just like in a `FormRequest`, you may provide the `prepareForValidation` method to insert some custom logic before both authorization and validation are triggered.

```php
public function prepareForValidation(ActionRequest $request): void
{
    $request->merge(['some' => 'additional data']);
}
```

## Custom validation messages

You may also customise the messages of your validation rules and provide some human-friendly mapping to your request attributes by implementing the `getValidationMessages` and `getValidationAttributes` methods respectively.

```php
public function getValidationMessages(): array
{
    return [
        'title.required' => 'Looks like you forgot the title.',
        'body.required' => 'Is that really all you have to say?',
    ];
}

public function getValidationAttributes(): array
{
    return [
        'title' => 'headline',
        'body' => 'content',
    ];
}
```

Note that providing the `getValidator` method will ignore both of these methods too.

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

Okay enough about controllers, let's now see how we can [dispatch our actions as asynchronous jobs](./dispatch-jobs).
