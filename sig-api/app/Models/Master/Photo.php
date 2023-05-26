<?php
namespace App\Models\Master;
use Illuminate\Database\Eloquent\Model;

class Photo extends Model
{
    //
    public $timestamps = false;

    protected $table="transaction_sample_photo";
    protected $primaryKey="id";
  
    public function transaction_sample(){
        return $this->hasOne('\App\Models\Analysis\TransactionSample','id','id_sample');
    }
}