<?php

namespace App\Models;

use App\Traits\HasOptimisticLocking;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomDoc extends Model
{
    use HasFactory;
    use HasOptimisticLocking;

    protected $table = 'custom_docs';

    protected $primaryKey = 'custom_doc_id';

    public $timestamps = false;

    protected $fillable = [
        'doc_name',
    ];

    public function shipmentDocuments()
    {
        return $this->hasMany(ShipmentDocument::class, 'custom_doc_id', 'custom_doc_id');
    }
}
