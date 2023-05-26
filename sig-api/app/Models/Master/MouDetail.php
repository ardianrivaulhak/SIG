<?php
namespace App\Models\Master;
use Illuminate\Database\Eloquent\Model;

class MouDetail extends Model
{
    //

    public $timestamps = false;
    protected $table="cust_mou_detail";
    protected $primaryKey="id";


    public function statuspengujian(){
        return $this->hasOne('\App\Models\Master\Statuspengujian','id','id_status_pengujian');
    }

}