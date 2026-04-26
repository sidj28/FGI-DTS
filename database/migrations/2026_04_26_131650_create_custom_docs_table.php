<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customDocs', function (Blueprint $table) {
            $table->increments('customDocId');
            $table->string('docName')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customDocs');
    }
};