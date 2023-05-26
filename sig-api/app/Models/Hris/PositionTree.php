<?php
namespace App\Models\Hris;
use Illuminate\Database\Eloquent\Model;
class PositionTree extends Model

{
        protected $connection = 'mysqlhris';
        protected $table="hris_position_update";
        protected $primaryKey="id_position";


        public function position_head(){
           return $this->hasOne('App\Models\Hris\PositionTree','id_position','head_position')->select('id_position','position_name');
        }

        public function division(){
                return $this->hasOne('App\Models\Hris\Division','id_div','id_div')->select('id_div','division_name');
             }
             public function subdiv(){
               return $this->hasOne('App\Models\Hris\Subdivision','id_subagian','id_subdiv');
            }
}