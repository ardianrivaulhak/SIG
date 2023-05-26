<?php
namespace App\Models\Hris;
use Illuminate\Database\Eloquent\Model;

class EmployementDetail extends Model
{
        protected $connection = 'mysqlhris';
        protected $table="hris_employeement_det";
        public $timestamps = false;
        protected $primaryKey="id";


        public function position(){
            return $this->hasOne('\App\Models\Hris\Position','id_position','id_pos');
        }
        public function desc(){
            return $this->hasMany('\App\Models\Hris\EmployeeDesc','id_employee','employee_id');
        }
        public function level(){
            return $this->hasOne('\App\Models\Hris\Level','id_level','id_level');
        }
        public function bagian(){
            return $this->hasOne('\App\Models\Hris\Division','id_div','id_div');
        }
        public function dept(){
            return $this->hasOne('\App\Models\Hris\Departement','id','id_dept');
        }
        public function subagian(){
            return $this->hasOne('\App\Models\Hris\Subdivision','id_subagian','id_subdiv');
        }
        
}