<?php
namespace App\Models\Ecert;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Akgfile extends Model
{
    protected $connection = 'mysqlcertificate';
    use SoftDeletes;
    protected $table="akgfile";
    protected $primaryKey="id";
    public $timestamps = false;
    protected $hidden =[
        'deleted_at',
    ];

    public function Ecertlhu()
    {
        return $this->belongsTo('\App\Models\Ecert\Ecertlhu','id_transaction_sample','id');
    }

    public function kontrakuji(){
        return $this->setConnection('mysql')->hasOne('\App\Models\Analysis\Kontrakuji','id_kontrakuji','id_contract');
    }

    public function user(){
        return $this->setConnection('mysql')->hasOne('\App\Models\Hris\Employee','user_id','id_user')->select('user_id','employee_name');
    }

}