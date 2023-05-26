<?php
namespace App\Models\Products\Dioxine;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DioxineUdara extends Model
{
    
    use SoftDeletes;
    protected $table="master_dioxin";
    protected $primaryKey="id";

}