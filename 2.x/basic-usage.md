# Basic usage

First, start by creating a simple PHP class that handles your task. For the sake of this tutorial, let's create a simple class that updates a user's password.

You can organise these actions however you want. Personally, I like to place these under an `app/Actions` folder or — if my app is separated into modules — under `app/MyModule/Actions`.

```php
namespace App\Authentication\Actions;

class UpdateUserPassword
{
    public function handle(User $user, string $newPassword)
    {
        $user->password = Hash::make($newPassword);
        $user->save();
    }
}
```

Next, add the `AsAction` trait to your class. This will enable you to use this class as **an object**, **a controller**, **a job**, **a listener**, **a command** and even as **a fake** instance for testing and mocking purposes.

```php
namespace App\Authentication\Actions;

use Lorisleiva\Actions\Concerns\AsAction;

class UpdateUserPassword
{
    use AsAction;

    public function handle(User $user, string $newPassword)
    {
        $user->password = Hash::make($newPassword);
        $user->save();
    }
}
```

## Running as an object

The `AsAction` trait provides a couple of methods that help you resolve the class from the container and execute it.

```php
// Equivalent to "app(UpdateUserPassword::class)".
UpdateUserPassword::make();

// Equivalent to "UpdateUserPassword::make()->handle($user, 'secret')".
UpdateUserPassword::run($user, 'secret');
```

## Running as a controller

Now, let's use our action as a controller. First, we need to register it in our routes file just like we would register any invokable controller.

```php
Route::put('auth/password', UpdateUserPassword::class)->middleware('auth');
```

Then, all we need to do is implement the `asController` method so we can translate the request data into the arguments our action expect — in this case, a user object and a password.

```php
class UpdateUserPassword
{
    use AsAction;

    public function handle(User $user, string $newPassword)
    {
        $user->password = Hash::make($newPassword);
        $user->save();
    }

    public function asController(Request $request)
    {
        $this->handle(
            $request->user(), 
            $request->get('password')
        );

        return redirect()->back();
    }
}
```

And just like that, you're using your custom PHP class as a controller. But what about authorization and validation? Shouldn't we make sure the new password was confirmed and the old password provided? Sure, let's do that.

## Adding controller validation

Instead of injecting the regular `Request` class, we can either inject a custom `FormRequest` class or inject the `ActionRequest` class which will use the action itself to resolve authorization and validation.

```php
use Lorisleiva\Actions\Concerns\AsAction;
use Lorisleiva\Actions\ActionRequest;
use Illuminate\Validation\Validator;

class UpdateUserPassword
{
    use AsAction;

    // ...

    public function rules()
    {
        return [
            'current_password' => ['required'],
            'password' => ['required', 'confirmed'],
        ];
    }

    public function withValidator(Validator $validator, ActionRequest $request)
    {
        $validator->after(function (Validator $validator) use ($request) {
            if (! Hash::check($request->get('current_password'), $request->user()->password)) {
                $validator->errors()->add('current_password', 'The current password does not match.');
            }
        });
    }

    public function asController(ActionRequest $request)
    {
        $this->handle(
            $request->user(), 
            $request->get('password')
        );

        return redirect()->back();
    }
}
```

And that's it! Now, when we reach the `asController` method, we know for sure the validation was successful and we can access the validated data using `$request->validated()` like we're used to.

## Running as a command

Before wrapping up this tutorial, let's see how we could run our action as a command.

Similarly to what we did earlier, we simply need to implement the `asCommand` method to transform our command line arguments and options into a user object and a password. This methods accepts a `Command` as an argument which can be used to both read input and write output.

Additionally we need to provide the command signature and description via the `$commandSignature` and `$commandDescription` properties.

```php
class UpdateUserPassword
{
    use AsAction;

    public string $commandSignature = 'user:update-password {user_id} {password}';
    public string $commandDescription = 'Updates the password a user.';

    public function asCommand(Command $command)
    {
        $user = User::findOrFail($command->argument('user_id'));

        $this->handle($user, $command->argument('password'));

        $command->line(sprintf('Password updated for %s.', $user->name));
    }

    // ...
}
```

Now we can register it in our console `Kernel` like so:

```php
namespace App\Console;

class Kernel extends ConsoleKernel
{
    protected $commands = [
        UpdateUserPassword::class,
    ];
    
    // ...
}
```

## Next steps

Hopefully, this little tutorial helped to see what this package can achieve for you. On top of controllers and commands, Laravel Actions also supports jobs and listeners following the same conventions — by implementing the `asJob` and `asListener` methods.

Better yet, **your custom PHP class is never directly used as a controller, job, command or listener**. Instead it is wrapped in an appropriate decorator based on what it is running as. This means you have full control of your actions and you don't need to worry about cross-pattern conflicts (See "[How does it work?](./how-does-it-work)").

If you like learning by reading code, the "[Learn with examples](./examples/generate-reservation-code)" section is for you. Each example provide the code of one action, how it's being used or registered and a brief description explaining its purpose.

Be sure to also check the "[Guide](./one-class-one-task)" and "[References](./as-object)" sections to gain more knowledge on what you can do with actions and to refer back to methods made available to you.
