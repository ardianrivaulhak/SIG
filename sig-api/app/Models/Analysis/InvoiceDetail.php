<?php
namespace App\Models\Analysis;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class InvoiceDetail extends Model
{
    use SoftDeletes;
    protected $table="invoice_detail";

    protected $primaryKey="id";
    public $timestamps = false;


    public function kontrakuji(){
        return $this->hasOne('\App\Models\Analysis\Kontrakuji','id_kontrakuji','id_contract');
    }

    public function kontrakuji_light(){
        return $this->hasOne('\App\Models\Analysis\Kontrakuji','id_kontrakuji','id_contract')->selectRaw('id_kontrakuji, contract_no, hold');
    }

    public function invoice_header(){
        return $this->hasOne('\App\Models\Analysis\InvoiceHeader','id','id_inv_header');
    }

    public function transactionSample(){
        return $this->hasOne('\App\Models\Analysis\TransactionSample','id','id_sample');
    }


    public function peyment_data(){
        return $this->hasOne('\App\Models\Analysis\PaymentData','id_contract','id_contract');
    }






    // public function invoice_header(){
    //     return $this->hasOne()
    // }
}
