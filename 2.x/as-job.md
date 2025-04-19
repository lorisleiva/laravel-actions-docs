---
sidebarDepth: 2
---

# As job

## Methods provided
*Lists all methods provided by the trait.*

### `dispatch`
Dispatches a job asynchronously.

```php
SendTeamReportEmail::dispatch($team);
```

### `dispatchIf`
Dispatches a job asynchronously if the condition is met.

```php
SendTeamReportEmail::dispatchIf($team->plan === 'premium', $team);
```

### `dispatchUnless`
Dispatches a job asynchronously unless the condition is met.

```php
SendTeamReportEmail::dispatchUnless($team->plan === 'free', $team);
```

### `dispatchSync`
Dispatches a job synchronously.

```php
SendTeamReportEmail::dispatchSync($team);
```

### `dispatchNow`
Dispatches a job synchronously. (Alias of `dispatchSync`).

```php
SendTeamReportEmail::dispatchNow($team);
```

### `dispatchAfterResponse`
Dispatches a job synchronously but only after the response was sent to the user.

```php
SendTeamReportEmail::dispatchAfterResponse($team);
```

### `makeJob`
Creates a new `JobDecorator` that wraps the action. This can be used to dispatch a job using `dispatch` helper method or when creating a chain of jobs from actions (See `withChain`).

```php
dispatch(SendTeamReportEmail::makeJob($team));
```

### `makeUniqueJob`
Creates a new `UniqueJobDecorator` that wraps the action. By default, `makeJob` will automatically return a `UniqueJobDecorator` if your action implements the `ShouldBeUnique` trait. However, you may use this method directly to force a `UniqueJobDecorator` to be created.

```php
dispatch(SendTeamReportEmail::makeUniqueJob($team));
```

### `withChain`
Attaches a list of jobs to be executed after the job was processed.

```php
$chain = [
    OptimizeTeamReport::makeJob($team),
    SendTeamReportEmail::makeJob($team),
];

CreateNewTeamReport::withChain($chain)->dispatch($team);
```

Note that you can achieve the same result by using the chain method on the Bus Facade.

```php
use Illuminate\Support\Facades\Bus;

Bus::chain([
    CreateNewTeamReport::makeJob($team),
    OptimizeTeamReport::makeJob($team),
    SendTeamReportEmail::makeJob($team),
])->dispatch();
```

### `assertPushed`
Asserts the action was dispatched.

```php
// Requires the Queue Facade to be fake.
Queue::fake();

// Assert the job was dispatched.
SendTeamReportEmail::assertPushed();

// Assert the job was dispatched 3 times.
SendTeamReportEmail::assertPushed(3);

// Assert a job that satisfies the given callback was dispatched.
SendTeamReportEmail::assertPushed($callback);

// Assert a job that satisfies the given callback was dispatched 3 times.
SendTeamReportEmail::assertPushed(3, $callback);
```

The callback will receive the following four arguments:

1. The action itself. Here it would be an instance of SendTeamReportEmail.
2. The job's arguments. That is, the arguments you provided when calling SendTeamReportEmail::dispatch(...).
3. The JobDecorator that decorates your action.
4. The name of the queue that was used.

### `assertNotPushed`
Asserts the action was not dispatched. See `assertPushed` for the callback arguments.

```php
// Requires the Queue Facade to be fake.
Queue::fake();

// Assert the job was not dispatched.
SendTeamReportEmail::assertNotPushed();

// Assert a job that satisfies the given callback was not dispatched.
SendTeamReportEmail::assertNotPushed($callback);
```

### `assertPushedOn`
Asserts the action was dispatched on a given queue. See `assertPushed` for the callback arguments.

```php
// Requires the Queue Facade to be fake.
Queue::fake();

// Assert the job was dispatched on the 'reports' queue.
SendTeamReportEmail::assertPushedOn('reports');

// Assert the job was dispatched on the 'reports' queue 3 times.
SendTeamReportEmail::assertPushedOn('reports', 3);

// Assert a job that satisfies the given callback was dispatched on the 'reports' queue.
SendTeamReportEmail::assertPushedOn('reports', $callback);

// Assert a job that satisfies the given callback was dispatched on the 'reports' queue 3 times.
SendTeamReportEmail::assertPushedOn('reports', 3, $callback);
```

## Methods used
*Lists all methods and properties recognised and used by the `JobDecorator`.*

### `asJob`
Called when dispatched as a job. Uses the `handle` method directly when no `asJob` method exists.

