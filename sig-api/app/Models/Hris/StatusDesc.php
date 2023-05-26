<?php
namespace App\Models\Hris;
use Illuminate\Database\Eloquent\Model;
class StatusDesc extends Model
{
    
    protected $connection = 'mysqlhris';
    protected $table="hris_status_desc";
    protected $primaryKey="id_status_desc";

}