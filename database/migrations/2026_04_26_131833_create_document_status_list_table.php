<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('documentStatuses', function (Blueprint $table) {
            $table->increments('docStatusId');
            $table->unsignedInteger('shipmentDocId')->nullable();
            $table->unsignedInteger('statusId')->nullable();
            $table->timestamp('changedAt')->nullable();
            $table->unsignedBigInteger('changedBy')->nullable();

            $table->foreign('shipmentDocId')->references('shipmentDocId')->on('shipmentDocuments')->onDelete('cascade');
            $table->foreign('statusId')->references('statusId')->on('documentStatusList')->onDelete('set null');
            $table->foreign('changedBy')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documentStatuses');
    }
};