<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class UserManagementController extends Controller
{
    public function index()
    {
        Gate::authorize('manage-roles');

        $users = User::with('roles')->get();
        $roles = Role::all();

        return Inertia::render('users/index', [
            'users' => $users,
            'roles' => $roles,
        ]);
    }

    public function store(Request $request)
    {
        Gate::authorize('manage-users');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'string', Password::defaults()],
            'role_ids' => 'required|array',
            'role_ids.*' => 'exists:roles,role_id',
        ]);

        // Prevent non-Super Admins from creating a Super Admin
        $superAdminRole = Role::where('role_name', 'Super Admin')->first();
        if ($superAdminRole && in_array($superAdminRole->role_id, $validated['role_ids'])) {
            if (! $request->user()->hasRole('Super Admin')) {
                abort(403, 'Only Super Admins can assign the Super Admin role.');
            }
        }

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $user->roles()->sync($validated['role_ids']);

        ActivityLogger::log('created', "Created user \"{$user->name}\" ({$user->email}).", $user);

        return redirect()->back()->with('success', 'User created successfully.');
    }

    public function updateRoles(Request $request, User $user)
    {
        Gate::authorize('manage-roles');

        if ($user->id === $request->user()->id) {
            abort(403, 'You cannot modify your own roles.');
        }

        $isCurrentUserSuperAdmin = $request->user()->hasRole('Super Admin');

        // 1. Only Super Admins can modify an existing Super Admin user
        if ($user->hasRole('Super Admin') && ! $isCurrentUserSuperAdmin) {
            abort(403, 'Only Super Admins can modify Super Admin users.');
        }

        $validated = $request->validate([
            'role_ids' => 'array',
            'role_ids.*' => 'exists:roles,role_id',
        ]);

        // 2. Only Super Admins can assign or remove the Super Admin role
        $superAdminRole = Role::where('role_name', 'Super Admin')->first();
        if ($superAdminRole) {
            $hasSuperAdminInRequest = in_array($superAdminRole->role_id, $validated['role_ids'] ?? []);
            $hadSuperAdminBefore = $user->hasRole('Super Admin');

            if (($hasSuperAdminInRequest !== $hadSuperAdminBefore) && ! $isCurrentUserSuperAdmin) {
                abort(403, 'Only Super Admins can assign or remove the Super Admin role.');
            }
        }

        $user->roles()->sync($validated['role_ids']);

        ActivityLogger::log(
            'roles_updated',
            "Updated roles for user \"{$user->name}\" ({$user->email}).",
            $user,
            ['role_ids' => $validated['role_ids']],
        );

        return redirect()->back()->with('success', 'User roles updated successfully.');
    }
}
