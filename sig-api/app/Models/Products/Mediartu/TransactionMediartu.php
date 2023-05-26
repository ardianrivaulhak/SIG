<?php
namespace App\Models\Products\Mediartu;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TransactionMediartu extends Model
{
    use SoftDeletes;
    protected $table="transaction_media_rtu";
    protected $primaryKey="id";

    public function master_media_rtu(){
        return $this->hasOne('App\Models\Products\Mediartu\Mediartu','id','id_mstr_mediartu');
    }

    public function contract_product(){
        return $this->hasOne('App\Models\Products\Products','id_product_contract','id_product_contract');
    }

    public function coa_mediartu(){
        return $this->hasOne('App\Models\Products\Mediartu\CoaMediaRtu','id_transaction_media_rtu','id');
    }

    public function sendingprogress(){
        return $this->hasMany('App\Models\Products\Mediartu\ProgressMediartu','id_transaction_mediartu','id');
    }

}