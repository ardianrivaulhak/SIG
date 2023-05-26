<?php
namespace App\Models\Analysis;
use Illuminate\Database\Eloquent\Model;
class TransactionSamplingPenawaran extends Model
{
    public $timestamps = false;
    protected $table="transaction_sampling_penawaran";
    protected $primaryKey="id";
    // protected $hidden =[
    //     'insert_user',
    //     'update_user',
    //     'delete_user',
    //     'created_at',
    //     'updated_at',
    //     'deleted_at'
    // ];

    public function samplingmaster(){
        return $this->hasOne('\App\Models\Master\Sampling','id','id_mstr_transaction_sampling');
    }
}