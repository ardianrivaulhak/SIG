<?php
namespace App\Models\Products\Mediartu;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProgressMediartu extends Model
{
    
    use SoftDeletes;
    protected $table="mediartu_progress";
    protected $primaryKey="id_product_progress";

    public function transaction_media_rtu(){
        return $this->hasOne('App\Models\Products\MEdiartu\TransactionMediartu','id','id_transaction_mediartu');
    }
    
}