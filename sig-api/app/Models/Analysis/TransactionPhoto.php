<?php
namespace App\Models\Analysis;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TransactionPhoto extends Model
{
    // use SoftDeletes;
    protected $table="transaction_sample_photo";
    protected $primaryKey="id";
    // protected $hidden =[
    //     'deleted_at'
    // ];

    // public function kontrakuji(){
    //     return $this->hasOne('\App\Models\Analysis\Kontrakuji','id_kontrakuji','id_contract');
    // }

    public function sample(){
        return $this->hasOne('\App\Models\Analysis\TransactionSample','id','id_sample');
    }

    // public function transaction_parameter(){
    //     return $this->hasMany('\App\Models\Analysis\Transaction_parameter','id_sample','id');
    // }

    // public function bobotsample(){
    //     return $this->hasMany('\App\Models\Analysis\BobotSample','id_sample','id');
    // }
}
