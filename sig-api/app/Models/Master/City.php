<?php
namespace App\Models\Master;
use Illuminate\Database\Eloquent\Model;
class City extends Model
{
    protected $table="city";
    protected $primaryKey="id_city";
    protected $hidden =[
        'view_url',
        'delete_url',
        'created_at',
        'updated_at'
    ];
    protected $appends = [
        'view_url',
        'delete_url'
    ];
    public function getDeleteUrlAttribute() {
        return route( 'city.delete', [ 'id' => $this->id_city ] );
    }
    public function getViewUrlAttribute() {
        return route( 'city.view', [ 'id' => $this->id_city ] );
    }
}