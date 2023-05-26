<?php
namespace App\Models\Hris;
use Illuminate\Database\Eloquent\Model;
class Position extends Model
{
        protected $connection = 'mysqlhris';
        protected $table="hris_position";
    protected $primaryKey="id_position";
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
        return route( 'position.delete', [ 'id' => $this->id_position ] );
    }
    public function getViewUrlAttribute() {
        return route( 'position.view', [ 'id' => $this->id_position ] );
    }
}