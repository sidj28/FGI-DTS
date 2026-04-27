<?php

namespace Database\Factories;

use App\Models\ShipmentStatusList;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ShipmentStatusList>
 */
class ShipmentStatusListFactory extends Factory
{
  /**
   * Define the model's default state.
   *
   * @return array<string, mixed>
   */
  public function definition(): array
  {
    return [
      'statusName' => fake()->randomElement(['Pending', 'In Transit', 'Delivered', 'Cancelled']),
    ];
  }
}
