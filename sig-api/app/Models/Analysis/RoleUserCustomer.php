<?php
namespace App\Models\Analysis;
use Illuminate\Database\Eloquent\Model;

class RoleUserCustomer extends Model
{
    protected $connection = 'mysqlconnect';
    //use SoftDeletes;
    protected $table="role_user";
    protected $primaryKey="id";
    // public $timestamps = false;
    // protected $hidden =[
    //     'deleted_at',
    // ];
        

    
}