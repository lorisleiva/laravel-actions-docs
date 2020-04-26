# Actions as listeners

## How are attributes filled?

By default, all of the event’s public properties will be used as attributes.

```php
class ProductCreated
{
    public $title;
    public $body;
    
    // ...
}
```

You can override that behaviour by defining the `getAttributesFromEvent` method.

```php
// Event
class ProductCreated
{
    public $product;
}

// Listener
class PublishANewArticle extends Action
{
    public function getAttributesFromEvent($event)
    {
        return [
            'title' => '[New product] ' . $event->product->name,
            'body' => $event->product->description,
        ];
    }
}
```

This can also work with events defined as strings.

```php
// Event
Event::listen('product_created', PublishANewArticle::class);

// Dispatch
event('product_created', ['My SaaS app', 'Lorem ipsum']);

// Listener
class PublishANewArticle extends Action
{
    public function getAttributesFromEvent($title, $description)
    {
        return [
            'title' => "[New product] $title",
            'body' => $description,
        ];
    }

    // ...
}
```
