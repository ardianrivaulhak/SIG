<?php
namespace App\Models\Analysis;
use Illuminate\Database\Eloquent\Model;


class PaymentInvoice extends Model
{
    public $timestamps = false;
    protected $table="invoice_payment";
    protected $primaryKey="id";

}