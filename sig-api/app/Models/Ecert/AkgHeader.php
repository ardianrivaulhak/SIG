<?php
namespace App\Models\Ecert;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AkgHeader extends Model
{
    protected $connection = 'mysqlcertificate';
    use SoftDeletes;
    protected $table="akg_header";
    protected $primaryKey="id";
    protected $hidden =[
        'deleted_at',
    ];

    public function contract()
    {
        return $this->setConnection('mysql')->hasOne('\App\Models\Analysis\Kontrakuji','id_kontrakuji','id_contract');
    }

    public function akgDetail()
    {
        return $this->hasMany('\App\Models\Ecert\AkgDetail','id_akg_header','id');
    }

    public function akgCondition()
    {
        return $this->hasMany('\App\Models\Ecert\AkgCondition','id_akg_header','id');
    }

    public function formatAkg()
    {
        return $this->hasOne('\App\Models\Ecert\Format','id','format');
    }

    public function akgParameter()
    {
        return $this->hasMany('\App\Models\Ecert\AkgParameter','id_akg_header','id');
    }

   


}