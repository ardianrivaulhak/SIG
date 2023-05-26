<?php
namespace App\Models\Products;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Products extends Model
{
    
    use SoftDeletes;
    protected $table="product_contract";
    protected $primaryKey="id_product_contract";

    public function customers(){
        return $this->hasOne('App\Models\Analysis\Customer','id_customer','id_customer');
    }

    public function contactpersons(){
        return $this->hasOne('App\Models\Analysis\ContactPerson','id_cp','id_cp');
    }

    public function employee(){
        return $this->hasOne('\App\Models\Hris\Employee','user_id','user_id');
    }

    public function conditions()
    {
        return $this->hasMany('App\Models\Products\ConditionProducts','id_product_contract','id_product_contract');
    }

    public function productprice()
    {
        return $this->hasOne('App\Models\Products\ProductPrice','id_product_contract','id_product_contract');
    }

    public function address()
    {
        return $this->hasOne('App\Models\Analysis\CustomerAddress','id_address','id_address');
    }

    public function category()
    {
        return $this->hasOne('App\Models\Master\ContractCategory','id','id_category');
    }

    public function productMediaRTU()
    {
        return $this->hasMany('App\Models\Products\Mediartu\TransactionMediartu','id_product_contract','id_product_contract');
    }

    public function productDioxin()
    {
        return $this->hasMany('App\Models\Products\Dioxine\TransactionDioxineUdara','id_product_contract','id_product_contract');
    }


}