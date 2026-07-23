<?php

use App\Models\ActivityLog;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\actingAs;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->manageRolesPermission = Permission::firstOrCreate(
        ['name' => 'manage_roles'],
        ['resource' => 'rbac', 'action' => 'manage_roles']
    );

    $this->adminRole = Role::firstOrCreate(['role_name' => 'Admin Role']);
    $this->adminRole->permissions()->syncWithoutDetaching([$this->manageRolesPermission->permission_id]);

    $this->adminUser = User::factory()->create();
    $this->adminUser->roles()->attach($this->adminRole);
});

test('role permission update logs added and removed permissions accurately', function () {
    $p1 = Permission::firstOrCreate(['name' => 'view_shipments'], ['resource' => 'shipments', 'action' => 'view']);
    $p2 = Permission::firstOrCreate(['name' => 'add_shipments'], ['resource' => 'shipments', 'action' => 'add']);
    $p3 = Permission::firstOrCreate(['name' => 'edit_shipments'], ['resource' => 'shipments', 'action' => 'edit']);

    $testRole = Role::create(['role_name' => 'Test Target Role']);
    $testRole->permissions()->sync([$p1->permission_id, $p2->permission_id]);

    $response = actingAs($this->adminUser)->put(route('roles.permissions.update', $testRole->role_id), [
        'permission_ids' => [$p2->permission_id, $p3->permission_id],
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success');

    $log = ActivityLog::where('action', 'permissions_updated')
        ->where('subject_id', $testRole->role_id)
        ->latest()
        ->first();

    expect($log)->not->toBeNull();
    expect($log->properties)->toHaveKey('added_permissions');
    expect($log->properties)->toHaveKey('removed_permissions');
    expect($log->properties['added_permissions'])->toContain('edit_shipments');
    expect($log->properties['removed_permissions'])->toContain('view_shipments');
    expect($log->properties['added'])->toBe('edit_shipments');
    expect($log->properties['removed'])->toBe('view_shipments');
});
