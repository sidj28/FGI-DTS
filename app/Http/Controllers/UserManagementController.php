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

        $validated = $request->validate([
            'role_ids' => 'array',
            'role_ids.*' => 'exists:roles,role_id',
        ]);

        $user->roles()->sync($validated['role_ids']);

        ActivityLogger::log(
            'roles_updated',
            "Updated roles for user \"{$user->name}\" ({$user->email}).",
            $user,
            ['role_ids' => $validated['role_ids']],
        );

        return redirect()->back()->with('success', 'User roles updated successfully.');
    }

    public function toggleStatus(Request $request, User $user)
    {
        Gate::authorize('manage-users');

        if ($user->id === $request->user()->id) {
            abort(403, 'You cannot deactivate your own account.');
        }

        $user->is_active = ! $user->is_active;
        $user->deactivated_at = $user->is_active ? null : now();
        $user->save();

        $action = $user->is_active ? 'reactivated' : 'deactivated';
        $statusText = $user->is_active ? 'reactivated' : 'deactivated';

        ActivityLogger::log(
            $action,
            "User \"{$user->name}\" ({$user->email}) was {$statusText}.",
            $user,
            ['is_active' => $user->is_active]
        );

        return redirect()->back()->with('success', "User {$statusText} successfully.");
    }
}
