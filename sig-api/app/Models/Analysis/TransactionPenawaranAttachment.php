<?php
namespace App\Models\Analysis;
use Illuminate\Database\Eloquent\Model;

class TransactionPenawaranAttachment extends Model
{
    
    protected $table="transaction_penawaran_attachment";
    protected $primaryKey="id";
    public $timestamps = false;

    // public function customers_handle(){
    //     return $this->hasOne('App\Models\Analysis\Customerhandle','idch','idch');
    // }   

    // public function user_created(){
    //     return $this->hasOne('App\Models\Hris\Employee','user_id','created_by');
    // } 

}