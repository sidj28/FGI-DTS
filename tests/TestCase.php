<?php

namespace Tests;

use Database\Seeders\DocumentStatusListSeeder;
use Database\Seeders\RolesAndPermissionsSeeder;
use Database\Seeders\ShipmentStatusListSeeder;
use Database\Seeders\ShipmentTypeSeeder;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Laravel\Fortify\Features;

abstract class TestCase extends BaseTestCase
{
    /**
     * Seed roles, permissions, and status lists for testing.
     */
    protected function seedTestData(): void
    {
        $this->seed([
            ShipmentStatusListSeeder::class,
            DocumentStatusListSeeder::class,
            ShipmentTypeSeeder::class,
            RolesAndPermissionsSeeder::class,
        ]);
    }

    protected function skipUnlessFortifyHas(string $feature, ?string $message = null): void
    {
        if (! Features::enabled($feature)) {
            $this->markTestSkipped($message ?? "Fortify feature [{$feature}] is not enabled.");
        }
    }
}
