# Actions as objects

## How are attributes filled?

When running actions as plain PHP objects, their attributes have to be filled manually using the various helper methods mentioned in the "[Actions' attributes](/actions-attributes.html)" page. For example:

```php
$action = new PublishANewArticle;
$action->title = 'My blog post';
$action->set('body', 'Lorem ipsum.');
$action->run();
```

Note that the `run` method also accepts additional attributes to be merged.

```php
(new PublishANewArticle)->run([
    'title' => 'My blog post',
    'body' => 'Lorem ipsum.',
]);
```

Alternatively, you can run an action like a function call or, even better, with a simple static call.

```php
// Actions are invokable objects.
(new PublishANewArticle)([
    'title' => 'My blog post',
    'body' => 'Lorem ipsum.',
]);

// You can also use the `run` method statically.
PublishANewArticle::run([
    'title' => 'My blog post',
    'body' => 'Lorem ipsum.',
]);
```

## Accessing the returned value

Whatever is returned by the `handle` method will be returned by the `run` method.

```php
// Assuming the `PublishANewArticle` returns the article that
// has been published, then we can access it like this.
$article = PublishANewArticle::run([
    'title' => 'My blog post',
    'body' => 'Lorem ipsum.',
]);
```
