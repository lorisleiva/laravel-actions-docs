# Actions as jobs

## How are attributes filled?

Similarly to actions as objects, attributes are filled manually when you dispatch the action.

```php
PublishANewArticle::dispatch([
    'title' => 'My blog post',
    'body' => 'Lorem ipsum.',
]);
```

## Queueable actions

Just like jobs, actions can be queued by implementing the `ShouldQueue` interface.

```php
use Illuminate\Contracts\Queue\ShouldQueue;

class PublishANewArticle extends Action implements ShouldQueue
{
    // ...
}
```

Note that you can also use the `dispatchNow` method to force a queueable action to be executed immediately.

## Access the returned value

When dispatching a job immediately (either by using `dispatchNow` or the `sync` queue driver), then the result of the action will be returned.

```php
$article = PublishANewArticle::dispatchNow([
    'title' => 'My blog post',
    'body' => 'Lorem ipsum.',
]);
```
