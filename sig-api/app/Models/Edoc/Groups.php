<?php
namespace App\Models\Edoc;
use Illuminate\Database\Eloquent\Model;

class Groups extends Model
{   
    protected $connection = 'mysqledoc';
    protected $table="groups";
    protected $primaryKey="id";

    public function Employee()
    {
        return $this->setConnection('mysql')->hasOne('\App\Models\Hris\Employee','user_id','id_user');
    }
}