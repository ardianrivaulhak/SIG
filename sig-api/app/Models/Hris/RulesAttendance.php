<?php
namespace App\Models\Hris;
use Illuminate\Database\Eloquent\Model;

class RulesAttendance extends Model
{
        protected $connection = 'mysqlhris';

        public $timestamps = false;
        protected $table="rules_hour_attendance";
        protected $primaryKey="id";

    
}