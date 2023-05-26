<?php
namespace App\Http\Controllers\Printout;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request; 
use Firebase\JWT\JWT;
use Barryvdh\DomPDF\Facade as PDF;
use Carbon\Carbon as time;
use App\Models\Analysis\Kontrakuji;

class KontrakController extends Controller{

    public function pdf(Request $request,$id){
        $var = Kontrakuji::with([
            'contract_condition' => function($q){
                return $q->where('groups','CS');
            },
            'contract_condition.user.signature',
            'cust_address',
            'cust_tax_address',
            'contract_category',
            'customers_handle',
            'attachment',
            'akgTrans',
            'akgTrans.masterakg',
            'samplingTrans',
            'memo_finance',
            'samplingTrans.samplingmaster',
            'payment_condition',
            'payment_condition.voucher',
            'customers_handle.customers',
            'customers_handle.customers.countries',
            'customers_handle.contact_person',
            'user',
            'description',
            'penawaran',
            'transactionsample' => function($q){
                return $q->orderBy('id','ASC');
            },
            'transactionsample.statuspengujian',
            'transactionsample.transactionparameter',
            'transactionsample.transactionparameter.lab',
            'transactionsample.transactionparameter.metode',
            'transactionsample.transactionparameter.lod',
            'transactionsample.transactionparameter.unit',
            'transactionsample.transactionparameter.standart',
            'transactionsample.transactionparameter.parameteruji',
            'transactionsample.transactionparameter.parameteruji.parametertype',
            'transactionsample.images',
            'transactionsample.statuspengujian',
            'transactionsample.tujuanpengujian',
            'transactionsample.subcatalogue'
        ])
        ->whereHas('transactionsample',function($z){
            return $z->orderBy('id','ASC');
        })
        ->find($id);
        return response()->json($var);
    }


    public function editview(Request $request,$id){
        $var = Kontrakuji::with([
            'contract_condition' => function($q){
                return $q->where('groups','CS');
            },
            'contract_condition.user',
            'cust_address',
            'cust_tax_address',
            'contract_category',
            'customers_handle',
            'attachment',
            'akgTrans',
            'akgTrans.masterakg',
            'samplingTrans',
            'samplingTrans.samplingmaster',
            'payment_condition',
            'payment_condition.voucher',
            'customers_handle.customers',
            'customers_handle.contact_person',
            'user',
            'description',
            'transactionsample' => function($q){
                return $q->orderBy('id','ASC');
            },
            'transactionsample.nonpaket',
            'transactionsample.paketparameter',
            'transactionsample.paketpkm'
        ])
        ->whereHas('transactionsample',function($z){
            return $z->orderBy('id','ASC');
        })
        ->find($id);
        return response()->json($var);
    }

}