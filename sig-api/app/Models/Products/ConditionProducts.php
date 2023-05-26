<?php
namespace App\Models\Products;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ConditionProducts extends Model
{
    use SoftDeletes;
    protected $table="product_condition";
    protected $primaryKey="id_product_condition";

    public function contract(){
        return $this->hasOne('\App\Models\Products\Products','id_product_contract','id_product_contract');
    }

    public function employee(){
        return $this->setConnection('mysql')->hasOne('\App\Models\Hris\Employee','user_id','user_id');
    }
}