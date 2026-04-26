<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rolePermissions', function (Blueprint $table) {
            $table->unsignedInteger('roleId');
            $table->unsignedInteger('permissionId');

            $table->primary(['roleId', 'permissionId']);

            $table->foreign('roleId')->references('roleId')->on('roles')->onDelete('cascade');
            $table->foreign('permissionId')->references('permissionId')->on('permissions')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rolePermissions');
    }
};