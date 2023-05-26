<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Log extends Model
{
    public $timestamps = false;
    protected $table="users_log";
    protected $primaryKey="id";

}