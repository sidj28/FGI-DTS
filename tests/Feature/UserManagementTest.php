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
    $admin->role()->associate($this->scmRole)->save();

    actingAs($admin)
        ->post(route('users.store'), [
            'name' => 'New User',
            'email' => 'newuser@example.com',
            'password' => 'Password123!',
            'role_id' => $this->otherRole->role_id,
        ])
        ->assertRedirect()
        ->assertSessionHas('success');

    $this->assertDatabaseHas('users', [
        'email' => 'newuser@example.com',
        'name' => 'New User',
    ]);

    $newUser = User::where('email', 'newuser@example.com')->first();
    expect($newUser->role_id)->toBe($this->otherRole->role_id);
    expect($newUser->role->role_name)->toBe('Logis Assoc');
});

it('denies other roles from creating a user', function () {
    $nonAdmin = User::factory()->create();
    $nonAdmin->role()->associate($this->otherRole)->save();

    actingAs($nonAdmin)
        ->post(route('users.store'), [
            'name' => 'Should Fail',
            'email' => 'fail@example.com',
            'password' => 'Password123!',
            'role_id' => $this->otherRole->role_id,
        ])
        ->assertForbidden();

    $this->assertDatabaseMissing('users', [
        'email' => 'fail@example.com',
    ]);
});

it('validates user creation input', function () {
    $admin = User::factory()->create();
    $admin->role()->associate($this->scmRole)->save();

    actingAs($admin)
        ->post(route('users.store'), [
            'name' => '',
            'email' => 'invalid-email',
            'password' => 'short',
            'role_id' => '',
        ])
        ->assertSessionHasErrors(['name', 'email', 'password', 'role_id']);
});
