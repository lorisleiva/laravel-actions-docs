# Installation

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
