<?php
namespace App\Models\Analysis;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class InvoiceHeader extends Model
{
    use SoftDeletes;
    protected $table="invoice_header";

    protected $primaryKey="id";
    public $timestamps = false;


    public function invoice_detail(){
        return $this->hasMany('\App\Models\Analysis\InvoiceDetail','id_inv_header','id');
    }

    public function cust_address(){
        return $this->hasOne('\App\Models\Analysis\CustomerAddress','id_address','id_cust_address');
    }
    public function cust_tax_address(){
        return $this->hasOne('\App\Models\Analysis\CustomerTaxAddress','id_taxaddress','id_cust_taxaddress');
    }

    public function customer(){
        return $this->hasOne('\App\Models\Analysis\Customer','id_customer','idcust');
    }

    public function contactperson(){
        return $this->hasOne('\App\Models\Analysis\ContactPerson','id_cp','idcp');
    }

    public function invoice_condition(){
        return $this->hasMany('\App\Models\Analysis\ConditionInvoice','id_invoice_header','id')->orderBy('id', 'desc');
    }

    public function invoice_condition_first(){
        return $this->hasOne('\App\Models\Analysis\ConditionInvoice','id_invoice_header','id')->orderBy('id', 'desc');
    }

    public function invoice_user(){
        return $this->hasOne('\App\Models\Analysis\ConditionInvoice','id_invoice_header','id');
    }
}



