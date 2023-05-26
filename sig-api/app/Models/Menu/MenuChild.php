<?php
namespace App\Models\Menu;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MenuChild extends Model
{
    
    protected $table="menu_master";
    protected $primaryKey="id";


    public function menuparent(){
        return $this->hasOne('\App\Models\Menu\MenuParent','id','id_menu_parent');
    }
}