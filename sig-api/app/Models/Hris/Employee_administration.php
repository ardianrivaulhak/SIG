<?php

namespace App\Models\Hris;

use Illuminate\Database\Eloquent\Model;

class Employee_administration extends Model
{
    public $timestamps = false;
    protected $connection = 'mysqlhris';
    protected $table = "hris_administration";
    protected $primaryKey = "id";

    public function bank(){
        return $this->setConnection('mysql')->hasOne('\App\Models\Master\Bank','id','id_bank');
    }

    public function employee(){
        return $this->setConnection('mysql')->hasOne('\App\Models\Hris\Employee','employee_id','employee_id');
    }
}
