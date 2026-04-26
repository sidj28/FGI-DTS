<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    protected $table = 'roles';
    protected $primaryKey = 'roleId';
    public $timestamps = false;

    protected $fillable = [
        'roleName',
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'userRoles', 'roleId', 'userId');
    }

    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'rolePermissions', 'roleId', 'permissionId');
    }
}
