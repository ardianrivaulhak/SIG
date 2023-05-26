<?php
namespace App\Models\Analysis;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Transaction_parameter extends Model
{
    protected $connection = 'mysql';
    public $timestamps = false;
    use SoftDeletes;
    protected $table="transaction_parameter";
    protected $primaryKey="id";


    public function transaction_sample(){
        return $this->hasOne('\App\Models\Analysis\TransactionSample','id','id_sample')->selectRaw('
            id,
            kode_sample,
            sample_name,
            no_sample,
            batch_number,
            tgl_input,
            tgl_selesai,
            IF(tgl_estimasi_lab is NULL,"-",DATE_FORMAT(tgl_estimasi_lab,"%d/%m/%Y")) as tgl_estimasi_lab,
            nama_pabrik,
            alamat_pabrik,
            no_notifikasi,
            no_pengajuan,
            no_registrasi,
            no_principalcode,
            nama_dagang,
            lot_number,
            jenis_kemasan,
            tgl_produksi,
            tgl_kadaluarsa,
            price,
            discount,
            id_tujuanpengujian,
            id_statuspengujian,
            id_subcatalogue,
            id_contract,
            certificate_info,
            keterangan_lain,
            kesimpulan
        ');
    }


    public function transactionsamples(){
        return $this->hasOne('\App\Models\Analysis\TransactionSample','id','id_sample');
    }

    public function parameteruji(){
        return $this->belongsTo('\App\Models\Master\ParameterUji','id_parameteruji','id');
    }

    public function metode(){
        return $this->hasOne('\App\Models\Master\Metode','id','id_metode');
    }

    public function lod(){
        return $this->hasOne('\App\Models\Master\Lod','id','id_lod');
    }

    public function lab(){
        return $this->hasOne('\App\Models\Master\Lab','id','id_lab');
    }

    public function unit(){
        return $this->hasOne('\App\Models\Master\Unit','id','id_unit');
    }

    public function standart(){
        return $this->hasOne('\App\Models\Master\Standart','id','id_standart');
    }

    public function parameterujiOne(){
        return $this->hasOne('\App\Models\Master\ParameterUji', 'id', 'id_parameteruji');
    }

    public function nonpaket(){
        return $this->hasOne('\App\Models\Master\Parameteruji', 'id', 'info_id');
    }

    public function labUji(){
        return $this->hasOne('\App\Models\Master\Lab', 'id', 'id_lab');
    }

    public function subpacket(){
        return $this->belongsTo('\App\Models\Master\DetailSpecificPackage','id_parameteruji','parameteruji_id');
    }

    public function paketinfo(){
        return $this->hasOne('App\Models\Master\Paketuji','id','idpaket');
    }

    public function parameter_condition(){
        return $this->hasOne('\App\Models\Analysis\ConditionContractNew','parameter_id','id');
    }

    public function paketdata(){
        return $this->hasOne('App\Models\Master\Paketuji','id','info_id');
    }
    
    public function nonpaketprice(){
        return $this->hasOne('App\Models\Master\ParameterPrice','parameteruji_id','info_id');
    }

    public function condition_contracts(){
        return $this->hasOne('\App\Models\Analysis\ConditionContractNew','sample_id','id_sample');
    }

    public function parameter_condition_lab(){
        return $this->hasMany('\App\Models\Analysis\ConditionContractNew','parameter_id','id')->selectRaw('
        contract_id,
        sample_id,
        parameter_id,
        user_id,
        groups,
        position,
        status,
        DATE_FORMAT(inserted_at,"%d/%m/%Y - %H:%i:%s") as inserted_at')->orderBy('status','desc');
    }
    

    public function parameter_condition_lab_first() {
        return $this->hasOne('\App\Models\Analysis\ConditionContractNew','parameter_id','id')->orderBy('status','desc');
    }

    public function preparation_approve(){
        return $this->hasMany('\App\Models\Analysis\ConditionContractNew','sample_id','id_sample')
        ->selectRaw('
        contract_id,
        sample_id,
        parameter_id,
        user_id,
        groups,
        position,
        status,
        DATE_FORMAT(inserted_at,"%d/%m/%Y - %H:%i:%s") as inserted_at
        ')->where('position',3)->where('parameter_id',0);
    }

    public function info_transaction(){
        if('transaction_parameter.status = 1'){
            return $this->paketdata();
        } else {
            return $this->nonpaket();
        }
    }

    public function conditionlabcome(){
        return $this->hasMany('App\Models\Analysis\ConditionLabCome','id_transaction_parameter','id')->selectRaw('
            id,
            id_transaction_parameter,
            user_id,
            DATE_FORMAT(inserted_at,"%d/%m/%Y - %H:%i:%s") as inserted_at
        ')->orderBy('inserted_at','desc');
    }

    public function conditionlabproccess(){
        return $this->hasMany('App\Models\Analysis\ConditionLabProccess','id_transaction_parameter','id')->selectRaw('
            id,
            id_transaction_parameter,
            user_id,
            DATE_FORMAT(inserted_at,"%d/%m/%Y - %H:%i:%s") as inserted_at
        ')->orderBy('inserted_at','desc');
    }

    public function conditionlabdone(){
        return $this->hasMany('App\Models\Analysis\ConditionLabDone','id_transaction_parameter','id')->selectRaw('
            id,
            id_transaction_parameter,
            user_id,
            DATE_FORMAT(inserted_at,"%d/%m/%Y - %H:%i:%s") as inserted_at
        ')->orderBy('inserted_at','desc');
    }
}