<?php
namespace App\Models\Edoc;
use Illuminate\Database\Eloquent\Model;

class Masterdocuments extends Model
{   
    protected $connection = 'mysqledoc';
    protected $table="master_document";
    protected $primaryKey="id";

  
}