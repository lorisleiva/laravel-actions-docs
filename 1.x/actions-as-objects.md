# Actions as objects

## How are attributes filled?

By default, you can initialise an action by providing an array of attributes like this.

```php
$action = new PublishANewArticle([
    'title' => 'My blog post',
    'body' => 'Lorem ipsum.',
]);
```

You can define your custom logic of how to get attributes from the constructor by overriding the `getAttributesFromConstructor` method.

```php
class PublishANewArticle extends Action
{
    public function getAttributesFromConstructor($title, $body)
    {
        return compact('title', 'body');
    }
}
```

With the example above, you can now create a new `PublishANewArticle` action like this:

```php
$action = new PublishANewArticle('My blog post', 'Lorem ipsum.');
```

If (like in the example above) you simply need to map the order in which the attributes are given, you can achieve the exact same result by defining the `$getAttributesFromConstructor` property instead.

```php
class PublishANewArticle extends Action
{
    protected $getAttributesFromConstructor = ['title', 'body'];
}
```

Finally, if you want to use the same order as the arguments of the handle method, all you need to do is set the `$getAttributesFromConstructor` property to `true`. The code below is equivalent to the previous example.

```php
class PublishANewArticle extends Action
{
    protected $getAttributesFromConstructor = true;

    public function handle($title, $body)
    {
        // ...
    }
}
```

## The static `run` method

In most cases, you will likely want to create an action and run it immediately. Thus, there exists a static `run` method that does just that. It is worth noting that any argument given to the static `run` method will be passed on to the constructor.

```php
// This:
PublishANewArticle::run('My blog post', 'Lorem ipsum.');

// Is equivalent to this:
$action = new PublishANewArticle('My blog post', 'Lorem ipsum.');
$action->run();
```

::: tip
If you are using PHPStorm, you can use annotations to update the signature of the static run method. That way, you can still benefit from the autocompletion feature.

```php
/**
 * @method mixed run(string $title, string $description)
 */
 class MyAction extends Action {...}
```
:::

## Handling attributes

When running actions as plain PHP objects, their attributes can be manually updated using the various helper methods mentioned in the "[Actions' attributes](./actions-attributes.html)" page. For example:

```php
$action = new PublishANewArticle;
$action->title = 'My blog post';
$action->set('body', 'Lorem ipsum.');
$action->run();
```

Note that the `run` method can also accept an array of attributes to merge with the existing attributes.

```php
$action = new PublishANewArticle;
$action->fill(['title' => 'My blog post'])
$action->run(['body' => 'Lorem ipsum.']);
```

Also note that actions are invokable object which means you can run them like functions.

```php
$action = new PublishANewArticle([
    'title' => 'My blog post',
    'body' => 'Lorem ipsum.',
]);

$actions();
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
