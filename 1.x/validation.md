# Validation

No matter how an action is run, you can define some validation logic directly within the action to ensure the provided attributes are what they are expected to be.

Note that, just like in a Laravel FormRequest, the validation logic occurs after the authorisation logic ([see previous page](./authorisation.html)).

::: tip
The page "[The lifecycle of an action](./action-lifecycle.html)" provides a handy summary of all methods that an Action will call before and after executing the `handle` method.
:::

## Defining the validation rules

Just like in a Laravel FormRequest, you can define your validation logic using the `rules` and `withValidator` methods.

The `rules` method enables you to list validation rules for your action's attributes.

```php
public function rules()
{
    return [
        'title' => ['required'],
        'body' => ['required', 'min:10'],
    ];
}
```

The `withValidator` method provide a convenient way to add custom validation logic.

```php
public function withValidator($validator)
{
    $validator->after(function ($validator) {
        if ($this->somethingElseIsInvalid()) {
            $validator->errors()->add('field', 'Something is wrong with this field!');
        }
    });
}
```

If all you want to do is add an after validation hook, you can use the `afterValidator` method instead of the `withValidator` method. The following example is equivalent to the one above.

```php
public function afterValidator($validator)
{
    if ($this->somethingElseIsInvalid()) {
        $validator->errors()->add('field', 'Something is wrong with this field!');
    };
}
```

::: tip
It is worth noting that, just like the `handle` method, the `rules`, `withValidator` and `afterValidator` methods [support dependency injections](./dependency-injections.html).
:::

If you want to validate some data directly within the `handle` method, you can use the `validate` method.

```php
public function handle()
{
    $this->validate([
        'comment' => ['required', 'min:10', 'spamfree'],
    ]);
}
```

This will validate the provided rules against the action's attributes.

## Handling failed validation

Whenever validation fails, it will throw an `ValidationException` resulting in a 422 status code when used in the HTTP layer (as a controller for example).

You can change that behaviour by overriding the `failedValidation` method.

```php
protected function failedValidation()
{
    throw new MyCustomExceptionForInvalidData();
}
```

## Accessing validated data

If you want to access all attributes that have been validated prior to reaching the `handle` method, you can use `$this->validated()` instead of `$this->all()`.

```php
public function rules()
{
    return ['title' => 'min:3'];
}

public function handle()
{
    // Will only return attributes that have been validated by the rules above.
    $this->validated();
}
```

## Customising validation texts

You can customise the validation texts using the `messages` and `attributes` methods.

```php
public function messages()
{
    return [];
}

public function attributes()
{
    return [];
}
```

::: tip
It is worth noting that, just like the `handle` method, the `messages`, `attributes` methods [support dependency injections](./dependency-injections.html).
:::
