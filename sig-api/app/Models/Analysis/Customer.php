<?php

namespace App\Models\Analysis;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends Model
{
    // use SoftDeletes;

    protected $table = "mstr_customers_customer";
    public $timestamps = false;
    protected $primaryKey = "id_customer";



    public function customer_address()
    {
        return $this->hasOne('\App\Models\Analysis\CustomerAddress', 'customer_id', 'id_customer');
    }


    public function city()
    {
        return $this->hasOne('\App\Models\Master\City', 'id_city', 'id_city');
    }

    public function countries()
    {
        return $this->hasOne('\App\Models\Master\Countries', 'id', 'id_countries');
    }

    public function customer_taxaddress()
    {
        return $this->hasOne('\App\Models\Analysis\CustomerTaxAddress', 'id_customer', 'customer_id');
    }

    public function customer_taxaddress6()
    {
        return $this->hasMany('\App\Models\Analysis\CustomerTaxAddress', 'customer_id', 'id_customer');
    }

    public function customers_handle()
    {
        return $this->hasOne('\App\Models\Analysis\Customer', 'id_customer', 'id_customer')->whereNotNull('id_customer');
    }

    public function customers_handle6()
    {
        return $this->hasMany('\App\Models\Analysis\Customerhandle', 'id_customer', 'id_customer')->whereNotNull('id_customer');
    }


    public function info_keu_cust()
    {
        return $this->hasOne('\App\Models\Master\InfoKeuanganCust', 'id_cust', 'id_customer');
    }

    public function customer_mou()
    {
        return $this->hasMany('\App\Models\Master\Mou', 'id_customer', 'id_customer');
    }

    public function customer_npwp()
    {
        return $this->hasMany('\App\Models\Master\Npwp', 'id_customer', 'id_customer');
    }

    public function ar_user()
    {
        return $this->hasOne('\App\Models\Hris\Employee', 'employee_id', 'id_user_ar');
    }
}
