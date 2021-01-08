# How does it work?

## Decorating your actions

Whenever you use or register your action as a framework pattern — e.g. a controller, listener, etc. — your action is never directly used as these patterns. Instead, **a new decorator is created that wraps and delegate to your action**.

![Decorators diagram](/how-decorators.png)

The primary reason for that is to ensure you have complete control over your PHP class. There is no need to extend the `Command` class; no need to implement your action around an API request or an event; no need to make your action a `Queueable` that has to be serializable; etc.

Instead, you just focus on writing your class the way you want without any forced dependencies.

Another important reason for decorating actions is to avoid conflict between patterns. If your action was directly used as a controller, job, listener and command, then these patterns would inevitably end up conflicting with one another. For example, you have middleware for both controllers and jobs but these are different types of middleware.

Another example is how the action itself is executed. Controllers are constructed once and reused for every request whereas for listeners are created on demand. With decorators, you don't need to worry about any of that. You just write your action and trust that it will resolved and executed every single time, no matter if its as a controller or as a listener.

## Identifying how an action is being executed

You now know that if an action is being executed as a controller, it will be wrapped in a `ControllerDecorator`, but how does Laravel Actions knows that it is being executed as a controller in the first place?

Laravel Actions does not extend nor override any core Laravel components to identify patterns. Instead it adds an interceptor inside the IoC container that analyses the `debug_backtrace` in order to identify how the action was dispatched.

To make sure the interceptor is only intercepting actions, Laravel Actions uses a combination of **before resolving callbacks** and **extenders**.

**Before resolving callbacks** were introduced in Laravel 8.15 and allow adding callbacks right before an `abstract` is being resolved from the container. If an `abstract` is using a trait from Laravel Actions — such as `AsController` — then we add one extender for that action. This extender is added at most once per action.

**Extenders** are callback that allow you to transform what is being resolved from the container. The extender added by Laravel Actions uses `debug_backtrace` to identify how the action was dispatched. If no pattern was identified, it simply returns the action itself — meaning we're using it as an object. Laravel Actions also uses that extender to identify if the action is being mocked and returns the fake instance if it is.

Note that it identifies patterns based on the traits used by the action. E.g. if an action does not use the `AsController` trait — included by default in `AsAction` — then the extender will not try to identify it as a controller.

The image below provides a simplified diagram on how the extender affects the container resolution.

![Container resolution diagram](/how-resolution.png)
