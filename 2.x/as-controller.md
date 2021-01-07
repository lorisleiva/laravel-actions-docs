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
TODO

```php
TODO
```

### `getControllerMiddleware`
TODO

```php
TODO
```

### `prepareForValidation`
TODO

```php
TODO
```

### `authorize`
TODO

```php
TODO
```

### `rules`
TODO

```php
TODO
```

### `withValidator`
TODO

```php
TODO
```

### `afterValidator`
TODO

```php
TODO
```

### `getValidator`
TODO

```php
TODO
```

### `getValidationData`
TODO

```php
TODO
```

### `getValidationMessages`
TODO

```php
TODO
```

### `getValidationAttributes`
TODO

```php
TODO
```

### `getValidationFailure`
TODO

```php
TODO
```

### `getValidationRedirect`
TODO

```php
TODO
```

### `getValidationErrorBag`
TODO

```php
TODO
```

### `getAuthorizationFailure`
TODO

```php
TODO
```

### `jsonResponse`
TODO

```php
TODO
```

### `htmlResponse`
TODO

```php
TODO
```

### `routes`
TODO

```php
TODO
```
