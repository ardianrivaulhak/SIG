<?php
namespace App\Models\Master;
use Illuminate\Database\Eloquent\Model;
// use Illuminate\Database\Eloquent\SoftDeletes;

class Menu extends Model
{
    
    // use SoftDeletes;
    protected $table="menu_apps";
    protected $primaryKey="id";
    // protected $hidden =[
    //     'insert_user',
    //     'update_user',
    //     'delete_user',
    //     'created_at',
    //     'updated_at',
    //     'deleted_at'
    // ];

    public function subagian(){
        return $this->hasMany('App\Models\Master\Subagian','id_bagian','id_div');
    }
}