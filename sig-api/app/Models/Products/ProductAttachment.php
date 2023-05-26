<?php
namespace App\Models\Products;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductAttachment extends Model
{
    use SoftDeletes;
    protected $table="product_image";
    protected $primaryKey="id_product_image";

    public function contract(){
        return $this->hasOne('\App\Models\Products\Products','id_product_contract','id_product_contract');
    }
}