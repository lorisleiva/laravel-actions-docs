# Upgrade from 1.x

Laravel Actions v2 has been re-written from scratch and provides a slightly different paradigm than v1. Therefore, in all honesty, upgrading to v2 is not going to be trivial.

## A different paradigm

The main difference is that v1 uses an array of attributes — similarly to how Eloquent models work — in order to unify data between patterns (i.e. controllers, jobs, listeners, etc.).

Additionally, the action itself becomes the pattern. So if you're running an action as a controller and a job, the action needs to act as both a controller and a job.

That requires the action to extends an `Action` class that acts as a hybrid of all supported patterns and override some core Laravel components to make that work.

```php
// v1
class UpdateUserPassword extends Action
{
    public function handle(): void
    {
        $this->user()->update([
            'password' => Hash::make($this->password),
        ]);
    }
}
```

On the other hand, v2 no longer forces your actions to extend anything and gives you the freedom to right your action classes exactly as you want them to be. Instead, it uses traits to provide helper methods and recognise that your action want to be recognised as a certain pattern.

Each pattern comes with their own trait — `AsController`, `AsJob`, etc. — and are bundled together in a `AsAction` trait (See "[More granular traits](./granular-traits)").

Additionally, your action is no longer directly used as the pattern. Instead, it is wrapped in a decorator that will delegate to your actions when it needs to (See "[How does it work?](./how-does-it-work)").


```php
// v2
class UpdateUserPassword
{
    use AsAction;

    public function handle(User $user, string $newPassword): void
    {
        $user->update([
            'password' => $newPassword,
        ]);
    }
}
```

The bottom line here is: a refactoring from v1 to v2 might be a good opportunity to rethink some of your actions now that you're free to implement them without any constraints.

Whilst it is impossible to provide a step-by-step guide to upgrading to v2, the next sections focus on providing snippet of before/after code to help you see what has changed.

## No more attributes

There's no longer an array of attributes in your actions.

```php
// v1
class CreateNewArticle extends Action
{
    public function handle(): Article
    {
        return $this->user()->articles()->create([
            'title' => $this->title,
            'body' => $this->body,
        ]);
    }
}

// v2
class CreateNewArticle
{
    use AsAction;

    public function handle(User $author, string $title, string $body): Article
    {
        return $author->articles()->create([
            'title' => $title,
            'body' => $body,
        ]);
    }
}
```

## Authorization and validation for controllers only

Because we no longer have attributes to unify data between patterns, authorization and validation will only affect the action when it is running as a controller — and therefore when a request is available.

## Inject dependencies in the constructor

Since your actions will always be resolved from the container, you may now use the `__construct` method to inject some dependencies into your action.

```php
// v2
class GetDirectionsToRestaurant
{
    use AsAction;

    protected GoogleMapsService $googleMaps;

    public function __construct(GoogleMapsService $googleMaps)
    {
        $this->googleMaps = $googleMaps;
    }
}
```

## One method for both input and output

On v1, you could use the `asX` methods to insert logic *before* the `handle` method is executed and/or the `getAttributesFromX` methods to provide custom parsing between the pattern and the attributes. You'd then need to implement an other method such as `response` or `consoleOutput` to insert logic *after* the `handle` method.

On v2, you no longer need to remember which method to call for hooking data before and/or after for each pattern. Instead, you have exactly one point of entry for each pattern: `asController`, `asCommand`, etc.

These methods are now responsible for both the input and the output of that pattern since you'll be calling the `handle` method directly in there.

```php
// v1
class CreateNewArticle extends Action
{
    public function getAttributesFromCommand(Command $command): array
    {
        $this->actingAs(User::findOrFail($command->argument('user_id')));

        return [
            'title' => $command->argument('title'),
            'body' => $command->argument('body'),
        ];
    }

    public function handle(): Article
    {
        return $this->user()->articles()->create([
            'title' => $this->title,
            'body' => $this->body,
        ]);
    }

    public function consoleOutput($article, Command $command): void
    {
        $command->info("Article \"{$article->title}\" created.");
    }
}

// v2
class CreateNewArticle
{
    use AsAction;

    public function handle(User $author, string $title, string $body): Article
    {
        return $author->articles()->create([
            'title' => $title,
            'body' => $body,
        ]);
    }

    public function asCommand(Command $command): Article
    {
        $article = $this->handle(
            User::findOrFail($command->argument('user_id')),
            $command->argument('title')),
            $command->argument('body')),
        );

        $command->info("Article \"{$article->title}\" created.");
    }
}
```

## Queue fake and job decorators

If you're using `Queue::fake()` in your test to assert an action was dispatched as a job, these tests will now fail due to the fact that the job is now a `JobDecorator` wrapping your action and no the action itself.

To fix this, you simply need to replace `Queue::assertPushed(MyAction::class)` to `MyAction::assertPushed()`.

