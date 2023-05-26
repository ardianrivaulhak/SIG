<?php
namespace App\Models\Analysis;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TransactionPenawaranStatus extends Model
{
    
    protected $table="transaction_penawaran_status";
    protected $primaryKey="id";
    public $timestamps = false;

    // public function customers_handle(){
    //     return $this->hasOne('App\Models\Analysis\Customerhandle','idch','idch');
    // }   

    public function user_created(){
        return $this->hasOne('App\Models\Hris\Employee','user_id','user_id');
    } 

}