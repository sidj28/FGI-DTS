<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Define initial users
        $users = [
            [
                'name' => 'Super Admin',
                'email' => 'superadmin@example.com',
                'password' => Hash::make('password'),
                'role' => 'Super Admin',
            ],
            [
                'name' => 'Supply Chain Admin',
                'email' => 'supply@example.com',
                'password' => Hash::make('password'),
                'role' => 'Supply chain manager',
            ],
            [
                'name' => 'Logis Associate',
                'email' => 'logis@example.com',
                'password' => Hash::make('password'),
                'role' => 'Logis Assoc',
            ],
            [
                'name' => 'Brand Manager',
                'email' => 'brand@example.com',
                'password' => Hash::make('password'),
                'role' => 'Brand manager',
            ],
        ];

        foreach ($users as $userData) {
            $roleName = $userData['role'];
            unset($userData['role']);

            $role = Role::where('role_name', $roleName)->first();
            if ($role) {
                $userData['role_id'] = $role->role_id;
            }

            User::firstOrCreate(['email' => $userData['email']], $userData);
        }
    }
}
