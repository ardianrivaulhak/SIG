<?php
namespace App\Models\Analysis;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TransactionSample extends Model
{
    protected $connection = 'mysql';
    use SoftDeletes;
    public $timestamps = false;
    protected $table="transaction_sample";
    protected $primaryKey="id";
    protected $hidden =[
        'deleted_at'
    ];


    // public function __construct(array $attributes = [])
    // {
    //     $this->table = 'mysql.' . $this->table;
    //     parent::__construct();
    // }

    public function kontrakuji(){
        return $this->hasOne('\App\Models\Analysis\Kontrakuji','id_kontrakuji','id_contract')->selectRaw('id_kontrakuji, contract_no, contract_type,id_customers_handle, id_contract_category, id_alamat_customer, id_alamat_taxaddress, hold');
    }

    public function kontrakujifull(){
        return $this->hasOne('\App\Models\Analysis\Kontrakuji','id_kontrakuji','id_contract');
    }

    public function status_cert(){
        return $this->hasOne('\App\Models\Ecert\Ecertlhu','id_transaction_sample','id');

    }

    public function contract_condition(){
        return $this->hasMany('\App\Models\Analysis\ConditionContractNew','sample_id','id');
    }

    public function condition_contract_lab(){
        return $this->hasOne('\App\Models\Analysis\ConditionContractNew','sample_id','id')->where('position',4)->where('parameter_id',0);
    }

    public function nonpaket(){
        return $this->hasMany('\App\Models\Analysis\Transaction_parameter','id_sample','id')
        ->select(
            \DB::raw('IF(transaction_parameter.status = 1, "PAKET",IF(transaction_parameter.status = 2,"NON PAKET",IF(transaction_parameter.status = 3,"REVISI","PAKET PKM"))) AS status_string'),
            'transaction_parameter.id',
            'transaction_parameter.id_parameteruji',
            'transaction_parameter.id_sample',
            \DB::raw('IF(transaction_parameter.simplo is NULL,"-",transaction_parameter.simplo) as simplo'),
            \DB::raw('IF(transaction_parameter.duplo is NULL,"-",transaction_parameter.duplo) as duplo'),
            \DB::raw('IF(transaction_parameter.triplo is NULL,"-",transaction_parameter.triplo) as triplo'),
            \DB::raw('IF(transaction_parameter.hasiluji is NULL,"-",transaction_parameter.hasiluji) as hasiluji'),
            'transaction_parameter.id_standart',
            'transaction_parameter.id_lod',
            'transaction_parameter.id_lab',
            'transaction_parameter.id_unit',
            'transaction_parameter.id_metode',
            'transaction_parameter.idfor',
            'transaction_parameter.format_hasil',
            'transaction_parameter.disc_parameter',
            'condition_contracts.status',
            'transaction_parameter.info_id',
            \DB::raw('IF(transaction_parameter.status = 1,mstr_products_paketuji.discount,IF(transaction_parameter.status = 4,mstr_specific_package.disc,1)) as discount'),
            'mstr_specific_package.id as id_paketpkm',
            'transaction_parameter.position',
            \DB::raw('IF(transaction_parameter.status = 1,mstr_products_paketuji.price,IF(transaction_parameter.status = 4,mstr_sub_specific_package.price,parameter_price.price)) as price'),
            \DB::raw('IF(transaction_parameter.status = 1,CONCAT(mstr_products_paketuji.kode_paketuji," - ",mstr_products_paketuji.nama_paketuji),IF(transaction_parameter.status = 4,CONCAT(mstr_specific_package.package_code," - ",mstr_specific_package.package_name),"NON PAKET")) as info'),
            'transaction_parameter.deleted_at',
            \DB::raw('IFNULL(IF(transaction_parameter.status = 4,mstr_standard_perka.n,"-"),"-") as n'),
            \DB::raw('IFNULL(IF(transaction_parameter.status = 4,mstr_standard_perka.m,"-"),"-")  as m'),
            \DB::raw('IFNULL(IF(transaction_parameter.status = 4,mstr_standard_perka.c,"-"),"-")  as c'),
            \DB::raw('IFNULL(IF(transaction_parameter.status = 4,mstr_standard_perka.mm,"-"),"-")  as mm'))
            ->leftJoin('mstr_products_paketuji','mstr_products_paketuji.id','transaction_parameter.info_id')
            ->leftJoin('mstr_sub_specific_package','mstr_sub_specific_package.id','transaction_parameter.info_id')
            ->leftJoin('mstr_standard_perka','mstr_standard_perka.id_sub_specific_catalogue','mstr_sub_specific_package.id')
            ->leftJoin('mstr_specific_package','mstr_specific_package.id','mstr_sub_specific_package.mstr_specific_package_id')
            ->leftJoin('parameter_price','parameter_price.id','transaction_parameter.info_id')
            ->leftJoin('condition_contracts','condition_contracts.parameter_id','transaction_parameter.id')->groupBy('transaction_parameter.id')
            ->where('transaction_parameter.status',2)
            ->orderBy('transaction_parameter.status','asc');
    }

