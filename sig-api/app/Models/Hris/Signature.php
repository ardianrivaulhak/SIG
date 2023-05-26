<?php
namespace App\Models\Hris;
use Illuminate\Database\Eloquent\Model;
class Signature extends Model
{

        protected $table="employee_signature";
        protected $primaryKey="id";
        public $timestamps = false;
        
    }