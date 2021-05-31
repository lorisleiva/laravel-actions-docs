# Installation

## Install the package

All you need to do to get started is add Laravel Action to your composer dependencies.

```sh
composer require lorisleiva/laravel-actions
```

You can then add the `AsAction` trait to any of your classes to make it an action.

```php
use Lorisleiva\Actions\Concerns\AsAction;

class UpdateUserPassword
{
    use AsAction;

    public function handle(User $user, string $newPassword)
    {
        // ...
    }
}
```

## Install ide helper for autocomplete (optional)

If you use a PHP version of `^8.0` you may want to install an additional package similar to [laravel-ide-helper](https://github.com/barryvdh/laravel-ide-helper) which enables your IDE to provide accurate autocompletion for your actions.

All you need to do is add `wulfheart/laravel-actions-ide-helper` to your dependencies.

```sh
composer require --dev wulfheart/laravel-actions-ide-helper
```

You can now generate the docs for yourself by running the command below. This will generate the file `_ide_helper_actions.php` which is expected to be additionally parsed by your IDE for autocomplete.

```sh
php artisan ide-helper:actions
```

## Publish the action stub (optional)

You may publish the stub used by the `make:action` command if you want to modify it.

```sh
php artisan vendor:publish --tag=stubs --provider="Lorisleiva\Actions\ActionServiceProvider"
```
