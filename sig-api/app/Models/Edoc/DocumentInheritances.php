<?php
namespace App\Models\Edoc;
use Illuminate\Database\Eloquent\Model;

class DocumentInheritances extends Model
{   
    protected $connection = 'mysqledoc';
    protected $table="document_inheritances";
    protected $primaryKey="id";

  
}