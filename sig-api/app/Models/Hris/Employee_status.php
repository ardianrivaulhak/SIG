<?php
namespace App\Models\Hris;
use Illuminate\Database\Eloquent\Model;
class Employee_status extends Model
{
    protected $connection = 'mysqlhris';
    protected $table = 'hris_employee_status';
    protected $primaryKey = 'id_employee_status';
    //

}