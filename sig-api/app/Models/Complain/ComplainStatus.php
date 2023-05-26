<?php
namespace App\Models\Complain;
use Illuminate\Database\Eloquent\Model;

class ComplainStatus extends Model
{
        protected $connection = 'mysqlcomplain';
        public $timestamps = false;

        protected $table="complain_technical_status";
        protected $primaryKey="id";
        

        public function employee(){
            return $this->belongsTo('\App\Models\Hris\Employee','user_id','user_id')->select('employee_name','user_id','employee_id','id_bagian','id_level');
        }

        public function complaindet(){
            return $this->belongsTo('\App\Models\Complain\ComplainTechnicalDetail','id_technical_det','id');
        }

        public function complainstatusprep(){
            return $this->hasMany('\App\Models\Complain\ComplainStatus','id_technical_det','id_technical_det')->where('position',3)->orderBy('inserted_at','desc');
        }
}