<?php
namespace App\Models\Edoc;
use Illuminate\Database\Eloquent\Model;

class Documents extends Model
{   
    protected $connection = 'mysqledoc';
    protected $table="documents";
    protected $primaryKey="id";


    public function MasterDocument()
    {
        return $this->hasOne('\App\Models\Edoc\Masterdocuments','id','type');
    }

    public function Document_inheritance()
    {
        return $this->hasOne('\App\Models\Edoc\DocumentInheritances','id_documents','id');
    }

    public function Attachment()
    {
        return $this->hasMany('\App\Models\Edoc\AttachmentDocuments','id_document','id');
    }

    public function Employee()
    {
        return $this->setConnection('mysql')->hasOne('\App\Models\Hris\Employee','user_id','user_id');
    }

  
}