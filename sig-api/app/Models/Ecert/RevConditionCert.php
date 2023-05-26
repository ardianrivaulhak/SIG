<?php
namespace App\Models\Ecert;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RevConditionCert extends Model
{
    protected $connection = 'mysqlcertificate';
    protected $table="rev_condition_sample_cert";
    protected $primaryKey="id";
    public $timestamps = false;
    protected $hidden =[
        'inserted_at',
    ];



}