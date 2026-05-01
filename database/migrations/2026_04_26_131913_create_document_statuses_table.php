<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('document_statuses', function (Blueprint $table) {
            $table->id('doc_status_id');
            $table->unsignedBigInteger('shipment_doc_id')->nullable();
            $table->unsignedBigInteger('status_id')->nullable();
            $table->boolean('is_current')->default(true);
            $table->timestamp('changed_at')->nullable();
            $table->unsignedBigInteger('changed_by')->nullable();

            $table->foreign('shipment_doc_id')->references('shipment_doc_id')->on('shipment_documents')->onDelete('cascade');
            $table->foreign('status_id')->references('status_id')->on('document_status_list')->onDelete('set null');
            $table->foreign('changed_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_statuses');
    }
};
