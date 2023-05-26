<?php
namespace App\Models\Hris;
use Illuminate\Database\Eloquent\Model;
class StatusActive extends Model
{
    
    protected $connection = 'mysqlhris';
    protected $table="hris_status_active";
    protected $primaryKey="id";

}