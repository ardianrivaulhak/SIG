<?php
namespace App\Models\Master;
use Illuminate\Database\Eloquent\Model;

class Provinces extends Model
{
    
    protected $table="provinces";
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