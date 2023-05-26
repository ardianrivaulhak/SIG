<?php
namespace App\Models\Edoc;
use Illuminate\Database\Eloquent\Model;

class DocumentViewers extends Model
{   
    protected $connection = 'mysqledoc';
    protected $table="document_viewers";
    protected $primaryKey="id";


    public function Documents()
    {
        return $this->hasOne('\App\Models\Edoc\Documents','id','id_document');
    }

    public function Document_inheritance()
    {
        return $this->hasOne('\App\Models\Edoc\DocumentInheritances','id','id_documents_inheritance');
    }

    public function Employee()
    {
        return $this->setConnection('mysql')->hasOne('\App\Models\Hris\Employee','user_id','id_user');
    }

  
}