    public function photo(){
        return $this->hasMany('\App\Models\Analysis\TransactionPhoto','id_sample','id')->select(
            'transaction_sample_photo.id',
            'transaction_sample_photo.id_sample',
            \DB::raw('CONCAT(mstr_transaction_kontrakuji.contract_no,"/",transaction_sample.no_sample,"/",transaction_sample_photo.photo) as photo')
        )
        ->join('transaction_sample','transaction_sample.id','transaction_sample_photo.id_sample')
        ->join('mstr_transaction_kontrakuji','mstr_transaction_kontrakuji.id_kontrakuji','transaction_sample.id_contract');
    }

    public function paketparameter(){
        return $this->hasMany('\App\Models\Analysis\Transaction_parameter','id_sample','id')
        ->select(
            \DB::raw('IF(transaction_parameter.status = 1, "PAKET",IF(transaction_parameter.status = 2,"NON PAKET",IF(transaction_parameter.status = 3,"REVISI","PAKET PKM"))) AS status_string'),
            'transaction_parameter.id',
            'transaction_parameter.id_parameteruji',
            'transaction_parameter.id_sample',
            \DB::raw('IF(transaction_parameter.simplo is NULL,"-",transaction_parameter.simplo) as simplo'),
            \DB::raw('IF(transaction_parameter.duplo is NULL,"-",transaction_parameter.duplo) as duplo'),
            \DB::raw('IF(transaction_parameter.triplo is NULL,"-",transaction_parameter.triplo) as triplo'),
            \DB::raw('IF(transaction_parameter.hasiluji is NULL,"-",transaction_parameter.hasiluji) as hasiluji'),
            'transaction_parameter.id_standart',
            'transaction_parameter.id_lod',
            'transaction_parameter.id_lab',
            'transaction_parameter.id_unit',
            'transaction_parameter.id_metode',
            'transaction_parameter.idfor',
            'transaction_parameter.format_hasil',
            'transaction_parameter.disc_parameter',
            'condition_contracts.status',
            'transaction_parameter.info_id',
            \DB::raw('IF(transaction_parameter.status = 1,mstr_products_paketuji.discount,IF(transaction_parameter.status = 4,mstr_specific_package.disc,1)) as discount'),
            'mstr_specific_package.id as id_paketpkm',
            'transaction_parameter.position',
            \DB::raw('IF(transaction_parameter.status = 1,mstr_products_paketuji.price,IF(transaction_parameter.status = 4,mstr_sub_specific_package.price,parameter_price.price)) as price'),
            \DB::raw('IF(transaction_parameter.status = 1,CONCAT(mstr_products_paketuji.kode_paketuji," - ",mstr_products_paketuji.nama_paketuji),IF(transaction_parameter.status = 4,CONCAT(mstr_specific_package.package_code," - ",mstr_specific_package.package_name),"NON PAKET")) as info'),
            'transaction_parameter.deleted_at',
            \DB::raw('IFNULL(IF(transaction_parameter.status = 4,mstr_standard_perka.n,"-"),"-") as n'),
            \DB::raw('IFNULL(IF(transaction_parameter.status = 4,mstr_standard_perka.m,"-"),"-")  as m'),
            \DB::raw('IFNULL(IF(transaction_parameter.status = 4,mstr_standard_perka.c,"-"),"-")  as c'),
            \DB::raw('IFNULL(IF(transaction_parameter.status = 4,mstr_standard_perka.mm,"-"),"-")  as mm'))
            ->leftJoin('mstr_products_paketuji','mstr_products_paketuji.id','transaction_parameter.info_id')
            ->leftJoin('mstr_sub_specific_package','mstr_sub_specific_package.id','transaction_parameter.info_id')
            ->leftJoin('mstr_standard_perka','mstr_standard_perka.id_sub_specific_catalogue','mstr_sub_specific_package.id')
            ->leftJoin('mstr_specific_package','mstr_specific_package.id','mstr_sub_specific_package.mstr_specific_package_id')
            ->leftJoin('parameter_price','parameter_price.id','transaction_parameter.info_id')
            ->leftJoin('condition_contracts','condition_contracts.parameter_id','transaction_parameter.id')->groupBy('transaction_parameter.id')
            ->where('transaction_parameter.status',1)
            ->orderBy('transaction_parameter.status','asc');
    }

