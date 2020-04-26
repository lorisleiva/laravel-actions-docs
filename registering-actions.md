# Registering actions

## Why do actions need to be registered?

Some features that Laravel Actions supports require them to be registered globally. These features are the following.
- Registering actions as commands automatically if a signature is provided.
- Registering routes directly within actions.

Thus, for these features to work, we need to know where the actions are kepts so we can register them.

## Updating the paths to register actions

By default, Laravel Actions will look into the `app/Actions` folder (or any of its subfolders).

You can change that behaviour by calling the `paths()` method from the `Actions` Facade within the `register` method of your `AppServiceProvider`.

```php
# Provide your Actions folder.
Actions::paths('app/MyActionsFolder');

# You can also provide multiple folders.
Actions::paths([
    'app/Actions', // <- default
    'app/SomeOtherFolder',
]);
```

## Disabling the registration of actions

If none of the features listed above are needed for your application, you may disable registering actions entirely via the `dontRegister` method.

```php
Actions::dontRegister();
```

### Alternative for "Registering actions as commands automatically"

When disabling the registration of actions, you will need to manually register actions as commands. You can do this by calling the `registerCommand` static method in your `routes/console.php` file.

```php
PublishANewArticle::registerCommand();
```

### Alternative for "Registering routes directly within actions"

When disabling the registration of actions, you will not be able to define your routes within the static `routes` method. Instead, you will need to define them in your routes files. See "[Registering actions in routes files](/actions-as-controllers#registering-actions-in-routes-files)".
