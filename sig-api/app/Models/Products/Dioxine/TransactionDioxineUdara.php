<?php
namespace App\Models\Products\Dioxine;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TransactionDioxineUdara extends Model
{
    
    use SoftDeletes;
    protected $table="transaction_dioxin";
    protected $primaryKey="id";

    public function master_dioxin(){
        return $this->hasOne('App\Models\Products\Dioxine\DioxineUdara','id','id_mstr_dioxineudara');
    }

}