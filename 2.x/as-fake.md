---
sidebarDepth: 2
---

# As fake

## Methods provided
*Lists all methods provided by the trait.*

### `mock`
Swaps the action with a mock.

```php
FetchContactsFromGoogle::mock()
    ->shouldReceive('handle')
    ->with(42)
    ->andReturn(['Loris', 'Will', 'Barney']);
```

### `partialMock`
Swaps the action with a partial mock. In the example below, only the `fetch` method is mocked.

```php
FetchContactsFromGoogle::partialMock()
    ->shouldReceive('fetch')
    ->with('some_google_identifier')
    ->andReturn(['Loris', 'Will', 'Barney']);
```

### `spy`
Swaps the action with a spy.

```php
$spy = FetchContactsFromGoogle::spy()
    ->allows('handle')
    ->andReturn(['Loris', 'Will', 'Barney']);

// ...

$spy->shouldHaveReceived('handle')->with(42);
```

### `shouldRun`
Helper method adding an expectation on the `handle` method.

```php
FetchContactsFromGoogle::shouldRun();

// Equivalent to:
FetchContactsFromGoogle::mock()->shouldReceive('handle');
```

### `shouldNotRun`
Helper method adding an expectation on the `handle` method.

```php
FetchContactsFromGoogle::shouldNotRun();

// Equivalent to:
FetchContactsFromGoogle::mock()->shouldNotReceive('handle');
```

### `allowToRun`
Helper method allowing the `handle` method on a spy.

```php
$spy = FetchContactsFromGoogle::allowToRun()
    ->andReturn(['Loris', 'Will', 'Barney']);

// ...

$spy->shouldHaveReceived('handle')->with(42);
```

### `isFake`
Whether the action has been swapped for a fake instance.

```php
FetchContactsFromGoogle::isFake(); // false
FetchContactsFromGoogle::mock();
FetchContactsFromGoogle::isFake(); // true
```

### `clearFake`
Clear the action's fake instance if any.

```php
FetchContactsFromGoogle::mock();
FetchContactsFromGoogle::isFake(); // true
FetchContactsFromGoogle::clearFake();
FetchContactsFromGoogle::isFake(); // false
```
