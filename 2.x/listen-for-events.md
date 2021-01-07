# Listen for events

## Registering the listener

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

If you're listening to string events, then the `asListener` method will receive all the event parameters as arguments.

```php
// When we dispatch that string event with some parameters.
Event::dispatch('taxi.requested', [$source, $destination]);

// Then the `asListener` method receives them as arguments.
public function asListener(Source $source, Destination $destination): void
{
    $this->handle($source, $destination);
}
```

Note that, in this particular case, the `asListener` could be obsolete since it has the same signature as the `handle` method and simply delegates to it.

You may also register your action as a listener of many different events and use the `asListener` as a way to parse the various events into your `handle` method.

```php
public function asListener(...$parameters): void
{
    $event = $parameters[0];

    if ($event instanceof TaxiRequested) {
        return $this->handle($event->source, $event->destination);
    }

    if ($event instanceof FoodDeliveryRequested) {
        return $this->handle($event->restaurant->address, $event->destination);
    }
    
    $this->handle(...$parameters);
}
```

And that's all there is to it! Next, let's move on to [executing your actions as artisan commands](./execute-as-commands).
