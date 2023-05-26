<?php

namespace App\Http\Controllers\Ecert;
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
use App\Models\Hris\Employee;
use Firebase\JWT\JWT;
use DB;
use Auth;
use Carbon\Carbon as time;

class EcertInvoiceController extends Controller
{
    public function invoice(Request $request){

        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $array = array();

        $m = ConditionInvoice::orderBy('id', 'desc')
            ->groupBy('id_invoice_header')
            ->get();

        foreach ($m as $ksd) {
            $bb = ConditionInvoice::where('id_invoice_header',$ksd->id_invoice_header)->latest('id')->first();
            array_push($array, $bb->id_invoice_header);
        }

        $model = InvoiceHeader::with([
            'invoice_detail',
            'invoice_condition',
            'invoice_user.user',
            'invoice_detail.kontrakuji',
            'invoice_detail.kontrakuji.contract_category',
            'invoice_detail.transactionSample'
            ])->whereIn('id',$array);

        if(!empty($request->input('invoice_number'))){
            $model=$model->where(\DB::raw('UPPER(no_invoice)'),'like','%'.strtoupper($request->input('invoice_number')).'%');
        }


        if(!empty($request->input('marketing'))){
            $marketingreq = $request->input('marketing');
            $model->whereHas('invoice_detail', function($query) use ($marketingreq, $model){
                return $query->whereHas('kontrakuji', function($que) use ($marketingreq){
                    return $que->where('contract_no', $marketingreq);
                });
            });
        }

        if(!empty($request->input('date'))){
            $model=$model->where('tgl_faktur','like','%'.strtoupper($request->input('date')).'%');
        }
        // tinggal baut percontact persion
        // disini
        $model = $model->orderBy('id', 'DESC')->paginate(25);
        return response()->json($model);
    }

    public function invoiceByContract(Request $request, $id_kontrakuji){

        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $array = array();

        $m = ConditionInvoice::orderBy('id', 'desc')
            ->groupBy('id_invoice_header')
            ->get();

        foreach ($m as $ksd) {
            $bb = ConditionInvoice::where('id_invoice_header',$ksd->id_invoice_header)->latest('id')->first();
            array_push($array, $bb->id_invoice_header);
        }

        $model = InvoiceHeader::with([
            'invoice_detail',
            'invoice_condition',
            'invoice_user.user',
            'invoice_detail.kontrakuji',
            'invoice_detail.kontrakuji.contract_category',
            'invoice_detail.transactionSample'
            ])->whereIn('id',$array);

        $model->whereHas('invoice_detail', function($query) use ($model, $id_kontrakuji){
                return $query->whereHas('kontrakuji', function($que) use ($id_kontrakuji){
                    return $que->where('id_kontrakuji', $id_kontrakuji);
                });
            });

        if(!empty($request->input('invoice_number'))){
            $model=$model->where(\DB::raw('UPPER(no_invoice)'),'like','%'.strtoupper($request->input('invoice_number')).'%');
        }

        if(!empty($request->input('category'))){
            $categoryreq = $request->input('category');
            $model->whereHas('invoice_detail', function($query) use ($categoryreq, $model){
                return $query->whereHas('kontrakuji', function($que) use ($categoryreq){
                    return $que->whereHas('contract_category', function($q) use ($categoryreq){
                        return $q->where('id', $categoryreq);
                    });
                });
            });
        }

        // if(!empty($request->input('marketing'))){
        //     $marketingreq = $request->input('marketing');
        //     $model->whereHas('invoice_detail', function($query) use ($marketingreq, $model){
        //         return $query->whereHas('kontrakuji', function($que) use ($marketingreq){
        //             return $que->where('contract_no', $marketingreq);
        //         });
        //     });
        // }
        // $marketingreq = 296;


        if(!empty($request->input('date'))){
            $model=$model->where('tgl_faktur','like','%'.strtoupper($request->input('date')).'%');
        }
        // tinggal baut percontact persion
        // disini
        $model = $model->orderBy('id', 'DESC')->paginate(25);
        return response()->json($model);
    }
}
