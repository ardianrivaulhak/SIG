<?php
namespace App\Models\Hris;
use Illuminate\Database\Eloquent\Model;

class TimetableFor extends Model
{
        protected $connection = 'mysqlhris';
        public $timestamps = false;
        protected $table="hris_timetable_for";
        protected $primaryKey="id";

}