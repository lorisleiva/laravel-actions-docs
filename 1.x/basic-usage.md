# Basic usage

Create your first action using `php artisan make:action PublishANewArticle` and fill the authorisation logic, the validation rules and the handle method. Note that the `authorize` and `rules` methods are optional and default to `true` and `[]` respectively.

```php
// app/Actions/PublishANewArticle.php
class PublishANewArticle extends Action
{
    public function authorize()
    {
        return $this->user()->hasRole('author');
    }
    
    public function rules()
    {
        return [
            'title' => 'required',
            'body' => 'required|min:10',
        ];
    }
    
    public function handle()
    {
        return Article::create($this->validated());
    }
}
```

You can now start using that action in multiple ways:

## As a plain object.

```php
$action = new PublishANewArticle([
    'title' => 'My blog post',
    'body' => 'Lorem ipsum.',
]);

$article = $action->run();
```

## As a dispatchable job.

```php
PublishANewArticle::dispatch([
    'title' => 'My blog post',
    'body' => 'Lorem ipsum.',
]);
```

## As an event listener.

```php
class ProductCreated
{
    public $title;
    public $body;
    
    public function __construct($title, $body)
    {
        $this->title = $title;
        $this->body = $body;
    }
}

Event::listen(ProductCreated::class, PublishANewArticle::class);

event(new ProductCreated('My new SaaS application', 'Lorem Ipsum.'));
```

## As an invokable controller.

```php
// routes/web.php
Route::post('articles', '\App\Actions\PublishANewArticle');
```
If you need to specify an explicit HTTP response for when an action is used as a controller, you can define the `response` method which provides the result of the `handle` method as the first argument.

```php
class PublishANewArticle extends Action
{
    // ...
    
    public function response($article)
    {
        return redirect()->route('article.show', $article);
    }
}
```

## As an artisan command.

```php
class PublishANewArticle extends Action
{
    protected static $commandSignature = 'make:article {title} {body}';
    protected static $commandDescription = 'Publishes a new article';

    // ...
}
```
