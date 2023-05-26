<?php
namespace App\Models\Analysis;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CustomerTaxAddress extends Model
{
    use SoftDeletes;
    
    protected $table="mstr_customers_taxaddress";

    protected $primaryKey="id_taxaddress";

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
        return route( 'taxaddress.delete', [ 'id' => $this->id_taxaddress ] );
    }

    public function getViewUrlAttribute() {
        return route( 'taxaddress.view', [ 'id' => $this->id_taxaddress ] );
    }

    public function getUpdateUrlAttribute() {
        return route( 'taxaddress.update', [ 'id' => $this->id_taxaddress ] );
    }
    
    public function customers(){
        return $this->hasOne('\App\Models\Analysis\Customer','id_customer','customer_id');
    }
}