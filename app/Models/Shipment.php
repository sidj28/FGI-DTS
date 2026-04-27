<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shipment extends Model
{
  use HasFactory;

  protected $table = 'shipments';
  protected $primaryKey = 'shipment_id';
  public $timestamps = false;

  protected $fillable = [
    'year',
    'month',
    'shipment_reference',
    'brand',
    'incoterm',
    'actual_time_of_arrival',
    'broker',
    'brand_manager',
    'shipment_type',
    'status_id',
    'created_at',
    'updated_at',
    'archived_at',
  ];

  protected $casts = [
    'actual_time_of_arrival' => 'datetime',
    'created_at' => 'datetime',
    'updated_at' => 'datetime',
    'archived_at' => 'datetime',
  ];

  public function status()
  {
    return $this->belongsTo(ShipmentStatusList::class, 'status_id', 'status_id');
  }

  public function documents()
  {
    return $this->hasMany(ShipmentDocument::class, 'shipment_id', 'shipment_id');
  }
}
