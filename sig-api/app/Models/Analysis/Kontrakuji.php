<?php
namespace App\Models\Analysis;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Kontrakuji extends Model
{

    public $timestamps = false;
    use SoftDeletes;
    protected $table="mstr_transaction_kontrakuji";
    protected $primaryKey="id_kontrakuji";
    protected $hidden =[
        'insert_user',
        'update_user',
        'delete_user',
        'updated_at',
        'deleted_at'
    ];

    public function contract_category(){
        return $this->hasOne('\App\Models\Master\ContractCategory','id','id_contract_category')->select('id','title');
    }

    public function contract_attachment(){
        return $this->hasMany('\App\Models\Analysis\ContractAttachment','id_contract','id_kontrakuji');
    }

    public function customers_handle(){
        return $this->hasOne('\App\Models\Analysis\Customerhandle','idch','id_customers_handle');
    }
    public function voucher(){
        return $this->hasOne('\App\Models\Master\Voucher','id','id_voucher');
    }
    public function penawaran(){
        return $this->hasOne('\App\Models\Analysis\TransactionPenawaran','id','id_penawaran');
    }
    public function user(){
        return $this->hasOne('\App\Models\Hris\Employee','user_id','user_id')->select('user_id','employee_name');
    }

    public function conditionContract(){
        return $this->hasOne('\App\Models\Analysis\ConditionContractNew','contract_id','id_kontrakuji')->where('position',1);
    }

    public function conditionContractControl(){
        return $this->hasMany('\App\Models\Analysis\ConditionContractNew','contract_id','id_kontrakuji')
        ->where('groups','KENDALI');
    }

    public function conditionContractPreparation(){
        return $this->hasOne('\App\Models\Analysis\ConditionContractNew','contract_id','id_kontrakuji')
        ->where('groups','PREPARATION')->where('position',3);
    }

    public function conditionContractCertificate(){
        return $this->hasOne('\App\Models\Analysis\ConditionContractNew','contract_id','id_kontrakuji')
        ->where('groups','CERTIFICATE')->where('position',5);
    }

    public function transactionsample(){
        return $this->hasMany('\App\Models\Analysis\TransactionSample','id_contract','id_kontrakuji')
        ->orderBy(\DB::raw('CAST(SUBSTRING_INDEX(no_sample, ".", -1) AS UNSIGNED)'), 'asc');
    }

    public function description(){
        return $this->hasMany('\App\Models\Analysis\Description','id_contract','id_kontrakuji')->where('id_sample',0);
    }

    public function description_cs(){
        return $this->hasMany('\App\Models\Analysis\Description','id_contract','id_kontrakuji')->where('status', 2)->where('id_sample',0)->orderBy('created_at','DESC');
    }

    public function description_invoice(){
        return $this->hasMany('\App\Models\Analysis\Description','id_contract','id_kontrakuji')->where('status', 1)->where('groups', 6);
    }

    public function description_kendali(){
        return $this->hasMany('\App\Models\Analysis\Description','id_contract','id_kontrakuji')
        ->where('status', 1)
        ->where('groups', 2);
    }

    public function description_preparation(){
        return $this->hasMany('\App\Models\Analysis\Description','id_contract','id_kontrakuji')
        ->where('status', 1)
        ->where('groups', 3);
    }

    public function contract_conditions(){
        return $this->hasMany('\App\Models\Analysis\ConditionContractNew','contract_id','id_kontrakuji');
    }

    public function contract_condition(){
        return $this->hasMany('\App\Models\Analysis\ConditionContractNew','contract_id','id_kontrakuji');
    }

    public function contract_rev(){
        return $this->hasMany('\App\Models\Analysis\Kontrakuji','id_kontrakuji','id_contract_rev');
    }

    public function payment_condition(){
        return $this->hasOne('\App\Models\Analysis\PaymentCondition','id_contract','id_kontrakuji');
    }

    public function tgl_selesai(){
        return $this->hasMany('\App\Models\Analysis\TransactionSample','id_contract','id_kontrakuji')
        ->select(
            'id_contract',
            \DB::raw('DATE_FORMAT(tgl_selesai,"%d/%m/%Y") as tgl_selesai'),
            'id_statuspengujian'
            )
        ->orderBy('id_statuspengujian','desc');
    }

