<?php
namespace App\Models\Hris;
use Illuminate\Database\Eloquent\Model;
class Employee extends Model
{

        protected $table="hris_employee";
        protected $primaryKey="employee_id";
        protected $hidden =[
            'inserted_user',
            'updated_user',
            'deleted_user',
            'created_at',
            'updated_at',
            'deleted_at',
            'view_url',
            'delete_url'
        ];
        protected $appends = [
            'view_url',
            'delete_url'
        ];
        public function getDeleteUrlAttribute() {
            return route( 'employee.delete', [ 'id' => $this->employee_id ] );
        }
        public function getViewUrlAttribute() {
            return route( 'employee.view', [ 'id' => $this->employee_id ] );
        }

        public function attendance(){
            return $this->belongsTo('\App\Models\Hris\Attendance','employee_id','id_employee')->selectRaw('
            DATE_FORMAT(hris_attendance.absen_masuk,"%d/%m/%Y %H:%i:%S") as absen_masuk,
            DATE_FORMAT(hris_attendance.absen_pulang,"%d/%m/%Y %H:%i:%S") as absen_pulang,
            hris_attendance.id_employee,
            hris_attendance.id_status,
            hris_attendance.id_status_plg,
            hris_attendance.id_rules,
            hris_attendance.desc,
            hris_attendance.id
        ');
        }

        // public function rules_attendance(){
        //     return $this->belongsTo('\App\Models\Hris\RulesAttendance','employee_id','employee_id');
        // }
    
        public function city(){
            return $this->belongsTo('\App\Models\Master\City','tempat_lahir','id_city');
        }

        // public function sistercompany(){
        //     return $this->belongsTo('\App\Models\Hris\SisterCompany','id_company','id');
        // }

        public function user(){
            return $this->hasOne('\App\User','id','user_id')->select('id','email');
        }
        public function desc(){
            return $this->hasMany('\App\Models\Hris\EmployeeDesc','id_employee','employee_id');
        }

        public function signature(){
            return $this->hasOne('\App\Models\Hris\Signature','employee_id','employee_id');
        }
        public function position(){
            return $this->hasOne('\App\Models\Master\Position','id_position','id_position');
        }
        public function level(){
            return $this->belongsTo('\App\Models\Master\Level','id_level','id_level');
        }

        public function bagian(){
            return $this->hasOne('\App\Models\Master\Bagian','id_div','id_bagian');
        }
        public function dept(){
            return $this->hasOne('\App\Models\Hris\Departement','id','id_departement');
        }
        public function subagian(){
            return $this->hasOne('\App\Models\Master\Subagian','id_subagian','id_sub_bagian');
        }
        public function competence(){
            return $this->hasMany('\App\Models\Hris\Competence','id_employee','employee_id');
        }

        public function historydiv(){
            return $this->setConnection('mysqlhris')->hasMany('\App\Models\Hris\EmployementDetail','employee_id','employee_id');
        }

        public function sistercompany(){
            return $this->setConnection('mysqlhris')->belongsTo('\App\Models\Hris\SisterCompany','id_company','id');
        }

        public function historylevel(){
            return $this->setConnection('mysqlhris')->hasMany('\App\Models\Hris\Levelstatus','employee_id','employee_id');
        }

        public function historystatus(){
            return $this->setConnection('mysqlhris')->hasMany('\App\Models\Hris\Statuskaryawan','id_employee','employee_id');
        }

        public function groupiso(){
            return $this->setConnection('mysqledoc')->hasOne('\App\Models\Edoc\TransactionGroups','id_user', 'employee_id');
        }

        public function documentaccess(){
            return $this->setConnection('mysqledoc')->hasOne('\App\Models\Edoc\DocumentAccess','id_user', 'employee_id');
        }
}