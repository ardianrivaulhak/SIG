<?php
namespace App\Models\Master;
use Illuminate\Database\Eloquent\Model;

class Regencies extends Model
{
    
    protected $table="regencies";
    protected $primaryKey="id";
    protected $hidden =[
        'view_url',
        'delete_url',
        'created_at',
        'updated_at'
    ];
    protected $appends = [
        'view_url',
        'delete_url'
    ];

 
}