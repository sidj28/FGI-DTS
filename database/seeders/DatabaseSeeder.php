<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();

        $this->call([
            ShipmentStatusListSeeder::class,
            DocumentStatusListSeeder::class,
            CustomDocSeeder::class,
            ShipmentTypeSeeder::class,
            BrokerSeeder::class,
            ShipmentSeeder::class,
            ShipmentDocumentSeeder::class, // add this
            DocumentStatusSeeder::class,
            RolesAndPermissionsSeeder::class,
            UserSeeder::class,
        ]);

        Schema::enableForeignKeyConstraints();

    }
}
