<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shipmentDocuments', function (Blueprint $table) {
            $table->increments('shipmentDocId');
            $table->unsignedInteger('shipmentId')->nullable();
            $table->unsignedInteger('customDocId')->nullable();
            $table->boolean('isRequired')->nullable();

            $table->foreign('shipmentId')->references('shipmentId')->on('shipments')->onDelete('cascade');
            $table->foreign('customDocId')->references('customDocId')->on('customDocs')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shipmentDocuments');
    }
};