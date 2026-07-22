<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Traits\HasOptimisticLocking;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

#[Fillable(['name', 'email', 'password', 'role_id', 'is_active'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    use HasOptimisticLocking;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'is_active' => 'boolean',
        ];
    }

    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id', 'role_id');
    }

    public function documentStatuses()
    {
        return $this->hasMany(DocumentStatus::class, 'changed_by', 'id');
    }

    /**
     * Check if user has a specific role.
     */
    public function hasRole($roleName): bool
    {
        // Eager load role if not already loaded
        if (! $this->relationLoaded('role')) {
            $this->load('role');
        }

        return $this->role?->role_name === $roleName;
    }

    /**
     * Check if user has a specific permission.
     */
    public function hasPermission(string $action, string $resource): bool
    {
        // Eager load role and permissions if not loaded
        if (! $this->relationLoaded('role')) {
            $this->load('role.permissions');
        }

        if ($this->role) {
            foreach ($this->role->permissions as $permission) {
                if ($permission->action === $action && $permission->resource === $resource) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Get all permission names for the user.
     */
    public function getPermissionNames(): array
    {
        if (! $this->relationLoaded('role')) {
            $this->load('role.permissions');
        }

        return $this->role
            ? $this->role->permissions->pluck('name')->unique()->values()->toArray()
            : [];
    }
}
