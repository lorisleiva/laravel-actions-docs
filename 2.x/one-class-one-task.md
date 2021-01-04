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

<small>Note that Laravel Actions uses a trait instead of inheritance to be as unintrusive as possible. If you prefer inheritance, you can use the equivalent `extends \Lorisleiva\Actions\Action`. If you don't prefer inheritance, you might be interested in "[More granular traits](./granular-traits)".</small>

## Running as an object

Because you have complete control over your action classes, you don't really need Laravel Actions to run it as an object.

However, Laravel Actions provides two helper static methods for you: `make` and `run`. These make it easier for you to **instantiate** and **execute** your action respectively.

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

### Start with a verb

Name your action classes as **small explicit sentences that start with a verb**. For example, an action that "sends an email to the user to reset its password" could be named `SendResetPasswordEmail`.

That way, your folder structure almost becomes an exhaustive dictionary of everything your application provides. This brings us to the second recommended convention.

### Use an `Actions` folder

Create an `app/Actions` folder and group your actions inside this folder by topic. Here's a simple example.

```
app/
├── Actions/
│   ├── Authentication/
│   │   ├── LoginUser.php
│   │   ├── RegisterUser.php
│   │   ├── ResetUserPassword.php
│   │   └── SendResetPasswordEmail.php
│   ├── Leads/
│   │   ├── BulkRemoveLead.php
│   │   ├── CreateNewLead.php
│   │   ├── GetLeadDetails.php
│   │   ├── MarkLeadAsCustomer.php
│   │   ├── MarkLeadAsLost.php
│   │   ├── RemoveLead.php
│   │   ├── SearchLeadsForUser.php
│   │   └── UpdateLeadDetails.php
│   └── Settings/
│       ├── GetUserSettings.php
│       ├── UpdateUserAvatar.php
│       ├── UpdateUserDetails.php
│       ├── UpdateUserPassword.php
│       └── DeleteUserAccount.php
├── Models/
└── ...
```

Alternatively, if your application is already divided in topics — or modules — you can create an `Actions` folder under each of these modules. For example:

```
app/
├── Authentication/
│   ├── Actions/
│   ├── Models/
│   └── ...
├── Leads/
│   ├── Actions/
│   ├── Models/
│   └── ...
└── Settings/
    ├── Actions/
    └── ...
```

## How does it work?

So far, we've only seen how to run actions as objects, but you might be wondering how your classes are going to be executed as controllers, jobs, etc.

Laravel Actions does that by adding a special interceptor on the container that recognise how the class is being run. When it does — and that's the important part — **it wraps your PHP class inside a decorator that will delegate to your action when it needs to**. Each design pattern has their own decorator — e.g. `ControllerDecorator`, `JobDecorator` and so on. That means you still have full control over your PHP class and need not to worry about conflict between various design patterns.

Check out the "[How does it work?](./how-does-it-work)" page if you're interested in learning more about this.

Now, let's move on to [controllers](./register-as-controller).
