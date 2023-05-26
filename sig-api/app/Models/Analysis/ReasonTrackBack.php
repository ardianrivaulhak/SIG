<?php
namespace App\Models\Analysis;
use Illuminate\Database\Eloquent\Model;

class ReasonTrackBack extends Model
{

    protected $table="reason_track_back";

    protected $primaryKey="id";


    public function user(){
        return $this->hasOne('\App\Models\Hris\Employee','user_id','id_user')
        ->selectRaw('user_id, nik, gender, photo, id_bagian, id_sub_bagian, employee_name');
    }
}