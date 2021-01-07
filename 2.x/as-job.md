# As job

## Method provided
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

```phpSendTeamReportEmail::dispatchAfterResponse($team);
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

## Method used
*Lists all methods and properties recognised and used by the `JobDecorator`.*

### `asJob`
TODO

```php
TODO
```

### `getJobMiddleware`
TODO

```php
TODO
```

### `configureJob`
TODO

```php
TODO
```

### `$jobQueue`
TODO

```php
TODO
```

### `$jobConnection`
TODO

```php
TODO
```

### `getJobDisplayName`
TODO

```php
TODO
```

### `getJobTags`
TODO

```php
TODO
```

### `getJobUniqueId`
TODO

```php
TODO
```

### `$jobUniqueId`
TODO

```php
TODO
```

### `getJobUniqueFor`
TODO

```php
TODO
```

### `$jobUniqueFor`
TODO

```php
TODO
```

### `getJobUniqueVia`
TODO

```php
TODO
```
