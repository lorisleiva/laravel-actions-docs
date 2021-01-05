# Listen for events

## Registering as a listener

The register your action as an event listener, simply register it in your `EventServiceProvider` just like any other listener.

```php
namespace App\Providers;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        MyEvent::class => [
            MyAction::class,
        ],
    ];

    // ...
}
```

You may also use the `listen` method on the `Event` Facade to register it somewhere else.

```php
Event::listen(MyEvent::class, MyAction::class);

// Note that it also works with string events.
Event::listen('my_string_events.*', MyAction::class);
```

## From listener to action

As usual, you may use the `asListener` method to translate the event data into a call to your `handle` method.

```php
class SendOfferToNearbyDrivers
{
    use AsAction;

    public function handle(Address $source, Address $destination): void
    {
        // ...
    }

    public function asListener(TaxiRequested $event): void
    {
        $this->handle($event->source, $event->destination);
    }
}
```

TODO
