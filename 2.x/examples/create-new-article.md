# Create new article

## Definition

Creates a new article for the given user with the given data. It uses the authenticated user when used as a controller and provides some custom authorization and validation.

```php
class CreateNewArticle
{
    use AsAction;

    public function handle(User $author, array $data): Article
    {
        return $author->articles()->create($data);
    }

    public function getControllerMiddleware(): array
    {
        return ['auth'];
    }

    public function authorize(ActionRequest $request): bool
    {
        return in_array($request->user()->role, ['author', 'admin']);
    }

    public function rules(ActionRequest $request): array
    {
        return [
            'title' => ['required', 'min:8'],
            'body' => ['required', IsValidMarkdown::class],
            'published' => ['required', 'boolean'],
        ]
    }

    public function asController(ActionRequest $request): Article
    {
        $data = $request->only('title', 'body');
        $data['published_at'] = $request->get('published') ? now() : null;

        return $this->handle($request->user(), $data);
    }
}
```

## Usage as object

Note how we can use this action different based on how it's running. Internally, we might want to allow ourselves to define a custom publication date whereas we only allow a `published` boolean to the outside world.

```php
CreateNewArticle::run($author, [
    'title' => 'My article',
    'body' => '# My article',
    'published_at' => now()->addWeek(),
])
```

It is also important to note that the authorization and validation logic will only be applied to the action when it is running as a controller.

## Usage as controller

To use as a controller simply register the action in your routes file.

```php
Route::post('articles', CreateNewArticle::class);
```
