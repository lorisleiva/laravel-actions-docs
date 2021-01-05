# Dispatch asynchronous jobs

## From job to action

When it comes to dispatching your actions as jobs, implementing the `handle` method should typically be enough. The reason for that is you'll likely want to use the same arguments when running an action as an object (`MyAction::run`) and when dispatching it as a job (`MyAction::dispatch`).

For example, say you have an action that sends a report email to every member of a team.

```php
class SendTeamReportEmail
{
    use AsAction;

    public function handle(Team $team): void
    {
        // Prepare report and send it to all $team->users.
    }
}
```

Using this `handle` method, you'll be dispatch it as a job by running `SendTeamReportEmail::dispatch($someTeam)`.

However, if the logic around dispatching a job differs from the `handle` method, then you may implement the `asJob` method.

For example, we might want to send a full report only when dispatched as a job.

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

## Dispatching jobs

### Asynchronously

Dispatching jobs asynchronously can be done using the `dipatch` method.

```php
SendTeamReportEmail::dispatch($team);
```

Behind the scene, this will create a new `JobDecorator` and wrap your action inside it.

This means you cannot dispatch a job using the `dispatch` helper method.

```php
// This will NOT work. ❌
dispatch(SendTeamReportEmail::make());
```

If you must use the `dispatch` helper method, then you'll need to use `makeJob` instead and pass it the action's arguments.

```php
// This will work. ✅
dispatch(SendTeamReportEmail::makeJob($team));
```

You may also use the `dispatchIf` and `dispatchUnless` method to dispatch a job under a certain condition.

```php
SendTeamReportEmail::dispatchIf($team->hasAddon('reports'), $team);

SendTeamReportEmail::dispatchUnless($team->missesAddon('reports'), $team);
```

### Synchronously

Although you can use `SendTeamReportEmail::run($team)` to execute an action immediately, you may also dispatch a synchronous job using the `dispatchNow` or `dispatchSync` methods.

```php
SendTeamReportEmail::dispatchNow($team);

SendTeamReportEmail::dispatchSync($team);
```

### After the response was sent

You may delay the execution of an action after the response was sent to the user by using the `dispatchAfterResponse` method.

```php
SendTeamReportEmail::dispatchAfterResponse($team);
```

### With chain

Finally, you main chain multiple jobs together by using the `withChain` method. Make sure to use the `makeJob` method to instantiate the chained jobs — otherwise your action will not be wrapped in a `JobDecorator`.

```php
$chain = [
    OptimizeTeamReport::makeJob($team),
    SendTeamReportEmail::makeJob($team),
];

CreateNewTeamReport::withChain($chain)->dispatch($team);
```

Note that you can achieve the same result by using the `chain` method on the `Bus` Facade.

```php
use Illuminate\Support\Facades\Bus;

Bus::chain([
    CreateNewTeamReport::makeJob($team),
    OptimizeTeamReport::makeJob($team),
    SendTeamReportEmail::makeJob($team),
])->dispatch();
```

## Configuring jobs

When dispatching a job, you'll receive a `PendingDispatch` allowing you to chain any job configuration you need.

```php
SendTeamReportEmail::dispatch($team)
    ->onConnection('my_connection')
    ->onQueue('my_queue')
    ->through(['my_middleware'])
    ->chain(['my_chain'])
    ->delay(60);
}
```

If you want to configure these options in the action itself so they are used by default whenever you dispatch it, you may use the `configureJob` method. It will provide the `JobDecorator` as a first argument which you can use to chain the same job configurations as above.

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

Alternatively, if you only want to set the connection and/or queue for your action, you may use the `jobConnection` and/or `jobQueue` properties respectively.

```php
class SendTeamReportEmail
{
    use AsAction;

    public string $jobConnection = 'my_connection';
    public string $jobQueue = 'my_queue';

    // ...
}
```

## Registering job middleware

You may also attach job middleware to your actions by returning them from the `getJobMiddleware` method.

```php
public function getJobMiddleware(): array
{
    return [new RateLimited('backups')];
}
```

## Unique jobs

The Laravel framework provides a `ShouldBeUnique` trait that you can use on a job to ensure it runs only once for a given identifier and for a given amount of time. With a traditional job, it looks like this.

```php
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Contracts\Queue\ShouldBeUnique;

class SendTeamReportEmail implements ShouldQueue, ShouldBeUnique
{
    public Team $team;
    public int $uniqueFor = 3600;

    public function uniqueId()
    {
        return $this->team->id;
    }

    // ...
}
```

With Laravel Actions, you can still achieve this by adding the `ShouldBeUnique` trait to your action.

- To define the unique identifier you may use the `$jobUniqueId` property or the `getJobUniqueId` method.
- To define the amount of time in which a job should stay unique, you may use the `$jobUniqueFor` property or the `getJobUniqueFor` method.

When you use either of these methods, their arguments will be the same as the job's arguments themselves.

For instance, the example above can be rewriten as an action like so:

```php
use Illuminate\Contracts\Queue\ShouldBeUnique;

class SendTeamReportEmail implements ShouldBeUnique
{
    use AsAction;

    public int $jobUniqueFor = 3600;

    public function getJobUniqueId(Team $team)
    {
        return $this->team->id;
    }

    // ...
}
```

By default, the default cache driver will be used to obtain the lock and therefore maintain the unicity of the jobs being dispatched. You may specify which cache driver to use for a particular action by implementing the `getJobUniqueVia` method.

```php
public function getJobUniqueVia()
{
    return Cache::driver('redis');
}
```

Finally, note that Laravel now has a baked-in `WithoutOverlapping` job middleware that can limit the concurrent processing of a job. If that's all you're trying to achieve, then it might be worth considering using this middleware instead of the `ShouldBeUnique` trait.

## Job tags and display name

If you're using Horizon, you might be interested in providing custom tags for a job to monitor it and even change its display name.

You may do this in an action by implementing the `getJobTags` and `getJobDisplayName` methods respectively.

```php
class SendTeamReportEmail
{
    use AsAction;

    public function getJobTags(Team $team): array
    {
        return ['report', 'team:'.$team->id];
    }

    public function getJobDisplayName(): string
    {
        return 'Send team report email';
    }

    // ...
}
```

Note that you can get the job's arguments from both these methods' arguments.

## Asserting jobs were pushed

TODO
Mention job assertions in tests

```php
public function handle(): void
{
    // ...
}
```
