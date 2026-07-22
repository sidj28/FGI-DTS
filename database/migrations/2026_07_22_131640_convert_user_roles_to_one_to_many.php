<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('role_id')->nullable()->constrained('roles', 'role_id')->nullOnDelete();
        });

        // Migrate existing roles to users table
        if (Schema::hasTable('user_roles')) {
            $userRoles = DB::table('user_roles')->get();
            foreach ($userRoles as $userRole) {
                DB::table('users')
                    ->where('id', $userRole->user_id)
                    ->update(['role_id' => $userRole->role_id]);
            }

            Schema::dropIfExists('user_roles');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('user_roles', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('role_id');
            $table->primary(['user_id', 'role_id']);
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('role_id')->references('role_id')->on('roles')->onDelete('cascade');
        });

        $users = DB::table('users')->whereNotNull('role_id')->get();
        foreach ($users as $user) {
            DB::table('user_roles')->insert([
                'user_id' => $user->id,
                'role_id' => $user->role_id,
            ]);
        }

        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['role_id']);
            $table->dropColumn('role_id');
        });
    }
};
