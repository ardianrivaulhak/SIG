<?php
namespace App\Models\Complain;
use Illuminate\Database\Eloquent\Model;
use App\Models\Analysis\Transaction_parameter;
use App\Models\Master\ParameterUji;

class ComplainTechnicalDetail extends Model
{
        protected $connection = 'mysqlcomplain';
    public $timestamps = false;

        protected $table="complain_technical_detail";
        protected $primaryKey="id";
    
    public function complain_tech(){
        return $this->hasOne('\App\Models\Complain\ComplainTechnical','id','id_tech_det');
    }

    public function transactionparameter(){     
        return $this->setConnection('mysql')->belongsTo(Transaction_parameter::class,'id_transaction_parameter','id');
    }

    public function parameteruji(){     
        return $this->setConnection('mysql')->belongsTo(ParameterUji::class,'id_parameteruji','id');
    }

    public function status(){
        return $this->hasMany('\App\Models\Complain\ComplainStatus','id_technical_det','id')->orderBy('inserted_at','desc');
    }

    public function statusone(){
        return $this->hasOne('\App\Models\Complain\ComplainStatus','id_technical_det','id')->orderBy('inserted_at','desc');
    }

    public function complainsend(){
        return $this->hasOne('\App\Models\Complain\ComplainSend','id_techdet','id');
    }


    public function complaindetagain(){
        return $this->hasMany('\App\Models\Complain\ComplainTechnicalDetailChild','idct_sample','id');
    }
    
    public function lab(){
        return $this->setConnection('mysql')->hasOne('\App\Models\Master\Lab','id','id_lab');
    }


    public function metode(){
        return $this->setConnection('mysql')->hasOne('\App\Models\Master\Metode','id','id_metode');
    }

    public function lod(){
        return $this->setConnection('mysql')->hasOne('\App\Models\Master\Lod','id','id_lod');
    }

    public function unit(){
        return $this->setConnection('mysql')->hasOne('\App\Models\Master\Unit','id','id_unit');
    }

    public function standart(){
        return $this->setConnection('mysql')->hasOne('\App\Models\Master\Standart','id','id_standart');
    }

    public function certificateParameter(){
        return $this->setConnection('mysqlcertificate')->hasOne('\App\Models\Ecert\ParameterCert','id','id_parameter_lhu');
    }


    

    

}