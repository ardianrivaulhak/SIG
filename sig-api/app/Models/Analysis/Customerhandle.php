<?php
namespace App\Models\Analysis;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Customerhandle extends Model
{
    
    use SoftDeletes;
    protected $table="mstr_customers_handle";
    protected $primaryKey="idch";
    protected $hidden =[
        'insert_user',
        'update_user',
        'delete_user',
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    public function customers(){
        return $this->hasOne('\App\Models\Analysis\Customer','id_customer','id_customer')->whereNotNull('id_customer');
    }

    public function contact_person(){
        return $this->hasOne('\App\Models\Analysis\ContactPerson','id_cp','id_cp')->whereNotNull('id_cp')->select('id_cp','name','gender');
    }

    public function address_customer(){
        return $this->hasMany('\App\Models\Analysis\CustomerAddress','customer_id','id_customer');
    }

}