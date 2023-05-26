<?php
namespace App\Models\Analysis;
use Illuminate\Database\Eloquent\Model;
// use Illuminate\Database\Eloquent\SoftDeletes;

class ContactPerson extends Model
{
    // use SoftDeletes;

    protected $table="mstr_customers_contactperson";
    public $timestamps = false;
    protected $primaryKey="id_cp";

    protected $hidden =[
        'created_at',
        'updated_at',
        'deleted_at',
        'view_url',
        'delete_url',
        'inserted_user',
        'updated_user',
        'deleted_user'
    ];

    protected $appends = [
        'view_url',
        'delete_url'
    ];

    public function customers(){
        return $this->hasOne('App\Models\Analysis\Customer','id_customer','id_cust');
    }

    public function getDeleteUrlAttribute() {
        return route( 'contactperson.delete', [ 'id' => $this->id_cp ] );
    }
    
    public function getViewUrlAttribute() {
        return route( 'contactperson.view', [ 'id' => $this->id_cp ] );
    }

    public function getUpdateUrlAttribute() {
        return route( 'contactperson.update', [ 'id' => $this->id_cp ] );
    }
}