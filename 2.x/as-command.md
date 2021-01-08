---
sidebarDepth: 2
---

# As command

## Method used
*Lists all methods and properties recognised and used by the `CommandDecorator`.*

### `asCommand`
Called when executed as a command. Uses the `handle` method directly when no `asCommand` method exists.

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

    public function asController(Command $command): void
    {
        $this->handle(
            User::findOrFail($command->argument('user_id')),
            $command->argument('role')
        );

        $command->info('Done!');
    }
}
```

### `getCommandSignature`
Defines the command signature. This is required when registering an action as a command in the console `Kernel`. You may define the signature using the `$commandSignature` property below.

```php
public function getCommandSignature(): string
{
    return 'users:update-role {user_id} {role}';
}
```

### `$commandSignature`
Same as `getCommandSignature` but as a property.

```php
public string $commandSignature = 'users:update-role {user_id} {role}';
```

### `getCommandDescription`
Provides a description to the command.

```php
public function getCommandDescription(): string
{
    return 'Updates the role of a given user.';
}
```

### `$commandDescription`
Same as `getCommandDescription` but as a property.

```php
public string $commandDescription = 'Updates the role of a given user.';
```

### `getCommandHelp`
Provides an additional message displayed when using the `--help` option.

```php
public function getCommandHelp(): string
{
    return 'My help message.';
}
```

### `$commandHelp`
Same as `getCommandHelp` but as a property.

```php
public string $commandHelp = 'My help message.';
```

### `isCommandHidden`
Defines whether or not we should hide the command from the artisan list. Default: `false`.

```php
public function isCommandHidden(): bool
{
    return true;
}
```

### `$commandHidden`
Same as `isCommandHidden` but as a property.

```php
public bool $commandHidden = true;
```
