<?php
namespace App\Http\Controllers\Analysis;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Analysis\Customer;
use App\Models\Master\Bank;
use App\Models\Analysis\BobotSample;
use App\Models\Analysis\PaymentInvoice;
use App\Models\Analysis\Kontrakuji;
use App\Models\Analysis\TransactionSample;
use App\Models\Analysis\ConditionContractNew;
use App\Models\Analysis\ConditionInvoice;
use App\Models\Analysis\InvoiceDetail;
use App\Models\Analysis\PaymentData;
use App\Models\Analysis\InvoiceHeader;
use App\Models\Analysis\Customerhandle;
use App\Models\Analysis\ContactPerson;
use App\Models\Analysis\CustomerAddress;
use App\Models\Analysis\BankAccount;
use App\Models\Analysis\Transaction_akg_contract;
use App\Models\Analysis\Transaction_sampling_contract;
use App\Models\Analysis\PaymentCondition;
use App\Models\Hris\Employee;
use Firebase\JWT\JWT;
use App\Models\Analysis\Description;
use DB;
use Auth;
use Carbon\Carbon as time;

class FinanceController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
    */

    public function index(Request $request){
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');            

            $model = InvoiceHeader::with([
                'invoice_detail',
                'invoice_detail.kontrakuji_light',
                'cust_address',
                'cust_tax_address',
                'customer',
                'contactperson',
                'invoice_condition',
                'invoice_user.user'])
                ->selectRaw('id, 
                    no_invoice, 
                    tgl_faktur, 
                    tgl_jatuhtempo, 
                    idcust, 
                    idcp, 
                    printed, 
                    edited, 
                    split, 
                    format ');

            if(!empty($data['invoice_number'])){
                $model=$model->where(\DB::raw('UPPER(no_invoice)'),'like','%'.strtoupper($data['invoice_number']).'%');
            }
            
            if(!empty($data['po_number'])){
                $model=$model->where(\DB::raw('UPPER(no_po)'),'like','%'.strtoupper($data['po_number']).'%');
            }
            
            if(!empty($data['invoice_date'])){
                $model=$model->where('tgl_faktur','like','%'.date('Y-m-d',strtotime($data['invoice_date'])).'%');
            }
            if(!empty($data['customers'])){
                $model=$model->where('idcust',$data['customers']);
            }

            if(!empty($data['users'])){
                $users = ConditionInvoice::where('user_id', $data['users'])
                ->whereYear('inserted_at', '>=', 2022)
                ->groupBy('id_invoice_header')
                ->get()->toArray();
    
                $arrayUsers = array_map(function ($users) {
                    return $users['id_invoice_header'];
                }, $users);


                $model=$model->whereIn('id', ($arrayUsers));
            }

            $model = $model
            ->orderby('id', 'DESC')
            ->paginate(50);

            return response()->json($model);


        } catch(\Exception $e){
            return response()->json($e->getMessage());
        }
    }

    public function userFinance()
    {
        $model = Employee::where('id_bagian', 2)->get();
        return response()->json($model);
    }

    public function edit_invoice(Request $request){
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            $inv = InvoiceHeader::find($data['id_invoice']);
            $inv->tgl_faktur =  date('Y-m-d',strtotime($data['tgl_faktur']));
            $inv->tgl_jatuhtempo = date('Y-m-d',strtotime($data['tgl_jatuhtempo']));
            $inv->tgl_berita_acara =  date('Y-m-d',strtotime($data['tgl_berita_acara']));
            $inv->description = $data['other_ref'];
            $inv->termin = $data['termin'];
            $inv->idcust = $data['id_cust'];
            $inv->idcp = $data['cust_penghubung'];
            $inv->no_rekening = $data['no_rekening'];
            $inv->id_cust_address = $data['cust_addres'];
            $inv->id_cust_taxaddress = $data['alamat_pjk'];
            $inv->no_invoice = $data['no_invoice'];
            $inv->no_faktur = $data['no_faktur'];
            $inv->no_po = $data['no_po'];
            $inv->save();


            $c = InvoiceDetail::where('id_inv_header',$data['id_invoice'])->get();

            foreach ($c as $g) {
                $deleteinvoicedetail = InvoiceDetail::find($g->id)->Delete();
            }

            foreach($data['idsample'] as $idsample => $value){
                $invoice = new InvoiceDetail;
                $invoice->id_sample = $value;
                $invoice->id_inv_header = $inv->id;
                 $invoice->save();

            }

            foreach($c as $o){
                $kontrak = Kontrakuji::where('id_kontrakuji', $o->id_contract)->first();
                $kontrak->status_inv = NULL;
                $kontrak->save();
            }

            $xxx = array(
                'status' => true,
                'message' => 'success'
            );

            return response()->json($xxx);

        } catch(\Exception $e){
            return response()->json($e->getMessage());
        }
    }

    public function editInvoiceWithDiscount(Request $request){
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');
            $sampleInvoice = array();
            $sampleSelect = array();

            $inv = InvoiceHeader::find($data['id']);
            $inv->tgl_faktur =  date('Y-m-d',strtotime($data['tgl_faktur']));
            $inv->tgl_jatuhtempo = date('Y-m-d',strtotime($data['tgl_jatuh_tempo']));
            $inv->tgl_berita_acara =  date('Y-m-d',strtotime($data['tgl_berita_acara']));
            $inv->description = $data['other_ref'];
            $inv->termin = $data['termin'];
            $inv->idcust = $data['id_cust'];
            $inv->idcp = $data['cust_penghubung'];
            $inv->no_rekening = $data['no_rekening'];
            $inv->id_cust_address = $data['cust_addres'];
            $inv->format = $data['format'];
            $inv->no_invoice = $data['no_invoice'];
            $inv->no_faktur = $data['no_faktur'];
            $inv->no_po = $data['no_po'];
            $inv->split = $data['split'] == true ? 1 : 0;
            $inv->save();

            $c = InvoiceDetail::where('id_inv_header',$data['id'])->get();  

            foreach ($c as $g) {
                $kontrak = Kontrakuji::where('id_kontrakuji', $g->id_contract)->first();
                $kontrak->status_inv = NULL;
                $kontrak->save();

                array_push($sampleInvoice, $g->id_sample);
            }
           
            foreach($data['idsample'] as $idsample){
                $ts = TransactionSample::where('id', $idsample['id'])->first();
                $ts->discount = $idsample['discount'];
                $ts->save();

                array_push($sampleSelect, $idsample['id']);
            }

            foreach ($sampleInvoice as $s) {
                if (!in_array($s, $sampleSelect)){
                    InvoiceDetail::where('id_inv_header', $data['id'])->where('id_sample', $s)->delete();
                }
            }

            foreach ($sampleSelect as $ss) {
                $kon = InvoiceDetail::where('id_inv_header',$data['id'])->first();

                if (!in_array($ss, $sampleInvoice)){
                    $invdet = New InvoiceDetail;
                    $invdet->id_contract = $kon->id_contract ;
                    $invdet->id_inv_header = $data['id'];
                    $invdet->id_sample = $ss ;
                    $invdet->save();
                }
            }
            // foreach($data['idsample'] as $idsample){
            //     if($g->id_sample != $idsample['id']){
            //         $deleteinvoicedetail = InvoiceDetail::where('id_sample', $g->id_sample)
            //         ->first();

            //         return [$g->id_sample, $idsample['id']];
            //     }
            // }            
            // foreach($data['idsample'] as $idsample){

                

                
            //     $invoice = new InvoiceDetail;
            //     $invoice->id_sample = $idsample['id'];
            //     $invoice->id_inv_header = $inv->id;
            //     $invoice->save();

            //     $ts = TransactionSample::where('id', $idsample['id'])->first();
            //     $ts->discount = $idsample['discount'];
            //     $ts->save();
            // }

            // foreach($c as $o){
            //     $kontrak = Kontrakuji::where('id_kontrakuji', $o->id_contract)->first();
            //     $kontrak->status_inv = NULL;
            //     $kontrak->save();

            //     // $payment = PaymentCondition::where('id_contract',  $o->id_contract)->first();
            //     // $payment->ppn = $data['ppn'];
            //     // $payment->discount_lepas = 0;
            //     // $payment->save();
            // }

            $message = array(
                'status' => true,
                'message' => 'message'
            );

            return response()->json($message);

        } catch(\Exception $e){
            return response()->json($e->getMessage());
        }
    }


    public function excelexport(Request $request){
        //try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;

            $m = ConditionContractNew::where('groups', 'LAB')
            ->where('position', 4)
            ->where('parameter_id', '==', 0)
            ->where('status', 1)
            ->where('inserted_at', 'LIKE', '%'. $request->input('tgljatuhtempo') .'%')
            ->groupBy('contract_id')
            ->get();

            $array = array();

            foreach($m as $b){
                $bb = ConditionContractNew::where('id_condition_contract', $b->id_condition_contract)->first();
                array_push($array, $bb->contract_id);
            }

            $model = Kontrakuji::whereIn('id_kontrakuji', $array)->get();
            return $model;

            // $v = \DB::table('invoice_detail as a')
            // ->selectRaw('
            //     DATE_FORMAT(b.tgl_faktur,"%d %M %Y") AS tgl_faktur,
            //     DATE_FORMAT(b.tgl_jatuhtempo,"%d %M %Y") AS tgl_jatuhtempo,
            //     b.cust_code,
            //     i.customer_name,
            //     b.no_invoice,
            //     b.no_faktur,
            //     b.no_po,
            //     b.cust_code,
            //     DATA2.price,
            //     IF(l.ppn IS NULL,0,l.ppn) as ppn,
            //     (DATA2.price + IF(l.ppn IS NULL,0,l.ppn)) AS nilai_faktur,
            //     (DATA2.price + IF(l.ppn IS NULL,0,l.ppn)) - IF(l.downpayment IS NULL,0,l.downpayment) AS terutang,
            //     j.name AS contact_person,
            //     b.no_po,
            //     l.downpayment,
            //     l.discount_lepas
            // ')
            // ->leftJoin('invoice_header as b','b.id','a.id_inv_header')
            // ->leftJoin('transaction_sample as c','c.id','a.id_sample')
            // ->leftJoin('mstr_transaction_kontrakuji as d','d.id_kontrakuji','c.id_contract')
            // ->leftJoin('mstr_customers_address as g','g.id_address','.id_cust_address')
            // ->leftJoin('mstr_customers_taxaddress as h','h.id_taxaddress','b.id_cust_taxaddress')
            // ->leftJoin('mstr_customers_customer as i','i.id_customer','b.idcust')
            // ->leftJoin('mstr_customers_contactperson as j','j.id_cp','b.idcp')
            // ->leftJoin(\DB::raw('(SELECT * FROM condition_contracts
            //     WHERE POSITION = 6 AND groups = "FINANCE") as DATA1'),'DATA1.contract_id','b.id')
            // ->leftJoin('payment_contract as l','l.id_contract','c.id_contract')
            // ->leftJoin(\DB::raw('(SELECT SUM(bb.price) AS price, bb.id_contract FROM invoice_detail aa
            //     LEFT JOIN transaction_sample bb ON bb.id = aa.id_sample
            //     WHERE bb.id_contract IS NOT NULL
            //     GROUP BY bb.id_contract) as DATA2'),'DATA2.id_contract','d.id_kontrakuji')
            // ->groupBy('b.id')
            // ->where('b.tgl_jatuhtempo','like','%'.$request->input('tgljatuhtempo').'%')->get();

            // return response()->json($v);

        // } catch( \Exception $e ){
        //     return response()->json($e->getMessage());
        // }
    }

    public function detailInvoice(Request $request, $id)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;

        $model = InvoiceHeader::with([
            'customer',
            'contactperson',
            'cust_address',
            'invoice_detail.kontrakuji.cust_address',
            'invoice_detail.kontrakuji.customers_handle',
            'invoice_detail.kontrakuji.customers_handle.customers',
            'invoice_detail.kontrakuji.customers_handle.contact_person',
            'invoice_detail.kontrakuji.customers_handle.address_customer',
            'invoice_detail.kontrakuji.payment_data',
            'invoice_detail.kontrakuji.payment_condition',
            'invoice_detail.kontrakuji.description_cs',
            'invoice_detail.kontrakuji.description_invoice',
            'invoice_detail.kontrakuji.samplingTrans.samplingmaster',
            'invoice_detail.transactionSample',
            'invoice_condition',
            ])->where('id', $id)->first();
        return response()->json($model);

    }

    public function dataInvoice(Request $request, $id)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;

        $model = InvoiceDetail::with([
            'kontrakuji',
            'kontrakuji.description_cs',
            'kontrakuji.akgTrans',
            'kontrakuji.payment_condition',
            'transactionSample',
            'transactionSample.statuspengujian'
            ])->where('id_inv_header', $id)->get();

        return response()->json($model);
    }

    public function show(Request $request){
        try{
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            $v = Kontrakuji::with([
                'description_cs',
                'description_invoice',
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
                'customers_handle.customers.customer_mou',
                'customers_handle.contact_person',
                'user',
                'transactionsample',
                'transactionsample.images',
                'transactionsample.statuspengujian',
                'transactionsample.tujuanpengujian',
                'transactionsample.subcatalogue',
                'invoice_condition',
                'payment_data'
                 ]
            )->whereIn('id_kontrakuji',$data['idcontract'])->get();
            return response()->json($v);

        } catch(\Exception $e){
            return response()->json($e->getMessage());
        }
    }

    public function detailFinanceContract(Request $request)
    {
        try{
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');
            // $model = InvoiceDetail::where('id_inv_header', $data['idcontract'] )->get();

            // return $model;

            $v = Kontrakuji::with([
                'description_cs',
                'description_invoice',
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
                'customers_handle.customers.customer_mou',
                'customers_handle.contact_person',
                'user',
                'transactionsample',
                'transactionsample.images',
                'transactionsample.statuspengujian',
                'transactionsample.tujuanpengujian',
                'transactionsample.subcatalogue',
                'invoice_condition',
                'payment_data'
                 ]
            )->where('id_kontrakuji',$data['idcontract'])->get();
            return response()->json($v);

        } catch(\Exception $e){
            return response()->json($e->getMessage());
        }
    }

    public function checkContract(Request $request){
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $check = count(InvoiceDetail::where('id_contract',$data[0])->groupBy('id_inv_header')->get());
        return response()->json($check);
    }


    public function checkSplit(Request $request){
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');
        

        $check = InvoiceDetail::with([
            'kontrakuji',
            'kontrakuji.payment_condition',
            'kontrakuji.transactionsample', 
            'invoice_header'])
        ->where('id_contract', $data)
        ->groupBy('id_inv_header')
        ->get();
        
        $totdisclepas = $check[0]['kontrakuji']['payment_condition']['discount_lepas'];
        
        $totdiscsample = 0;
        foreach ($check[0]['kontrakuji']['transactionsample'] as $cek) {
            $totdiscsample +=  $cek->discount;
        }
        $totdisckontrak = 0;
        if($totdiscsample > 0){
            $totdisckontrak = $totdiscsample;
        }elseif($totdisclepas> 0){
            $totdisckontrak = $totdisclepas;
        }else{
            $totdisckontrak = 0;
        }

        $totaldiscinvoice = 0;
        foreach ($check as $c) {
            $totaldiscinvoice +=  $c['invoice_header']['discount'];
        }

        $remainingdisc =  $totdisckontrak - $totaldiscinvoice;
       
        return response()->json($remainingdisc);

    }

    public function checkAddressFaktur(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        return $data;
    }

    public function accept_invoice(Request $request){
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;

            $var = ConditionContractNew::where('contract_id',$request->input('idinv'))->first();
            $condition = ConditionContractNew::find($var->id_condition_contract);
            $condition->status = $request->input('status');
            $condition->inserted_at = time::now();
            $condition->user_id = $id_user;
            $condition->save();

            $data = array(
                'status' => true,
                'message' => 'success updating data'
            );

            return response()->json($data);

        } catch (\Exception $e){
            return response()->json($e->getMessage());
        }
    }


    public function payment_invoice_get(Request $request){
        try{

            $find_inv = PaymentInvoice::where('id_inv_header',$request->input('idinv'))->get();

            if(count($find_inv) > 0){
                $v = \DB::table('invoice_detail as a')
                ->selectRaw('
                CAST(IF(DATA2.price is NULL, 0, (DATA2.price + IF(l.ppn IS NULL,0,l.ppn)) - IF(l.downpayment IS NULL,0,l.downpayment)) AS UNSIGNED) AS totalharga,
                    j.name AS contact_person,
                    i.customer_name,
                    k.id,
                    k.id_bankaccount,
                    k.price,
                    k.tgl_pembayaran,
                    b.id as id_inv_header
                ')
                ->leftJoin('invoice_header as b','b.id','a.id_inv_header')
                ->leftJoin('transaction_sample as c','c.id','a.id_sample')
                ->leftJoin('mstr_transaction_kontrakuji as d','d.id_kontrakuji','c.id_contract')
                ->leftJoin('mstr_customers_address as g','g.id_address','.id_cust_address')
                ->leftJoin('mstr_customers_taxaddress as h','h.id_taxaddress','b.id_cust_taxaddress')
                ->leftJoin('mstr_customers_customer as i','i.id_customer','b.idcust')
                ->leftJoin('mstr_customers_contactperson as j','j.id_cp','b.idcp')
                ->leftJoin('invoice_payment as k','k.id_inv_header','b.id')
                ->leftJoin('payment_contract as l','l.id_contract','c.id_contract')
                ->leftJoin(\DB::raw('(SELECT SUM(bb.price) AS price, bb.id_contract FROM invoice_detail aa
                    LEFT JOIN transaction_sample bb ON bb.id = aa.id_sample
                    WHERE bb.id_contract IS NOT NULL
                    GROUP BY bb.id_contract) as DATA2'),'DATA2.id_contract','d.id_kontrakuji')
                ->groupBy('b.id')
                ->where('k.id',$find_inv[0]->id)->first();
            } else {
                $v = \DB::table('invoice_detail as a')
                ->selectRaw('
                CAST(
                    IF(
                        DATA2.price is NULL,
                        0,
                        (DATA2.price + IF(l.ppn IS NULL,0,l.ppn)
                    ) -
                    IF(
                        l.downpayment IS NULL,
                        0,
                        l.downpayment)
                        ) AS UNSIGNED) AS totalharga,
                    j.name AS contact_person,
                    i.customer_name,
                    k.id,
                    k.id_bankaccount,
                    k.price,
                    k.tgl_pembayaran,
                    b.id as id_inv_header
                ')
                ->leftJoin('invoice_header as b','b.id','a.id_inv_header')
                ->leftJoin('transaction_sample as c','c.id','a.id_sample')
                ->leftJoin('mstr_transaction_kontrakuji as d','d.id_kontrakuji','c.id_contract')
                ->leftJoin('mstr_customers_address as g','g.id_address','.id_cust_address')
                ->leftJoin('mstr_customers_taxaddress as h','h.id_taxaddress','b.id_cust_taxaddress')
                ->leftJoin('mstr_customers_customer as i','i.id_customer','b.idcust')
                ->leftJoin('mstr_customers_contactperson as j','j.id_cp','b.idcp')
                ->leftJoin('invoice_payment as k','k.id_inv_header','b.id')
                ->leftJoin('payment_contract as l','l.id_contract','c.id_contract')
                ->leftJoin(\DB::raw('(SELECT SUM(bb.price) AS price, bb.id_contract FROM invoice_detail aa
                    LEFT JOIN transaction_sample bb ON bb.id = aa.id_sample
                    WHERE bb.id_contract IS NOT NULL
                    GROUP BY bb.id_contract) as DATA2'),'DATA2.id_contract','d.id_kontrakuji')
                ->groupBy('b.id')
                ->where('b.id',$request->input('idinv'))->first();
            }

            // $finding_id = count($find_inv) > 0 ? $v : [];

            return response()->json($v);

        } catch(\Exception $e){

            return response()->json($e->getMessage());

        }
    }

    public function paymment_action(Request $request){
        try {
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            $v = !empty($data['payment']) ? PaymentInvoice::find($data['payment']) : new PaymentInvoice;
            $v->id_inv_header = $data['id_inv_header'];
            $v->id_bankaccount = $data['id_bankaccount'];
            $v->price = $data['price'];
            $v->tgl_pembayaran = $data['tgl_pembayaran'];
            $v->save();

            if(!empty($data['payment'])){

                $f = ConditionContractNew::where('contract_id',$data['payment'])
                ->where('groups','PAYMENT')
                ->where('position',7)->first();
                $xz = ConditionContractNew::find($f['id_condition_contract']);


                $xz->contract_id = $v->id;
                $xz->parameter_id = 0;
                $xz->sample_id = 0;
                $xz->status = 2;
                $xz->user_id = $id_user;
                $xz->inserted_at = time::now();
                $xz->groups = 'PAYMENT';
                $xz->position = 7;
                $xz->save();

            } else {

                $f = new ConditionContractNew;
                $f->contract_id = $v->id;
                $f->parameter_id = 0;
                $f->sample_id = 0;
                $f->status = 1;
                $f->user_id = $id_user;
                $f->inserted_at = time::now();
                $f->groups = 'PAYMENT';
                $f->position = 7;
                $f->save();

            }

            $data = array(
                'success' => true,
                'message' => !empty($data['payment']) ? 'data has been edited' : 'data has been saved'
            );

            return response()->json($data);

        } catch (\Exception $e){
            return response()->json($e->getMessage());
        }
    }

    public function for_edit(Request $request){
       // try{
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;

            // $data = InvoiceHeader::with([
            //     'cust_address',
            //     'cust_tax_address',
            //     'customer',
            //     'contactperson',
            //     'invoice_detail',
            //     'invoice_detail.sample',
            //     'invoice_detail.sample.statuspengujian',
            //     'invoice_detail.sample.tujuanpengujian',
            //     'invoice_detail.sample.kontrakuji',
            //     'invoice_detail.sample.kontrakuji.contract_condition' => function ($u){
            //         return $u->where('groups','LAB')->where('position',4)->where('status',2)
            //         ->orWhere('groups','CS')->where('position',1)->where('status',1);
            //     },
            //     'invoice_detail.sample.kontrakuji.contract_category',
            //     'invoice_detail.sample.kontrakuji.payment_condition',
            //     'invoice_detail.sample.kontrakuji.akgTrans',
            //     'invoice_detail.sample.kontrakuji.samplingTrans',
            //     'invoice_detail.sample.kontrakuji.attachment'
            // ])->find($request->input('idinvoice'));
            // return response()->json($data);

            $model = InvoiceHeader::with([
                'invoice_detail',
                'invoice_detail.kontrakuji',
                'cust_address',
                'cust_tax_address',
                'customer',
                'contactperson',
                'invoice_condition','invoice_condition' => function ($query){
                    return   $query->orderBy('id', 'desc')->first();
                },
                'invoice_user.user'
                ])->find($request->input('idinvoice'));

                return response()->json($model);

        // } catch(\Exception $e){
        //     return response()->json($e->getMessage());
        // }
    }

    public function selectingindex(Request $request){
        try{

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            $v = \DB::table('invoice_detail as a')
            ->leftJoin('invoice_header as b','b.id','a.id_inv_header')
            ->leftJoin('mstr_customers_customer as c','c.id_customer','b.idcust')
            ->leftJoin('mstr_customers_contactperson as d','d.id_cp','b.idcp')
            ->leftJoin('transaction_sample as f','f.id','a.id_sample')
            ->leftJoin('mstr_transaction_kontrakuji as g','g.id_kontrakuji','f.id_contract')
            ->leftJoin(\DB::raw('(SELECT * FROM condition_contracts WHERE POSITION = 6 AND groups = "FINANCE") as DATA1'),'DATA1.contract_id','b.id')
            ->leftJoin('hris_employee as e','e.user_id','DATA1.user_id');
            // ->groupBy('a.id_inv_header');

            if($data['type'] =='invoice'){
                $v = $v->select('a.id_inv_header','b.no_invoice')->groupBy('b.no_invoice')->whereNotNull('a.id_inv_header');
                if(!empty($data['invoice'])){
                    $v = $v->where('a.id_inv_header','like','%'.$data['invoice'].'%');
                }
            }

            if($data['type'] == 'user'){
                $v= $v->select('DATA1.user_id','e.employee_name')->groupBy('DATA1.user_id')->whereNotNull('DATA1.user_id');;
                if(!empty($data['user'])){
                    $v = $v->where('e.employee_name','like','%'.$data['user'].'%');
                }
            }

            if($data['type'] == 'customer'){
                $v = $v->select('c.id_customer','c.customer_name')->groupBy('b.idcust')->whereNotNull('c.id_customer');
                if(!empty($data['customer'])){
                    $v = $v->where('c.customer_name','like','%'.$data['customer'].'%');
                }
            }

            if($data['type'] == 'tglfaktur'){
                $v = $v->select('b.tgl_faktur','a.id_inv_header')->groupBy('b.tgl_faktur')->whereNotNull('a.id_inv_header');
                if(!empty($data['tglfaktur'])){
                    $v = $v->where('b.tgl_faktur','like','%'.$data['tglfaktur'].'%');
                }
            }

            if($data['type'] == 'tgljatuhtempo'){
                $v = $v->select('a.id_inv_header','b.tgl_jatuhtempo')->groupBy('b.tgl_jatuhtempo')->whereNotNull('a.id_inv_header');
                if(!empty($data['tgljatuhtempo'])){
                    $v = $v->where('b.tgl_jatuhtempo','like','%'.$data['tgljatuhtempo'].'%');
                }
            }

            if($data['type'] == 'contract'){
                $v = $v->select('g.id_kontrakuji','g.contract_no')->groupBy('g.id_kontrakuji')->whereNotNull('g.id_kontrakuji');
                if(!empty($data['contract'])){
                    $v = $v->where('g.contract_no','like','%'.$data['contract'].'%');
                }
            }
            $v = $v->paginate(25);
            return response()->json($v);
        } catch(\Exception $e){
            return response()->json($e->getMessage());
        }
    }


    public function getKontrak(Request $request)
    {
        // try {
        //     $model = ConditionContractNew::with(['kontrakuji_light'])->selectRaw('contract_id')
        //         ->where('parameter_id', 0)
        //         ->groupBy('contract_id');

        //         if($request->has('search')){
        //             $search = $request->input('search');
        //             $model = $model->whereHas('kontrakuji_light',function($query) use ($search){
        //                     $query->where(\DB::raw('UPPER(contract_no)'),'like','%'.$search.'%');
        //             });
        //         }
        //         return response()->json($model->paginate(25));

        // } catch (\Exception $e){
        //     return response()->json($e->getMessage());
        // }

        try {
            $model = Kontrakuji::selectRaw('id_kontrakuji, contract_no');
                if($request->input('search')){
                    $model = $model->where(\DB::raw('UPPER(contract_no)'),'like','%'.$request->input('search').'%');
                }
            $model = $model->whereYear('created_at','>=', 2022);

            return response()->json($model->paginate(25));
        }catch (\Exception $e){
            return response()->json($e->getMessage());
        }
    }


    public function bankaccount(Request $request){
        try {

            $var = Bank::all();

            return response()->json($var);

        } catch(\Exception $e){
            return response()->json($e->getMessage());
        }
    }

    public function add(Request $request){
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');          

            $re = ConditionContractNew::where('position',6)->where('user_id',$id_user)->get();
            $ee = \DB::table('hris_employee as a')->where('a.user_id',$id_user)->first();
            $eecount = str_word_count($ee->employee_name);

            if( $eecount > 1){
                $pisahnama = explode(" ",$ee->employee_name);
                $jumlah = count($re) + 1;
                $codename = substr($pisahnama[0],0,1).''.substr($pisahnama[1],0,1)."-".$this->leftpad($jumlah,3);
            }else{
                $pisahnama = explode(" ",$ee->employee_name);
                $jumlah = count($re) + 1;
                $codename = substr($pisahnama[0],0,1).''.substr($pisahnama[0],1,1)."-".$this->leftpad($jumlah,3);
            }

            $inv = new InvoiceHeader;
            $inv->cust_code = $codename;
            $inv->tgl_faktur =  date('Y-m-d',strtotime($data['tgl_faktur']));
            $inv->tgl_jatuhtempo = $data['tgl_jatuh_tempo'] == null ? null :  date('Y-m-d',strtotime($data['tgl_jatuh_tempo']));
            $inv->tgl_berita_acara = $data['tgl_berita_acara'] == null ? null :  date('Y-m-d',strtotime($data['tgl_berita_acara']));
            $inv->description = $data['other_ref'];
            $inv->termin = $data['termin'] == null ? 0 : $data['termin'];
            $inv->idcust = $data['id_cust'];
            $inv->idcp = $data['cust_penghubung'];
            $inv->id_cust_address = $data['cust_addres'];
            $inv->split = $data['split'];
            $inv->rek = $data['rek'];
            $inv->no_rekening =!empty($data['no_rekening']) ? $data['no_rekening'] : null;
            $inv->no_invoice = $data['no_invoice'];
            $inv->no_faktur = $data['no_faktur'];
            $inv->totalcostsample = $data['totalcostsample'];
            $inv->samplingfee = $data['samplingfee'];
            $inv->ingfees = $data['ingfees'];
            $inv->ppn = $data['ppn'];
            $inv->discount = $data['discount'];
            $inv->subtotal = $data['priceSubTotal'];
            $inv->dp = $data['downpayment'];
            $inv->no_po = $data['no_po'];
            $inv->format = $data['format'];
            $inv->remainingpayment = $data['remainingpayment'];
            $inv->save();

            foreach($data['id_kontrakuji'] as $d){
                $kontrak = Kontrakuji::where('id_kontrakuji', $d)->first();
                $kontrak->status_inv = 1;
                $kontrak->save();

                $payment = PaymentCondition::where('id_contract', $d)->first();
                $payment->ppn = $data['ppn'];
                $payment->save();
            }
          
            //$countlat = InvoiceHeader::count();
            //$lat_inv = InvoiceHeader::latest('id')->first();

           

            // special invoice
            if($data['format'] == 4){
                $conds = New ConditionInvoice;
                $conds->id_invoice_header = $inv->id;
                $conds->user_id = $id_user;
                $conds->status = 3;
                $conds->inserted_at = time::now();
                $conds->save();
            }else{
                $cond = New ConditionInvoice;
                $cond->id_invoice_header = $inv->id;
                $cond->user_id = $id_user;
                $cond->status = 0;
                $cond->inserted_at = time::now();
                $cond->save();
            }   
          

            foreach($data['idsample'] as $idsample){
                $ts = TransactionSample::where('id', $idsample['idsample'])->first();
                $invoice = new InvoiceDetail;
                $invoice->id_sample = $idsample['idsample'];
                $invoice->id_contract = $ts->id_contract;
                $invoice->id_inv_header = $inv->id;
                $invoice->save();

            }


            $message = array(
                'status' => true,
                'message' => 'success'
            );

            return response()->json($message);

        } catch(\Exception $e){
            return response()->json($e->getMessage());
        }
    }

    public function addWithDiscount(Request $request){
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');


            $re = ConditionContractNew::where('position',6)->where('user_id',$id_user)->get();
            $ee = \DB::table('hris_employee as a')->where('a.user_id',$id_user)->first();
            $eecount = str_word_count($ee->employee_name);

            if( $eecount > 1){
                $pisahnama = explode(" ",$ee->employee_name);
                $jumlah = count($re) + 1;
                $codename = substr($pisahnama[0],0,1).''.substr($pisahnama[1],0,1)."-".$this->leftpad($jumlah,3);
            }else{
                $pisahnama = explode(" ",$ee->employee_name);
                $jumlah = count($re) + 1;
                $codename = substr($pisahnama[0],0,1).''.substr($pisahnama[0],1,1)."-".$this->leftpad($jumlah,3);
            }

            $inv = new InvoiceHeader;
            $inv->cust_code = $codename;
            $inv->tgl_faktur =  date('Y-m-d',strtotime($data['tgl_faktur']));
            $inv->tgl_jatuhtempo = $data['tgl_jatuh_tempo'] == null ? null :  date('Y-m-d',strtotime($data['tgl_jatuh_tempo']));
            $inv->tgl_berita_acara = $data['tgl_berita_acara'] == null ? null :  date('Y-m-d',strtotime($data['tgl_berita_acara']));
            $inv->description = $data['other_ref'];
            $inv->termin = $data['termin'] == null ? 0 : $data['termin'];
            $inv->idcust = $data['id_cust'];
            $inv->idcp = $data['cust_penghubung'];
            $inv->id_cust_address = $data['cust_addres'];
            $inv->split = $data['split'];
            $inv->rek = $data['rek'];
            $inv->no_rekening =!empty($data['no_rekening']) ? $data['no_rekening'] : null;
            $inv->no_invoice = $data['no_invoice'];
            $inv->no_faktur = $data['no_faktur'];
            $inv->totalcostsample = $data['totalcostsample'];
            $inv->samplingfee = $data['samplingfee'];
            $inv->ingfees = $data['ingfees'];
            $inv->ppn = $data['ppn'];
            $inv->discount = $data['discount'];
            $inv->subtotal = $data['priceSubTotal'];
            $inv->dp = $data['downpayment'];
            $inv->no_po = $data['no_po'];
            $inv->remainingpayment = $data['remainingpayment'];
            $inv->save();

            foreach($data['id_kontrakuji'] as $d){
                $kontrak = Kontrakuji::where('id_kontrakuji', $d)->first();
                $kontrak->status_inv = 1;
                $kontrak->save();

                // $payment = PaymentCondition::where('id_contract', $d)->first();
                // $payment->ppn = $data['ppn'];
                // $payment->discount_lepas = 0;
                // $payment->save();
            }
          
            $countlat = InvoiceHeader::count();
            $lat_inv = InvoiceHeader::latest('id')->first();
            $cond = New ConditionInvoice;
            $cond->id_invoice_header = $lat_inv->id;
            $cond->user_id = $id_user;
            $cond->status = 0;
            $cond->inserted_at = time::now();
            $cond->save();
          

            foreach($data['idsample'] as $idsample){
                $ts = TransactionSample::where('id', $idsample['idsample'])->first();
                $ts->discount = $idsample['discount'];
                $ts->save();

                $invoice = new InvoiceDetail;
                $invoice->id_sample = $idsample['idsample'];
                $invoice->id_contract = $ts->id_contract;
                $invoice->id_inv_header = $inv->id;
                $invoice->save();

            }


            $message = array(
                'status' => true,
                'message' => 'success'
            );

            return response()->json($message);

        } catch(\Exception $e){
            return response()->json($e->getMessage());
        }
    }

    public function getSampleData(Request $request){
        try {
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            $datasample = TransactionSample::with([
                'kontrakuji',
                'kontrakuji.description',
                'kontrakuji.description.user',
                'kontrakuji.description.user.bagian',
                'kontrakuji.description.user.subagian',
                'kontrakuji.conditionContract',
                'bobotsample',
                'bobotsample.labname',
                'kontrakuji.contract_category',
                'statuspengujian',
                'tujuanpengujian',
                'kontrakuji.customers_handle',
                'kontrakuji.customers_handle.customers',
                'kontrakuji.customers_handle.contact_person',
                'kontrakuji.payment_condition',
                'kontrakuji.akgTrans',
                'kontrakuji.samplingTrans',
                'kontrakuji.attachment',
                'kontrakuji.cust_address',
                'kontrakuji.cust_tax_address'
                ])->where('id_contract',$request->input('contract'))->get();

                return response()->json($datasample);

        } catch(\Exception $e){
            return response()->json($e->getMessage());
        }

    }

    private function leftPad($number, $targetLength) {
        $output = strlen((string)$number);
        $selisih = intval($targetLength) - intval($output);
        $nol = '';
        for ($i=0; $i < $selisih; $i++) {
            $nol .= '0';
        }
        $nol .= strval($number);
        return $nol;
    }

    public function marketingFinance(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = Kontrakuji::with('conditionInvocie')->get();
        return $model;
    }

        /**
     * Create a new controller instance.
     *
     * @return void
    */

    public function indexApprove(Request $request){
        
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            $m = DB::select('SELECT * FROM (
                SELECT * FROM (
                   SELECT * FROM condition_invoice ci group by ci.id ORDER BY ci.id DESC ) AS zz
                GROUP BY zz.id_invoice_header ) AS aa
             WHERE aa.status = 0 ');

            $result = array_map(function ($m) {
                return $m->id_invoice_header;
            }, $m);

            $model = InvoiceHeader::with([
                'invoice_detail',
                'cust_address',
                'cust_tax_address',
                'customer.ar_user',
                'contactperson',
                'invoice_condition',
                'invoice_user.user'
                ])->whereIn('id', $result);
            
            if(!empty($data['invoice_number'])){
                $model=$model->where(\DB::raw('UPPER(no_invoice)'),'like','%'.strtoupper($data['invoice_number']).'%');
            }

            if(!empty($data['customers'])){
                $customer = $data['customers'];
                $model = $model->whereHas('customer',function($query) use ($customer){
                        $query->where('id_customer', $customer);
                });
            }  

            if(!empty($data['user'])){
                $user = $data['user'];
                $model = $model->whereHas('invoice_user',function($query) use ($user){
                        $query->where('user_id', $user);
                });
            }  

            $model = $model->paginate(50);
            return response()->json($model);

        } catch(\Exception $e){
            return response()->json($e->getMessage());
        }
    }

    public function approveInvoice(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        foreach($data as $data){
            $model = ConditionInvoice::where('id_invoice_header', $data['id'])->first();
            $add = New ConditionInvoice;
            $add->id_invoice_header = $model->id_invoice_header;
            $add->inserted_at = time::now();
            $add->status = 1;
            $add->user_id = $id_user;
            $add->save();
        }

        $data=array(
            'success'=>true,
            'message'=>'approve successfully'
        );

        return response()->json($data);
    }

    public function cancelInvoice(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        foreach($data as $data){
            $model = ConditionInvoice::where('id_invoice_header', $data['id'])->first();
            $add = New ConditionInvoice;
            $add->id_invoice_header = $model->id_invoice_header;
            $add->inserted_at = time::now();
            $add->status = 2;
            $add->user_id = $id_user;
            $add->save();
        }

        $data=array(
            'success'=>true,
            'message'=>'cancel invoice'
        );

        return response()->json($data);
    }

    public function holdContract(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $array = array();

        foreach($data as $data){
            $model = ConditionInvoice::where('id_invoice_header', $data['id'])->first();
            array_push($array, $model->contract_id);
        }
    }

    public function deleteInvoce(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('id');

        $model = InvoiceHeader::where('id', $data)->first();
        $conds  = ConditionInvoice::where('id_invoice_header', $data)->get();
        $details = InvoiceDetail::where('id_inv_header', $data)->get();

        $model->delete();

        foreach($conds as $cond){
            $c = ConditionInvoice::where('id_invoice_header', $cond->id_invoice_header)->first();
            $c->delete();
        }

        foreach($details as $detail){
            $c = InvoiceDetail::where('id_inv_header', $detail->id_inv_header)->first();
            $c->delete();
        }

        $data=array(
            'success'=>true,
            'message'=>'delete invoice'
        );

        return response()->json($data);


    }

    public function getSampleInvoice(Request $request , $idinvoice)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;

        $data = InvoiceDetail::with([
        'transactionSample',
        'transactionSample.statuspengujian'
        ])->where('id_inv_header', $idinvoice)
        ->get();

        return response()->json($data);
    }

    public function selectedCustomer(Request $request){
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model=Customer::selectRaw('*')
        ->whereIn('id_customer', $data);

        if($request->has('search')){
            $model=$model->where(\DB::raw('UPPER(customer_name)'),'like','%'.strtoupper($request->input('search')).'%');
        }
        $model=$model->paginate(25);

        return response()->json($model);
    }

    public function selectedContact(Request $request){

        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model=ContactPerson::selectRaw('*')
        ->whereIn('id_cp', $data);

        $model=$model->paginate(25);

        return response()->json($model);
    }

    public function selectedAddress(Request $request){
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');
        $model=CustomerAddress::selectRaw('*')
        ->whereIn('customer_id', $data);

        $model=$model->paginate(25);

        return response()->json($model);
    }


    public function editInvoice(Request $request, $id)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $inv = InvoiceHeader::find($data['id']);
        $inv->tgl_faktur =  date('Y-m-d',strtotime($data['tgl_faktur']));
        $inv->tgl_jatuhtempo = $data['tgl_jatuh_tempo'] == null ? null :  date('Y-m-d',strtotime($data['tgl_jatuh_tempo']));
        $inv->tgl_berita_acara = $data['tgl_berita_acara'] == null ? null :  date('Y-m-d',strtotime($data['tgl_berita_acara']));
        $inv->description = $data['other_ref'];
        $inv->termin = $data['termin'];
        $inv->no_po = $data['no_po'];
        $inv->idcust = $data['id_cust'];
        $inv->idcp = $data['cust_penghubung'];
        $inv->id_cust_address = $data['cust_addres'];
        $inv->split = $data['split'] == true ? 1 : 0;
        $inv->rek = $data['rek'];
        //$inv->no_rekening =!empty($data['no_rekening']) ? $data['no_rekening'] : null;
        $inv->no_invoice = $data['no_invoice'];
        $inv->no_faktur = $data['no_faktur'];
        $inv->totalcostsample = $data['totalcostsample'];
        $inv->samplingfee = $data['samplingfee'];
        $inv->ingfees = $data['ingfees'];
        $inv->ppn = $data['ppn'];
        $inv->discount = $data['discount'];
        $inv->subtotal = $data['priceSubTotal'];
        $inv->dp = $data['downpayment'];
        $inv->remainingpayment = $data['remainingpayment'];
        $inv->format = $data['format'];
        $inv->save();

        $i = [];
        $test_array = InvoiceDetail::where('id_inv_header', $data['id'])->get();
        $j = $data['idsample'];

        foreach($test_array as $t){
            array_push($i, $t->id_sample);
        }

        // add sample
        $z = [];
        foreach($j as $h){
            if(!in_array($h['id'],$i)){
                array_push($z,$h);
            }
        }
       
        if(count($z) > 0){
            foreach($z as $z){
                $ba =  TransactionSample::where('id', $z['id'])->first();               
                $add = new InvoiceDetail;
                $add->id_inv_header = $data['id'];
                $add->id_sample = $z['id'];
                $add->id_contract = $ba['id_contract'];
                $add->save();
            }
        }

        // delete sample
        $w = [];
        foreach($j as $tt){
            array_push($w, $tt['id']);
        }

        $v = [];
        foreach($i as $d){
            if(!in_array($d,$w)){
                array_push($v,$d);
            }
        }
        
        if(count($v) > 0){
            InvoiceDetail::whereIn('id_sample', $v)->where('id_inv_header', $data['id'])->delete();
        }

        $data=array(
            'success'=>true,
            'message'=>'Update Success'
        );
        return response()->json($data);
    }

    function arrayIsNotEmpty($arr) {
        if(!is_array($arr)) {
        return;
        }
        return count($arr) != 0;
        }

    public function paymentAdd(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');



        $sum = 0;
        $waw = $this->getPayment($request, $data['id_contract']);
        if(count($waw) > 0){
            foreach($waw as $w){
                $sum +=  $w->payment;
            }
        }else{
            $sum = 0;
        }

        $wiw = array();
        $kont = Kontrakuji::with(['payment_condition', 'akgTrans', 'samplingTrans'])->where('id_kontrakuji', $data['id_contract'])->first()->toArray();

        $op = array(
            'count_akg' => count($kont['akg_trans']),
            'akg_trans' => $kont['akg_trans'],
            'count_sampling' => count($kont['sampling_trans']),
            'sampling_trans' =>$kont['sampling_trans']
        );

        $sumakg = 0;
        if($op['count_akg'] === 0 ){
            $sumakg = 0;
        }else{
            foreach($op['akg_trans'] as $a){
                $sumakg += $a['total'];
            }
        }

        $sumsampling = 0;
        if($op['count_sampling'] == NULL){
            $sumsampling = 0;

        }else{
            foreach($op['sampling_trans'] as $s){
                $sumsampling += $s['total'];
            }
        }

     


        $model = New PaymentData;
        $model->id_contract = $data['id_contract'];
        $model->payment = $data['payment'];
        $model->user_id = $id_user;
        $model->bank = $data['bank'];
        $model->information = $data['information'];
        $model->tgl_bayar = $data['tgl_bayar'];
        $model->save();

        $kontrak = Kontrakuji::where('id_kontrakuji', $data['id_contract'])->first();
        $kontrak->status = 2;
        $kontrak->save();

        $count_invoice = InvoiceDetail::where('id_contract', $data['id_contract'])->count();
        if($count_invoice > 0){
            $sum_cok = 0;
            $invoice = InvoiceDetail::where('id_contract', $data['id_contract'])->first();
            $cok = PaymentData::where('id_contract', $data['id_contract'])->get();
            foreach($cok as $s){
                $sum_cok += $s['payment'];
            }

        // hasil kontrak
        $total = (($kont['payment_condition']['biaya_pengujian'] + $kont['payment_condition']['ppn']  + $sumakg + $sumsampling) ) -
        $kont['payment_condition']['discount_lepas'];

        $hasil = $total - ($sum + $data['payment']) ;

        $inv_head = InvoiceHeader::where('id', $invoice->id_inv_header)->first();
        $inv_head->dp = $sum_cok;
        $inv_head->remainingpayment = $hasil;
        $inv_head->save();
        }

        $payments = PaymentData::where('id_contract', $data['id_contract'])->get();
        $sum_pay = 0;
        foreach($payments as $pay){
            $sum_pay += $pay['payment'];
        }

        $contract_pay = PaymentCondition::where('id_contract', $data['id_contract'])->first();
        $contract_pay->downpayment = $sum_pay;
        $contract_pay->save();

        $data=array(
            'success'=>true,
            'message'=>'Update Success'
        );
        return response()->json($data);
    }

    public function getPayment(Request $request, $idcontract)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;

        $model = PaymentData::with(['user', 'bank'])->where('id_contract', $idcontract)->get();
        return $model;
    }

    public function accountBank(){
        $model = BankAccount::all();
        return $model;
    }

    public function editHold(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = Kontrakuji::where('id_kontrakuji', $data['contract_id'])->first();
        $model->hold = $data['hold'];
        $model->save();

        $data=array(
            'success'=>true,
            'message'=>'Update Success'
        );
        return response()->json($data);
    }

    public function getDatainLab(Request $request)
    {
        try {
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            $array = array();

            $m = ConditionContractNew::with('conditionCert')->selectRaw('*')
            ->where('sample_id', '<>', 0)
            ->where('status', 1)
            ->where('groups', 'LAB')
            ->where('position', 4)
            ->get()
            ->toArray();

            foreach($m as $asd){
                if($asd['condition_cert'] == '' || $asd['condition_cert'] == null){
                    array_push($array, $asd);
                }
            }

            $datagroup =  array_map(function($b) {
                        return $b['contract_id'];
                }, $array);


            $model = Kontrakuji::with([
                'contract_category',
                'customers_handle',
                'customers_handle.customers',
                'customers_handle.contact_person',
                'count_samplelab' => function($q){
                    return $q->selectRaw('COUNT(id) as countid')->groupBy('id_contract');
                },
                'status_sample_certificate'
            ])->whereIn('id_kontrakuji',$datagroup);

            if(!empty($data['marketing'])){
                $model=$model->where('contract_no','like','%'.$data['marketing'].'%');
            }

            if(!empty($data['category'])){
                $model = $model->where('id_contract_category',$data['category']);
            }

            if(!empty($data['customer_name'])){
                $customer_name = $data['customer_name'];
                $model = $model->whereHas('customers_handle.customers',function($query) use ($customer_name){
                        $query->where(\DB::raw('UPPER(customer_name)'),'like','%'.$customer_name.'%');
                });
            }

            if(!empty($data['desc'])){
                $model = $model->where('desc','like','%'.$data['desc'].'%');
            }

            $model=$model->paginate(50);
            $model->groupBy('contract_id');

            return response()->json( $model);

        }
        catch(\Exception $e){
            $data=array(
                'success'=>false,
                'message'=>'Update Error'
            );
            return response()->json($data);
        }
    }

    public function printInvoice(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = InvoiceHeader::where('id', $data['id'])->first();
        $model->printed = $data['printed'];
        $model->save();


        $data=array(
            'success'=>true,
            'message'=>'Printed'
        );
        return response()->json($data);

    }

    public function getCustomerInvoice(Request $request){

        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $m = Customer::where('id_customer', $data)->first();
        return $m;
    }

    public function getCPInvoice(Request $request){

        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $m = ContactPerson::where('id_cp', $data)->first();
        return $m;
    }

    public function getAddressInvoice(Request $request){

        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $m = CustomerAddress::where('id_address', $data)->first();

        return $m;
    }
    public function calculationData(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $sum_pay = 0;
        $sum_akg = 0;
        $sum_sampling = 0;
        $biayapengujian = 0;
        $discount = 0;

        $checkdetaildata = InvoiceDetail::where('id_inv_header', $data)->groupBy('id_contract')->get();
      

        foreach($checkdetaildata as $d){
            $checkPayment = PaymentCondition::where('id_contract', $d->id_contract)->first();
            $biayapengujian += $checkPayment->biaya_pengujian;

            if($checkPayment->discount_lepas < 1){
                $smple = TransactionSample::where('id_contract', $d->id_contract)->get();
                foreach($smple as $sm){
                    $discount += $sm->discount;
                }
            }else{
                $discount += $checkPayment->discount_lepas;
            }

            $payment = PaymentData::where('id_contract', $d->id_contract)->get();

            if(count($payment) != 0){
                foreach($payment as $a){
                    $sum_pay += $a['payment'];
                }
            }

            $akg = Transaction_akg_contract::where('id_transaction_kontrakuji', $d->id_contract)->get();
            
            if(count($akg) != 0){
                foreach($akg as $a){
                    $sum_akg += $a['total'];
                }
            }
    
            $sampling = Transaction_sampling_contract::where('id_transaction_contract', $d->id_contract)->get();
            
            if(count($sampling) != 0){
                foreach($sampling as $a){
                    $sum_sampling += $a['total'];
                }
            }

            
            // $detailMod = InvoiceDetail::where('id_contract', $d->id_contract)->get();
            // return $detailMod;
        }
          
        $subTot = ($biayapengujian - $discount) + $sum_sampling + $sum_akg;
        $ppn = $subTot*11/100;
        $totalCost = $subTot + $ppn;

        $model = InvoiceHeader::where('id', $d->id_inv_header)->first();
        $model->dp = $sum_pay;
        $model->remainingpayment = $totalCost - $sum_pay;
        $model->subtotal = $subTot;
        $model->ppn = $ppn;
        $model->ingfees = $sum_akg;
        $model->samplingfee = $sum_sampling;
        $model->save();

        

        $data=array(
            'success'=>true,
            'message'=>'Update Success'
        );

        return response()->json($data);

    }

    public function updateNewData(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $megadata = InvoiceHeader::where('id', $data)->first();

        $checkdetaildata = InvoiceDetail::where('id_inv_header', $data)->first();
        //check diskon lepas
        $checkkontrak = Kontrakuji::with('payment_condition')->where('id_kontrakuji', $checkdetaildata->id_contract)->first();

        if($checkkontrak->biaya_pengujian['discount_lepas'] == null || $checkkontrak->biaya_pengujian['discount_lepas'] == 0)
        {
            $samples = TransactionSample::where('id_contract', $checkkontrak->id_kontrakuji)->get()->toArray();
            $datasample =  array_map(function($b) {
                return $b['price'] + $b['discount'];
            }, $samples);
            $totalSamplePrice = array_sum($datasample);
            return $totalSamplePrice;

        }else{
            $sampleBagi = $checkkontrak->biaya_pengujian['discount_lepas'] / TransactionSample::where('id_contract', $checkkontrak->id_kontrakuji)->count();
            return TransactionSample::where('id_contract', $checkkontrak->id_kontrakuji)->count();
        }

        // add new invoice with new contract
        $re = ConditionInvoice::where('user_id',$id_user)->count();
        $ee = \DB::table('hris_employee as a')->where('a.user_id',$id_user)->first();
        $eecount = str_word_count($ee->employee_name);

        if( $eecount > 1){
            $pisahnama = explode(" ",$ee->employee_name);
            $jumlah = $re + 1;
            $codename = substr($pisahnama[0],0,1).''.substr($pisahnama[1],0,1)."-".$this->leftpad($jumlah,3);
        }else{
            $pisahnama = explode(" ",$ee->employee_name);
            $jumlah = $re + 1;
            $codename = substr($pisahnama[0],0,1).''.substr($pisahnama[0],1,1)."-".$this->leftpad($jumlah,3);
        }


        $inv = new InvoiceHeader;
        $inv->cust_code = $codename;
        $inv->tgl_faktur =  date('Y-m-d',strtotime($megadata->tgl_faktur));
        $inv->tgl_jatuhtempo = $megadata->tgl_jatuhtempo == null ? null :  date('Y-m-d',strtotime($megadata->tgl_faktur));
        $inv->tgl_berita_acara = $megadata->tgl_berita_acara == null ? null :  date('Y-m-d',strtotime($megadata->tgl_faktur));
        $inv->description = $megadata->description;
        $inv->termin = $megadata->termin;
        $inv->idcust = $contract->customers_handle->id_customer;
        $inv->idcp =  $contract->customers_handle->id_cp;
        $inv->id_cust_address =  $contract->customers_handle->id_alamat_customer;
        $inv->split = $megadata->split;
        $inv->rek = $megadata->rek;
        $inv->no_rekening =!empty($megadata->no_rekening) ? $megadata->no_rekening : null;
        $inv->no_invoice = $megadata->no_invoice;
        $inv->no_faktur = $megadata->no_faktur;
        $inv->no_po = $megadata->no_po;

        // $inv->totalcostsample = $data['totalcostsample'];
        // $inv->samplingfee = $data['samplingfee'];
        // $inv->ingfees = $data['ingfees'];
        // $inv->ppn = $data['ppn'];
        // $inv->discount = $data['discount'];
        // $inv->subtotal = $data['priceSubTotal'];
        // $inv->dp = $data['downpayment'];
        // $inv->remainingpayment = $data['remainingpayment'];
        //$inv->save();

        $countlat = InvoiceHeader::count();
        $lat_inv = InvoiceHeader::latest('id')->first();
        $cond = New ConditionInvoice;
        $cond->id_invoice_header = $lat_inv->id;
        $cond->user_id = $id_user;
        $cond->status = 0;
        $cond->inserted_at = time::now();
        //$cond->save();

        foreach($data['idsample'] as $idsample => $v){
            $ts = TransactionSample::where('id', $v)->first();

            $invoice = new InvoiceDetail;
            $invoice->id_sample = $v;
            $invoice->id_contract = $ts->id_contract;
            $invoice->id_inv_header = $inv->id;
            //$invoice->save();

        }

// data lama
        $datalama = InvoiceDetail::where('id_inv_header', $data)->groupBy('id_contract')->get();

        //search new contract  if revsion
        $contract = Kontrakuji::with(['customers_handle','payment_condition', 'payment_data'])->where('id_kontrakuji', $datalama[0]->id_contract)->first();
        $sampleNew = TransactionSample::where('id_contract', $datalama[0]->id_contract)->get();

        //delete data lama

        //condition delete
        $conds = ConditionInvoice::where('id_invoice_header', $data)->get();
        foreach($conds as $cond){
            $c = ConditionInvoice::where('id_invoice_header', $cond->id_invoice_header)->first();
            //$c->delete();
        }
        //details sample delete
        $details = InvoiceDetail::where('id_inv_header', $data)->get();
        foreach($details as $detail){
            $c = InvoiceDetail::where('id_inv_header', $detail->id_inv_header)->first();
            //$c->delete();
        }

        //invoice header delete
        $header = InvoiceDetail::where('id_inv_header', $data)->first();




    }

    public function getDescription(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $desc = Description::where('id_contract', $data['id_kontrakuji'])
        ->where('status', 1)
        ->where('groups', 6)
        ->orderBy('created_at', 'desc')
        ->first();

        return response()->json($desc);

    }

    public function postDescription(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $desc = Description::where('id_contract', $data['data']['id_kontrakuji'])->where('status', 1)->count();

        if($desc != 0){
            $editdesc = Description::where('id_contract', $data['data']['id_kontrakuji'])->where('status', 1)->first();
            $editdesc->id_contract = $data['data']['id_kontrakuji'];
            $editdesc->desc = $data['value']['desc_internal'];
            $editdesc->insert_user = $id_user;
            $editdesc->status = 1;
            $editdesc->groups = 6;
            $editdesc->save();
        }else{
            $adddesc = new Description;
            $adddesc->desc =  $data['value']['desc_internal'];
            $adddesc->id_contract = $data['data']['id_kontrakuji'];
            $adddesc->insert_user = $id_user;
            $adddesc->status = 1;
            $adddesc->groups = 6;
            $adddesc->created_at = time::now();
            $adddesc->save();
        }
        $data=array(
            'success'=>true,
            'message'=>'Update Success'
        );

        return response()->json($data);

    }

    public function holdContractByInvoice(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = InvoiceHeader::with([
            'invoice_detail',
            ])->where('id', $data['id'])->first();

        $idkontrak =  $model->invoice_detail[0]->id_contract;

        $change = Kontrakuji::where('id_kontrakuji', $idkontrak)->first();
        $change->hold = $data['data'];
        $change->save();

        $data=array(
            'success'=>true,
            'message'=>'Update Success'
        );

        return response()->json($data);
    }

    public function holdContractData(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $change = Kontrakuji::where('id_kontrakuji', $data['id'])->first();
        $change->hold = $data['data'];
        $change->save();

        $data=array(
            'success'=>true,
            'message'=>'Update Success'
        );

        return response()->json($data);
    }

    public function FinderInfoice(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');


        $model = Kontrakuji::with([
            'akgTrans',
            'samplingTrans',
            'payment_condition',
            'payment_data',
            'customers_handle',
            'customers_handle.customers',
            'customers_handle.contact_person',
            'status_invoices',
            'contract_category'
        ]);

        if(!empty($data['marketing'])){
            $model=$model->where(\DB::raw('UPPER(contract_no)'),'like','%'.strtoupper($data['marketing']).'%');
        }

        if(!empty($data['ponumber'])){
            $model=$model->where(\DB::raw('UPPER(no_po)'),'like','%'.strtoupper($data['ponumber']).'%');
        }

        if(!empty($data['contractdate'])){
            $model=$model->where(DB::raw("DATE(created_at) = '".$data['contractdate']."'"));
        }

        if(!empty($data['category'])){
            $model=$model->where('id_contract_category', $data['category'] );
        }

        if(!empty($data['status'])){
            $model=$model->where('hold', $data['status'] );
        }

        if(!empty($data['customers'])){
            $customers = $data['customers'];
            $model = $model->whereHas('customers_handle',function($query) use ($customers){
                     $query->where('id_customer', $customers);
            });
        }


        $model = $model->orderBy('id_kontrakuji', 'desc')->paginate(50);

        return response()->json($model);

    }

    public function deletePaymentData(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $modul = PaymentData::where('id', $data)->first();
        $del = PaymentData::where('id', $data)->delete();

        $payments = PaymentData::where('id_contract', $modul['id_contract'])->get();

        $sum_pay = 0;
        foreach($payments as $pay){
            $sum_pay += $pay['payment'];
        }

        $contract_pay = PaymentCondition::where('id_contract', $modul['id_contract'])->first();
        $contract_pay->downpayment = $sum_pay;
        $contract_pay->save();


        $kont = Kontrakuji::with(['payment_condition', 'akgTrans', 'samplingTrans'])->where('id_kontrakuji', $modul['id_contract'])->first()->toArray();

        $op = array(
            'count_akg' => count($kont['akg_trans']),
            'akg_trans' => $kont['akg_trans'],
            'count_sampling' => count($kont['sampling_trans']),
            'sampling_trans' =>$kont['sampling_trans']
        );

        $sumakg = 0;
        if($op['count_akg'] === 0 ){
            $sumakg = 0;
        }else{
            foreach($op['akg_trans'] as $a){
                $sumakg += $a['total'];
            }
        }

        $sumsampling = 0;
        if($op['count_sampling'] == NULL){
            $sumsampling = 0;

        }else{
            foreach($op['sampling_trans'] as $s){
                $sumsampling += $s['total'];
            }
        }

        // hasil kontrak
       $total = (($kont['payment_condition']['biaya_pengujian'] + $kont['payment_condition']['ppn']  + $sumakg + $sumsampling) ) -
       $kont['payment_condition']['discount_lepas'];


       $hasil = $total - $sum_pay  ;

        $count_invoice = InvoiceDetail::where('id_contract', $modul['id_contract'])->count();

        if($count_invoice > 0){
            $sum_cok = 0;
            $invoice = InvoiceDetail::where('id_contract', $modul['id_contract'])->first();
            $cok = PaymentData::where('id_contract', $modul['id_contract'])->get();
            foreach($cok as $s){
                $sum_cok += $s['payment'];
            }
        $inv_head = InvoiceHeader::where('id', $invoice->id_inv_header)->first();
        $inv_head->dp = $sum_cok;
        $inv_head->remainingpayment = $hasil;
        $inv_head->save();
        }

        $data=array(
            'success'=>true,
            'message'=>'Delete Success'
        );

        return response()->json($data);

    }

    public function getInvoiceByContract(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $mod = InvoiceDetail::with([
            'invoice_header'
            ])
        ->where('id_contract',  $data)        
        ->groupBy('id_inv_header')
        ->get();

        return $mod;
    }

    public function activedInvoice(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        
        $data['bool'] == true ? $bool = 1 : $bool =  0; 

        $model = InvoiceHeader::where('id', $data['id'])->first();
        $model->actived = $bool;
        $model->save();

        
        $data=array(
            'success'=>true,
            'message'=>'Actived Success'
        );

        return response()->json($data);
    }

    public function getDataEmail()
    {

    }

    public function getPerforma(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = KontrakUji::with([
            'customers_handle.customers',
            'customers_handle.contact_person',
            'cust_address',
            'transactionsample.statuspengujian',
            'payment_condition',
            'akgTrans',
            'samplingTrans',
            'payment_data'
            ])->where('id_kontrakuji', $data)->first();
        return $model;
    }

    public function approveRevision(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = InvoiceDetail::where('id_contract', $data)->get();

        foreach($model as $m){
            $contract = Kontrakuji::where('id_kontrakuji', $m->id_contract)->first();
            $contract->status_inv = NULL;
            $contract->save();
        }
        
        $data=array(
            'success'=>true,
            'message'=>'Approve Revision Success'
        );

        return response()->json($data);
    }

    public function userTopGlobal(Request $request)
    {

        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = DB::select('
        SELECT stat.user_id, 
        hris_employee.employee_name,
        COUNT(stat.user_id) AS total FROM ( 
            SELECT * FROM (	
                SELECT * FROM condition_invoice 
                WHERE MONTH(condition_invoice.inserted_at) = 05
                AND YEAR(condition_invoice.inserted_at) = 2022
                ORDER BY id ASC) AS cond
            GROUP BY cond.id_invoice_header ) AS stat
            INNER JOIN hris_employee ON hris_employee.user_id = stat.user_id
        WHERE stat.status = 0
        GROUP BY stat.user_id
        ORDER BY total DESC ');

        return response()->json($model);
    }

    public function totalInvoiceDay(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = DB::select('
        SELECT SUM(dono.total) as total_day FROM (	
            SELECT (invoice_header.subtotal + invoice_header.ppn) AS total FROM condition_invoice 
            INNER JOIN invoice_header ON invoice_header.id = condition_invoice.id_invoice_header
            where DATE(condition_invoice.inserted_at) = "2022-11-11"
        GROUP BY id_invoice_header) AS dono ');

        return response()->json($model);
    }

    public function summaryInvoiceDay(Request $request)
    {
        

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');
    
            $model = DB::select('
            SELECT COUNT(dono.id_invoice_header) as sum FROM (
                SELECT condition_invoice.id_invoice_header FROM condition_invoice 
                where DATE(condition_invoice.inserted_at) = "2022-11-11"
                AND STATUS = 0
                GROUP BY condition_invoice.id_invoice_header ) AS dono');
    
            return response()->json($model);
    }

    public function invoiceSpesial(Request $request){
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            $conditions = DB::select('SELECT * FROM (
                SELECT * FROM (SELECT * FROM condition_invoice ci group by ci.id ORDER BY ci.id DESC ) AS zz
                GROUP BY zz.id_invoice_header
                ORDER BY id DESC ) as aa
            WHERE aa.status = 3');

            $arrays = array_map(function ($conditions) {
                return $conditions->id_invoice_header;
            }, $conditions);


            $model = InvoiceHeader::with([
                'invoice_detail',
                'invoice_detail.kontrakuji_light',
                'cust_address',
                'cust_tax_address',
                'customer.ar_user',
                'contactperson',
                'invoice_condition_first',
                'invoice_user.user'])->selectRaw('id, no_invoice, tgl_faktur, tgl_jatuhtempo, idcust, idcp, printed, edited, split, format ');

            if(!empty($data['invoice_number'])){
                $model=$model->where(\DB::raw('UPPER(no_invoice)'),'like','%'.strtoupper($data['invoice_number']).'%');
            }
            
            if(!empty($data['po_number'])){
                $model=$model->where(\DB::raw('UPPER(no_po)'),'like','%'.strtoupper($data['po_number']).'%');
            }
            
            if(!empty($data['invoice_date'])){
                $model=$model->where('tgl_faktur','like','%'.date('Y-m-d',strtotime($data['invoice_date'])).'%');
            }

            if(!empty($data['customers'])){
                $model=$model->where('idcust',$data['customers']);
            }

            // $model =  $model->whereHas('invoice_condition_first',function($query){
            //     $query->where('status', 3);
            // });

            // if(empty($data['status']) && 
            // empty($data['users']) && 
            // empty($data['invoice_number']) && 
            // empty($data['po_number']) && 
            // empty($data['invoice_date']) && 
            // empty($data['customers']) )
            // {
            //     $model = $model->whereMonth('created_at', date('m'))
            //     ->whereYear('created_at', date('Y'));
            // }
              
            $model = $model->whereIn('id', $arrays)
            ->where('format', 4)
            ->orderby('id', 'DESC');

            if($data['download'] == false){
                $model = $model->paginate(50);
            }else{
                $model = $model->get();
            }
          

            return response()->json($model);


        } catch(\Exception $e){
            return response()->json($e->getMessage());
        }
    }

    public function approveSpecialInvoice(Request $request)
    {
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            $conds = New ConditionInvoice;
            $conds->id_invoice_header = $data;
            $conds->user_id = $id_user;
            $conds->status = 0;
            $conds->inserted_at = time::now();
            $conds->save();

            $message = array(
                'status' => true,
                'message' => 'success'
            );

            return response()->json($message);
    }

}
