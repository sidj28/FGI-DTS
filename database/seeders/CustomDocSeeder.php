<?php

namespace Database\Seeders;

use App\Models\CustomDoc;
use Illuminate\Database\Seeder;

class CustomDocSeeder extends Seeder
{
  /**
   * Run the database seeds.
   */
  public function run(): void
  {
    $docs = [
      ['doc_name' => 'SH'],
      ['doc_name' => 'SSDT'],
      ['doc_name' => 'FAN'],
      ['doc_name' => 'TAN'],
      ['doc_name' => 'SAD'],
      ['doc_name' => 'BL'],
      ['doc_name' => 'FE'],
      ['doc_name' => 'IV'],
      ['doc_name' => 'PL'],
      ['doc_name' => 'CI'],
      ['doc_name' => 'DH'],
    ];

    foreach ($docs as $doc) {
      CustomDoc::create($doc);
    }
  }
}
