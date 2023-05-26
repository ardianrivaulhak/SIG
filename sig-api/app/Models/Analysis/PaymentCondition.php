<?php
namespace App\Models\Analysis;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PaymentCondition extends Model
{
    public $timestamps = false;
    protected $table="payment_contract";
    protected $primaryKey="id_payment_contract";

    // public function subagian(){
    //     return $this->hasMany('App\Models\Master\Subagian','id_bagian','id_div');
    // }
    
    // public function menu_auth(){
    //     return $this->hasMany('\App\Models\Master\Menu_auth','id_div','id_div');
    // }

    public function voucher(){
        return $this->hasOne('\App\Models\Master\Voucher','id','id_voucher');
    }
}