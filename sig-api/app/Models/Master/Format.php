<?php
namespace App\Models\Master;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Format extends Model
{
    
    use SoftDeletes;
    protected $connection = 'mysqlcertificate';
    protected $table="cert_format";
    protected $primaryKey="id";
    protected $hidden =[
        'created_at',
        'updated_at',
        'deleted_at'
    ];

}