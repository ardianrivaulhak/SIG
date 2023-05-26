<?php
namespace App\Models\Master;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Tujuanpengujian extends Model
{
    
    use SoftDeletes;
    protected $table="mstr_transaction_tujuanpengujian";
    protected $primaryKey="id";
    protected $hidden =[
        'insert_user',
        'update_user',
        'delete_user',
        'created_at',
        'updated_at',
        'deleted_at'
    ];
}