<?php

namespace Database\Factories;

use App\Models\CustomDoc;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CustomDoc>
 */
class CustomDocFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'docName' => fake()->word(),
        ];
    }
}
