# Synchronize contacts from Google

## Definition

Fetches all contacts from the user's Google account and synchronize it with our own definition of contacts. Concretely, it adds or updates the fetched contacts and deletes the ones that are no longer part of the fetched contacts.

```php
class SynchronizeContactsFromGoogle
{
    use AsAction;

    protected Collection $fetchedIds;

    public function __construct(): void
    {
        $this->fetchedIds = collect();
    }

    public function handle(User $user): void
    {
        // Delegate to another action to fetch the actual data (makes it easier to mock).
        $googleContacts = FetchContactsFromGoogle::run($user);

        // TODO: Loop through them.

        // TODO: Delete old ones.
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
}
```

## Using as an object

TODO

```php
```

## Registering as a controller

TODO

```php
```

## Dispatching as an asynchronous job

TODO

```php
```

## Registering as a listener

TODO: GoogleAccountChanged

```php
```
