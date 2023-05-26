<?php
namespace App\Models\Analysis;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ConditionLabProccess extends Model
{
    public $timestamps = false;
    protected $table="condition_lab_proccess";
    protected $primaryKey="id";

    // public function subagian(){
    //     return $this->hasMany('App\Models\Master\Subagian','id_bagian','id_div');
    // }
    
    public function user(){
        return $this->hasOne('\App\Models\Hris\Employee','user_id','user_id')->select('user_id','employee_name');
    }
}