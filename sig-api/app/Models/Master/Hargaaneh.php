<?php
namespace App\Models\Master;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Hargaaneh extends Model
{
    //
    public $timestamps = false;
    protected $table="harga_aneh";
    protected $primaryKey="id";

}