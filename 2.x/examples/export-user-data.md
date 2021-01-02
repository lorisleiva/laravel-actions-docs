# Export user data

## Definition

Extracts all user data into a JSON file and send it to the user via email.

```php
class ExportUserData
{
    use AsAction;

    public function handle(User $user): void
    {
        // Extract and store user data as a JSON file.
        $content = json_encode($this->getAllUserData($user));
        $path = sprintf('user_exports/%s.json', $user->id);
        Storage::disk('s3')->replace($path, $content);

        // Send JSON file temporaty URL via email.
        Mail::to($user)->send(new UserDataExportReady($user, $path));
    }

    protected function getAllUserData(User $user): array
    {
        return [
            'profile' => $user->toArray(),
            'articles' => $user->articles->toArray(),
        ]
    }
}
```

## Using as an object

```php
ExportUserData::run($user);
```

## Using as an asynchronous job

You can use the `dispatch` static method instead of `run` to dispatch the actions as an asynchronous job.

Note that here we did not implement the `asJob` method since it would have been exactly the same as the `handle` method. In general, when no `asX` method is defined, the `handle` method is being used directly instead.

```php
ExportUserData::dispatch($user)->onQueue('my_queue');
```

If you prefer defining the queue — or any other job settings — directly in the action, you can do this using the `configureJob` method.

```php
use Lorisleiva\Actions\Decorators\JobDecorator;

class ExportUserData
{
    use AsAction;

    public function configureJob(JobDecorator $job): void
    {
        $job->onConnection('my_connection')
            ->onQueue('my_queue')
            ->through(['my_middleware'])
            ->chain(['my_chain'])
            ->delay(60);
    }

    // ...
}
```

## Using as a synchronous job

You can use the `dispatchNow` method to dispatch the action as a synchronous job.

Note that this is equivalent to using the action as an object using the `run` method.

```php
ExportUserData::dispatchNow($user);
```
