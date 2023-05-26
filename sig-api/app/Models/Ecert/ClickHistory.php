<?php
namespace App\Models\Ecert;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ClickHistory extends Model
{
    protected $connection = 'mysqlcertificate';
    use SoftDeletes;
    protected $table="clickhistory";
    protected $primaryKey="id";

}