```php
class SendTeamReportEmail
{
    use AsAction;

    public function handle(Team $team, bool $fullReport = false): void
    {
        // Prepare report and send it to all $team->users.
    }

    public function asJob(Team $team): void
    {
        $this->handle($team, true);
    }
}
```

### `getJobMiddleware`
Adds job middleware directly in the action. The parameters are passed in but note that they are in an array.

```php
public function getJobMiddleware(array $parameters): array
{
    return [new RateLimited('reports')];
}
```

### `configureJob`
Defines the `JobDecorators`'s option directly in the action.

```php
use Lorisleiva\Actions\Decorators\JobDecorator;

public function configureJob(JobDecorator $job): void
{
    $job->onConnection('my_connection')
        ->onQueue('my_queue')
        ->through(['my_middleware'])
        ->chain(['my_chain'])
        ->delay(60);
}
```

### `$jobConnection`
Defines the connection of the `JobDecorator`. Can also be set using `configureJob`.

```php
public string $jobConnection = 'my_connection';
```

### `$jobQueue`
Defines the queue of the `JobDecorator`. Can also be set using `configureJob`.

```php
public string $jobQueue = 'my_queue';
```

### `$jobTries`
Defines the number of times the job may be attempted.

```php
public int $jobTries = 10;
```

### `$jobMaxExceptions`
Defines the maximum number of exceptions to allow before failing.

```php
public int $jobMaxExceptions = 3;
```

### `$jobBackoff`
Defines the number of seconds to wait before retrying the job. Can also be set the `getJobBackoff` method.

```php
public int $jobBackoff = 60;
```

### `getJobBackoff`
Defines the number of seconds to wait before retrying the job.

```php
public function getJobBackoff(): int
{
    return 60;
}
```

You may also provide an array to provide different backoffs for each retries.

```php
public function getJobBackoff(): array
{
    return [30, 60, 120];
}
```

### `$jobTimeout`
Defines the number of seconds the job can run before timing out.

```php
public int $jobTimeout = 60 * 30;
```

### `$jobRetryUntil`
Defines the timestamp at which the job should timeout. Can also be set the `getJobRetryUntil` method.

```php
public int $jobRetryUntil = 1610191764;
```

### `getJobRetryUntil`
Defines the time at which the job should timeout.

```php
public function getJobRetryUntil(): DateTime
{
    return now()->addMinutes(30);
}
```

### `getJobDisplayName`
Customises the display name of the `JobDecorator`. It provides the same arguments as the `asJob` method.

```php
public function getJobDisplayName(): string
{
    return 'Send team report email';
}
```

### `getJobTags`
Adds some tags to the `JobDecorator`. It provides the same arguments as the `asJob` method.

```php
public function getJobTags(Team $team): array
{
    return ['report', 'team:'.$team->id];
}
```

### `getJobUniqueId`
Defines the unique key when using the `ShouldBeUnique` interface. It provides the same arguments as the `asJob` method.

```php
public function getJobUniqueId(Team $team)
{
    return $team->id;
}
```

### `$jobUniqueId`
Same as `getJobUniqueId` but as a property.

```php
public string $jobUniqueId = 'some_static_key';
```

### `getJobUniqueFor`
Define the amount of time in which a job should stay unique when using the `ShouldBeUnique` interface. It provides the same arguments as the `asJob` method.

```php
public function getJobUniqueFor(Team $team)
{
    return $this->team->role === 'premium' ? 1800 : 3600;
}
```

### `$jobUniqueFor`
Same as `getJobUniqueFor` but as a property.

```php
public int $jobUniqueFor = 3600;
```

### `getJobUniqueVia`
Defines the cache driver to use to obtain the lock and therefore maintain the unicity of the jobs being dispatched. Defaults to: the default cache driver.

```php
public function getJobUniqueVia()
{
    return Cache::driver('redis');
}
```

### `$jobDeleteWhenMissingModels`
Same as `getJobDeleteWhenMissingModels` but as a property.

```php
public bool $jobDeleteWhenMissingModels = true;
```

### `getJobDeleteWhenMissingModels`
Defines whether to automatically delete jobs with missing models.

```php
public function getJobDeleteWhenMissingModels(): bool
{
    return true;
}
```

### `jobFailed`
Handle the job failure, if an exception is thrown it is passed in as the first arguent, the parameters the job was called with are spread into the rest of the arguments.

```php
public function jobFailed(?Throwable $e, ...$parameters): void
{
    // Send user notification of failure, etc... 
}
```
