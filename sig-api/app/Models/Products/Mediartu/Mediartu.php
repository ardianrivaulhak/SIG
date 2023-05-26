<?php
namespace App\Models\Products\Mediartu;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Mediartu extends Model
{
    
    use SoftDeletes;
    protected $table="master_media_rtu";
    protected $primaryKey="id";

    // public function subagian(){
    //     return $this->hasMany('App\Models\Master\Subagian','id_bagian','id_div');
    // }
    
    // public function menu_auth(){
    //     return $this->hasMany('\App\Models\Master\Menu_auth','id_div','id_div');
    // }
}