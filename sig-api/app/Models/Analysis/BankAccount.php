<?php
namespace App\Models\Analysis;
use Illuminate\Database\Eloquent\Model;

class BankAccount extends Model
{
    public $timestamps = false;
    protected $table="account_bank";
    protected $primaryKey="id";

}
