<?php
namespace App\Models\Hris;
use Illuminate\Database\Eloquent\Model;
class StatusAttendance extends Model
{
    protected $connection = 'mysqlhris';
    protected $table="status_attendance";
    protected $primaryKey="id";
    
}