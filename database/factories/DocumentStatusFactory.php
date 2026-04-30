<?php

namespace Database\Factories;

use App\Models\DocumentStatus;
use App\Models\ShipmentDocument;
use App\Models\DocumentStatusList;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DocumentStatus>
 */
class DocumentStatusFactory extends Factory
{
  /**
   * Define the model's default state.
   *
   * @return array<string, mixed>
   */
  public function definition(): array
  {
    return [
      'shipmentDocId' => ShipmentDocument::factory(),
      'statusId' => DocumentStatusList::factory(),
      'changedAt' => now(),
      'changedBy' => User::factory(),
    ];
  }
}
