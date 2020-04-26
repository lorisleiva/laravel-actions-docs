# Actions as controllers

## How are attributes filled?

By default, all input data from the request and the route parameters will be used to fill the action's attributes.

You can change this behaviour by overriding the `getAttributesFromRequest` method. This is its default implementation:

```php
public function getAttributesFromRequest(Request $request)
{
    return array_merge(
        $this->getAttributesFromRoute($request),
        $request->all()
    );
}
```

Note that, since we're merging two sets of data together, a conflict is possible when a variable is defined on both sets. As you can see, by default, the request's data takes priority over the route's parameters. However, when resolving dependencies for the `handle` method's argument, the route parameters will take priority over the request's data.

That means in case of conflict, you can access the route parameter as a method argument and the request's data as an attribute. For example:

```php
// Route endpoint: PATCH /comments/{comment}
// Request input: ['comment' => 'My updated comment']
public function handle(Comment $comment)
{
    $comment;        // <- Comment instance matching the given id.
    $this->comment;  // <- 'My updated comment'
}
```

## Registering actions in routes files

Because your actions are located by default in the `\App\Action` namespace and not the `\App\Http\Controller` namespace, you have to provide the full qualified name of the action if you want to define them in your `routes/web.php` or `routes/api.php` files.

```php
// routes/web.php
Route::post('articles', '\App\Actions\PublishANewArticle');
```

<sup>*Note that the initial `\` here is important to ensure the namespace does not become `\App\Http\Controller\App\Actions\PublishANewArticle`.*</sup>

Alternatively you can place them in a group that re-defines the namespace.

```php
// routes/web.php
Route::namespace('\App\Actions')->group(function () {
    Route::post('articles', 'PublishANewArticle');
});
```

Laravel Actions provides a `Route` macro that does exactly this:

```php
// routes/web.php
Route::actions(function () {
    Route::post('articles', 'PublishANewArticle');
});
```

Another solution would be to create a new route file `routes/action.php` and register it in your `RouteServiceProvider`.

```php
// app/Providers/RouteServiceProvider.php
Route::middleware('web')
     ->namespace('App\Actions')
     ->group(base_path('routes/action.php'));

// routes/action.php
Route::post('articles', 'PublishANewArticle');
```

## Registering routes directly in actions

Another way to register actions as controllers is to define the routes directly within the actions using the static `routes` method.

```php
class GetArticlesFromAuthor extends Action
{
    public static function routes(Router $router)
    {
        $router->get('author/{author}/articles', static::class);
    }

    public function handle(User $author)
    {
        return $author->articles;
    }
}
```

::: warning
This will work out-of-the-box for actions defined in the `app/Actions` folder (or subfolders). If some of your actions live outside this folder, you will need to call `Actions::paths([...])` in a service provider to let the library know where to find your actions in order to register these routes.

See the "[Registering actions](/registering-actions.html)" page for more details. 
:::

## Registering middleware

You can register middleware using the `middleware` method.

```php
public function middleware()
{
    return ['auth'];
}
```

Alternatively, if you decide to register your routes directly within your actions, you can specify the middleware in the `routes` static method.

```php
public static function routes(Router $router)
{
    $router->middleware(['web', 'auth'])->get('author/{author}/articles', static::class);
}
```

## Returning HTTP responses

It is good practice to let the action return a value that makes sense for your domain. For example, the article that was just created or the filtered list of topics that we are searching for.

However, you might want to wrap that value into a proper HTTP response when the action is being ran as a controller. You can use the `response` method for that. It provides the result of the `handle` method as first argument and the HTTP request as second argument.

```php
public function response($result, $request)
{
    return view('articles.index', [
        'articles' => $result,
    ])
}
```

If you want to return distinctive responses for clients that require HTML and clients that require JSON, you can respectively use the `htmlResponse` and `jsonResponse` methods.

```php
public function htmlResponse($result, $request)
{
    return view('articles.index', [
        'articles' => $result,
    ]);
}

public function jsonResponse($result, $request)
{
    return ArticleResource::collection($result);
}
```
