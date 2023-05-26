<?php
namespace App\Models\Analysis;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SamplingTransaction extends Model
{
    public $timestamps = false;
    protected $table="transaction_sampling_contract";
    protected $primaryKey="id";

    // public function subagian(){
    //     return $this->hasMany('App\Models\Master\Subagian','id_bagian','id_div');
    // }
    
    public function samplingmaster(){
        return $this->hasOne('\App\Models\Master\Sampling','id','id_mstr_transaction_sampling');
    }
}