<?php
namespace App\Models\Analysis;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TransactionPenawaranSample extends Model
{
    
    protected $table="transaction_penawaran_sample";
    protected $primaryKey="id";
    public $timestamps = false;

    
    public function status_pengujian(){
        return $this->hasOne('App\Models\Master\Statuspengujian','id','id_statuspengujian');
    } 

    public function transactionPenawaranParameter(){
        return $this->hasMany('\App\Models\Analysis\TransactionPenawaranParameter','id_tr_sample_penawaran','id')
        ->select(
            \DB::raw('IF(transaction_penawaran_parameter.status = 1, "PAKET",IF(transaction_penawaran_parameter.status = 2,"NON PAKET","PAKET PKM")) AS status_string'),
            'transaction_penawaran_parameter.id',
            'transaction_penawaran_parameter.id_parameteruji',
            'transaction_penawaran_parameter.id_tr_sample_penawaran',
            'transaction_penawaran_parameter.id_standart',
            'transaction_penawaran_parameter.id_lod',
            'transaction_penawaran_parameter.id_lab',
            'transaction_penawaran_parameter.status',
            'transaction_penawaran_parameter.id_satuan',
            'transaction_penawaran_parameter.id_metode',
            'transaction_penawaran_parameter.format_hasil',
            \DB::raw('IF(transaction_penawaran_parameter.format_hasil = "Simplo",1,IF(transaction_penawaran_parameter.format_hasil = "Duplo",2,3)) as formathasil'),
            'transaction_penawaran_parameter.info_id',
            \DB::raw('IF(transaction_penawaran_parameter.status = 1,mstr_products_paketuji.discount,IF(transaction_penawaran_parameter.status = 3,mstr_specific_package.disc,1)) as discount'),
            \DB::raw('IF(transaction_penawaran_parameter.status = 1,mstr_products_paketuji.price,IF(transaction_penawaran_parameter.status = 3,mstr_sub_specific_package.price,parameter_price.price)) as price'),
            \DB::raw('IF(transaction_penawaran_parameter.status = 1,CONCAT(mstr_products_paketuji.kode_paketuji," - ",mstr_products_paketuji.nama_paketuji),IF(transaction_penawaran_parameter.status = 3,CONCAT(mstr_specific_package.package_code," - ",mstr_specific_package.package_name),"NON PAKET")) as info'),
            \DB::raw('IF(transaction_penawaran_parameter.status = 1,CONCAT(mstr_products_paketuji.kode_paketuji," - ",IF(mstr_products_paketuji.nama_paketuji_en IS NULL, mstr_products_paketuji.nama_paketuji, mstr_products_paketuji.nama_paketuji_en)),IF(transaction_penawaran_parameter.status = 3,CONCAT(mstr_specific_package.package_code," - ",IF(mstr_specific_package.package_name_en IS NULL, mstr_specific_package.package_name,mstr_specific_package.package_name_en)),"NON PACKAGE")) as info_en'))
            ->leftJoin('mstr_products_paketuji','mstr_products_paketuji.id','transaction_penawaran_parameter.info_id')
            ->leftJoin('mstr_sub_specific_package','mstr_sub_specific_package.id','transaction_penawaran_parameter.info_id')
            ->leftJoin('mstr_specific_package','mstr_specific_package.id','mstr_sub_specific_package.mstr_specific_package_id')
            ->leftJoin('parameter_price','parameter_price.id','transaction_penawaran_parameter.info_id')
            ->groupBy('transaction_penawaran_parameter.id')
            ->orderBy('transaction_penawaran_parameter.status','asc');
    }


    public function transactionpenawaran(){
        return $this->hasOne('\App\Models\Analysis\TransactionPenawaran','id','id_penawaran');
    }

    public function getonlyprice(){
        return $this->hasMany('\App\Models\Analysis\TransactionPenawaranParameter','id_tr_sample_penawaran','id')
        ->select(
            'transaction_penawaran_parameter.id',
            'transaction_penawaran_parameter.info_id',
            'transaction_penawaran_parameter.status',
            'transaction_penawaran_parameter.id_parameteruji',
            'transaction_penawaran_parameter.id_tr_sample_penawaran',
            \DB::raw('IF(transaction_penawaran_parameter.status = 1,mstr_products_paketuji.price,IF(transaction_penawaran_parameter.status = 4,mstr_sub_specific_package.price,parameter_price.price)) as price'),
            \DB::raw('IF(transaction_penawaran_parameter.status = 1,mstr_products_paketuji.discount,IF(transaction_penawaran_parameter.status = 4,mstr_specific_package.disc,1)) as disc')
        )
        ->leftJoin('mstr_products_paketuji','mstr_products_paketuji.id','transaction_penawaran_parameter.info_id')
        ->leftJoin('mstr_sub_specific_package','mstr_sub_specific_package.id','transaction_penawaran_parameter.info_id')
        ->leftJoin('mstr_specific_package','mstr_specific_package.id','mstr_sub_specific_package.mstr_specific_package_id')
        ->leftJoin('parameter_price','parameter_price.id','transaction_penawaran_parameter.info_id');
    }

    // public function subcatalogue(){
    //     return $this->hasOne('\App\Models\Master\Subcatalogue','id_sub_catalogue','id_subcatalogue');
    // }

}