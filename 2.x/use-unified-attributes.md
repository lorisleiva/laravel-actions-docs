# Use unified attributes

::: tip Info
This feature is available from version `2.1`.
:::

## Why using unified attributes?

In the first version of Laravel Actions, actions were much more opinionated and forced you to **structure your data as a set of attributes that were unified across all design patterns** — i.e. as an object, as a controller, etc.

Laravel Actions moved away from this and dropped unified attributes to allow actions to be much more flexible and much less intrusive in the way you organize your classes. As a result, you can now run any class as anything you want and even [cherry-pick the parts of Laravel Actions you want](./granular-traits).

This also means that Laravel Actions can now only help you resolve authorization and validation for your actions when they are executed as controllers. In the first version, the unified attributes meant we could offer this feature for every single pattern.

For that reason, Laravel Actions v2 provides an optional `WithAttributes` trait that allows you to **structure your action's data as an array of attributes that can be validated at any time**. Additionally, this trait makes the process of upgrading from Laravel Actions v1 much easier.

## Adding attributes to an action

The `WithAttributes` trait is not included in the `AsAction` trait by default. This means you will need to add it next to the other imports.

```php
use Lorisleiva\Actions\Concerns\AsAction;
use Lorisleiva\Actions\Concerns\WithAttributes;

class MyAction
{
    use AsAction;
    use WithAttributes;

    // Or if you prefer cherry-picking patterns.
    use AsObject;
    use AsController;
    use AsFaker;
    use WithAttributes;
}
```

If you're going to use unified attributes for every single action, you might want to create your own `AsAction` trait like so.

```php
use Lorisleiva\Actions\Concerns\AsAction as AsBaseAction;
use Lorisleiva\Actions\Concerns\WithAttributes;

trait AsAction
{
    use AsBaseAction;
    use WithAttributes;
}
```

## Managing attributes

The `WithAttributes` trait provides the following methods to access and update attributes. You can [read more about them in the references](./with-attributes.html#method-provided).

```php
$action->setRawAttributes(['key' => 'value']); // Replace all attributes.
$action->fill(['key' => 'value']);             // Merge the given attributes with the existing attributes.
$action->fillFromRequest($request);            // Merge the request data and route parameters with the existing attributes.
$action->all();                                // Retrieve all attributes.
$action->only('title', 'body');                // Retrieve only the attributes provided.
$action->except('body');                       // Retrieve all attributes excepts the one provided.
$action->has('title');                         // Whether the action has the provided attribute.
$action->get('title');                         // Get an attribute.
$action->get('title', 'Untitled');             // Get an attribute with default value.
$action->set('title', 'My blog post');         // Set an attribute.
$action->title;                                // Get an attribute.
$action->title = 'My blog post';               // Set an attribute.
```

## Validating attributes

The `WithAttributes` trait also provides a `validateAttributes` method that you can use at any time to trigger the authorization and validation of your attributes. This method returns the validated data if you need it.

```php
public function handle(array $attributes = [])
{
    $this->fill($attributes);
    $validatedData = $this->validateAttributes();

    // ...
}
```

When calling the `validateAttributes` method, the same methods used to validate the `ActionRequest` will be used to validate your attributes:

- [`prepareForValidation`](./as-controller.html#prepareforvalidation)
- [`authorize`](./as-controller.html#authorize)
- [`rules`](./as-controller.html#rules)
- [`withValidator`](./as-controller.html#withvalidator)
- [`afterValidator`](./as-controller.html#aftervalidator)
- [`getValidator`](./as-controller.html#getvalidator)
- [`getValidationData`](./as-controller.html#getvalidationdata)
- [`getValidationMessages`](./as-controller.html#getvalidationmessages)
- [`getValidationAttributes`](./as-controller.html#getvalidationattributes)
- [`getValidationRedirect`](./as-controller.html#getvalidationredirect)
- [`getValidationErrorBag`](./as-controller.html#getvalidationerrorbag)
- [`getValidationFailure`](./as-controller.html#getvalidationfailure)
- [`getAuthorizationFailure`](./as-controller.html#getauthorizationfailure)

Note that, when using the `WithAttributes` trait, **the action will no longer automatically validate the `ActionRequest` for you**. This is to avoid triggering the validation process twice: once on the `ActionRequest` and once on your attributes.

If you want to manually trigger validation on the `ActionRequest` instance, you can do so by calling the `validate` method on the request.

```php
class MyAction
{
    use AsAction;
    use WithAttributes;

    public function rules()
    {
        return [
            // ...
        ];
    }

    public function asController(ActionRequest $request)
    {
        // Even though we provided some rules, the $request will 
        // not be validated since we're using unified attributed.

        // You can trigger validation on the request manually like so.
        $request->validate();

        // ...
    }
}
```

## A concrete example

Let's have a look at a concrete example using unified attributes. We'll implement an action that creates a new article and do so as an object or as a controller. We'll want authorization and validation to trigger for both of these patterns.

It's important to note that, even with the `WithAttributes` trait, you still have full control over how to structure your action's API. It's a good idea to first think about how you'd like your action to be run as an object. Do you want to be explicit in the arguments you provide? Do you want to give all the data as one big array? Or a mixture of both?

```php
// As explicit arguments.
PublishNewArticle::run($author, $title, $body);

// As an array of attributes.
PublishNewArticle::run([
    'author' => $author,
    'title' => $title,
    'body' => $body,
])

// As a mixture of both.
PublishNewArticle::run($author, [
    'title' => $title,
    'body' => $body,
])
```

Since it comes down to preferences, let's use the latter so we can study both scenarios at once.

Let's implement that `PublishNewArticle` action. The `authorize` method will check if the user has the appropriate permission to add articles and the `rule` method will validate the title and the content of the article.

```php
class PublishNewArticle
{
    use AsAction;
    use WithAttributes;

    public function authorize()
    {
        return $this->author->can('publish-new-articles');
    }

    public function rules()
    {
        return [
            'title' => ['required'],
            'body' => ['required', 'min:100'],
        ]
    }

    public function handle(User $author, array $attributes = [])
    {
        $this->set('author', $author)->fill($attributes);
        $validatedData = $this->validateAttributes();

        return $this->author->articles()->create($validatedData);
    }

    public function asController(ActionRequest $request)
    {
        $this->fillFromRequest($request);
        $article = $this->handle($request->user());

        return $this->author->articles()->create($validatedData);
    }
}
```

Notice how the `handle` method fills an optional attribute array when used as an object. When used as a controller, we can use the `fillFromRequest` method instead which will fill our attributes with the request data and its route parameters.

Note that there are many ways you could handle unified attributes in your actions. This example is simply meant to help you get started with unified attributes.
