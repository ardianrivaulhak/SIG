<?php
namespace App\Models\Master;
use Illuminate\Database\Eloquent\Model;

class Mou extends Model
{
    //

    public $timestamps = false;
    protected $table="cust_mou_header";
    protected $primaryKey="id_cust_mou_header";
    protected $hidden =[
        'insert_user',
        'update_user',
        'created_at',
        'updated_at',
        'deleted_at'
    ];


    public function customer(){
        return $this->hasOne('\App\Models\Analysis\Customer','id_customer','id_customer');
    }

    public function employee(){
        return $this->hasOne('\App\Models\Hris\Employee','user_id','user_id')->select('employee_id','user_id','employee_name','photo');
    }

    public function detail(){
        return $this->hasMany('\App\Models\Master\MouDetail','id_cust_mou_header','id_cust_mou_header');
    }

    public function attachment(){
        return $this->hasMany('\App\Models\Master\AttachmentMou','id_cust_mou_header','id_cust_mou_header');
    }

}