# One class, one task

Laravel Actions provide a new "unit of life" within your application: **An action**.

This encourages you to focus on what your application actually does instead of the framework patterns it relies on.

## Concretely, what is an action?

An action can be any PHP class with a `handle` method. Just add the `AsAction` trait to that class and voilà, you've got yourself an action.

It has only one constraint: **it must be able to resolve from the container** — meaning `app(MyAction::class)` should not fail.

This means, you can use the constructor to inject dependencies to your actions.

```php
use Lorisleiva\Actions\Concerns\AsAction;

class MyFirstAction
{
    use AsAction;

    protected MyInjectedService $service;

    public function __construct(MyInjectedService $service)
    {
        $this->service = $service;
    }

    public function handle(...$someArguments)
    {
        // Your action logic here...
    }
}
```

<small>Note that Laravel Actions uses a trait instead inheritance to be as unintrusive as possible. If you prefer inheritance, you can use the equivalent `extends \Lorisleiva\Actions\Action` instead. If you don't prefer inheritance, you might be interested in "[More granular traits](./granular-traits)".</small>

## Running as an object

Because you have complete control over your action classes, you don't really need Laravel Actions to run it as an object.

However, Laravel Actions provides two helper static methods for you: `make` and `run`. These make it easier for you to instantiate and execute your action respectively.

```php
// Equivalent to "app(MyFirstAction::class)".
MyFirstAction::make();

// Equivalent to "MyFirstAction::make()->handle($myArguments)".
MyFirstAction::run($myArguments);
```

It is good practice to use these methods to instantiate an Action to ensure it is always resolved from the container. That way:
- You can always use dependency injection on the constructor.
- You can replace the action with a mock on your tests (See "[Mock and test your actions](./mock-and-test)").

## Recommended conventions

Even though you have full control on how to implement your actions, a few minor conventions can help you stay consistent when organising your application. Here are two recommended ones.

### Use an `Actions` folder

TODO
- `app/Actions/Module` or `app/Module/Actions`

### Start with a verb

TODO
- Actions name start with a verb and explicitely describe the task it handles

## How does it work?

TODO: brief explanation of decorators and link to extra page.
