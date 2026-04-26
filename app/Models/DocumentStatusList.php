<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentStatusList extends Model
{
  use HasFactory;

  protected $table = 'documentStatusList';
  protected $primaryKey = 'statusId';
  public $timestamps = false;

  protected $fillable = [
    'statusName',
  ];

  public function documentStatuses()
  {
    return $this->hasMany(DocumentStatus::class, 'statusId', 'statusId');
  }
}
