<?php
namespace App\Models\Analysis;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ConditionInvoice extends Model
{   
    use SoftDeletes;
    public $timestamps = false;
    //use SoftDeletes;
    protected $table="condition_invoice";
    protected $primaryKey="id";
    // protected $hidden =[
    //     'deleted_at'
    // ];

    public function kontrakuji(){
        return $this->hasOne('\App\Models\Analysis\Kontrakuji','id_kontrakuji','id_contract');
    }

    public function user(){
        return $this->hasOne('\App\Models\Hris\Employee','user_id','user_id')->select('user_id','employee_name');
    }



}
