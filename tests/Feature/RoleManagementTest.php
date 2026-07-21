<?php

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\actingAs;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->manageRolesPerm = Permission::firstOrCreate(
        ['name' => 'manage-roles'],
        ['resource' => 'rbac', 'action' => 'manage_roles']
    );

    $this->superAdminRole = Role::firstOrCreate(['role_name' => 'Super Admin']);
    $this->superAdminRole->permissions()->syncWithoutDetaching([$this->manageRolesPerm->permission_id]);

    $this->otherRole = Role::firstOrCreate(['role_name' => 'Logis Assoc']);
});

it('prevents modifying permissions for the Super Admin role', function () {
    $admin = User::factory()->create();
    $admin->roles()->attach($this->superAdminRole);

    actingAs($admin)
        ->put(route('roles.permissions.update', $this->superAdminRole), [
            'permission_ids' => [],
        ])
        ->assertForbidden();
});

it('prevents user from modifying permissions of their own assigned role', function () {
    $customRole = Role::create(['role_name' => 'Custom Role']);
    $customRole->permissions()->syncWithoutDetaching([$this->manageRolesPerm->permission_id]);

    $user = User::factory()->create();
    $user->roles()->attach($customRole);

    actingAs($user)
        ->put(route('roles.permissions.update', $customRole), [
            'permission_ids' => [],
        ])
        ->assertForbidden();
});

it('allows modifying permissions of other unassigned non-super-admin roles', function () {
    $admin = User::factory()->create();
    $admin->roles()->attach($this->superAdminRole);

    actingAs($admin)
        ->put(route('roles.permissions.update', $this->otherRole), [
            'permission_ids' => [$this->manageRolesPerm->permission_id],
        ])
        ->assertRedirect()
        ->assertSessionHas('success');

    expect($this->otherRole->fresh()->permissions->pluck('permission_id')->toArray())
        ->toContain($this->manageRolesPerm->permission_id);
});
