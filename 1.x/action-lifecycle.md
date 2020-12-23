# The lifecycle of an action

![The lifecycle of an action](/lifecycle.png)

## Explanations

### `registered`

The static `registered` method is triggered once the Action has been [automatically registered](./registering-actions.html). Thus, this method will run at most once per class.

### `initialized`

This method will be called every time a new action object of this class is constructed.

### `getAttributesFrom...`

Overridable methods that maps data from various resources into attributes.
- `getAttributesFromEvent` (for listeners)
- `getAttributesFromRequest` (for controllers)
- `getAttributesFromCommand` (for commands)

Note that objects and jobs do not need such methods since their attributes are manually given when created/dispatched.

### `prepareForValidation`

Can be used to provide additional logic before going through the authorisation and validation steps.

### `as...`

Similar to the `prepareForValidation` method but different methods will be triggered based on how the actions is running as.
- `asObject`
- `asJob`
- `asListener`
- `asController`
- `asCommand`

### `authorize` and `failedAuthorization`

Can be used to provide authorisation logic. See the "[Authorisation](./authorisation.html)" page.

### `rules`, `failedValidation` and other validation methods

Can be used to provide validation logic. See the "[Validation](./validation.html)" page.

### `handle`

The main method that defines the logic of your action to be executed. This is the only required method.

### `response` (controllers only)

Can be used to map the result of the action into a HTTP response. See "[Returning HTTP responses](./actions-as-controllers.html#returning-http-responses)".

### `consoleOutput` (commands only)

Can be used to customise what to display to the console after executing the action. See "[Console output and exit code](./actions-as-commands.html#console-output-and-exit-code)".
