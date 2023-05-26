<?php
namespace App\Models\Products;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductPayment extends Model
{
    
    use SoftDeletes;
    protected $table="product_payment";
    protected $primaryKey="id_product_payment";

    public function product_price(){
        return $this->hasOne('App\Models\Products\ProductPrice','id_product_price','id_product_coid_product_pricentract');
    }

    public function user(){
        return $this->hasOne('\App\Models\Hris\Employee','user_id','user_id')->select('user_id','employee_name');
    }



}