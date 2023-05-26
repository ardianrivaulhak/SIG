<?php
namespace App\Models\Analysis;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AkgTransaction extends Model
{
    public $timestamps = false;
    protected $table="transaction_akg_contract";
    protected $primaryKey="id";

    // public function subagian(){
    //     return $this->hasMany('App\Models\Master\Subagian','id_bagian','id_div');
    // }
    
    public function masterakg(){
        return $this->hasOne('\App\Models\Master\Akg','id','id_mstr_transaction_akg');
    }
}