    public function getonlyprice(){
        return $this->hasMany('\App\Models\Analysis\Transaction_parameter','id_sample','id')
        ->select(
            'transaction_parameter.id',
            'transaction_parameter.info_id',
            'transaction_parameter.status',
            'transaction_parameter.idfor',
            'transaction_parameter.id_parameteruji',
            'transaction_parameter.id_sample',
            \DB::raw('IF(transaction_parameter.status = 1,mstr_products_paketuji.price,IF(transaction_parameter.status = 4,mstr_sub_specific_package.price,parameter_price.price)) as price'),
            \DB::raw('IF(transaction_parameter.status = 1,mstr_products_paketuji.discount,IF(transaction_parameter.status = 4,mstr_specific_package.disc,1)) as disc')
        )
        ->leftJoin('mstr_products_paketuji','mstr_products_paketuji.id','transaction_parameter.info_id')
        ->leftJoin('mstr_sub_specific_package','mstr_sub_specific_package.id','transaction_parameter.info_id')
        ->leftJoin('mstr_specific_package','mstr_specific_package.id','mstr_sub_specific_package.mstr_specific_package_id')
        ->leftJoin('parameter_price','parameter_price.id','transaction_parameter.info_id');
    }


    public function paketpkm(){
        return $this->hasMany('\App\Models\Analysis\Transaction_parameter','id_sample','id')
        ->select(
            \DB::raw('IF(transaction_parameter.status = 1, "PAKET",IF(transaction_parameter.status = 2,"NON PAKET",IF(transaction_parameter.status = 3,"REVISI","PAKET PKM"))) AS status_string'),
            'transaction_parameter.id',
            'transaction_parameter.id_parameteruji',
            'transaction_parameter.id_sample',
            \DB::raw('IF(transaction_parameter.simplo is NULL,"-",transaction_parameter.simplo) as simplo'),
            \DB::raw('IF(transaction_parameter.duplo is NULL,"-",transaction_parameter.duplo) as duplo'),
            \DB::raw('IF(transaction_parameter.triplo is NULL,"-",transaction_parameter.triplo) as triplo'),
            \DB::raw('IF(transaction_parameter.hasiluji is NULL,"-",transaction_parameter.hasiluji) as hasiluji'),
            'transaction_parameter.id_standart',
            'transaction_parameter.id_lod',
            'transaction_parameter.id_lab',
            'transaction_parameter.id_unit',
            'transaction_parameter.id_metode',
            'transaction_parameter.idfor',
            'transaction_parameter.format_hasil',
            'transaction_parameter.disc_parameter',
            'condition_contracts.status',
            'transaction_parameter.info_id',
            \DB::raw('IF(transaction_parameter.status = 1,mstr_products_paketuji.discount,IF(transaction_parameter.status = 4,mstr_specific_package.disc,1)) as discount'),
            'mstr_specific_package.id as id_paketpkm',
            'transaction_parameter.position',
            \DB::raw('IF(transaction_parameter.status = 1,mstr_products_paketuji.price,IF(transaction_parameter.status = 4,mstr_sub_specific_package.price,parameter_price.price)) as price'),
            \DB::raw('IF(transaction_parameter.status = 1,CONCAT(mstr_products_paketuji.kode_paketuji," - ",mstr_products_paketuji.nama_paketuji),IF(transaction_parameter.status = 4,CONCAT(mstr_specific_package.package_code," - ",mstr_specific_package.package_name),"NON PAKET")) as info'),
            'transaction_parameter.deleted_at',
            \DB::raw('IFNULL(IF(transaction_parameter.status = 4,mstr_standard_perka.n,"-"),"-") as n'),
            \DB::raw('IFNULL(IF(transaction_parameter.status = 4,mstr_standard_perka.m,"-"),"-")  as m'),
            \DB::raw('IFNULL(IF(transaction_parameter.status = 4,mstr_standard_perka.c,"-"),"-")  as c'),
            \DB::raw('IFNULL(IF(transaction_parameter.status = 4,mstr_standard_perka.mm,"-"),"-")  as mm'))
            ->leftJoin('mstr_products_paketuji','mstr_products_paketuji.id','transaction_parameter.info_id')
            ->leftJoin('mstr_sub_specific_package','mstr_sub_specific_package.id','transaction_parameter.info_id')
            ->leftJoin('mstr_standard_perka','mstr_standard_perka.id_sub_specific_catalogue','mstr_sub_specific_package.id')
            ->leftJoin('mstr_specific_package','mstr_specific_package.id','mstr_sub_specific_package.mstr_specific_package_id')
            ->leftJoin('parameter_price','parameter_price.id','transaction_parameter.info_id')
            ->leftJoin('condition_contracts','condition_contracts.parameter_id','transaction_parameter.id')->groupBy('transaction_parameter.id')
            ->where('transaction_parameter.status',4)
            ->orderBy('transaction_parameter.status','asc');
    }


    



