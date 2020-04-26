# Actions within actions

With Laravel Actions you can easily call actions within actions.

As you can see in the following example, you can use another action as an object in order to access its result.

```php
class CreateNewRestaurant extends Action
{
    public function handle()
    {
        $coordinates = FetchGoogleMapsCoordinates::run([
            'address' => $this->address,
        ]);

        return Restaurant::create([
            'name' => $this->name,
            'longitude' => $coordinates->longitude,
            'latitude' => $coordinates->latitude,
        ]);
    }
}
```

However, sometimes, you might want to delegate completely to another action. That means the action we delegate to should have the same attributes and run as the same type as the parent action. You can achieve this using the `delegateTo` method.

For example, let’s say you have three actions `UpdateProfilePicture`, `UpdatePassword` and `UpdateProfileDetails` that you want to use in a single endpoint.

```php
class UpdateProfile extends Action
{
    public function handle()
    {
        if ($this->has('avatar')) {
            return $this->delegateTo(UpdateProfilePicture::class);
        }

        if ($this->has('password')) {
            return $this->delegateTo(UpdatePassword::class);
        }

        return $this->delegateTo(UpdateProfileDetails::class);
    }
}
```

In the above example, if we are running the `UpdateProfile` action as a controller, then the sub actions will also be running as controllers.

::: tip
It is worth noting that the `delegateTo` method is implemented using the `createFrom` and `runAs` methods.

```php
// These two lines are equivalent.
$this->delegateTo(UpdatePassword::class);
UpdatePassword::createFrom($this)->runAs($this);
```
:::
