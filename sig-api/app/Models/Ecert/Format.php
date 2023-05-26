<?php
namespace App\Models\Ecert;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Format extends Model
{
    protected $connection = 'mysqlcertificate';
    use SoftDeletes;
    protected $table="cert_format";
    protected $primaryKey="id";
    public $timestamps = false;
    protected $hidden =[
        'deleted_at',
    ];


}