    public function transactionparameter(){
        return $this->hasMany('\App\Models\Analysis\Transaction_parameter','id_sample','id')
        ->select(
            \DB::raw('IF(transaction_parameter.status = 1, "PAKET",IF(transaction_parameter.status = 2,"NON PAKET",IF(transaction_parameter.status = 3,"REVISI","PAKET PKM"))) AS status_string'),
            'transaction_parameter.id',
            'transaction_parameter.id_parameteruji',
            'transaction_parameter.id_sample',
            \DB::raw('IF(transaction_parameter.simplo is NULL,"-",transaction_parameter.simplo) as simplo'),
            \DB::raw('IF(transaction_parameter.duplo is NULL,"-",transaction_parameter.duplo) as duplo'),
            \DB::raw('IF(transaction_parameter.triplo is NULL,"-",transaction_parameter.triplo) as triplo'),
            \DB::raw('IF(transaction_parameter.hasiluji is NULL,"-",transaction_parameter.hasiluji) as hasiluji'),
            'transaction_parameter.id_standart',
            'transaction_parameter.actual_result',
            'transaction_parameter.id_lod',
            'transaction_parameter.id_lab',
            'transaction_parameter.id_unit',
            'transaction_parameter.desc',
            'transaction_parameter.id_metode',
            'transaction_parameter.idfor',
            'transaction_parameter.format_hasil',
            'transaction_parameter.disc_parameter',
            'transaction_parameter.info_id',
            \DB::raw('IF(transaction_parameter.status = 1,mstr_products_paketuji.discount,IF(transaction_parameter.status = 4,mstr_specific_package.disc,1)) as discount'),
            'mstr_specific_package.id as id_paketpkm',
            'transaction_parameter.position',
            \DB::raw('IF(transaction_parameter.status = 1,mstr_products_paketuji.price,IF(transaction_parameter.status = 4,mstr_sub_specific_package.price,parameter_price.price)) as price'),
            \DB::raw('IF(transaction_parameter.status = 1,CONCAT(mstr_products_paketuji.kode_paketuji," - ",mstr_products_paketuji.nama_paketuji),IF(transaction_parameter.status = 4,CONCAT(mstr_specific_package.package_code," - ",mstr_specific_package.package_name),"NON PAKET")) as info'),
            'transaction_parameter.deleted_at',
            \DB::raw('IFNULL(IF(transaction_parameter.status = 4,mstr_standard_perka.n,"-"),"-") as n'),
            \DB::raw('IFNULL(IF(transaction_parameter.status = 4,mstr_standard_perka.m,"-"),"-")  as m'),
            \DB::raw('IFNULL(IF(transaction_parameter.status = 4,mstr_standard_perka.c,"-"),"-")  as c'),
            \DB::raw('IFNULL(IF(transaction_parameter.status = 4,mstr_standard_perka.mm,"-"),"-")  as mm'))
            ->leftJoin('mstr_products_paketuji','mstr_products_paketuji.id','transaction_parameter.info_id')
            ->leftJoin('mstr_sub_specific_package','mstr_sub_specific_package.id','transaction_parameter.info_id')
            ->leftJoin('mstr_standard_perka','mstr_standard_perka.id_sub_specific_catalogue','mstr_sub_specific_package.id')
            ->leftJoin('mstr_specific_package','mstr_specific_package.id','mstr_sub_specific_package.mstr_specific_package_id')
            ->leftJoin('parameter_price','parameter_price.id','transaction_parameter.info_id')
            ->groupBy('transaction_parameter.id')
            ->orderBy('transaction_parameter.status','asc');
    }

