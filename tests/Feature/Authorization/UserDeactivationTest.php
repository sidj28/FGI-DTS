<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seedTestData();
});

test('active user can log in', function () {
    $user = User::factory()->create([
        'password' => bcrypt('password123'),
        'is_active' => true,
    ]);

    $response = $this->post(route('login'), [
        'email' => $user->email,
        'password' => 'password123',
    ]);

    $response->assertRedirect();
    $this->assertAuthenticatedAs($user);
});

test('inactive user cannot log in', function () {
    $user = User::factory()->create([
        'password' => bcrypt('password123'),
        'is_active' => false,
    ]);

    $response = $this->post(route('login'), [
        'email' => $user->email,
        'password' => 'password123',
    ]);

    $response->assertSessionHasErrors('email');
    $this->assertGuest();
});

test('inactive user with active session is logged out on next request', function () {
    $user = User::factory()->create([
        'is_active' => true,
    ]);

    $this->actingAs($user);
    $this->assertAuthenticatedAs($user);

    // Deactivate user in database
    $user->update(['is_active' => false]);
    $user->refresh();

    // Perform request and verify redirected to login
    $response = $this->get(route('dashboard'));

    $response->assertRedirect(route('login'));
    $this->assertGuest();
});

test('user cannot deactivate themselves', function () {
    $user = createUserWithPermission('manage_users', 'rbac');

    $response = $this->actingAs($user)->patch(route('users.status.toggle', $user), [
        'is_active' => false,
    ]);

    expect($response->status())->toBe(403);
    expect($user->fresh()->is_active)->toBeTrue();
});

test('non-Super Admin cannot deactivate a Super Admin user', function () {
    $nonSuperAdmin = createUserWithPermission('manage_users', 'rbac');
    $superAdminUser = createUserWithRole('Super Admin');

    $response = $this->actingAs($nonSuperAdmin)->patch(route('users.status.toggle', $superAdminUser), [
        'is_active' => false,
    ]);

    expect($response->status())->toBe(403);
    expect($superAdminUser->fresh()->is_active)->toBeTrue();
});

test('authorized manager can deactivate a regular user', function () {
    $manager = createUserWithPermission('manage_users', 'rbac');
    $targetUser = User::factory()->create(['is_active' => true]);

    $response = $this->actingAs($manager)->patch(route('users.status.toggle', $targetUser), [
        'is_active' => false,
    ]);

    $response->assertRedirect();
    expect($targetUser->fresh()->is_active)->toBeFalse();
});
