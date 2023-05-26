<?php
namespace App\Models\Analysis;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ConditionContract extends Model
{
    public $timestamps = false;
    use SoftDeletes;
    protected $table="condition_contracts";
    protected $primaryKey="id_condition_contract";
    protected $hidden =[
        'deleted_at'
    ];

    public function kontrakuji(){
        return $this->hasOne('\App\Models\Analysis\Kontrakuji','id_kontrakuji','id_contract');
    }

    // public function kontrakuji2(){
    //     return $this->hasMany('\App\Models\Analysis\Kontrakuji','id_kontrakuji','id_contract');
    // }

    public function contract_category(){
        return $this->belongsTo('\App\Models\Master\ContractCategory','id','id_contract_category');
    }

    public function user(){
        return $this->hasOne('\App\Models\Hris\Employee','user_id','user_id');
    }

    public function user_kendali(){
        return $this->hasOne('\App\Models\Hris\Employee','user_id','user_status_kendali')->select('user_id','employee_name');
    }

    
}