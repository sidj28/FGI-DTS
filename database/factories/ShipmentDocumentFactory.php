<?php

namespace Database\Factories;

use App\Models\ShipmentDocument;
use App\Models\Shipment;
use App\Models\CustomDoc;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ShipmentDocument>
 */
class ShipmentDocumentFactory extends Factory
{
  /**
   * Define the model's default state.
   *
   * @return array<string, mixed>
   */
  public function definition(): array
  {
    return [
      'shipmentId' => Shipment::factory(),
      'customDocId' => CustomDoc::factory(),
      'isRequired' => fake()->boolean(),
    ];
  }
}
