<?php
namespace App\Models\Master;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class TransactionTeam extends Model
{

    use SoftDeletes;
    protected $table="mstr_transaction_group";
    protected $primaryKey="id";
    protected $hidden =[
        'created_at',
        'deleted_at'
    ];

    public function user(){
        return $this->hasOne('\App\Models\Hris\Employee','employee_id','id_employee');
    }


}
