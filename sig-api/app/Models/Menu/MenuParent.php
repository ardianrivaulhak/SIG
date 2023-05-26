<?php
namespace App\Models\Menu;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MenuParent extends Model
{
    
    protected $table="menu_apps";
    protected $primaryKey="id";


    public function menuchild(){
        return $this->hasMany('\App\Models\Menu\MenuChild','id_menu_parent','id')
        ->select(
            'id',
            'menu_id',
            'title',
            'url',
            'icon',
            'type',
            'id_menu_parent',
            'id_parent',
            \DB::raw('IF(position is NULL,99999,position) as position')
        )
        ->orderBy('position','ASC');
    }

}