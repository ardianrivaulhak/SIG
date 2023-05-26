<?php
namespace App\Models\Master;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Position extends Model
{
    //
    use SoftDeletes;
    protected $table="hris_position";
    protected $primaryKey="id_position";
    protected $hidden =[
        'created_at',
        'updated_at',
        'deleted_at'
    ];
}