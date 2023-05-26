<?php
namespace App\Models\Products;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductInvoiceCondition extends Model
{
    
    use SoftDeletes;
    protected $table="product_invoice_condition";
    protected $primaryKey="id_invoice_condition";

  
     public function employee(){
        return $this->hasOne('\App\Models\Hris\Employee','user_id','user_id');
    }

}