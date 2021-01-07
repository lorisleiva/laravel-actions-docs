# How does it work?

## Decorating your actions

Whenever you use or register your action as a framework pattern — e.g. a controller, listener, etc. — your action is never directly used as these patterns. Instead, **a new decorator is created that wraps and delegate to your action**.

![Decorators diagram](/how-decorators.png)

The primary reason for that is to ensure you have complete control over your PHP class. There is no need to extends the `Command` class; no need to implement your action around an API request or an event; no need to make your action a `Queueable` that has to be serializable; etc.

Instead, you just focus on writing your class the way you want without any forced dependencies.

Another important reason for decorating actions is to avoid conflict between patterns. If your action was directly used as a controller, job, listener and command, then these patterns would inevitably end up conflicting with one another. For example, you have middleware for controllers and jobs but these are different types of middleware.

Another example is how the action itself is executed. Controllers are constructed once and reused for every request whereas for listeners are created on demand. With decorators, you don't need to worry about any of that. You just write your action and trust that it will resolved and executed every single time, no matter if its as a controller or as a listener.

## Identifying how an action is being executed

TODO:
debug_backtrace
Container: beforeResolving callback
Contrainer: extend
