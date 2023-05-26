<?php
namespace App\Models\Master;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Sampling extends Model
{
    
    use SoftDeletes;
    protected $table="mstr_transaction_sampling";
    protected $primaryKey="id";
    protected $hidden =[
        'insert_user',
        'update_user',
        'delete_user',
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    // public function subagian(){
    //     return $this->hasMany('App\Models\Master\Subagian','id_bagian','id_div');
    // }
    
    // public function menu_auth(){
    //     return $this->hasMany('\App\Models\Master\Menu_auth','id_div','id_div');
    // }
}