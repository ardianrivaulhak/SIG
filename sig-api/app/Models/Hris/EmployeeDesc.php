<?php
namespace App\Models\Hris;
use Illuminate\Database\Eloquent\Model;
class EmployeeDesc extends Model
{
    protected $connection = 'mysqlhris';
    public $timestamps = false;
    protected $table="hris_desc";
    protected $primaryKey="id";


    public function employee(){
        return $this->setConnection('mysql')->hasOne('App\Models\Hris\Employee','employee_id','id_employee');
    }
}