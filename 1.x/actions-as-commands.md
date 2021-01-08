# Actions as commands

## How are attributes filled?

By default, all of the command's arguments and options will be used as attributes.

This means the attributes will also include any options defined by Laravel such as `verbose` or `help`.

You can provide more thorough mapping of your command input by overriding the `getAttributesFromCommand` method.

```php
class PublishANewArticle extends Action
{
    protected static $commandSignature = 'make:article
                                          {title : The title of the article}
                                          {--published : Whether the article should be immediately published}
                                          {--tags=* : Tags for the newly created article}';

    public function getAttributesFromCommand(Command $command): array
    {
        return [
            'title' => $command->argument('title'),
            'published_at' => $command->option('published') ? now() : null,
            'tags' => $command->option('tags'),
        ];
    }

    // ...
}
```

## Registering commands

By default, any action that defines the `$commandSignature` static property will be registered as a command.

::: warning
This will work out-of-the-box for actions defined in the `app/Actions` folder (or subfolders). If some of your actions live outside this folder, you will need to call `Actions::paths([...])` in a service provider to let the library know where to find your actions in order to register these routes.

See the "[Registering actions](./registering-actions.html)" page for more details. 

Alternatively, when not automatically registered, you can manually register an action by calling the `registerCommand` static method in your `routes/console.php` file.

```php
PublishANewArticle::registerCommand();
```
:::

## Prompting additional data

In some cases, when an action is running as a command, you might want to gather some attributes interactively. For example, prompt the user some additional data or ask them to confirm an action before continuing. You may do all of this within the `asCommand` method. This method will run before executing the action to allow you to define additional attributes. See example below.

```php

class PublishANewArticle extends Action
{
    protected static $commandSignature = 'make:article';

    public function asCommand(Command $command)
    {
        $this->title = $command->ask('What is the title?');
        $this->published_at = $command->confirm('Publish immediately?') ? now() : null;

        if (! $command->confirm('Are you sure?')) {
            throw new Exception('Operation cancelled');
        }
    }

    // ...
}
```

::: tip
It is worth noting that, just like the `handle` method, the `asCommand` method [support dependency injections](./dependency-injections.html).
:::

::: tip
Also note that there exists a `as...` method for every way an action can run as.
Namely, `asObject`, `asJob`, `asListener`, `asController` and `asCommand`.

See "[The before hooks](./action-running-as.html#the-before-hooks)" for more details.
:::

## Console output and exit code

By default, the returned value of the `handle` method will be dumped in the console and a successful exit code (i.e. `0`) will be returned.

You may customise what you want to display to the console after executing the action by overriding the `consoleOutput` method. The returned value of the `handle` method is given as the first argument. The command object is available as the second argument.

```php
public function consoleOutput($article, Command $command)
{
    $command->line("Success! You've published the article \"{$article->title}\".");
}
```

Any value returned by the `consoleOutput` method will be used as an exit code.

```php
public function consoleOutput($article, Command $command)
{
    return 42;
}
```
