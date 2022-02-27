---
sidebarDepth: 2
---

# As object

## Methods provided
*Lists all methods provided by the trait.*

### `make`
Resolves the action from the container.

```php
MyAction::make();

// Equivalent to:
app(MyAction::class);
```

### `run`
Resolves and executes the action.

```php
MyAction::run($someArguments);

// Equivalent to:
MyAction::make()->handle($someArguments);
```

### `runIf`
Resolves and executes the action if the condition is met.

```php
MyAction::runIf(true, $someArguments);
```

### `runUnless`
Resolves and executes the action if some condition is not met.

```php
MyAction::runUnless(false, $someArguments);
```
