<?php
namespace App\Models\Analysis;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Invoice extends Model
{
    public $timestamps = false;
    // use SoftDeletes;
    protected $table="invoice";
    protected $primaryKey="id";
    // protected $hidden =[
    //     'deleted_at'
    // ];

    public function contracUji(){
        return $this->hasOne('\App\Models\Analysis\Kontrakuji', 'id_kontrakuji', 'id_kontrakuji'); 
    }

    
}