<?php
namespace App\Models\Hris;
use Illuminate\Database\Eloquent\Model;
class Employee_education extends Model
{
    protected $connection = 'mysqlhris';
    protected $table="hris_employee_education";
    protected $primaryKey="id_employee_education";
    protected $hidden =[
        'created_at',
        'updated_at',
        'deleted_at'
    ];
}