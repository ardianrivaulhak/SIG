<?php
namespace App\Models\Master;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
class MemberTeam extends Model
{
    
    use SoftDeletes;
    protected $table="mstr_transaction_group";
    protected $primaryKey="id";
    protected $hidden =[
        'created_at',
        'deleted_at'
    ];

    public function group(){
        return $this->hasOne('App\Models\Master\Team','id','id_group');
    }

    public function employee(){
        return $this->hasOne('\App\Models\Hris\Employee','user_id','id_employee');
    }

}