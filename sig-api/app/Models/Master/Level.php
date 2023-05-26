<?php
namespace App\Models\Master;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Level extends Model
{
    //
    use SoftDeletes;
    protected $connection = 'mysqlhris';
    protected $table="hris_level";
    protected $primaryKey="id_level";
    protected $hidden =[
        'created_at',
        'updated_at',
        'deleted_at'
    ];
}