<?php
namespace App\Models\Master;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Subcatalogue extends Model
{
    //
    use SoftDeletes;
    protected $table="mstr_transaction_sub_catalogue";
    protected $primaryKey="id_sub_catalogue";
    protected $hidden =[
        'insert_user',
        'update_user',
        'delete_user',
        'created_at',
        'updated_at',
        'deleted_at'
    ];


    public function catalogue(){
        return $this->hasOne('\App\Models\Master\Catalogue','id_catalogue','id_catalogue');
    }
}