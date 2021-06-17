# Execute as commands

## Registering the command

The first thing you need to do to run your action as an artisan command is to register it in your console `Kernel` just like any other command class.

```php
namespace App\Console;

class Kernel extends ConsoleKernel
{
    protected $commands = [
        UpdateUserRole::class,
    ];

    // ...
}
```

Alternatively, you may auto-register commands by calling the `Actions::registerCommands()` method on one of your service providers. This will recursively look into the provided folders and automatically registers actions that have a signature defined.

```php
use Lorisleiva\Actions\Facades\Actions;

// Register commands from actions in "app/Actions" (default).
Actions::registerCommands();

// Register commands from actions in "app/MyCustomActionsFolder".
Actions::registerCommands('app/MyCustomActionsFolder');

// Register commands from actions in multiple folders.
Actions::registerCommands([
    'app/Authentication',
    'app/Billing',
    'app/TeamManagement',
]);
```

## Command signature and options

Next, you need to provide a command signature to your action using the `$commandSignature` property.

```php
class UpdateUserRole
{
    use AsAction;

    public string $commandSignature = 'users:update-role {user_id} {role}';

    // ...
}
```

You may also provide a description and additional command options by using the following properties.

```php
class UpdateUserRole
{
    use AsAction;

    public string $commandSignature = 'users:update-role {user_id} {role}';
    public string $commandDescription = 'Updates the role of a given user.';
    public string $commandHelp = 'Additional message displayed when using the --help option.';
    public bool $commandHidden = true; // Hides the command from the artisan list.

    // ...
}
```

If you need to define these options using more logic, you may use the following methods instead.

```php
class UpdateUserRole
{
    use AsAction;

    public function getCommandSignature(): string
    {
        return 'users:update-role {user_id} {role}';
    }

    public function getCommandDescription(): string
    {
        return 'Updates the role of a given user.';
    }

    public function getCommandHelp(): string
    {
        return 'Additional message displayed when using the --help option.';
    }

    public function isCommandHidden(): bool
    {
        return true; // Hides the command from the artisan list.
    }

    // ...
}
```

## From command to action

Finally, you will need to implement the `asCommand` method in order to parse the command's input into a call to your `handle` method.

The `asCommand` method provides you with the `CommandDecorator` as a first argument which is an instance of `Illuminate\Console\Command`.

This means you can use it to fetch command arguments and options but also to prompt and/or display something back to the terminal.

```php
use Illuminate\Console\Command;

class UpdateUserRole
{
    use AsAction;

    public string $commandSignature = 'users:update-role {user_id} {role}';

    public function handle(User $user, string $newRole): void
    {
        $user->update(['role' => $newRole]);
    }

    public function asCommand(Command $command): void
    {
        $this->handle(
            User::findOrFail($command->argument('user_id')),
            $command->argument('role')
        );

        $command->info('Done!');
    }
}
```

In the example above, we've used the `{user_id}` and `{role}` arguments but we could have also prompted for these values as we run the command.

```php
class UpdateUserRole
{
    use AsAction;

    public string $commandSignature = 'users:update-role';

    public function handle(User $user, string $newRole): void
    {
        $user->update(['role' => $newRole]);
    }

    public function asCommand(Command $command): void
    {
        $userId = $command->ask('What is the ID of the user?');

        if (! $user = User::find($userId)) {
            return $command->error('This user does not exists.');
        }

        $role = $command->choice('What new role should we assign this user?', [
            'reader', 'author', 'moderator', 'admin',
        ]);

        $this->handle($user, $role);

        $command->info('Done!');
    }
}
```

We've now seen how to execute our actions in many different ways. In the next page, we'll see [how to mock them in our tests](./mock-and-test).
