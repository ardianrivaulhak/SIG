<?php
namespace App\Models\Ecert;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AutoSend extends Model
{
    // update
    protected $connection = 'mysqlcertificate';
    use SoftDeletes;
    protected $table="auto_send";
    protected $primaryKey="id";

    public function certificate()
    {
        return $this->hasOne('\App\Models\Ecert\Ecertlhu', 'id','id_certificate');
    }

    public function contract()
    {
        return $this->setConnection('mysql')->hasOne('\App\Models\Analysis\Kontrakuji','id_kontrakuji','id_contract')->select('id_kontrakuji', 'id_customers_handle', 'contract_no', 'hold');
    }


}
