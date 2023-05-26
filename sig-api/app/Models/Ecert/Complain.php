<?php

namespace App\Models\Ecert;

use Illuminate\Database\Eloquent\Model;

class Complain extends Model {

    protected $connection = 'mysqlcertificate';
    protected $table = "complains";
    protected $primaryKey = "id";
    
    
    // public function __construct(array $attributes = [])
    // {
    //     $this->table = 'mysqlcert.' . $this->table;
    //     parent::__construct();
    // }

    public function TransactionSample()
    {
        return $this->setConnection('mysql')->hasOne('\App\Models\Analysis\TransactionSample', 'id', 'id_transaction_sample');
    }

    public function transactionsampleCompact()
    {
        return $this->setConnection('mysql')->hasOne('\App\Models\Analysis\TransactionSample', 'id', 'id_transaction_sample')->select(
            'transaction_sample.id',
            'transaction_sample.sample_name',
            'transaction_sample.no_sample',
            'transaction_sample.id_contract',
            \DB::raw('(SELECT sub_catalogue_name FROM mstr_transaction_sub_catalogue WHERE id_sub_catalogue = transaction_sample.id_subcatalogue) as matriks')
        );
    }

    public function ComplainTech()
    {
        return $this->setConnection('mysqlcomplain')->hasMany('\App\Models\Complain\ComplainTechnical', 'id_complain', 'id');
    }

    public function ComplainNonTech()
    {
        return $this->setConnection('mysqlcomplain')->hasMany('\App\Models\Complain\Nontechnical', 'id_complain', 'id');
    }

    public function TransactionCertificate()
    {
        return $this->hasOne('\App\Models\Ecert\Ecertlhu', 'id', 'id_cert');
    }

    public function user(){
        return $this->setConnection('mysql')->hasOne('\App\Models\Hris\Employee','user_id','user_id');
    }

}

   
