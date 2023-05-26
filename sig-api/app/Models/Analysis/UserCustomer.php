<?php
namespace App\Models\Analysis;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserCustomer extends Model
{
    protected $connection = 'mysqlconnect';
    use SoftDeletes;
    protected $table="users";
    protected $primaryKey="id";
    // public $timestamps = false;
    // protected $hidden =[
    //     'deleted_at',
    // ];
        
    public function customers(){
        return $this->setConnection('mysql')->hasOne('\App\Models\Analysis\Customer','id_customer','id_customer');
    }

    
}