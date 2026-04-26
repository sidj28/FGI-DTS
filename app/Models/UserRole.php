<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserRole extends Model
{
  use HasFactory;

  protected $table = 'userRoles';
  public $timestamps = false;
  protected $primaryKey = null;
  public $incrementing = false;

  protected $fillable = [
    'userId',
    'roleId',
  ];

  public function user()
  {
    return $this->belongsTo(User::class, 'userId', 'id');
  }

  public function role()
  {
    return $this->belongsTo(Role::class, 'roleId', 'roleId');
  }
}
