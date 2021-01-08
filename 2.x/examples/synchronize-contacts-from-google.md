# Synchronize contacts from Google

## Definition

Fetches all contacts from the user's Google account and synchronize it with our own definition of contacts. Concretely, it adds or updates the fetched contacts and deletes the ones that are no longer part of the fetched contacts.

```php
class SynchronizeContactsFromGoogle
{
    use AsAction;

    protected Collection $fetchedIds;
    public string $commandSignature = 'users:sync-contacts {user_id}';
    public string $commandDescription = 'Synchronize the Google contacts of the given user.';

    public function __construct(): void
    {
        $this->fetchedIds = collect();
    }

    public function handle(User $user): void
    {
        // Delegate to another action to fetch the actual data (makes it easier to mock).
        $googleContacts = FetchContactsFromGoogle::run($user);

        // Update or create contacts from the fetched data.
        $googleContacts->each(
            fn ($googleContact) => $this->upsertContact($user, $googleContact)
        );

        // Remove any existing contacts that were not part of the fetched contacts.
        $user->contacts()
            ->whereNotIn('google_id', $this->fetchedIds)
            ->delete();
    }

    protected function upsertContact(User $user, array $googleContact): void
    {
        $user->contacts()->updateOrCreate(
            [
                'google_id' => Arr::get($googleContact, 'id')
            ],
            [
                'name' => Arr::get($googleContact, 'name'),
                'company' => Arr::get($googleContact, 'company'),
                'phone' => Arr::get($googleContact, 'phone'),
                'email' => Arr::get($googleContact, 'email'),
            ],
        );

        $this->fetchedIds->push(Arr::get($googleContact, 'id'));
    }

    public function getControllerMiddleware(): array
    {
        return ['auth'];
    }

    public function asController(Request $request)
    {
        $this->handle($user = $request->user());

        return ContactResource::collection($user->contacts);
    }

    public function asListener(GoogleAccountChanged $event): void
    {
        $this->handle($event->googleAccount->user);
    }

    public function asCommand(Command $command): void
    {
        $this->handle(
            User::findOrFail($command->argument('user_id'))
        );

        $command->line('Done!');
    }
}
```

## Using as an object

```php
SynchronizeContactsFromGoogle::run($user);
```

## Registering as a controller

```php
Route::post('users/contacts/sync', SynchronizeContactsFromGoogle::class);
```

## Dispatching as an asynchronous job

```php
SynchronizeContactsFromGoogle::dispatch($user);
```

## Registering as a listener

```php
namespace App\Providers;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        GoogleAccountChanged::class => [
            SynchronizeContactsFromGoogle::class,
        ],
    ];

    // ...
}
```

## Registering as a command

```php
namespace App\Console;

class Kernel extends ConsoleKernel
{
    protected $commands = [
        SynchronizeContactsFromGoogle::class,
    ];
    
    // ...
}
```
