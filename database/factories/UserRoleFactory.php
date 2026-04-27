<?php

namespace Database\Factories;

use App\Models\UserRole;
use App\Models\User;
use App\Models\Role;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<UserRole>
 */
class UserRoleFactory extends Factory
{
  /**
   * Define the model's default state.
   *
   * @return array<string, mixed>
   */
  public function definition(): array
  {
    return [
      'userId' => User::factory(),
      'roleId' => Role::factory(),
    ];
  }
}
