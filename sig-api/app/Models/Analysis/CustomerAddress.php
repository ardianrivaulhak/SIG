<?php
namespace App\Models\Analysis;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CustomerAddress extends Model
{
    use SoftDeletes;
    protected $table="mstr_customers_address";

    protected $primaryKey="id_address";

    protected $hidden =[
        'insert_user',
        'update_user',
        'delete_user',
        'created_at',
        'updated_at',
        'deleted_at',
        'view_url',
        'delete_url'
    ];

    protected $appends = [
        'view_url',
        'delete_url'
    ];


    public function getDeleteUrlAttribute() {
        return route( 'address.delete', [ 'id' => $this->id_address ] );
    }

    public function getViewUrlAttribute() {
        return route( 'address.view', [ 'id' => $this->id_address ] );
    }

    public function getUpdateUrlAttribute() {
        return route( 'address.update', [ 'id' => $this->id_address ] );
    }

    public function customers(){
        return $this->hasOne('\App\Models\Analysis\Customer','id_customer','customer_id');
    }
}