<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RolePermission extends Model
{
  use HasFactory;

  protected $table = 'rolePermissions';
  public $timestamps = false;
  protected $primaryKey = null;
  public $incrementing = false;

  protected $fillable = [
    'roleId',
    'permissionId',
  ];

  public function role()
  {
    return $this->belongsTo(Role::class, 'roleId', 'roleId');
  }

  public function permission()
  {
    return $this->belongsTo(Permission::class, 'permissionId', 'permissionId');
  }
}
