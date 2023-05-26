<?php
namespace App\Models\Hris;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class Pengujian extends Model{
    
    protected $table="hris_pengujian";
    protected $primaryKey="id_pengujian";
    protected $hidden =[
        'created_at',
        'updated_at',
    ];
    protected $appends = [
        'view_url',
        'delete_url'
    ];
    public function getDeleteUrlAttribute() {
        return route( 'pengujian.delete', [ 'id' => $this->id_pengujian ] );
    }
    public function getViewUrlAttribute() {
        return route( 'pengujian.view', [ 'id' => $this->id_pengujian ] );
    }
}