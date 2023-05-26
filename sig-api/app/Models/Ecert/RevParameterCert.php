<?php
namespace App\Models\Ecert;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RevParameterCert extends Model
{
    protected $connection = 'mysqlcertificate';
    use SoftDeletes;
    protected $table="rev_transaction_parameter_cert";
    protected $primaryKey="id";
    public $timestamps = false;
    protected $hidden =[
        'deleted_at',
    ];

  


}