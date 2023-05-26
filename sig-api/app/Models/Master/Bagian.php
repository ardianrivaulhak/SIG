<?php

namespace App\Models\Master;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Bagian extends Model
{

    use SoftDeletes;
    protected $connection = 'mysqlhris';
    protected $table = "hris_division";
    protected $primaryKey = "id_div";
    protected $hidden = [
        'insert_user',
        'update_user',
        'delete_user',
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    public function subagian()
    {
        return $this->hasMany('App\Models\Master\Subagian', 'id_bagian', 'id_div');
    }

    public function menu_auth()
    {
        return $this->hasMany('\App\Models\Master\Menu_auth', 'id_div', 'id_div');
    }
}
