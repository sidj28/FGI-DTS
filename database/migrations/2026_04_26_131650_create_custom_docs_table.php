<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('custom_docs', function (Blueprint $table) {
            $table->increments('custom_doc_id');
            $table->string('doc_name')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('custom_docs');
    }
};