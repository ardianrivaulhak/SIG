<?php
namespace App\Models\Edoc;
use Illuminate\Database\Eloquent\Model;

class AttachmentDocuments extends Model
{   
    protected $connection = 'mysqledoc';
    protected $table="attachment";
    protected $primaryKey="id";

    
    public function documents()
    {
        return $this->hasOne('\App\Models\Edoc\Documents', 'id','id_document');
    }

    public function inheritance_document()
    {
        return $this->hasOne('\App\Models\Edoc\DocumentInheritances', 'id','id_document_inheritance');
    }

}