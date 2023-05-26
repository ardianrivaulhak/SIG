<?php
namespace App\Models\Complain;
use Illuminate\Database\Eloquent\Model;

class ComplainSend extends Model
{
        protected $connection = 'mysqlcomplain';
        public $timestamps = false;

        protected $table="sending_certificate";
        protected $primaryKey="id";
        
        public function technical(){
            return $this->hasOne('\App\Models\Complain\ComplainTechnical','id','id_technical');
        }

        public function technicalDetail(){
            return $this->hasMany('\App\Models\Complain\ComplainTechnicalDetail','id_tech_det','id_technical');
        }

        public function lab(){
            return $this->setConnection('mysql')->hasOne('\App\Models\Master\Lab','id','id_lab');
        }

        public function lod(){
            return $this->setConnection('mysql')->hasOne('\App\Models\Master\Lod','id','id_lod');
        }

        public function parameteruji(){
            return $this->setConnection('mysql')->hasOne('\App\Models\Master\ParameterUji','id','id_parameteruji');
        }

        public function metode(){
            return $this->setConnection('mysql')->hasOne('\App\Models\Master\Metode','id','id_metode');
        }

        public function unit(){
            return $this->setConnection('mysql')->hasOne('\App\Models\Master\Unit','id','id_unit');
        }

        public function technical_detail_one(){
            return $this->hasOne('\App\Models\Complain\ComplainTechnicalDetail','id','id_techdet');
        }

}