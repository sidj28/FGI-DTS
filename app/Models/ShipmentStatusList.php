<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShipmentStatusList extends Model
{
    use HasFactory;

    protected $table = 'shipmentStatusList';
    protected $primaryKey = 'statusId';
    public $timestamps = false;

    protected $fillable = [
        'statusName',
    ];

    public function shipments()
    {
        return $this->hasMany(Shipment::class, 'statusId', 'statusId');
    }
}
