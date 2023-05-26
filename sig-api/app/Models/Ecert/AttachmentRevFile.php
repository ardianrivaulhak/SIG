<?php
namespace App\Models\Ecert;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AttachmentRevFile extends Model
{
    protected $connection = 'mysqlcertificate';
    use SoftDeletes;
    protected $table="attachment_rev";
    protected $primaryKey="id";
    public $timestamps = false;
    protected $hidden =[
        'deleted_at',
    ];


}