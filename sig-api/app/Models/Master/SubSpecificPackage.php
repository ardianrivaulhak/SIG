<?php
namespace App\Models\Master;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SubSpecificPackage extends Model
{
    public $timestamps = false;
    protected $table="mstr_sub_specific_package";
    protected $primaryKey="id";

    // public function subagian(){
    //     return $this->hasMany('App\Models\Master\Subagian','id_bagian','id_div');
    // }
    
    public function detailSpecific(){
        return $this->hasMany('\App\Models\Master\DetailSpecificPackage','id_mstr_sub_specific_package','id')->whereNotNull('id');
    }

    public function perka(){
        return $this->hasOne('\App\Models\Master\Perka','id_sub_specific_catalogue','id');
    }

    public function pkmpackage(){
        return $this->hasOne('\App\Models\Master\SpesificPackage','id','mstr_specific_package_id');
    }
}