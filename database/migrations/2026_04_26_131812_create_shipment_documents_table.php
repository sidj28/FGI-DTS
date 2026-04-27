<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shipment_documents', function (Blueprint $table) {
            $table->increments('shipment_doc_id');
            $table->unsignedInteger('shipment_id')->nullable();
            $table->unsignedInteger('custom_doc_id')->nullable();
            $table->boolean('is_required')->nullable();

            $table->foreign('shipment_id')->references('shipment_id')->on('shipments')->onDelete('cascade');
            $table->foreign('custom_doc_id')->references('custom_doc_id')->on('custom_docs')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shipment_documents');
    }
};