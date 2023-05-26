<?php
namespace App\Models\Master;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TransactionMediaRtu extends Model
{
    
    protected $table="transaction_media_rtu";
    protected $primaryKey="id";
    public $timestamps = false;

    public function master_media_rtu(){
        return $this->hasOne('App\Models\Master\MediaRtu','id_master_mediartu','id');
    }

}