<?php
namespace App\Models\Analysis;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ConditionContractNew extends Model
{
    public $timestamps = false;
    // use SoftDeletes;
    protected $table="condition_contracts";
    protected $primaryKey="id_condition_contract";
    // protected $hidden =[
    //     'deleted_at'
    // ];

    public function kontrakuji(){
        return $this->hasOne('\App\Models\Analysis\Kontrakuji','id_kontrakuji','contract_id')->selectRaw('
        id_kontrakuji,
        contract_no,
        hold,
        no_penawaran,
        no_po,
        (SELECT employee_name FROM hris_employee WHERE employee_id = mstr_transaction_kontrakuji.status) as pic_sales,
        mstr_transaction_kontrakuji.status,
        status_inv,
        contract_type,
        mstr_transaction_kontrakuji.desc,
        id_customers_handle,
        id_contract_category
        ');
    }

    public function kontrakujifinder(){
        return $this->hasOne('\App\Models\Analysis\Kontrakuji','id_kontrakuji','contract_id')
        ->selectRaw('
                mstr_transaction_kontrakuji.id_kontrakuji,
                mstr_transaction_kontrakuji.status_prep,
                mstr_transaction_kontrakuji.st_complain,
                (SELECT title FROM mstr_products_contactcategory WHERE id = mstr_transaction_kontrakuji.id_contract_category) AS category,
                (SELECT customer_name FROM mstr_customers_customer WHERE id_customer = c.id_customer ) AS customer_name,
                (SELECT NAME FROM mstr_customers_contactperson WHERE id_cp = c.id_cp ) AS cp,
                IF(mstr_transaction_kontrakuji.id_penawaran IS NULL,mstr_transaction_kontrakuji.no_penawaran,(SELECT no_penawaran FROM transaction_penawaran WHERE mstr_transaction_kontrakuji.id_penawaran = id)) AS no_penawaran,
                mstr_transaction_kontrakuji.no_po,
                mstr_transaction_kontrakuji.contract_no,
                smp.tgl_selesai,
                c.phone,
                c.telp,
                c.email,
                mstr_transaction_kontrakuji.hold,
                (SELECT employee_name FROM hris_employee where employee_id = mstr_transaction_kontrakuji.status) as picsales
        ')
        ->join('mstr_customers_handle as c','c.idch','mstr_transaction_kontrakuji.id_customers_handle')
        ->join(\DB::raw('(SELECT id_contract, DATE_FORMAT(tgl_selesai, "%d/%m/%Y") AS tgl_selesai FROM transaction_sample aa
        GROUP BY aa.id_contract
        ORDER BY aa.tgl_selesai ASC   
        ) AS smp'),'smp.id_contract','mstr_transaction_kontrakuji.id_kontrakuji');
    }

    public function transactionparameter(){
        return $this->hasOne('\App\Models\Analysis\Transaction_parameter','id','parameter_id')->select(
            \DB::raw('0 as checked'),
            'transaction_parameter.id',
            'transaction_parameter.id_parameteruji',
            'transaction_parameter.simplo',
            'transaction_parameter.duplo',
            'transaction_parameter.triplo',
            'transaction_parameter.hasiluji',
            'transaction_parameter.id_standart',
            'transaction_parameter.id_lod',
            'transaction_parameter.id_lab',
            'transaction_parameter.id_unit',
            'transaction_parameter.id_metode',
            'transaction_parameter.format_hasil',
            'transaction_parameter.id_sample',
            'transaction_parameter.id_team',
            'transaction_parameter.status',
            'transaction_parameter.position',
            'transaction_parameter.deleted_at',
            \DB::raw('IF(transaction_parameter.status = 1,mstr_products_paketuji.price,IF(transaction_parameter.status = 4,mstr_sub_specific_package.price,parameter_price.price)) as price'),
            \DB::raw('IF(transaction_parameter.status = 1,CONCAT(mstr_products_paketuji.kode_paketuji," - ",mstr_products_paketuji.nama_paketuji),IF(transaction_parameter.status = 4,CONCAT(mstr_specific_package.package_code," - ",mstr_specific_package.package_name),"NON PAKET")) as info'),
            'transaction_parameter.deleted_at',
            \DB::raw('IF(transaction_parameter.status = 4,mstr_sub_specific_package.n,"-") as n'),
            \DB::raw('IF(transaction_parameter.status = 4,mstr_sub_specific_package.m,"-") as m'),
            \DB::raw('IF(transaction_parameter.status = 4,mstr_sub_specific_package.c,"-") as c'),
            \DB::raw('IF(transaction_parameter.status = 4,mstr_sub_specific_package.mm,"-") as mm')
            )
            ->leftJoin('mstr_products_paketuji','mstr_products_paketuji.id','transaction_parameter.info_id')
            ->leftJoin('mstr_sub_specific_package','mstr_sub_specific_package.id','transaction_parameter.info_id')
            ->leftJoin('mstr_specific_package','mstr_specific_package.id','mstr_sub_specific_package.mstr_specific_package_id')
            ->leftJoin('parameter_price','parameter_price.id','transaction_parameter.info_id')->orderBy('transaction_parameter.id','ASC')->groupBy('transaction_parameter.id');
    }

    public function contract_category(){
        return $this->belongsTo('\App\Models\Master\ContractCategory','id','id_contract_category');
    }

    public function user_cs(){
        return $this->hasOne('\App\Models\Hris\Employee','user_id','user_status_cs')->select('user_id','employee_name');
    }

    public function user_kendali(){
        return $this->hasOne('\App\Models\Hris\Employee','user_id','user_id')->select('user_id','employee_name');
    }

    public function user(){
        return $this->hasOne('\App\Models\Hris\Employee','user_id','user_id')->select('user_id','employee_name','employee_id');
    }

    public function conditionCert(){
        return $this->belongsTo('\App\Models\Ecert\ConditionCert','contract_id','id_contract');
    }

    public function transactionCert(){
        return $this->belongsTo('\App\Models\Ecert\Ecertlhu','id_transaction_sample','sample_id');
    }

    public function conditionInvocie(){
        return $this->belongsTo('\App\Models\Analysis\ConditionInvoice','id_contract','id_kontrakuji');
    }

    public function kontrakstatus_cs(){
        return $this->hasMany('\App\Models\Analysis\ConditionContractNew','contract_id','contract_id')->where('position',1)->groupBy('status');
    }

    public function kontrakstatus_kendali(){
        return $this->hasMany('\App\Models\Analysis\ConditionContractNew','contract_id','contract_id')->where('position',2)->where('status','<>',2)->groupBy('status');
    }

    public function kontrakstatus_prep(){
        return $this->hasMany('\App\Models\Analysis\ConditionContractNew','contract_id','contract_id')->where('position',3)->where('sample_id','<>',0)->groupBy('status');
    }

    public function kontrakstatus_lab(){
        return $this->hasMany('\App\Models\Analysis\ConditionContractNew','contract_id','contract_id')->where('position',4)->groupBy('status');
    }

    public function kontrakstatus_cert(){
        return $this->belongsTo('\App\Models\Ecert\ConditionCert','contract_id','id_contract');
    }

    public function sample_cert(){
        return $this->hasMany('\App\Models\Ecert\Ecertlhu','id_transaction_sample','sample_id');
    }

    public function transaction_sample_light(){
        return $this->hasOne('\App\Models\Analysis\TransactionSample','id','sample_id')->select('sample_id');
    }

    public function kontrakuji_light(){
        return $this->hasOne('\App\Models\Analysis\Kontrakuji','id_kontrakuji','contract_id')->selectRaw('
        id_kontrakuji,
        contract_no
        ');
    }



}
