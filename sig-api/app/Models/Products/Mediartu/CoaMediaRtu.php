<?php
namespace App\Models\Products\Mediartu;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CoaMediaRtu extends Model
{
    
    use SoftDeletes;
    protected $table="coa_media_rtu";
    protected $primaryKey="id";

    public function transaction_media_rtu(){
        return $this->hasMany('App\Models\Products\Mediartu','id_transaction_media_rtu','id');
    }
    
}