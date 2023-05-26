<?php
namespace App\Models\Master;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
class Standart extends Model
{
    //
    use SoftDeletes;
    protected $table="mstr_laboratories_standart";
    protected $primaryKey="id";
    protected $hidden =[
        'insert_user',
        'update_user',
        'created_at',
        'updated_at',
        'deleted_at'
    ];
}