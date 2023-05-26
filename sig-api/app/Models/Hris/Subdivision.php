<?php
namespace App\Models\Hris;
use Illuminate\Database\Eloquent\Model;

class Subdivision extends Model
{
        protected $connection = 'mysqlhris';

        protected $table="hris_sub_division";
        protected $primaryKey="id_subagian";
        protected $hidden =[
            'created_at',
            'updated_at',
            'deleted_at'
        ];

        public function division(){
            return $this->hasOne('App\Models\Hris\Division','id_div','id_div');
        }
}