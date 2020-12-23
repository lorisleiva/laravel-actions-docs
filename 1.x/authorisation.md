# Authorisation

No matter how actions are run, you can define some authorisation logic directly within the action to make sure that it is performed under valid circumstances. For example, this could ensure the authenticated user has the appropriate role before continuing.

Note that, just like in a Laravel FormRequest, the authorisation logic occurs before the validation logic ([see next page](/validation.html)).

::: tip
The page "[The lifecycle of an action](/action-lifecycle.html)" provides a handy summary of all methods that an Action will call before and after executing the `handle` method.
:::

## The `authorize` method

Actions can define their authorisation logic using the `authorize` method. It should return a boolean indicating if we are authorised to execute this action.

```php
public function authorize()
{
    // Your authorisation logic here...
}
```

The `authorize` method is optional and defaults to `true` when not provided.

::: tip
It is worth noting that, just like the `handle` method, the `authorize` method [supports dependency injections](/dependency-injections.html).
:::

Whenever the `authorize` method returns `false`, it will throw an `AuthorizationException` resulting in a 403 status code when used in the HTTP layer (as a controller for example).

You can change that behaviour by overriding the `failedAuthorization` method.

```php
protected function failedAuthorization()
{
    throw new MyCustomExceptionForWhenAnActionIsUnauthorized();
}
```

## The `user` and `actingAs` methods

If you want to access the authenticated user from an action you can simply use the `user` method.

```php
public function authorize()
{
    return $this->user()->isAdmin();
}
```

When run as a controller, the user is fetched from the incoming request, otherwise `$this->user()` is equivalent to `Auth::user()`.

If you want to run an action acting on behalf of another user you can use the `actingAs` method. In this case, the `user` method will always return the provided user.

```php
$action->actingAs($admin)->run();
```

## The `can` method

If you’d still like to use Gates and Policies to externalise your authorisation logic, you can use the `can` helper method to verify that the user can perform the provided ability.

```php
public function authorize()
{
    return $this->can('create', Article::class);
}
```
