<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
  use HasFactory;

  protected $table = 'permissions';
  protected $primaryKey = 'permissionId';

  protected $fillable = [
    'name',
    'resource',
    'action',
  ];

  public function roles()
  {
    return $this->belongsToMany(Role::class, 'rolePermissions', 'permissionId', 'roleId');
  }
}
