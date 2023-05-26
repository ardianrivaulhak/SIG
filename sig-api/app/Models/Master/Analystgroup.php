<?php
namespace App\Models\Master;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Analystgroup extends Model
{
    
    use SoftDeletes;
    protected $table="mstr_analyst_group";
    protected $primaryKey="id";
    protected $hidden =[
        'insert_user',
        'update_user',
        'delete_user',
        'created_at',
        'updated_at',
    ];


    public function user(){
        return $this->hasMany('\App\Models\Hris\Employee','user_id','user_id')->selectRaw('user_id,nik,employee_name,photo,phone');
    }

    public function pic(){
        return $this->hasOne('\App\Models\Hris\Employee','user_id','user_id')->selectRaw('user_id,nik,employee_name,photo,phone');
    }

    // public function subagian(){
    //     return $this->hasMany('App\Models\Master\Subagian','id_bagian','id_div');
    // }
    
    // public function menu_auth(){
    //     return $this->hasMany('\App\Models\Master\Menu_auth','id_div','id_div');
    // }
}