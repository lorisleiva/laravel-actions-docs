# As listener

## Method used
*Lists all methods recognised and used by the `ListenerDecorator`.*

### `asListener`
Called when executed as an event listener. Uses the `handle` method directly when no `asListener` method exists.

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