    // public function payment_conditions(){
    //     return $this->hasOne('\App\Models\Analysis\PaymentCondition','id_contract','id_kontrakuji');
    // }


    public function akgTrans(){
        return $this->hasMany('App\Models\Analysis\AkgTransaction','id_transaction_kontrakuji','id_kontrakuji');
    }

    public function totalAkg(){
        return $this->setConnection('mysqlcertificate')->hasMany('App\Models\Ecert\Akgfile','id_contract','id_kontrakuji')->where('deleted_at', null);
    }

    public function contract_info(){
        return $this->hasOne('App\Models\Analysis\ContractMessage','id_contract','id_kontrakuji');
    }

    public function memo_finance(){
        return $this->hasOne('\App\Models\Analysis\Description','id_contract','id_kontrakuji')->where('status', 1)->where('groups',6);
    }

    public function samplingTrans(){
        return $this->hasMany('\App\Models\Analysis\SamplingTransaction','id_transaction_contract','id_kontrakuji');
    }

    public function attachment(){
        return $this->hasMany('\App\Models\Analysis\ContractAttachment','id_contract','id_kontrakuji');
    }

    public function cust_address(){
        return $this->hasOne('\App\Models\Analysis\CustomerAddress','id_address','id_alamat_customer');
    }

    public function cust_tax_address(){
        return $this->hasOne('\App\Models\Analysis\CustomerTaxAddress','id_taxaddress','id_alamat_taxaddress');
    }

    public function status_sample_kendali(){
        return $this->hasMany('\App\Models\Analysis\ConditionContractNew','contract_id','id_kontrakuji')
        ->where('groups', 'KENDALI')
        ->where('status' , 2)
        ->where('parameter_id',0);
    }

    public function count_samplelab(){
        return $this->hasMany('App\Models\Analysis\TransactionSample','id_contract','id_kontrakuji')->select('id_contract','id');
    }

    public function count_preparation(){
        return $this->hasMany('\App\Models\Analysis\ConditionContractNew','contract_id','id_kontrakuji')
        ->where('groups', 'PREPARATION')
        ->where('sample_id','!=',0)
        ->where('status' , 1)
        ->select('id_condition_contract', 'contract_id');
    }

    public function sample_condition(){
        return $this->hasMany('\App\Models\Analysis\ConditionContractNew','contract_id','id_kontrakuji')->where('parameter_id',0);
    }

    public function status_sample_certificate(){
        return $this->hasMany('\App\Models\Analysis\ConditionContractNew','contract_id','id_kontrakuji')
        ->where('groups', 'LAB')
        ->where('position', 4)
        ->where('status' , 4)
        ->where('parameter_id',0)
        ->where('sample_id', '<>', 0);
    }

    public function memo(){
        return $this->hasOne('\App\Models\Analysis\Description','id_contract','id_kontrakuji')->where('status', 1);
    }

    public function conditionContractCert(){
        return $this->setConnection('mysqlcertificate')->hasMany('\App\Models\Ecert\ConditionCert','id_contract','id_kontrakuji');
    }

    public function condition_cert(){
        return $this->setConnection('mysqlcertificate')->hasMany('\App\Models\Ecert\ConditionCert','id_contract','id_kontrakuji')->orderBy('status','desc');
    }

    public function condition_certOne(){
        return $this->setConnection('mysqlcertificate')->hasOne('\App\Models\Ecert\ConditionCert','id_contract','id_kontrakuji')->orderBy('status','desc')
        ->select('id_contract','status','inserted_at','cert_status');
    }

    public function invoice_condition(){
        return $this->belongsTo('\App\Models\Analysis\ConditionInvoice','id_contract','id_kontrakuji');
    }

    public function status_invoices(){
        return $this->hasMany('\App\Models\Analysis\InvoiceDetail','id_contract','id_kontrakuji');
    }

    // public function pic_sales(){
    //     return $this->belongsTo('\App\Models\Hris\Employee','employee_id','mstr_transaction_kontrakujistatus')->select('employee_id','employee_name');
    // }

    public function payment_data()
    {
        return $this->hasMany('\App\Models\Analysis\PaymentData','id_contract','id_kontrakuji');
    }







}
