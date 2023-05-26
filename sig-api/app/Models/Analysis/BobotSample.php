<?php
namespace App\Models\Analysis;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BobotSample extends Model
{
    use SoftDeletes;

    protected $table="bobot_sample";

    protected $primaryKey="id";

    protected $hidden =[
        'created_at',
        'updated_at',
        'deleted_at',
    ];


    public function labname(){
        return $this->hasOne('\App\Models\Master\Lab','id','id_lab');
    }

}