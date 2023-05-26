<?php
namespace App\Models\Ecert;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CustomerCert extends Model
{
    protected $connection = 'mysqlcertificate';
    protected $table="customer_cert_data";
    protected $primaryKey="id";
    public $timestamps = false;
    protected $hidden =[
        'inserted_at',
    ];


}