    public function transactionbasicparameter(){
        return $this->hasMany('\App\Models\Analysis\Transaction_parameter','id_sample','id');
    }

    public function status_lab(){
        return $this->hasMany('\App\Models\Analysis\ConditionContractNew','sample_id','id')->where('position',4)->orderBy('status','desc');
    }


    public function subcatalogue(){
        return $this->hasOne('\App\Models\Master\Subcatalogue','id_sub_catalogue','id_subcatalogue');
    }

    public function bobotsample(){
        return $this->hasMany('\App\Models\Analysis\BobotSample','id_sample','id');
    }

    public function images(){
        return $this->hasMany('\App\Models\Analysis\TransactionPhoto','id_sample','id');
    }

    public function statuspengujian(){
        return $this->hasOne('\App\Models\Master\Statuspengujian','id','id_statuspengujian');
    }

    public function tujuanpengujian(){
        return $this->hasOne('\App\Models\Master\Tujuanpengujian','id','id_tujuanpengujian');
    }

    public function description(){
        return $this->hasMany('\App\Models\Analysis\Description','id_sample','id')->where('id_sample','<>',0);
    }

    public function descriptionprep(){
        return $this->hasOne('\App\Models\Analysis\Description','id_sample','id')->where('status', 1)->where('groups', 3);
    }


    public function sample_condition(){
        return $this->hasOne('\App\Models\Analysis\ConditionContractNew','sample_id','id')
        ->where('parameter_id',0)
        ->where('groups','PREPARATION')
        ->where('position',3);
    }

    public function sample_condition_pre(){
        return $this->hasMany('\App\Models\Analysis\ConditionContractNew','sample_id','id')
        ->where('parameter_id',0)
        ->where('groups','PREPARATION')
        ->where('position',3);
    }

    public function sample_condition_histprep(){
        return $this->hasOne('\App\Models\Analysis\ConditionContractNew','sample_id','id')
        ->where('parameter_id',0)
        ->where('groups','PREPARATION')
        ->where('position',3)->orderby('id_condition_contract', 'desc');
    }

    public function sample_condition_cert(){
        return $this->hasOne('\App\Models\Analysis\ConditionContractNew','sample_id','id')
        ->where('parameter_id',0)
        ->where('groups','LAB')
        ->where('position', 4);
    }

    public function condition(){
        return $this->hasMany('\App\Models\Analysis\ConditionContractNew','contract_id','id_contract')->where('parameter_id',0)->where('sample_id',0);
    }

    public function parametersub(){
        return $this->hasMany('\App\Models\Analysis\Transaction_parameter','id_sample','id');
    }

    // public function parametercount(){
    //     return $this->hasMany('\App\Models\Analysis\Transaction_parameter','id_sample','id')->count();
    // }


    // public function paketparameter(){
    //     return $this->hasMany('\App\Models\Analysis\Transaction_parameter','id_sample','id')
    //     ->select(
    //         \DB::raw('IF(status = 1, "PAKET","-") AS status_string'),
    //         'id',
    //         'id_parameteruji',
    //         'id_sample',
    //         'simplo',
    //         'duplo',
    //         'triplo',
    //         'hasiluji',
    //         'id_standart',
    //         'id_lod',
    //         'id_lab',
    //         'id_unit',
    //         'id_metode',
    //         'format_hasil',
    //         'id_team',
    //         'status',
    //         'info_id',
    //         'position',
    //         'deleted_at');
    // }

    public function Ecertlhu()
    {
        return $this->hasOne('\App\Models\Ecert\Ecertlhu','id_transaction_sample','id')->select('id', 'id_transaction_sample');
    }

    public function paymentinfo(){
        return $this->hasOne('\App\Models\Analysis\PaymentCondition','id_kontrakuji','id_contract');
    }

    public function desc_prep(){
        return $this->hasOne('\App\Models\Analysis\Description','id_sample','id')
        ->where('id_parameter', null)
        ->where('groups',3);
    }

    public function bobotinfo(){
        return $this->hasMany('\App\Models\Analysis\BobotSample','id_sample','id');
    }
}
