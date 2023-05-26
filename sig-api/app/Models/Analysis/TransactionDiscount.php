<?php
namespace App\Models\Analysis;
use Illuminate\Database\Eloquent\Model;
// use Illuminate\Database\Eloquent\SoftDeletes;

class TransactionDiscount extends Model
{
    // use SoftDeletes;
    public $timestamps = false;
    protected $table="transaction_discount_parameter";
    protected $primaryKey="id";
    // protected $hidden =[
    //     'deleted_at'
    // ];

    // public function kontrakuji(){
    //     return $this->hasOne('\App\Models\Analysis\Kontrakuji','id_kontrakuji','id_contract');
    // }

    // public function sample(){
    //     return $this->hasOne('\App\Models\Analysis\TransactionSample','id','id_sample');
    // }

    // public function transaction_parameter(){
    //     return $this->hasOne('\App\Models\Analysis\Transaction_parameter','id','id_transaction_parameter');
    // }

    // public function bobotsample(){
    //     return $this->hasMany('\App\Models\Analysis\BobotSample','id_sample','id');
    // }
}
