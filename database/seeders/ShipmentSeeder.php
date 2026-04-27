<?php

namespace Database\Seeders;

use App\Models\Shipment;
use App\Models\ShipmentStatusList;
use Illuminate\Database\Seeder;

class ShipmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $completedStatus = ShipmentStatusList::where('status_name', 'Completed')->first();
        $pendingStatus = ShipmentStatusList::where('status_name', 'Pending')->first();
        $rejectedStatus = ShipmentStatusList::where('status_name', 'Rejected')->first();

        $shipments = [
            [
                'year' => 2025,
                'month' => 4,
                'shipment_reference' => '2025-SKDEVAN-488',
                'brand' => 'Brumate',
                'incoterm' => 'EXW',
                'actual_time_of_arrival' => '2003-09-25',
                'broker' => 'Grab Philippines',
                'brand_manager' => 'Matthew Andre Corral',
                'shipment_type' => 'Sea',
                'status_id' => $completedStatus->status_id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'year' => 2025,
                'month' => 4,
                'shipment_reference' => '2025-SKDEVAN-488',
                'brand' => 'Fendi Casa',
                'incoterm' => 'FCA',
                'actual_time_of_arrival' => '2003-12-20',
                'broker' => 'Lalancove',
                'brand_manager' => 'Shannen Salvatera',
                'shipment_type' => 'Sea',
                'status_id' => $completedStatus->status_id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'year' => 2025,
                'month' => 4,
                'shipment_reference' => '2025-SKDEVAN-488',
                'brand' => 'Hunter Douglas',
                'incoterm' => 'FCA',
                'actual_time_of_arrival' => '2003-05-27',
                'broker' => 'Angkas',
                'brand_manager' => 'Terrenz Cubacub',
                'shipment_type' => 'Sea',
                'status_id' => $completedStatus->status_id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'year' => 2025,
                'month' => 4,
                'shipment_reference' => '2025-SKDEVAN-488',
                'brand' => 'TechnoGym',
                'incoterm' => 'EXW',
                'actual_time_of_arrival' => '2002-05-23',
                'broker' => 'Movelt',
                'brand_manager' => 'Gavin Lorenzo Castro',
                'shipment_type' => 'Air',
                'status_id' => $pendingStatus->status_id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'year' => 2025,
                'month' => 4,
                'shipment_reference' => '2025-SKDEVAN-488',
                'brand' => 'Philips Personal Care',
                'incoterm' => 'FOB',
                'actual_time_of_arrival' => '2003-12-22',
                'broker' => 'Joyride',
                'brand_manager' => 'Jaslein Zynah Dueñas',
                'shipment_type' => 'Sea',
                'status_id' => $pendingStatus->status_id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'year' => 2025,
                'month' => 4,
                'shipment_reference' => '2025-SKDEVAN-488',
                'brand' => 'Villeroy & Boch',
                'incoterm' => 'FCA',
                'actual_time_of_arrival' => '2004-04-28',
                'broker' => 'Grab Philippines',
                'brand_manager' => 'Christian Jerard Abella',
                'shipment_type' => 'Sea',
                'status_id' => $completedStatus->status_id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'year' => 2025,
                'month' => 4,
                'shipment_reference' => '2025-SKDEVAN-488',
                'brand' => 'B&B Italia',
                'incoterm' => 'FOB',
                'actual_time_of_arrival' => '2004-04-04',
                'broker' => 'Joyride',
                'brand_manager' => 'Angela Luisse Briones',
                'shipment_type' => 'Sea',
                'status_id' => $completedStatus->status_id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'year' => 2025,
                'month' => 4,
                'shipment_reference' => '2025-SKDEVAN-488',
                'brand' => 'DMC',
                'incoterm' => 'EXW',
                'actual_time_of_arrival' => '2004-04-17',
                'broker' => 'LBC',
                'brand_manager' => 'Reich Alexandria Balubal',
                'shipment_type' => 'Land',
                'status_id' => $completedStatus->status_id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'year' => 2025,
                'month' => 4,
                'shipment_reference' => '2025-SKDEVAN-488',
                'brand' => 'Boffi',
                'incoterm' => 'EXW',
                'actual_time_of_arrival' => '2003-12-29',
                'broker' => 'Movelt',
                'brand_manager' => 'Anvil Dumaual',
                'shipment_type' => 'Sea',
                'status_id' => $completedStatus->status_id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'year' => 2025,
                'month' => 4,
                'shipment_reference' => '2025-SKDEVAN-488',
                'brand' => 'Philips Personal Care',
                'incoterm' => 'EXW',
                'actual_time_of_arrival' => '2004-05-11',
                'broker' => 'Grab Philippines',
                'brand_manager' => 'XXXXXXXX',
                'shipment_type' => 'Sea',
                'status_id' => $rejectedStatus->status_id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($shipments as $shipment) {
            Shipment::create($shipment);
        }
    }
}
