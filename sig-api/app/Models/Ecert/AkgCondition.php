<?php
namespace App\Models\Ecert;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AkgCondition extends Model
{
    protected $connection = 'mysqlcertificate';
    use SoftDeletes;
    protected $table="akg_condition";
    protected $primaryKey="id";
    public $timestamps = false;
    protected $hidden =[
        'deleted_at',
    ];

    public function user()
    {
        return $this->setConnection('mysql')->hasOne('\App\Models\Hris\Employee','user_id','id_user');
    }


}