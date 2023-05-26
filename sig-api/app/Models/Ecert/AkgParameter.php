<?php
namespace App\Models\Ecert;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AkgParameter extends Model
{
    protected $connection = 'mysqlcertificate';
    use SoftDeletes;
    protected $table="akg_parameter";
    protected $primaryKey="id";
    public $timestamps = false;
    protected $hidden =[
        'deleted_at',
    ];
    
    public function parameters()
    {
        return $this->hasOne('\App\Models\Ecert\ParameterCert','id','id_trans_parameter');
    }

    public function data_lab_parameter()
    {
        return $this->setConnection('mysql')->hasOne('\App\Models\Master\ParameterUji','id','id_parameter');
    }

    public function akg_master()
    {
        return $this->setConnection('mysql')->hasOne('\App\Models\Ecert\AkgMasterParameter','id_parameter','id_parameter');
    }

}