<?php
namespace App\Models\Hris;
use Illuminate\Database\Eloquent\Model;

class Leave extends Model
{
    protected $connection = 'mysqlhris';
    protected $table="hris_leave";
    protected $primaryKey="id_leave";
    public $timestamps = false;

    public function statusattendance(){
        return $this->hasOne('\App\Models\Hris\StatusAttendance','id','id_status');
    }

    public function employee(){
        return $this->setConnection('mysql')->belongsTo('\App\Models\Hris\Employee','employee_id','employee_id')->select('employee_name','user_id','employee_id','id_bagian','id_level');
    }
    
}