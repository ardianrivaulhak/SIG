<?php
namespace App\Models\Analysis;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ConditionLabDone extends Model
{
    public $timestamps = false;
    protected $table="condition_lab_done";
    protected $primaryKey="id";

    // public function subagian(){
    //     return $this->hasMany('App\Models\Master\Subagian','id_bagian','id_div');
    // }
    
    public function user(){
        return $this->hasOne('\App\Models\Hris\Employee','user_id','user_id')->select('user_id','employee_name');
    }

    public function transactionparameter(){
        return $this->hasOne('\App\Models\Analysis\Transaction_parameter','id_transaction_parameter','id');
    }
}