<?php
namespace App\Models\Edoc;
use Illuminate\Database\Eloquent\Model;

class DocumentAccess extends Model
{   
    protected $connection = 'mysqledoc';
    protected $table="document_access";
    protected $primaryKey="id";

    public function documents()
    {
        return $this->hasOne('\App\Models\Edoc\Documents','id','id_document');
    }

    public function employee()
    {
        return $this->setConnection('mysql')->hasOne('\App\Models\Hris\Employee','employee_id','id_user');
    }

  
}