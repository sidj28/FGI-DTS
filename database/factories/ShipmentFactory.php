<?php

namespace Database\Factories;

use App\Models\Shipment;
use App\Models\ShipmentStatusList;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Shipment>
 */
class ShipmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'year' => fake()->year(),
            'month' => fake()->monthNumberString(),
            'shipmentReference' => fake()->unique()->bothify('SHIP-????-####'),
            'brand' => fake()->word(),
            'incoterm' => fake()->randomElement(['FOB', 'CIF', 'CFR', 'DDP']),
            'actualTimeOfArrival' => fake()->dateTime(),
            'broker' => fake()->name(),
            'brandManager' => fake()->name(),
            'shipmentType' => fake()->randomElement(['Air', 'Sea', 'Land']),
            'statusId' => ShipmentStatusList::factory(),
            'createdAt' => now(),
            'updatedAt' => now(),
            'archivedAt' => null,
        ];
    }
}
