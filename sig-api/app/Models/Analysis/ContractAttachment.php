<?php
namespace App\Models\Analysis;
use Illuminate\Database\Eloquent\Model;

class ContractAttachment extends Model
{
    //
    public $timestamps = false;

    protected $table="contract_attachment";
    protected $primaryKey="id_contract_attachment";
  
    public function kontrakuji(){
        return $this->hasOne('\App\Models\Analysis\Kontrakuji','id_kontrakuji','id_contract');
    }
    
}