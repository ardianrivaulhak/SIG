<?php
namespace App\Models\Hris;
use Illuminate\Database\Eloquent\Model;
class SisterCompany extends Model
{

        protected $connection = 'mysqlhris';
        protected $table="hris_sister_company";
        protected $primaryKey="id";
        
        
}