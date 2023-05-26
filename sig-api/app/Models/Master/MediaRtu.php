<?php
namespace App\Models\Master;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MediaRtu extends Model
{
    
    protected $table="master_media_rtu";
    protected $primaryKey="id";
    public $timestamps = false;

}