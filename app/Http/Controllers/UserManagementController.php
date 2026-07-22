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

        $users = User::with('role')->get();
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
            'role_id' => 'required|exists:roles,role_id',
        ]);

        // Prevent non-Super Admins from creating a Super Admin
        $superAdminRole = Role::where('role_name', 'Super Admin')->first();
        if ($superAdminRole && $superAdminRole->role_id === (int) $validated['role_id']) {
            if (! $request->user()->hasRole('Super Admin')) {
                abort(403, 'Only Super Admins can assign the Super Admin role.');
            }
        }

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role_id' => $validated['role_id'],
        ]);

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
            'role_id' => 'required|exists:roles,role_id',
        ]);

        // 2. Only Super Admins can assign or remove the Super Admin role
        $superAdminRole = Role::where('role_name', 'Super Admin')->first();
        if ($superAdminRole) {
            $hasSuperAdminInRequest = $superAdminRole->role_id === (int) $validated['role_id'];
            $hadSuperAdminBefore = $user->hasRole('Super Admin');

            if (($hasSuperAdminInRequest !== $hadSuperAdminBefore) && ! $isCurrentUserSuperAdmin) {
                abort(403, 'Only Super Admins can assign or remove the Super Admin role.');
            }
        }

        $user->update(['role_id' => $validated['role_id']]);

        ActivityLogger::log(
            'roles_updated',
            "Updated roles for user \"{$user->name}\" ({$user->email}).",
            $user,
            ['role_id' => $validated['role_id']],
        );

        return redirect()->back()->with('success', 'User roles updated successfully.');
    }

    public function toggleStatus(Request $request, User $user)
    {
        Gate::authorize('manage-users');

        if ($user->id === $request->user()->id) {
            abort(403, 'You cannot deactivate your own account.');
        }

        if ($user->hasRole('Super Admin') && ! $request->user()->hasRole('Super Admin')) {
            abort(403, 'Only Super Admins can modify Super Admin accounts.');
        }

        $validated = $request->validate([
            'is_active' => 'required|boolean',
        ]);

        $user->update(['is_active' => $validated['is_active']]);

        $statusStr = $user->is_active ? 'activated' : 'deactivated';
        ActivityLogger::log(
            'status_updated',
            "User \"{$user->name}\" ({$user->email}) was {$statusStr}.",
            $user,
            ['is_active' => $user->is_active],
        );

        return redirect()->back()->with('success', "User account {$statusStr} successfully.");
    }
}
