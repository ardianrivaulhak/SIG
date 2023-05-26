<?php
namespace App\Models\Master;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
class ContractCategory extends Model
{
    //
    use SoftDeletes;
    protected $table="mstr_products_contactcategory";
    protected $primaryKey="id";
    protected $hidden =[
        'insert_user',
        'update_user',
        'created_at',
        'updated_at',
        'deleted_at'
    ];
}