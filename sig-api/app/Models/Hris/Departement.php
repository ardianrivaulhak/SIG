<?php
namespace App\Models\Hris;
use Illuminate\Database\Eloquent\Model;

class Departement extends Model
{
        protected $connection = 'mysqlhris';
        public $timestamps = false;
        protected $table="hris_departement";
        protected $primaryKey="id";

}