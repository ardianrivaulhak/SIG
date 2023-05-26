<?php
namespace App\Models\Hris;
use Illuminate\Database\Eloquent\Model;
class Attendance extends Model
{

        protected $connection = 'mysqlhris';
        public $timestamps = false;
        protected $table="hris_attendance";
        protected $primaryKey="id";


    public function employee(){
        return $this->setConnection('mysql')->hasOne('\App\Models\Hris\Employee','employee_id','id_employee')->select('employee_name','employee_id','id_bagian','id_level');
    }

    public function status_attendance(){
        return $this->hasOne('\App\Models\Hris\StatusAttendance','id','id_status');
    }
    public function status_attendance_plg(){
        return $this->hasOne('\App\Models\Hris\StatusAttendance','id','id_status_plg');
    }

    public function rules_attendance(){
        return $this->hasOne('\App\Models\Hris\RulesAttendance','id','id_rules');
    }
    
}