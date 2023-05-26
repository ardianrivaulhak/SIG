<?php
namespace App\Models\Ecert;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RevEcertlhu extends Model
{
    protected $connection = 'mysqlcertificate';
    use SoftDeletes;
    protected $table="rev_transaction_sample_cert";
    protected $primaryKey="id";
    public $timestamps = false;
    protected $hidden =[
        'deleted_at',
    ];




   


}