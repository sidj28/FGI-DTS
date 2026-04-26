<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomDoc extends Model
{
  use HasFactory;

  protected $table = 'customDocs';
  protected $primaryKey = 'customDocId';
  public $timestamps = false;

  protected $fillable = [
    'docName',
  ];

  public function shipmentDocuments()
  {
    return $this->hasMany(ShipmentDocument::class, 'customDocId', 'customDocId');
  }
}
