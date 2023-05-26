<?php
namespace App\Models\Edoc;
use Illuminate\Database\Eloquent\Model;

class TransactionGroups extends Model
{   
    protected $connection = 'mysqledoc';
    protected $table="transaction_groups";
    protected $primaryKey="id";

    public function Group()
    {
        return $this->hasOne('\App\Models\Edoc\Groups', 'id', 'id_group');
    }

    public function Employee()
    {
        return $this->setConnection('mysql')->hasOne('\App\Models\Hris\Employee','employee_id','id_user');
    }

    public function EmployeeCreate()
    {
        return $this->setConnection('mysql')->hasOne('\App\Models\Hris\Employee','user_id','user_create');
    }

    // public function Created()
    // {
    //     return $this->setConnection('mysql')->hasOne('\App\Models\Hris\Employee','user_id','user_create');
    // }
}