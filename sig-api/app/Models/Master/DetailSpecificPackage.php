<?php
namespace App\Models\Master;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DetailSpecificPackage extends Model
{
    public $timestamps = false;
    protected $table="mstr_detail_specific_package";
    protected $primaryKey="id";

    // public function subagian(){
    //     return $this->hasMany('App\Models\Master\Subagian','id_bagian','id_div');
    // }
    
    public function parameteruji(){
        return $this->hasOne('\App\Models\Master\ParameterUji','id','parameteruji_id');
    }

    public function lab(){
        return $this->hasOne('\App\Models\Master\Lab','id','id_lab');
    }

    public function metode(){
        return $this->hasOne('\App\Models\Master\Metode','id','id_metode');
    }

    public function unit(){
        return $this->hasOne('\App\Models\Master\Unit','id','id_unit');
    }

    public function standart(){
        return $this->hasOne('\App\Models\Master\Standart','id','id_standart');
    }
    
}