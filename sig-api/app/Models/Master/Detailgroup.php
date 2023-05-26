<?php
namespace App\Models\Master;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Detailgroup extends Model
{
    // public $timestamps = false;
    protected $table="mstr_transaction_group";
    protected $primaryKey="id";

    // public function subagian(){
    //     return $this->hasMany('App\Models\Master\Subagian','id_bagian','id_div');
    // }
    
    public function employee(){
        return $this->hasOne('\App\Models\Hris\Employee','employee_id','id_employee');
    }
}