See ["Asserting jobs were pushed"](./dispatch-jobs.html#asserting-jobs-were-pushed) for more information.

## Methods and properties map

The table below provides a mapping between the methods and properties available in v1 and the ones available in v2 ordered alphabetically.

| v1 | v2 | Comments |
| - | - | - |
| `actingAs` | *Removed* | No more user helpers. If an action requires a user to work, simply pass the user as an argument. |
| `afterValidator` | `afterValidator` | Same behaviour but only applies when running as a controller. |
| `all` | *Removed* | Obsolete now that actions no longer have attributes. |
| `asCommand` | `asCommand` | Same name but different behaviour. `asCommand` is now the single point of entry when the action is executed as a command (See "[One method for both input and output](#one-method-for-both-input-and-output)").  |
| `asController` | `asController` | Same name but different behaviour. `asController` is now the single point of entry when the action is executed as a controller (See "[One method for both input and output](#one-method-for-both-input-and-output)").  |
| `asJob` | `asJob` | Same name but different behaviour. `asJob` is now the single point of entry when the action is dispatched as a job (See "[One method for both input and output](#one-method-for-both-input-and-output)").  |
| `asListener` | `asListener` | Same name but different behaviour. `asListener` is now the single point of entry when the action is executed as a listener (See "[One method for both input and output](#one-method-for-both-input-and-output)").  |
| `attributes` | `getValidationAttributes` | Same behaviour but only applies when running as a controller. |
| `authorize` | `authorize` | Same behaviour but only applies when running as a controller. |
| `can` | *Removed* | On v2, there's no `$user` property anymore. |
| `$commandSignature` | `$commandSignature` | Same but need to be `public`. On v2, you can also use the `getCommandSignature` method instead. |
| `$commandDescription` | `$commandDescription` | Same but need to be `public`. On v2, you can also use the `getCommandDescription` method instead. |
| `consoleOutput` | *Removed* | You can now provide the command's output directly in the `asCommand` method. |
| `delegateTo` | *Removed* | Just use `MyOtherAction::run` instead. The same goes for `createFrom` and `runAs`. |
| `$errorBag` | `getValidationErrorBag` | Same behaviour but only applies when running as a controller. |
| `except` | *Removed* | Obsolete now that actions no longer have attributes. |
| `failedAuthorization` | `getAuthorizationFailure` | Same behaviour but only applies when running as a controller. |
| `failedValidation` | `getValidationFailure` | Same behaviour but only applies when running as a controller. |
| `fill` | *Removed* | Obsolete now that actions no longer have attributes. |
| `get` | *Removed* | Obsolete now that actions no longer have attributes. |
| `getAttributesFromCommand` | *Removed* | You can now parse the command's input directly in the `asCommand` method. |
| `getAttributesFromConstructor` | *Removed* | Obsolete now that actions no longer have attributes. |
| `getAttributesFromEvent` | *Removed* | You can now parse the event data directly in the `asListener` method. |
| `getAttributesFromRequest` | *Removed* | You can now parse the request data directly in the `asController` method. |
| `getRedirectUrl` | `getValidationRedirect` | Same behaviour but only applies when running as a controller. |
| `handle` | `handle` | Same method but it no longer resolves the attributes from its arguments since v2 no longer has attributes. Instead, you have full control over your method signature. |
| `has` | *Removed* | Obsolete now that actions no longer have attributes. |
| `initialized` | *Removed* | You can now use `__construct` instead. |
| *Added* | `make` | *(Static)* Equivalent to `app(MyAction::class)`. |
| `messages` | `getValidationMessages` | Same behaviour but only applies when running as a controller. |
| `middleware` | `getControllerMiddleware` or `getJobMiddleware` | On v2, you have to explicitely provide middleware for controllers and/or jobs. On v1, there could have been conflicts between the two. |
| `only` | *Removed* | Obsolete now that actions no longer have attributes. |
| `prepareForValidation` | `prepareForValidation` | Same behaviour but only applies when running as a controller. |
| `registered` | *Removed* | On v2, actions are recognised on demand instead of being registered in a service provider. |
| `response` | *Removed* | You can now provide the controller's reponse directly in the `asController` method. Note that `htmlResponse` and `jsonResponse` still exist. |
| `routes` | `routes` | *(static)* Same method but you need to locate your actions in a service provider for this to work (See "[Registering routes directly in the action](register-as-controller.html#registering-routes-directly-in-the-action)"). |
| `rules` | `rules` | Same behaviour but only applies when running as a controller. |
| `run` | `run` | *(Static)* Same behaviour but now works only statically. You can use `$action->handle(...)` if you're looking for a non-static way to run your action. |
| `runningAs` | *Removed* | You pattern-specific logic now live in the `asX` methods. |
| `set` | *Removed* | Obsolete now that actions no longer have attributes. |
| `user` | *Removed* | No more user helpers. If an action requires a user to work, simply pass the user as an argument. |
| `validationData` | `getValidationData` | Same behaviour but only applies when running as a controller. |
| `validator` | `getValidator` | Same behaviour but only applies when running as a controller. |
| `withValidator` | `withValidator` | Same behaviour but only applies when running as a controller. |
