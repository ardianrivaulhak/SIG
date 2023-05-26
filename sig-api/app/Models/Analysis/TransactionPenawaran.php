<?php
namespace App\Models\Analysis;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TransactionPenawaran extends Model
{
    
    protected $table="transaction_penawaran";
    protected $primaryKey="id";
    public $timestamps = false;

    public function customers_handle(){
        return $this->hasOne('App\Models\Analysis\Customerhandle','idch','idch');
    }  

    public function format(){
        return $this->hasOne('App\Models\Analysis\TransactionPenawaranFormat','id_tp','id');
    }   

    public function payment(){
        return $this->hasOne('App\Models\Analysis\TransactionPenawaranPayment','id_tp','id');
    } 

    public function transactionPenawaranSample(){
        return $this->hasMany('App\Models\Analysis\TransactionPenawaranSample','id_penawaran','id');
    } 

    public function user_created(){
        return $this->hasOne('App\Models\Hris\Employee','user_id','created_by');
    } 

    public function akgTrans(){
        return $this->hasMany('App\Models\Analysis\AkgTransaction','id_transaction_kontrakuji','id');
    }

    public function samplingTrans(){
        return $this->hasMany('\App\Models\Analysis\TransactionSamplingPenawaran','id_tp','id');
    }

    public function tphs(){
        return $this->hasMany('\App\Models\Analysis\TransactionPenawaran','status','id')->orderBy('id','desc');
    }

    public function status(){
        return $this->hasMany('\App\Models\Analysis\TransactionPenawaranStatus','id_tp','status');
    }

    public function contract(){
        return $this->hasOne('\App\Models\Analysis\Kontrakuji','id_penawaran','id');
    }

    public function sales_name(){
        return $this->hasOne('App\Models\Hris\Employee','employee_id','clienthandling')->select('employee_id','employee_name','id_position','phone');
    }

}