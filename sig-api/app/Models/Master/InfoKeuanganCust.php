<?php
namespace App\Models\Master;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class InfoKeuanganCust extends Model
{
    
    protected $table="info_keu_customer";
    protected $primaryKey="id";
    public $timestamps = false;


    public function customer(){
        return $this->hasMany('App\Models\Analysis\Customer','id_cust','id');
    }
    
    // public function menu_auth(){
    //     return $this->hasMany('\App\Models\Master\Menu_auth','id_div','id_div');
    // }
}