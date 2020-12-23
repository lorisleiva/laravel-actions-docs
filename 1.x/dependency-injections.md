# Dependency injections

The `handle` method support dependency injections. 

That means, whatever arguments you enter in the `handle` method, Laravel Actions will try to resolve them from the container but also from its own attributes. Let’s have a look at some examples.

```php
// Resolved from the IoC container.
public function handle(Request $request) {/* ... */}
public function handle(MyService $service) {/* ... */}

// Resolved from the attributes.
// -- $title and $body are equivalent to $action->title and $action->body
// -- When attributes are missing, null will be returned unless a default value is provided.
public function handle($title, $body) {/* ... */}
public function handle($title, $body = 'default') {/* ... */}

// Resolved from the attributes using route model binding.
// -- If $action->comment is already an instance of Comment, it provides it.
// -- If $action->comment is an id, it will provide the right instance of 
//    Comment from the database or fail (just like it would in a controller).
//    This will also update $action->comment to be that instance.
public function handle(Comment $comment) {/* ... */}

// They can all be combined (in no particular order).
public function handle($title, Comment $comment, MyService $service) {/* ... */}
```

As you can see, both the action’s attributes and the IoC container are used to resolve dependency injections. When a matching attribute is type-hinted, the library will do its best to provide an instance of that class from the value of the attribute.

::: tip
Note that almost every method that are meant for you to override (e.g. `authorize`, `rules`, `handle`, etc.) support dependency injections.
:::
