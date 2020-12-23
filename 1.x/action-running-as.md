# Keeping track of how an action was run

## The `runningAs` method

In some rare cases, you might want to know how the action is being run. You can access this information using the `runningAs` method.

```php
public function handle()
{
    $this->runningAs('object');
    $this->runningAs('job');
    $this->runningAs('listener');
    $this->runningAs('controller');
    $this->runningAs('command');

    // Returns true if any of them is true.
    $this->runningAs('object', 'job');
}
```

## The before hooks

If you want to execute some code only when the action is running as a certain type, you can use the before hooks `asObject`, `asJob`, `asListener`, `asController` and `asCommand`.

```php
public function asController(Request $request)
{
    $this->token = $request->cookie('token');
}
```

If you want to prepare the data before running the action (and thus also before validating the data), you can use the `prepareForValidation` method. This method will be run before the `as...` methods, no matter how the action is running as.

::: tip
It is worth noting that, just like the `handle` method, the `prepareForValidation` method and the `as...` methods [support dependency injections](./dependency-injections.html).
:::

::: tip
The page "[The lifecycle of an action](./action-lifecycle.html)" provides a handy summary of all methods that an Action will call before and after executing the `handle` method.
:::

::: warning
These before hooks will be executed at every run. This means you cannot use the `asController` method to register your middleware. You need to [use the `middleware` method](./actions-as-controllers.html#registering-middleware) instead.
:::
