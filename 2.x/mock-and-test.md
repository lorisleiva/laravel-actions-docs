# Mock and test your actions

One of the advantages of using Laravel Actions is that it ensures your actions are resolved from the container — even when executing them as simple objects. This means, we can easily leverage this to swap their implementation with a mock or a spy to make testing easier.

## Mocking

To replace an action with a mock in your test, simply use the `mock` static method like so:

```php
FetchContactsFromGoogle::mock();
```

This will return a `MockInterface` and thus you can chain your mock expectations as you're used to.

```php
FetchContactsFromGoogle::mock()
    ->shouldReceive('handle')
    ->with(42)
    ->andReturn(['Loris', 'Will', 'Barney']);
```

Since you'll likely be mocking the `handle` method the most, you may also use the helper method `shouldRun` to make it easier to read. The code below is equivalent to the previous example.

```php
FetchContactsFromGoogle::shouldRun()
    ->with(42)
    ->andReturn(['Loris', 'Will', 'Barney']);
```

You may also use the helper method `shouldNotRun` to add the opposite expectation.

```php
FetchContactsFromGoogle::shouldNotRun();

// Equivalent to:
FetchContactsFromGoogle::mock()->shouldNotReceive('handle');
```

## Partial mocking

If you only want to mock the methods that have expectations, you may use the `partialMock` method instead. In the example below, only the `fetch` method will be mocked.

```php
FetchContactsFromGoogle::partialMock()
    ->shouldReceive('fetch')
    ->with('some_google_identifier')
    ->andReturn(['Loris', 'Will', 'Barney']);
```

## Spying

If you prefer running first and asserting after, you may use a spy instead of a mock by using the `spy` method.

```php
$spy = FetchContactsFromGoogle::spy();
$spy->allows('handle')->andReturn(['Loris', 'Will', 'Barney']);

// ...

$spy->shouldHaveReceived('handle')->with(42);
```

You may also use the helper method `allowToRun` to make it slightly more readable. The code below is equivalent to the previous example.

```php
FetchContactsFromGoogle::allowToRun()
    ->andReturn(['Loris', 'Will', 'Barney']);

// ...

FetchContactsFromGoogle::spy()
    ->shouldHaveReceived('handle')->with(42);
```

## Handling fake instances

When using `mock`, `partialMock` or `spy` on an action, it will generate a new `MockInterface` once and then keep on using the same fake instance.

This means, no matter how many times you call the `mock` method, it will always reference the same `MockInterface`, allowing to keep adding expectations in your tests.

Laravel Actions provides two additional methods to help your handle fake instances.

The first one is a simple `isFake` method telling you if the action is currently being mocked or not.

```php
FetchContactsFromGoogle::isFake(); // false
FetchContactsFromGoogle::mock();
FetchContactsFromGoogle::isFake(); // true
```

The second one, `clearFake`, allows you to dattach the `MockInterface` from the action so it can go back to its real implementation.

```php
FetchContactsFromGoogle::mock();
FetchContactsFromGoogle::isFake(); // true
FetchContactsFromGoogle::clearFake();
FetchContactsFromGoogle::isFake(); // false
```

And that's all there is to it. Congratulations, you've now finished the main part of this guide! 🎉

The next two pages are optional and slightly more advanced. The first one explains [how to use more granular traits](./granular-traits) than `AsAction` and the second one dig a bit deeper into [how Laravel Actions works under the hood](./how-does-it-work).
