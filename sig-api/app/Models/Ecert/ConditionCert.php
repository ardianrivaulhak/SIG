<?php
namespace App\Models\Ecert;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ConditionCert extends Model
{
    protected $connection = 'mysqlcertificate';
    protected $table="condition_sample_cert";
    protected $primaryKey="id";
    public $timestamps = false;

    public function transaction_sample_cert()
    {
        return $this->hasOne('\App\Models\Ecert\Ecertlhu','id','id_transaction_cert');
    }

    public function transaction_cert_light()
    {
        return $this->hasOne('\App\Models\Ecert\Ecertlhu','id','id_transaction_cert')->select('id', 'lhu_number', 'date_at', 'print_info');
    }

    public function customer_cert()
    {
        return $this->hasOne('\App\Models\Ecert\CustomerCert','id_transaction_sample','id_transaction_sample');
    }

    public function Akgdata()
    {
        return $this->hasMany('App\Models\Analysis\AkgTransaction','id_transaction_kontrakuji','id_contract');
    }

    public function Akgdatas()
    {
        return $this->setConnection('mysql')->hasMany('App\Models\Analysis\AkgTransaction','id_transaction_kontrakuji','id_contract');
    }

    public function team(){
        return $this->setConnection('mysql')->hasOne('\App\Models\Master\Group','id','id_team');
    }

    // public function lhu(){
    //     return $this->hasOne('\App\Models\Ecert\Ecertlhu','id_transaction_sample','id_transaction_sample');
    // }

    public function user(){
        return $this->setConnection('mysql')->hasOne('\App\Models\Hris\Employee','user_id','user_id')->select('user_id','employee_name');
    }

    public function contract_master(){
        return $this->setConnection('mysql')->hasOne('\App\Models\Analysis\Kontrakuji','id_kontrakuji','id_contract')->select('id_kontrakuji', 'id_customers_handle', 'contract_no', 'hold');
    }





}
