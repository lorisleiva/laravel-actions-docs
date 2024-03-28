# Generate reservation code

## Definition

This action generates a unique reservation code using a non-ambiguous alphabet.

```php
class GenerateReservationCode
{
    use AsAction;

    const UNAMBIGUOUS_ALPHABET = 'BCDFGHJLMNPRSTVWXYZ2456789';

    public function handle(int $characters = 7): string
    {
        do {
            $code = $this->generateCode($characters);
        } while(Reservation::where('code', $code)->exists());

        return $code;
    }

    protected function generateCode(int $characters): string
    {
        return substr(str_shuffle(str_repeat(static::UNAMBIGUOUS_ALPHABET, $characters)), 0, $characters);
    }
}
```

## Using as an object

In a real-life application this action would typically be nested inside another action that create a new reservations.

```php{10}
class CreateNewReservation
{
    use AsAction;

    public function handle(User $user, Concert $concert, int $tickets = 1): Reservation
    {
        return $user->reservations()->create([
            'concert_id' => $concert->id,
            'price' => $concert->getTicketPrice() * $tickets,
            'code' => GenerateReservationCode::run(),
        ]);
    }
}
```

## Using as a fake instance

The advantage of using `::make()` or `::run()` is that it will resolve the action from the container. That means we can then easily swap its implementation for a mock when testing.

```php{9}
/** @test */
public function it_generates_a_unique_code_when_creating_a_new_reservation()
{
    // Given an existing user and concert.
    $user = User::factory()->create();
    $concert = Concert::factory()->create();

    // And given we mock the code generator.
    GenerateReservationCode::shouldRun()->andReturn('ABCD234');

    // When we create a new reservation for that user and that concert.
    $reservation = CreateNewReservation::run($user, $concert);

    // Then we saved the expected reservation code.
    $this->assertSame('ABCD234', $reservation->code);
}
```
