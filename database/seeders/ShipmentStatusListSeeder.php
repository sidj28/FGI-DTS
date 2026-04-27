<?php

namespace Database\Seeders;

use App\Models\ShipmentStatusList;
use Illuminate\Database\Seeder;

class ShipmentStatusListSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $statuses = [
            ['status_name' => 'Completed'],
            ['status_name' => 'Pending'],
            ['status_name' => 'Rejected'],
        ];

        foreach ($statuses as $status) {
            ShipmentStatusList::create($status);
        }
    }
}
