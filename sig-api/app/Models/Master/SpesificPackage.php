<?php
namespace App\Models\Master;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SpesificPackage extends Model
{
    public $timestamps = false;
    use SoftDeletes;
    
    protected $table="mstr_specific_package";
    protected $primaryKey="id";
    protected $hidden =[
        'insert_user',
        'update_user',
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    public function subspecific(){
        return $this->hasMany('\App\Models\Master\SubSpecificPackage','mstr_specific_package_id','id');
    }
}