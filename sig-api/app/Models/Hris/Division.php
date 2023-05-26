<?php
namespace App\Models\Hris;
use Illuminate\Database\Eloquent\Model;

class Division extends Model
{
        protected $connection = 'mysqlhris';
        protected $table="hris_division";
        protected $primaryKey="id_div";
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
            return route( 'division.delete', [ 'id' => $this->id_div ] );
        }
        public function getViewUrlAttribute() {
            return route( 'division.view', [ 'id' => $this->id_div ] );
        }
        public function menu_auth(){
            return $this->hasMany('\App\Models\Master\Menu_auth','id_div','id_div');
        }

        public function dept(){
            return $this->hasOne('\App\Models\Hris\Departement','id','id_dept');
        }
}