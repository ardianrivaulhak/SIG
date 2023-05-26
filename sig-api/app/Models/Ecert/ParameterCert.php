<?php
namespace App\Models\Ecert;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ParameterCert extends Model
{
    protected $connection = 'mysqlcertificate';
    use SoftDeletes;
    protected $table="transaction_parameter_cert";
    protected $primaryKey="id";
    protected $hidden =[
        'deleted_at',
    ];

    public function Ecertlhu()
    {
        return $this->belongsTo('\App\Models\Ecert\Ecertlhu','id_transaction_sample','id');
    }

    public function AkgMaster()
    {
        return $this->hasOne('\App\Models\Ecert\AkgMasterParameter','id_parameter','id_parameteruji');
    }


}