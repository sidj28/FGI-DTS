<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shipments', function (Blueprint $table) {
            $table->increments('shipment_id');
            $table->integer('year')->nullable();
            $table->integer('month')->nullable();
            $table->string('shipment_reference')->nullable();
            $table->string('brand')->nullable();
            $table->string('incoterm')->nullable();
            $table->timestamp('actual_time_of_arrival')->nullable();
            $table->string('broker')->nullable();
            $table->string('brand_manager')->nullable();
            $table->string('shipment_type')->nullable();
            $table->unsignedInteger('status_id')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->timestamp('archived_at')->nullable();

            $table->foreign('status_id')->references('status_id')->on('shipment_status_list')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shipments');
    }
};
