<?php

namespace Database\Factories;

use App\Models\RolePermission;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<RolePermission>
 */
class RolePermissionFactory extends Factory
{
  /**
   * Define the model's default state.
   *
   * @return array<string, mixed>
   */
  public function definition(): array
  {
    return [
      'roleId' => Role::factory(),
      'permissionId' => Permission::factory(),
    ];
  }
}
