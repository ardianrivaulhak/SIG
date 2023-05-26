<?php
namespace App\Models\Master;
use Illuminate\Database\Eloquent\Model;

class AttachmentMou extends Model
{
    //
    public $timestamps = false;

    protected $table="cust_mou_attachment";
    protected $primaryKey="id";

    public function mouheader(){
        return $this->hasOne('\App\Models\Master\Mou','id_cust_mou_header','id_cust_mou_header');
    }
    
}