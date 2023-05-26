<?php
namespace App\Models\Analysis;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TransactionPenawaranParameter extends Model
{
    
    protected $table="transaction_penawaran_parameter";
    protected $primaryKey="id";
    public $timestamps = false;

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
        return $this->hasOne('\App\Models\Master\Unit','id','id_satuan');
    }

    public function standart(){
        return $this->hasOne('\App\Models\Master\Standart','id','id_standart');
    }

}