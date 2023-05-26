<?php
namespace App\Models\Hris;
use Illuminate\Database\Eloquent\Model;
class Statuskaryawan extends Model
{
    
    protected $connection = 'mysqlhris';
    protected $table="hris_status_karyawan";
    protected $primaryKey="id";
    public $timestamps = false;
   
    public function employee_status(){
        return $this->hasOne('\App\Models\Hris\Employee_status','id_employee_status','statusp');
    } 
    public function level(){
        return $this->hasOne('\App\Models\Hris\Level','id_level','id_level');
    } 
    public function division(){
        return $this->hasOne('\App\Models\Hris\Division','id_div','id_div');
    } 
    public function subdivision(){
        return $this->hasOne('\App\Models\Hris\Subdivision','id_subagian','id_subdiv');
    } 
    public function position(){
        return $this->hasOne('\App\Models\Hris\PositionTree','id_position','id_position');
    } 
    public function dept(){
        return $this->hasOne('\App\Models\Hris\Departement','id','id_dept');
    } 
}