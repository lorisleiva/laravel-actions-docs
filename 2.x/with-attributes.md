---
sidebarDepth: 2
---

# With attributes

## Methods provided
*Lists all methods provided by the trait.*

### `setRawAttributes`
Replaces all attributes with the provided attributes.

```php
$action->setRawAttributes([
    'key' => 'value',
]);
```

### `fill`
Merges the provided attributes with the existing attributes.

```php
$action->fill([
    'key' => 'value',
]);
```

### `fillFromRequest`
Merges the request data and its route parameters with the existing attributes. If an attribute is present in both the request data and as a route parameter, the request data takes priority.

```php
$action->fillFromRequest($request);
```

### `all`
Retrieves all attributes.

```php
$action->all();
```

### `only`
Retrieves all attributes such that their key is included in the arguments.

```php
$action->only('title', 'body');
```

### `except`
Retrieves all attributes except those whose key is included in the arguments.

```php
$action->except('body');
```

### `has`
Returns `true` if and only if there is an existing attribute with the provided key.

```php
$action->has('title');
```

### `get`
Retrieves the value of an attribute by passing its key as the first argument. An optional second argument can be passed to provide a default value should the attribute not exist on the action.

```php
$action->get('title');
$action->get('title', 'Untitled');
```

### `set`
Set the value of an attribute by providing a key and its value.

```php
$action->set('title', 'My blog post');
```

### `__get`
Makes attributes accessible as properties by using the magic method `__get`.

```php
$action->title;
```

### `__set`
Allows attributes to be updated like properties by using the magic method `__set`.

```php
$action->title = 'My blog post';
```

### `__isset`
Allows attributes' existance to be checked like properties by using the magic method `__isset`.

```php
isset($action->title);
```

### `validateAttributes`
Triggers the authorization and validation process on the action using its attributes and returns the validated data. [See the guide for more information](./use-unified-attributes.html#validating-attributes).

```php
$validatedData = $action->validateAttributes();
```

## Methods used
*Lists all methods recognised and used by the `AttributeValidator`.*

The `WithAttributes` trait uses the same authorization and validation methods used by the `AsController` trait:

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
