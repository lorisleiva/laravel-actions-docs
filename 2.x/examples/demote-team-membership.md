# Demote team membership

## Definition

Update the plan of a given team to `free` and disable projects that are no longer included in the plan.

```php
class DemoteTeamMembership
{
    use AsAction;

    public string $commandSignature = 'teams:demote {team_id}';
    public string $commandDescription = 'Demote the team with the given id.';

    public function handle(Team $team): void
    {
        $team->update(['plan' => 'free' ]);
        $numberOfProjectsAllowed = config('app.plans.free.number_of_projects');

        if ($team->projects()->count() <= $numberOfProjectsAllowed) {
            return;
        }

        $team->projects()
            ->orderBy('created_at')
            ->skip($numberOfProjectsAllowed)
            ->update(['disabled_at' => now()]);
    }

    public function asListener(PaymentFailed $event): void
    {
        $this->handle($event->payment->team);
    }

    public function asCommand(Command $command): void
    {
        $team = Team::findOrFail($command->argument('team_id'));
        $this->handle($team);

        $command->line('Done!');
    }
}
```

## Using as an object

```php
DemoteTeamMembership::run($team);
```

## Registering as a listener

To make your action listen to a particular event, simply add it to your `EventServiceProvider`.

```php
namespace App\Providers;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        PaymentFailed::class => [
            DemoteTeamMembership::class,
        ],
    ];

    // ...
}
```

## Using as a command

It could be useful to register the action as command should we need to manually demote a team. To do that we need to register our command in the console `Kernel`.

```php
namespace App\Console;

class Kernel extends ConsoleKernel
{
    protected $commands = [
        DemoteTeamMembership::class,
    ];
    
    // ...
}
```

Now we can demote a team of id `42` like this:

```
php artisan teams:demote 42
```
