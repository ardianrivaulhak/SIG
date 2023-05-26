<?php
namespace App\Models\Master;
use Illuminate\Database\Eloquent\Model;
class ParameterUji extends Model
{
    //
    protected $table="mstr_laboratories_parameteruji";
    protected $primaryKey="id";
    protected $hidden =[
        'insert_user',
        'update_user',
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    public function lab(){
        return $this->hasOne('\App\Models\Master\Lab','id','mstr_laboratories_laboratory_id');
    }
    
    public function parametertype(){
        return $this->hasOne('\App\Models\Master\ParameterType','id','mstr_laboratories_parametertype_id');
    }

    public function parameterinfo(){
        return $this->belongsTo('\App\Models\Master\ParameterujiInfo','id','id_parameteruji');
    }
  
    public function parameterprice(){
        return $this->hasMany('\App\Models\Master\ParameterPrice','parameteruji_id','id');
    }

    public function analystgroup(){
        return $this->hasOne('\App\Models\Master\Group','id','id_analystgroup');
    }

    
}