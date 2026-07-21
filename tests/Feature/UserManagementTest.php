<?php

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\actingAs;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Ensure permissions and roles exist
    $this->manageUsersPermission = Permission::firstOrCreate(
        ['name' => 'manage_users'],
        ['resource' => 'rbac', 'action' => 'manage_users']
    );

    $this->scmRole = Role::firstOrCreate(['role_name' => 'Supply chain manager']);
    $this->scmRole->permissions()->syncWithoutDetaching([$this->manageUsersPermission->permission_id]);

    $this->otherRole = Role::firstOrCreate(['role_name' => 'Logis Assoc']);
});

it('allows supply chain manager to create a user', function () {
    $admin = User::factory()->create();
    $admin->roles()->attach($this->scmRole);

    actingAs($admin)
        ->post(route('users.store'), [
            'name' => 'New User',
            'email' => 'newuser@example.com',
            'password' => 'Password123!',
            'role_ids' => [$this->otherRole->role_id],
        ])
        ->assertRedirect()
        ->assertSessionHas('success');

    $this->assertDatabaseHas('users', [
        'email' => 'newuser@example.com',
        'name' => 'New User',
    ]);

    $newUser = User::where('email', 'newuser@example.com')->first();
    expect($newUser->roles)->toHaveCount(1);
    expect($newUser->roles->first()->role_name)->toBe('Logis Assoc');
});

it('denies other roles from creating a user', function () {
    $nonAdmin = User::factory()->create();
    $nonAdmin->roles()->attach($this->otherRole);

    actingAs($nonAdmin)
        ->post(route('users.store'), [
            'name' => 'Should Fail',
            'email' => 'fail@example.com',
            'password' => 'Password123!',
            'role_ids' => [$this->otherRole->role_id],
        ])
        ->assertForbidden();

    $this->assertDatabaseMissing('users', [
        'email' => 'fail@example.com',
    ]);
});

it('validates user creation input', function () {
    $admin = User::factory()->create();
    $admin->roles()->attach($this->scmRole);

    actingAs($admin)
        ->post(route('users.store'), [
            'name' => '',
            'email' => 'invalid-email',
            'password' => 'short',
            'role_ids' => [],
        ])
        ->assertSessionHasErrors(['name', 'email', 'password', 'role_ids']);
});

it('prevents a user from updating their own roles', function () {
    $manageRolesPerm = Permission::firstOrCreate(
        ['name' => 'manage-roles'],
        ['resource' => 'rbac', 'action' => 'manage_roles']
    );
    $adminRole = Role::firstOrCreate(['role_name' => 'Super Admin']);
    $adminRole->permissions()->syncWithoutDetaching([$manageRolesPerm->permission_id]);

    $admin = User::factory()->create();
    $admin->roles()->attach($adminRole);

    actingAs($admin)
        ->put(route('users.roles.update', $admin), [
            'role_ids' => [$this->otherRole->role_id],
        ])
        ->assertForbidden();

    expect($admin->fresh()->roles->pluck('role_name')->toArray())->toContain('Super Admin');
});

it('allows updating roles of other users', function () {
    $manageRolesPerm = Permission::firstOrCreate(
        ['name' => 'manage-roles'],
        ['resource' => 'rbac', 'action' => 'manage_roles']
    );
    $adminRole = Role::firstOrCreate(['role_name' => 'Super Admin']);
    $adminRole->permissions()->syncWithoutDetaching([$manageRolesPerm->permission_id]);

    $admin = User::factory()->create();
    $admin->roles()->attach($adminRole);

    $targetUser = User::factory()->create();

    actingAs($admin)
        ->put(route('users.roles.update', $targetUser), [
            'role_ids' => [$this->otherRole->role_id],
        ])
        ->assertRedirect()
        ->assertSessionHas('success');

    expect($targetUser->fresh()->roles->pluck('role_name')->toArray())->toContain('Logis Assoc');
});

it('allows managing users to deactivate a user', function () {
    $admin = User::factory()->create();
    $admin->roles()->attach($this->scmRole);

    $targetUser = User::factory()->create(['is_active' => true]);

    actingAs($admin)
        ->patch(route('users.status.toggle', $targetUser))
        ->assertRedirect()
        ->assertSessionHas('success');

    expect($targetUser->fresh()->is_active)->toBeFalse();
    expect($targetUser->fresh()->deactivated_at)->not->toBeNull();

    $this->assertDatabaseHas('activity_logs', [
        'user_id' => $admin->id,
        'action' => 'deactivated',
        'subject_id' => $targetUser->id,
    ]);
});

it('allows managing users to reactivate a user', function () {
    $admin = User::factory()->create();
    $admin->roles()->attach($this->scmRole);

    $targetUser = User::factory()->create(['is_active' => false, 'deactivated_at' => now()]);

    actingAs($admin)
        ->patch(route('users.status.toggle', $targetUser))
        ->assertRedirect()
        ->assertSessionHas('success');

    expect($targetUser->fresh()->is_active)->toBeTrue();
    expect($targetUser->fresh()->deactivated_at)->toBeNull();

    $this->assertDatabaseHas('activity_logs', [
        'user_id' => $admin->id,
        'action' => 'reactivated',
        'subject_id' => $targetUser->id,
    ]);
});

it('prevents a user from deactivating their own account', function () {
    $admin = User::factory()->create(['is_active' => true]);
    $admin->roles()->attach($this->scmRole);

    actingAs($admin)
        ->patch(route('users.status.toggle', $admin))
        ->assertForbidden();

    expect($admin->fresh()->is_active)->toBeTrue();
});

it('prevents unauthorized users from toggling user status', function () {
    $nonAdmin = User::factory()->create();
    $nonAdmin->roles()->attach($this->otherRole);

    $targetUser = User::factory()->create(['is_active' => true]);

    actingAs($nonAdmin)
        ->patch(route('users.status.toggle', $targetUser))
        ->assertForbidden();

    expect($targetUser->fresh()->is_active)->toBeTrue();
});
