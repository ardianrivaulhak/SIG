<?php
namespace App\Models\Ecert;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Ecertlhu extends Model
{
    protected $connection = 'mysqlcertificate';
    use SoftDeletes;
    protected $table="transaction_sample_cert";
    protected $primaryKey="id";
    public $timestamps = false;
    protected $hidden =[
        'deleted_at',
    ];

    // public function complaint()
    // {
    //     return $this->hasMany('\App\Models\Ecert\Complain', 'id',  'id_cert');
    // }

    public function complaint()
    {
        return $this->hasMany('\App\Models\Ecert\Complain', 'id_cert','id');
    }

    public function TransactionSample()
    {
        return $this->setConnection('mysql')->belongsTo('\App\Models\Analysis\TransactionSample','id_transaction_sample','id');
    }
    public function transaction_sample_light()
    {
        return $this->setConnection('mysql')->belongsTo('\App\Models\Analysis\TransactionSample','id_transaction_sample','id')->select('id');
    }

    public function format()
    {
        return $this->hasOne('\App\Models\Ecert\Format','id','format');
    }

    public function manual()
    {
        return $this->hasOne('\App\Models\Ecert\ManualData','id_transaction_sample','id');
    }

    public function ConditionCert()
    {
        return $this->hasMany('\App\Models\Ecert\ConditionCert', 'id_transaction_cert','id')->orderBy('status','ASC');
    }

    public function ConditionCheckCert()
    {
        return $this->hasMany('\App\Models\Ecert\ConditionCert','id', 'id_transaction_sample')->orderBy('status','ASC');
    }

    public function condition_check_last()
    {
        return $this->hasOne('\App\Models\Ecert\ConditionCert','id_transaction_cert', 'id')->orderBy('status','DESC');
    }

    public function ConditionCertFirst()
    {
        return $this->hasOne('\App\Models\Ecert\ConditionCert','id_transaction_cert','id');
    }

    public function ConditionCertinSample()
    {
        return $this->hasMany('\App\Models\Ecert\ConditionCert','id_transaction_cert','id');
    }

    public function status_pengujian()
    {
        return $this->setConnection('mysql')->hasOne('\App\Models\Master\Statuspengujian','id','id_statuspengujian');
    }

    public function tujuan_pengujian()
    {
        return $this->setConnection('mysql')->hasOne('\App\Models\Master\Tujuanpengujian','id','id_tujuanpengujian');
    }

    public function subcatalog()
    {
        return $this->setConnection('mysql')->hasOne('\App\Models\Master\Subcatalogue','id_sub_catalogue','id_subcatalogue');
    }

    public function condition_many()
    {
        return $this->hasMany('\App\Models\Ecert\ConditionCert','id_transaction_cert','id');
    }

    public function parameters()
    {
        return $this->hasMany('\App\Models\Ecert\ParameterCert','id_transaction_sample','id')->orderBy('position', 'asc');
    }

    public function customer()
    {
        return $this->setConnection('mysql')->hasOne('\App\Models\Analysis\Customer','id_customer','customer_name');
    }

    public function contact_person()
    {
        return $this->setConnection('mysql')->hasOne('\App\Models\Analysis\ContactPerson','id_cp','contact_person');
    }

    public function address()
    {
        return $this->setConnection('mysql')->hasOne('\App\Models\Analysis\CustomerAddress','id_address','customer_address');
    }

    public function employee_sampling()
    {
        return $this->setConnection('mysql')->hasOne('\App\Models\Hris\Employee','employee_id','pic');
    }

    public function transample()
    {
        return $this->setConnection('mysql')->hasOne('\App\Models\Analysis\TransactionSample','id','id_transaction_sample');
    }

    public function autosend()
    {
        return $this->hasOne('\App\Models\Ecert\AutoSend','id_certificate','id');
    }

    public function revision()
    {
        return $this->hasMany('\App\Models\Ecert\RevEcertlhu','id_sample_cert', 'id');
    }

    public function attachment()
    {
        return $this->hasMany('\App\Models\Ecert\AttachmentRevFile','id_transaction_sample', 'id');
    }

    public function transaction_sample()
    {
        return $this->setConnection('mysql')->belongsTo('\App\Models\Analysis\TransactionSample','id_transaction_sample','id');
    }







}
