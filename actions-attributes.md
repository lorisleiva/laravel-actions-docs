# Actions' attributes

In order to unify the various forms an action can take, the data of an action is implemented as a set of attributes (similarly to models).

This means when interacting with an instance of an `Action`, you can manipulate its attributes with the following methods:

```php
$action = new Action(['key' => 'value']);   // Initialise an action with the provided attribute.
$action->fill(['key' => 'value']);          // Merge the new attributes with the existing attributes.
$action->all();                             // Retrieve all attributes of an action as an array.
$action->only('title', 'body');             // Retrieve only the attributes provided.
$action->except('body');                    // Retrieve all attributes excepts the one provided.
$action->has('title');                      // Whether the action has the provided attribute.
$action->get('title');                      // Get an attribute.
$action->get('title', 'Untitled');          // Get an attribute with default value.
$action->set('title', 'My blog post');      // Set an attribute.
$action->title;                             // Get an attribute.
$action->title = 'My blog post';            // Set an attribute.
```

Depending on how an action is ran, its attributes are filled with the relevant information available. For example, as a controller, an action’s attributes will contain all of the input from the request. For more information see:

- [How do attributes get filled as objects?](/actions-as-objects#how-are-attributes-filled)
- [How do attributes get filled as jobs?](/actions-as-jobs#how-are-attributes-filled)
- [How do attributes get filled as listeners?](/actions-as-listeners#how-are-attributes-filled)
- [How do attributes get filled as controllers?](/actions-as-controllers#how-are-attributes-filled)
- [How do attributes get filled as commands?](/actions-as-commands#how-are-attributes-filled)
