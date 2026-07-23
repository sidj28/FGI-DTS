<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use App\Models\Role;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class RoleManagementController extends Controller
{
    public function index()
    {
        Gate::authorize('manage-roles');

        $roles = Role::with('permissions')->get();
        $permissions = Permission::all();

        return Inertia::render('roles/index', [
            'roles' => $roles,
            'permissions' => $permissions,
        ]);
    }

    public function updatePermissions(Request $request, Role $role)
    {
        Gate::authorize('manage-roles');

        if ($request->user()->role_id === $role->role_id) {
            abort(403, 'You cannot modify the permissions of a role you possess.');
        }

        // Prevent non-Super Admins from editing the Super Admin role permissions
        if ($role->role_name === 'Super Admin' && ! $request->user()->hasRole('Super Admin')) {
            abort(403, 'Only Super Admins can modify permissions of the Super Admin role.');
        }

        $validated = $request->validate([
            'permission_ids' => 'array',
            'permission_ids.*' => 'exists:permissions,permission_id',
        ]);

        // capture previous permission names for a readable audit trail
        $oldPermissionNames = $role->permissions()->pluck('name')->toArray();

        $role->permissions()->sync($validated['permission_ids'] ?? []);

        // resolve new permission names
        $newPermissionNames = Permission::whereIn('permission_id', $validated['permission_ids'] ?? [])->pluck('name')->toArray();

        $addedPermissions = array_values(array_diff($newPermissionNames, $oldPermissionNames));
        $removedPermissions = array_values(array_diff($oldPermissionNames, $newPermissionNames));

        ActivityLogger::log(
            'permissions_updated',
            "Updated permissions for role \"{$role->role_name}\".",
            $role,
            [
                'permission_ids' => $validated['permission_ids'] ?? [],
                'old_permission_names' => $oldPermissionNames,
                'new_permission_names' => $newPermissionNames,
                'added_permissions' => $addedPermissions,
                'removed_permissions' => $removedPermissions,
                'added' => implode(', ', $addedPermissions),
                'removed' => implode(', ', $removedPermissions),
                'from' => implode(', ', $oldPermissionNames),
                'to' => implode(', ', $newPermissionNames),
            ],
        );

        return redirect()->back()->with('success', 'Role permissions updated successfully.');
    }
}
