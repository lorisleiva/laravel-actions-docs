# Installation

All you need to do to get started is add Laravel Action to your composer dependencies.

```sh
composer require "lorisleiva/laravel-actions":"^1.2"
```

You can then use the `make:action` artisan command to create your first action.

```sh
php artisan make:action MyFirstAction
```

This will create the following class in your repository.

```php
namespace App\Actions;

use Lorisleiva\Actions\Action;

class MyFirstAction extends Action
{
    /**
     * Determine if the user is authorized to make this action.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the action.
     *
     * @return array
     */
    public function rules()
    {
        return [];
    }

    /**
     * Execute the action and return a result.
     *
     * @return mixed
     */
    public function handle()
    {
        // Execute the action.
    }
}
```
