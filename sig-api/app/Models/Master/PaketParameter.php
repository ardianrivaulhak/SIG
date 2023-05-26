<?php
namespace App\Models\Master;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PaketParameter extends Model
{
    
    public $timestamps = false;
    protected $table="mstr_products_paketparameter";
    protected $primaryKey="id";
    protected $hidden =[
        'insert_user',
        'update_user',
        'delete_user',
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    public function paketuji(){
        return $this->hasOne('\App\Models\Master\Paketuji','id','id_paketuji');
    }

    

    public function parameteruji(){
        return $this->hasMany('\App\Models\Master\ParameterUji','id','id_parameter_uji')
        ->selectRaw('id,parameter_code,name_id,name_en,description');
    }

    public function standart(){
        return $this->hasOne('\App\Models\Master\Standart','id','id_standart');
    }

    public function lod(){
        return $this->hasOne('\App\Models\Master\Lod','id','id_lod');
    }
    public function unit(){
        return $this->hasOne('\App\Models\Master\Unit','id','id_unit');
    }

    public function metode(){
        return $this->hasOne('\App\Models\Master\Metode','id','id_metode');
    }

    public function lab(){
        return $this->hasOne('\App\Models\Master\Lab','id','id_lab');
    }
}