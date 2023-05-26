<?php
namespace App\Models\Complain;
use Illuminate\Database\Eloquent\Model;

class ComplainTechnical extends Model
{
        protected $connection = 'mysqlcomplain';
        protected $table="complain_technical";
        protected $primaryKey="id";
    

    public function complain(){
        return $this->setConnection('mysqlcertificate')->hasOne('\App\Models\Ecert\Complain','id','id_complain');
    }

    public function complain_cs(){
        return $this->hasOne('\App\Models\Ecert\Complain','id','id_complain');
    }

    public function complain_det(){
        return $this->hasMany('\App\Models\Complain\ComplainTechnicalDetail','id_tech_det','id');
    }
    public function sendingCert(){
        return $this->hasMany('\App\Models\Complain\ComplainSend','id_technical','id');
    }

    public function kontrakUji()
    {
        return $this->setConnection('mysql')->hasOne('\App\Models\Analysis\Kontrakuji','id_kontrakuji','id_contract');
    }

    public function statusTechnical()
    {
        return $this->hasMany('\App\Models\Complain\ComplainStatus','id_technical','id');
    }


}