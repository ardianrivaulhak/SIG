<?php
namespace App\Models\Products;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductPrice extends Model
{
    
    use SoftDeletes;
    protected $table="product_price";
    protected $primaryKey="id_product_price";

    public function contract(){
        return $this->hasOne('App\Models\Products\Products','id_product_contract','id_product_contract');
    }

    public function product_payment(){
        return $this->hasMany('App\Models\Products\ProductPayment','id_product_price','id_product_price');
    }



}