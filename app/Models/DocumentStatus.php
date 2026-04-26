<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentStatus extends Model
{
    use HasFactory;

    protected $table = 'documentStatuses';
    protected $primaryKey = 'docStatusId';
    public $timestamps = false;

    protected $fillable = [
        'shipmentDocId',
        'statusId',
        'changedAt',
        'changedBy',
    ];

    protected $casts = [
        'changedAt' => 'datetime',
    ];

    public function shipmentDocument()
    {
        return $this->belongsTo(ShipmentDocument::class, 'shipmentDocId', 'shipmentDocId');
    }

    public function status()
    {
        return $this->belongsTo(DocumentStatusList::class, 'statusId', 'statusId');
    }

    public function changedByUser()
    {
        return $this->belongsTo(User::class, 'changedBy', 'id');
    }
}
