<?php
namespace App\Models\Hris;
use Illuminate\Database\Eloquent\Model;
class Dayoff extends Model
{

        protected $connection = 'mysqlhris';
        public $timestamps = false;
        protected $table="hris_dayoff";
        protected $primaryKey="id";

    
}


