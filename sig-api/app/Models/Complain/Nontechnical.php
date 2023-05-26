<?php
namespace App\Models\Complain;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Nontechnical extends Model
{
    protected $connection = 'mysqlcomplain';
    use SoftDeletes;
    protected $table="complain_nontechnical";
    protected $primaryKey="id";
    protected $hidden =[
        'deleted_at',
    ];

    public function division()
    {
        return $this->setConnection('mysql')->hasOne('\App\Models\Master\Bagian','id_div','id_division');
    }

    public function complain_data()
    {
        return $this->hasOne('\App\Models\Ecert\Complain','id','id_complain');
    }

    public function penerima_complain()
    {
        return $this->setConnection('mysql')->hasOne('\App\Models\Hris\Employee','user_id','id_user');
    }

    public function user_fu()
    {
        return $this->setConnection('mysql')->hasOne('\App\Models\Hris\Employee','user_id','user_fu');
    }




}