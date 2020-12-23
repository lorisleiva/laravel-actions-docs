# Actions as jobs

## How are attributes filled?

Similarly to [actions as objects](./actions-as-objects.html), attributes are filled manually when you dispatch the action.

```php
PublishANewArticle::dispatch([
    'title' => 'My blog post',
    'body' => 'Lorem ipsum.',
]);
```

If you have defined a `getAttributesFromConstructor` method or property, this will also be applicable to jobs. For example:

```php
// If you have the following constructor mapping.
class PublishANewArticle extends Action
{
    protected $getAttributesFromConstructor = ['title', 'body'];
}

// Then you can dispatch the action as a job like this.
PublishANewArticle::dispatch('My blog post', 'Lorem ipsum.');
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

## Accessing the returned value

When dispatching a job immediately (either by using `dispatchNow` or the `sync` queue driver), then the result of the action will be returned.

```php
$article = PublishANewArticle::dispatchNow([
    'title' => 'My blog post',
    'body' => 'Lorem ipsum.',
]);
```

## Registering middleware

You can register job middleware using the `middleware` method.

```php
public function middleware()
{
    return [new RateLimited];
}
```
