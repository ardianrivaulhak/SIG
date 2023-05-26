<?php
namespace App\Models\Products;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductInvoice extends Model
{
    
    use SoftDeletes;
    protected $table="product_invoice";
    protected $primaryKey="id_product_invoice";

    public function contract(){
        return $this->hasOne('App\Models\Products\Products','id_product_contract','id_product_contract');
    }

    public function conditionInvoice(){
        return $this->hasMany('App\Models\Products\ProductInvoiceCondition','id_product_invoice','id_product_invoice');
    }

    public function customers(){
        return $this->hasOne('App\Models\Analysis\Customer','id_customer','id_customer');
    }

    public function contactpersons(){
        return $this->hasOne('App\Models\Analysis\ContactPerson','id_cp','id_cp');
    }

    public function address()
    {
        return $this->hasOne('App\Models\Analysis\CustomerAddress','id_address','id_address');
    }

    public function price(){
        return $this->hasOne('App\Models\Products\ProductPrice','id_product_contract','id_product_contract');
    }

}