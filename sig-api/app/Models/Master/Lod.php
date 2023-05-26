<?php
namespace App\Models\Master;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Lod extends Model
{
    //
    use SoftDeletes;

    protected $table="mstr_laboratories_lod";
    protected $primaryKey="id";
    protected $hidden =[
        'insert_user',
        'update_user',
        'created_at',
        'updated_at',
        'deleted_at'
    ];
}