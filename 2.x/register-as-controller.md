# Register your task as a controller

## Registering the route

To run your action as a controller, you simply need to register it in your routes file just like any other invokable controller.

```php
Route::post('/users/{user}/articles', CreateNewArticle::class);
```

## From controller to action

Because you have full control on how your actions are implemented, you need to translate the received request into a call to your `handle` method.

You can use the `asController` method to define that logic. Its parameters will be resolved using route model binding just like it would in a controller method.

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
        )

        return redirect()->route('articles.show', [$article]);
    }
}
```

If you're only planning on using your action as controller, you can omit the `asController` method and use the `handle` method directly as an invokable controller.

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

## Providing a different response for JSON and HTML

TODO:
jsonResponse
htmlResponse

## The __invoke method

TODO
__invoke
