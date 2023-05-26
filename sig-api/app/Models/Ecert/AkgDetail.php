<?php
namespace App\Models\Ecert;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AkgDetail extends Model
{
    protected $connection = 'mysqlcertificate';
    use SoftDeletes;
    protected $table="akg_detail";
    protected $primaryKey="id";
    protected $hidden =[
        'deleted_at',
    ];

    public function akgheader()
    {
        return $this->hasOne('\App\Models\Ecert\AkgHeader','id','id_akg_header');
    }

    public function akgInLhu()
    {
        return $this->hasOne('\App\Models\Ecert\EcertLhu','id','id_lhu');
    }


}