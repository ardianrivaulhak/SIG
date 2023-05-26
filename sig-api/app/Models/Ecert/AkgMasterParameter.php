<?php
namespace App\Models\Ecert;
use Illuminate\Database\Eloquent\Model;

class AkgMasterParameter extends Model
{
    protected $connection = 'mysqlcertificate';
    protected $table="akg_master_parameter";
    protected $primaryKey="id";
    public $timestamps = false;
    protected $hidden =[
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function masterUnit()
    {
        return $this->setConnection('mysql')->hasOne('\App\Models\Master\Unit','id','id_unit');
    }



}