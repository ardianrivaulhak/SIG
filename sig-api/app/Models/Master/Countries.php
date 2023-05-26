<?php
namespace App\Models\Master;
use Illuminate\Database\Eloquent\Model;

class Countries extends Model
{
    
    public $timestamps = false;
    protected $table="countries";
    protected $primaryKey="id";

}