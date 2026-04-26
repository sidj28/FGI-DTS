<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shipmentStatusList', function (Blueprint $table) {
            $table->increments('statusId');
            $table->string('statusName')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shipmentStatusList');
    }
};