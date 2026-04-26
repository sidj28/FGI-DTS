<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shipments', function (Blueprint $table) {
            $table->increments('shipmentId');
            $table->integer('year')->nullable();
            $table->integer('month')->nullable();
            $table->string('shipmentReference')->nullable();
            $table->string('brand')->nullable();
            $table->string('incoterm')->nullable();
            $table->timestamp('actualTimeOfArrival')->nullable();
            $table->string('broker')->nullable();
            $table->string('brandManager')->nullable();
            $table->string('shipmentType')->nullable();
            $table->unsignedInteger('statusId')->nullable();
            $table->timestamp('createdAt')->nullable();
            $table->timestamp('updatedAt')->nullable();
            $table->timestamp('archivedAt')->nullable();

            $table->foreign('statusId')->references('statusId')->on('shipmentStatusList')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shipments');
    }
};