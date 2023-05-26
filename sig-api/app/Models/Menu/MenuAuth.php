<?php
namespace App\Models\Menu;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MenuAuth extends Model
{
    public $timestamps = false;
    protected $table="menu_auth";
    protected $primaryKey="id";


    public function menuchild(){
        return $this->hasOne('\App\Models\Menu\MenuChild','id','menu_id');
    }

}
