# Register your task as a controller

## Registering the route

To run your action as a controller, you simply need to register it in your routes file just like any other invokable controller.

```php
Route::post('/users/{user}/articles', CreateNewArticle::class);
```

## From controller to action

Because you have full control on how your actions are implemented, you need to translate the received request into a call to your `handle` method.

You can use the `asController` method to define that logic. Its parameters will be resolved using route model binding just like it would in a controller.

```php
class CreateNewArticle
{
    use AsAction;

    public function handle(User $user, string $title, string $body): Article
    {
        return $user->articles()->create(compact('title', 'body'));
    }

    public function asController(User $user, Request $request): Response
    {
        $article = $this->handle(
            $user,
            $request->get('title'),
            $request->get('body')
        );

        return redirect()->route('articles.show', [$article]);
    }
}
```

If you're only planning on using your action as a controller, you can omit the `asController` method and use the `handle` method directly as an invokable controller.

```php
class CreateNewArticle
{
    use AsAction;

    public function handle(User $user, Request $request): Response
    {
        $article = $user->articles()->create(
            $request->only('title', 'body')
        )

        return redirect()->route('articles.show', [$article]);
    }
}
```

Note that, in this example, you loose the ability to run `CreateNewArticle::run($user, 'My title', 'My content')`.

## Assigning controller middleware

Instead of — or in addition to — defining your middleware in your routes file, you may also define them directly in the action using the `getControllerMiddleware` method.

```php
class CreateNewArticle
{
    use AsAction;

    public function getControllerMiddleware(): array
    {
        return ['auth', MyCustomMiddleware::class];
    }

    // ...
}
```

## Providing a different response for JSON and HTML

Oftentimes, you'll need your controllers — and therefore actions — to be available both as a web page and as a JSON API endpoint. You'll likely endup doing something like this a little bit everywhere.

```php
if ($request->expectsJson()) {
    return new ArticleResource($article);
} else {
    return redirect()->route('articles.show', [$article]);
}
```

That's why Laravel Actions recognises two helper methods `jsonResponse` and `htmlResponse` that you can use to separate the response based on the request expecting JSON or not.

These methods receive as a first argument the return value of the `asController` method and, as a second argument, the `Request` object.

```php
class CreateNewArticle
{
    use AsAction;

    public function handle(User $user, string $title, string $body): Article
    {
        return $user->articles()->create(compact('title', 'body'));
    }

    public function asController(User $user, Request $request): Article
    {
        return $this->handle($user, $request->get('title'), $request->get('body'));
    }

    public function htmlResponse(Article $article): Response
    {
        return redirect()->route('articles.show', [$article]);
    }

    public function jsonResponse(Article $article): ArticleResource
    {
        return new ArticleResource($article);
    }
}
```

Now that we're familiar on how to use actions as controllers, let's go one step further and see how Laravel Actions can handle [authorization and validation when being used as a controller](./add-validation-to-controllers).
