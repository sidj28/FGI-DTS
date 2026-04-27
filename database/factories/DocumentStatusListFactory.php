<?php

namespace Database\Factories;

use App\Models\DocumentStatusList;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DocumentStatusList>
 */
class DocumentStatusListFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'statusName' => fake()->randomElement(['Pending', 'Approved', 'Rejected', 'Expired']),
        ];
    }
}
