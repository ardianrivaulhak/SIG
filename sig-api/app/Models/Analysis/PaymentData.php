<?php
namespace App\Models\Analysis;
use Illuminate\Database\Eloquent\Model;

class PaymentData extends Model
{
    protected $table="payment_data";
    protected $primaryKey="id";

    public function contracUji(){
        return $this->hasOne('\App\Models\Analysis\Kontrakuji', 'id_kontrakuji', 'id_contract');
    }


    public function user(){
        return $this->hasOne('\App\Models\Hris\Employee','user_id','user_id');
    }

    public function bank(){
        return $this->hasOne('\App\Models\Analysis\BankAccount','id','bank');
    }


}
