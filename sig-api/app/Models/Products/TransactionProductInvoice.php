<?php
namespace App\Models\Products;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TransactionProductInvoice extends Model
{
    
    use SoftDeletes;
    protected $table="transaction_product_invoice";
    protected $primaryKey="id_transaction_product_invoice";

  


}