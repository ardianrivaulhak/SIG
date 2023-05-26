<?php
namespace App\Models\Master;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Group extends Model
{

    use SoftDeletes;
    protected $table="mstr_group";
    protected $primaryKey="id";
    protected $hidden =[
        'created_at',
        'deleted_at'
    ];


    public function detailgroup(){
        return $this->hasMany('App\Models\Master\Detailgroup','id_group','id');
    }

    public function pic(){
        return $this->hasOne('\App\Models\Hris\Employee','employee_id','pic');
    }

    public function subdiv(){
        return $this->hasOne('\App\Models\Hris\Subdivision','id_subagian','id_sub_div');
    }

    public function tsteam(){
        return $this->hasMany('\App\Models\Master\TransactionTeam','id_group','id');
    }

}
