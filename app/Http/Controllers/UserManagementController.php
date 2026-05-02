<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class UserManagementController extends Controller
{
    public function index()
    {
        Gate::authorize('manage-rbac');

        $users = User::with('roles')->get();
        $roles = Role::all();

        return Inertia::render('users/index', [
            'users' => $users,
            'roles' => $roles,
        ]);
    }

    public function updateRoles(Request $request, User $user)
    {
        Gate::authorize('manage-rbac');

        $validated = $request->validate([
            'role_ids' => 'array',
            'role_ids.*' => 'exists:roles,role_id',
        ]);

        $user->roles()->sync($validated['role_ids']);

        return redirect()->back()->with('success', 'User roles updated successfully.');
    }
}
