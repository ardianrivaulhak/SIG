<?php
namespace App\Models\Hris;
use Illuminate\Database\Eloquent\Model;
class Competence extends Model
{

        protected $connection = 'mysqlhris';
        protected $table="hris_competence";
        protected $primaryKey="id_competence";
        protected $hidden =[
            'inserted_user',
            'updated_user',
            'created_at',
            'updated_at',
            'deleted_at'
        ];

    public function parameter(){
        return $this->hasOne('\App\Models\Hris\Parameter','id_parameter','id_parameter');
    }
    public function pengujian(){
        return $this->hasOne('\App\Models\Hris\Pengujian','id_pengujian','id_pengujian');
    }
    public function info_penguji(){
        return $this->hasOne('\App\Models\Hris\Employee','employee_id','penguji')->select('employee_id','employee_name');
    }
}