<?php
namespace App\Http\Controllers\Products\Mediartu;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Master\Group;
use App\Models\Master\Format;
use App\Models\Master\ParameterUji;
use App\Models\Analysis\ConditionContract;
use App\Models\Analysis\TransactionSample;
use App\Models\Analysis\Transaction_parameter;
use App\Models\Analysis\Kontrakuji;
use App\Models\Analysis\Description;
use App\Models\Analysis\ConditionContractNew;
use App\Models\Analysis\ContactPerson;
use App\Models\Analysis\Customer;
use App\Models\Hris\Employee;
use DB;
use Auth;
use Firebase\JWT\JWT;
use Carbon\Carbon as time;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Intervention\Image\ImageManagerStatic as Image;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;
use App\Models\Products\Mediartu\Mediartu;
use App\Models\Products\Mediartu\TransactionMediartu;
use App\Models\Products\Products;
use App\Models\Products\ConditionProducts;
use App\Models\Products\ProductPrice;
use App\Models\Products\ProductPayment;
use App\Models\Products\ProductInvoiceCondition;
use App\Models\Products\ProductInvoice;
use App\Models\Products\TransactionProductInvoice;

class MediartuController extends Controller
{
    public function productsmediatru(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = Mediartu::where(\DB::raw('UPPER(product_name)'),'like','%'.$data['search'].'%')
        ->paginate(25);
        
        return response()->json($model);
    }

    public function contractMediartu(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');


        $m = DB::select('
        SELECT * FROM (
            SELECT * FROM  
            product_condition p 
            WHERE p.category = 14
            GROUP BY p.id_product_condition
            ORDER BY p.id_product_condition DESC) AS awal
        GROUP BY awal.id_product_contract
        ');

        $result = array_map(function ($m) {
            return $m->id_product_contract;
        }, $m);

        $model = Products::with([
            'customers',
            'contactpersons',
            'address',
            'employee',
            'conditions',
            'productprice.product_payment'])
            ->whereIn('id_product_contract', $result);

            if(!empty($data['marketing'])){
                $model=$model->where(\DB::raw('UPPER(contract_number)'),'like','%'.$data['marketing'].'%');
            }

            if(!empty($data['customer'])){
                $model=$model->where('id_customer', $data['customer']);
            }

            if(!empty($data['contact_person'])){
                $model=$model->where('id_cp', $data['contact_person']);
            }

            if(!empty($data['estimate'])){
                $model=$model->where('estimasi','like','%'.date('Y-m-d',strtotime($data['estimate'])).'%');
            }

            if(!empty($data['received_date'])){
                $model=$model->where('tgl_terima','like','%'.date('Y-m-d',strtotime($data['received_date'])).'%');
            }


            $model = $model->paginate(100);

        return response()->json($model);
    }

    public function mediaRtuDetail(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');
        
        $model = Products::with([
            'customers',
            'contactpersons',
            'address',
            'employee',
            'conditions',
            'productprice.product_payment'])
            ->where('id_product_contract', $data)
            ->first();

        return response()->json($model);
    }

    public function getProductinContract(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        // $model = TransactionMediaRtu::with([
        //     'master_media_rtu'
        // ])->where('id_product_contract', $data)
        // ->get();

        $model = Products::with([
            'customers',
            'contactpersons',
            'employee',
            'address',
            'category',
            'productprice',
            'productprice.product_payment',
            'productMediaRTU',
            'productMediaRTU.master_media_rtu'
            ])
        ->where('id_product_contract', $data)->first();

        return response()->json($model);
    }

    public function getMediaRtuProduct(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = TransactionMediartu::with([
            'master_media_rtu'
        ])->where('id_product_contract', $data['id_product_contract'])
        ->get();

        return response()->json($model);
    }

    public function mediaRtuApprove(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = New ConditionProducts;
        $model->id_product_contract = $data['id_product_contract'];
        $model->status = 0;
        $model->category = 14;
        $model->position = 1;
        $model->user_id = $id_user;
        $model->created_at = time::now();
        $model->save();

        $model = New ConditionProducts;
        $model->id_product_contract = $data['id_product_contract'];
        $model->status = 0;
        $model->category = 14;
        $model->position = 2;
        $model->user_id = $id_user;
        $model->created_at = time::now();
        $model->save();

        $message=array(
            'success'=>true,
            'message'=>'Saving Success'
        );
        return response()->json($message);
    }

    public function deleteData(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        // delete data contract product
        $product = Products::where('id_product_contract', $data['id_product_contract'])->first();
        $product->delete();

        $conditionProduct = ConditionProducts::where('id_product_contract', $data['id_product_contract'])->get();
        foreach($conditionProduct as $cp)
        {
            $cond = ConditionProducts::where('id_product_condition', $cp->id_product_condition)->first();
            $cond->delete();
        }

        $transaksi = TransactionMediartu::where('id_product_contract', $data['id_product_contract'])->get();
        foreach($transaksi as $t)
        {
            $trans = TransactionMediartu::where('id', $t->id)->first();
            $trans->delete();
        }


        // delete data invoice product
        $invoice = ProductInvoice::where('id_product_contract', $data['id_product_contract'])->first();
       
       
        $transaksiInvoice = TransactionProductInvoice::where('id_product_invoice', $invoice->id_product_invoice)->get();
        foreach($transaksiInvoice as $ti)
        {
            $transInv = TransactionProductInvoice::where('id_transaction_product_invoice', $ti->id_transaction_product_invoice)->first();
            $transInv->delete();
        }

        $conditionInvoice = ProductInvoiceCondition::where('id_product_invoice', $invoice->id_product_invoice)->get();
        foreach($conditionInvoice as $ci)
        {
            $condInv = ProductInvoiceCondition::where('id_invoice_condition', $ci->id_invoice_condition)->first();
            $condInv->delete();
        }
        $invoice->delete();

        $productPrice = ProductPrice::where('id_product_contract', $data['id_product_contract'])->first();
       

        $productPayment = ProductPayment::where('id_product_price', $productPrice->id_product_price)->count();
        if($productPayment > 0){
            $payment = ProductPayment::where('id_product_price', $productPrice->id_product_price)->get();
            foreach($payment as $p)
            {
                $pay = ProductPayment::where('id_product_payment', $p->id_product_payment)->first();
                $pay->delete();
            }
        }
        $productPrice->delete();

        $message=array(
            'success'=>true,
            'message'=>'Saving Success'
        );
        return response()->json($message);
    }

    public function sendingMediaRtu(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = TransactionMediartu::with([
            'master_media_rtu', 
            'contract_product', 
            'sendingprogress.transaction_media_rtu.master_media_rtu'])->where('id_product_contract', $data['id_transaction_mediartu'])->get();

        return response()->json($model);
    }

    
}