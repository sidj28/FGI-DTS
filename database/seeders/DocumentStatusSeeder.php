<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DocumentStatusSeeder extends Seeder
{
    public function run(): void
    {
        $shipmentDocs = DB::table('shipment_documents')->get();
        $statusIds = DB::table('document_status_list')->pluck('status_id')->toArray();

        $rows = [];
        foreach ($shipmentDocs as $doc) {
            $rows[] = [
                'shipment_doc_id' => $doc->shipment_doc_id,
                'status_id' => $statusIds[array_rand($statusIds)],
                'is_current' => true,
                'changed_at' => now(),
                'changed_by' => null,
            ];
        }

        DB::table('document_statuses')->insert($rows);
    }
}