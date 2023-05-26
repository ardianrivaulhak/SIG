<?php
namespace App\Models\Master;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Paketuji extends Model
{
    //
    use SoftDeletes;

    protected $table="mstr_products_paketuji";
    protected $primaryKey="id";
    protected $hidden =[
        'insert_user',
        'update_user',
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    public function paketparameter(){
        return $this->hasMany('\App\Models\Master\PaketParameter','id_paketuji','id')->orderBy('id_parameter_uji');
    }
}