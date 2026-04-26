<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shipment extends Model
{
  use HasFactory;

  protected $table = 'shipments';
  protected $primaryKey = 'shipmentId';
  public $timestamps = false;

  protected $fillable = [
    'year',
    'month',
    'shipmentReference',
    'brand',
    'incoterm',
    'actualTimeOfArrival',
    'broker',
    'brandManager',
    'shipmentType',
    'statusId',
    'createdAt',
    'updatedAt',
    'archivedAt',
  ];

  protected $casts = [
    'actualTimeOfArrival' => 'datetime',
    'createdAt' => 'datetime',
    'updatedAt' => 'datetime',
    'archivedAt' => 'datetime',
  ];

  public function status()
  {
    return $this->belongsTo(ShipmentStatusList::class, 'statusId', 'statusId');
  }

  public function documents()
  {
    return $this->hasMany(ShipmentDocument::class, 'shipmentId', 'shipmentId');
  }
}
