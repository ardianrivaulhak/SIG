<?php
namespace App\Models\Master;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Team extends Model
{

    use SoftDeletes;
    protected $table="mstr_group";
    protected $primaryKey="id";
    protected $hidden =[
        'created_at',
        'deleted_at'
    ];

    public function subagian(){
        return $this->hasOne('App\Models\Master\Subagian','id_subagian','id_sub_div');
    }

    public function pic(){
        return $this->hasOne('\App\Models\Hris\Employee','user_id','pic');
    }

    public function tsteam(){
        return $this->hasOne('\App\Models\Master\TransactionTeam','id','id_group');
    }

}
