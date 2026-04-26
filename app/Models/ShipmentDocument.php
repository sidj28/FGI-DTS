<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShipmentDocument extends Model
{
  use HasFactory;

  protected $table = 'shipmentDocuments';
  protected $primaryKey = 'shipmentDocId';
  public $timestamps = false;

  protected $fillable = [
    'shipmentId',
    'customDocId',
    'isRequired',
  ];

  protected $casts = [
    'isRequired' => 'boolean',
  ];

  public function shipment()
  {
    return $this->belongsTo(Shipment::class, 'shipmentId', 'shipmentId');
  }

  public function customDoc()
  {
    return $this->belongsTo(CustomDoc::class, 'customDocId', 'customDocId');
  }

  public function documentStatuses()
  {
    return $this->hasMany(DocumentStatus::class, 'shipmentDocId', 'shipmentDocId');
  }
}
