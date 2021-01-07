# More granular traits

## A collection of traits

If you look closer at the `AsAction` trait provided by Laravel Actions, you'll notice it's just a collection of smaller traits.

```php
namespace Lorisleiva\Actions\Concerns;

trait AsAction
{
    use AsObject;
    use AsController;
    use AsListener;
    use AsJob;
    use AsCommand;
    use AsFake;
}
```

Each of these traits:
- **Provide** methods to the action and/or 
- Enable the decorator to **use** methods from the action.

You can check the "[References](./as-object)" section of this documentation to see all methods provided and/or used by each of these traits.

## Cherry-picking

This means you can cherry-pick the part of Laravel Actions you want to use.

For example, you could explicitely cherry-pick these traits for each action.

```php
class MyAction
{
    use AsObject;
    use AsController;

    // ...
}
```

Or, you could create your own `AsAction` trait that only includes the features of Laravel Actions your application needs.

```php
use Lorisleiva\Actions\Concerns\AsObject;
use Lorisleiva\Actions\Concerns\AsController;
use Lorisleiva\Actions\Concerns\AsJob;
use Lorisleiva\Actions\Concerns\AsFake;

trait AsAction
{
    use AsObject;
    use AsController;
    use AsJob;
    use AsFake;
}
```

The benefits of this cherry-picking are very small — which is why the documentation focuses on the `AsAction` trait — but here they are:
- Remove potential conflicting methods. For example, if you want to define your own `rules` method on an action that will never run as a controller.
- Tiny (negligeable) performance improvements since we'll be looping through less patterns to identify how an action is being executed.
- That's it...

Cherry-picking can be particularly useful if you only need one slice of Laravel Actions. For example, if all you need is a way to run your plain PHP classes as controllers, then all you need to use is the `AsController` trait.
