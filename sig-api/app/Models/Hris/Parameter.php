<?php
namespace App\Models\Hris;
use Illuminate\Database\Eloquent\Model;
class Parameter extends Model
{
    protected $table="hris_parameter";
    protected $primaryKey="id_parameter";
    protected $hidden =[
        'created_at',
        'updated_at',
        'deleted_at'
    ];
    protected $appends = [
        'view_url',
        'delete_url'
    ];
    public function getDeleteUrlAttribute() {
        return route( 'parameter.delete', [ 'id' => $this->id_parameter ] );
    }
    public function getViewUrlAttribute() {
        return route( 'parameter.view', [ 'id' => $this->id_parameter ] );
    }
}