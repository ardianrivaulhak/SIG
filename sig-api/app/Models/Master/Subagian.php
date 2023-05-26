<?php

namespace App\Models\Master;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Subagian extends Model
{

    use SoftDeletes;

    protected $connection = 'mysqlhris';
    protected $table = "hris_sub_division";
    protected $primaryKey = "id_subagian";
    protected $hidden = [
        'insert_user',
        'update_user',
        'delete_user',
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    public function bagian()
    {
        return $this->hasOne('\App\Models\Master\Bagian', 'id_div', 'id_bagian');
    }
}
