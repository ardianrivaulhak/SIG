<?php
namespace App\Models\Analysis;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Description extends Model
{

    protected $table="description_info";

    protected $primaryKey="id";
    public $timestamps = false;


    public function user(){
        return $this->hasOne('\App\Models\Hris\Employee','user_id','insert_user')
        ->selectRaw('user_id, nik, gender, photo, id_bagian, id_sub_bagian, employee_name');
    }
}