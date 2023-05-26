<?php
namespace App\Models\Master;
use Illuminate\Database\Eloquent\Model;

class ParameterPrice extends Model
{
    //
    public $timestamps = false;

    protected $table="parameter_price";
    protected $primaryKey="id";
  

    public function employee(){
        return $this->hasOne('\App\Models\Hris\Employee','user_id','update_user')->selectRaw('user_id,nik,employee_name,photo,phone');
    }
    
}