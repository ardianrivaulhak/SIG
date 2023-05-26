<?php
namespace App\Models\Analysis;
use Illuminate\Database\Eloquent\Model;
class Transaction_sampling_contract extends Model
{
    protected $table="transaction_sampling_contract";
    protected $primaryKey="id";
    // protected $hidden =[
    //     'insert_user',
    //     'update_user',
    //     'delete_user',
    //     'created_at',
    //     'updated_at',
    //     'deleted_at'
    // ];
}