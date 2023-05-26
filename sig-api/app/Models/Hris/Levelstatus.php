<?php
namespace App\Models\Hris;
use Illuminate\Database\Eloquent\Model;
class Levelstatus extends Model
{
    
    protected $connection = 'mysqlhris';
    protected $table="hris_level_status";
    protected $primaryKey="id";
    public $timestamps = false;

    public function level(){
        return $this->hasOne('\App\Models\Hris\Level','id_level','id_level');
    }
    
}