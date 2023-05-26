<?php
namespace App\Models\Master;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Catalogue extends Model
{
    //
    use SoftDeletes;
    protected $table="mstr_transaction_catalogue";
    protected $primaryKey="id_catalogue";
    protected $hidden =[
        'insert_user',
        'update_user',
        'delete_user',
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    public function subcatalogue(){
        return $this->hasMany('App\Models\Master\Subcatalogue','id_catalogue','id_catalogue');
    }
}