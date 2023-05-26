<?php
namespace App\Http\Controllers\Products\Finance\Invoice;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
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
use App\Models\Master\Group;
use App\Models\Master\Format;
use App\Models\Master\ParameterUji;
use App\Models\Master\ContractCategory;
use App\Models\Analysis\ConditionContract;
use App\Models\Analysis\TransactionSample;
use App\Models\Analysis\Transaction_parameter;
use App\Models\Analysis\Kontrakuji;
use App\Models\Analysis\Description;
use App\Models\Analysis\ConditionContractNew;
use App\Models\Analysis\ContactPerson;
use App\Models\Analysis\Customer;
use App\Models\Hris\Employee;
use App\Models\Products\Products;
use App\Models\Products\ConditionProducts;
use App\Models\Products\ProductPrice;
use App\Models\Products\ProductPayment;
use App\Models\Products\ProductInvoiceCondition;
use App\Models\Products\ProductInvoice;
use App\Models\Products\TransactionProductInvoice;
use App\Models\Products\Mediartu\Mediartu;
use App\Models\Products\Mediartu\TransactionMediaRtu;
use App\Models\Products\Dioxine\DioxineUdara;
use App\Models\Products\Dioxine\TransactionDioxineUdara;


class InvoiceProductController extends Controller
{   

   public function invoiceProduct(Request $request)
   {
    $token = $request->bearerToken();
    $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
    $id_user = $users->sub;
    $data = $request->input('data');

    $model = ProductInvoice::with([
        'contract.category',
        'conditionInvoice.employee',
        'customers',
        'contactpersons',
        'address',
        'price.product_payment.user'
    ]);

    if(!empty($data['invoice'])){
        $model=$model->where(\DB::raw('UPPER(no_invoice)'),'like','%'.strtoupper($data['invoice']).'%');
    }

    if(!empty($data['category'])){
        $category = $data['category'];
        $model = $model->whereHas('contract',function($query) use ($category){
            $query->where('id_category', $category);
        });
    }

    if(!empty($data['customer'])){
        $customer = $data['customer'];
        $model = $model->whereHas('contract',function($query) use ($customer){
            $query->where('id_customer', $customer);
        });
    }

    if(!empty($data['status'])){
        $model=$model->where(\DB::raw('UPPER(no_invoice)'),'like','%'.strtoupper($data['invoice']).'%');
    }

    if(!empty($data['date'])){
        $model=$model->where('tgl_faktur', $data['date']);
    }
    

    $model = $model->paginate(25);

    return $model;
   }


   public function invoiceProductDetail(Request $request)
   {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');
    
        $model = ProductInvoice::with([
            'contract.category',
            'contract.productMediaRTU.master_media_rtu',
            'contract.productDioxin.master_dioxin',
            'conditionInvoice.employee',
            'customers',
            'contactpersons',
            'address',
            'price.product_payment'
            ])
        ->where('id_product_invoice', $data)
        ->first();

        return response()->json($model);
    }

    public function submitInvoice(Request $request, $id)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $prd = ProductInvoice::where('id_product_invoice', $id)->first();
        $prd->id_customer = $data['id_customer'];
        $prd->id_cp = $data['id_contact_person'];
        $prd->id_address = $data['id_address'];
        $prd->tgl_faktur = $data['invoice_date'];
        $prd->tgl_jatuhtempo = $data['due_date'];
        $prd->save();

        $data=array(
            'success'=>true,
            'message'=>'Submit Success'
        );
        return response()->json($data);
    }

    public function waitingApproved(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $product = New ProductInvoiceCondition;
        $product->id_product_invoice = $data['id_product_invoice'];
        $product->status = 1;
        $product->user_id = $id_user;
        $product->created_at = time::now();
        $product->updated_at = time::now();
        $product->save();

        $contract = Products::where('id_product_contract', $data['id_product_contract'])->first();
        $contract->status_rev = 1;
        $contract->save(); 

        $data=array(
            'success'=>true,
            'message'=>'Approve Success'
        );

        return response()->json($data);

    }

    public function printInvoice(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $product = ProductInvoice::where('id_product_invoice', $data)->first();
        $product->print = 1;
        $product->save();

        $data=array(
            'success'=>true,
            'message'=>'Printed'
        );
        return response()->json($data);

    }

    public function ApproveFinanceIndex(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $m = DB::select('SELECT * FROM (
            SELECT * FROM (
                SELECT * FROM product_invoice_condition as pic 
                GROUP BY pic.id_product_condition ORDER BY pic.id_product_condition DESC ) AS pc
            GROUP BY pc.id_product_invoice ) AS pcc
        WHERE pcc.status = 1');
        
        $result = array_map(function ($m) {
            return $m->id_product_invoice;
        }, $m);
        
        
        $products = ProductInvoice::with([
            'contract.category',
            'conditionInvoice',
            'conditionInvoice.employee',
            'customers',
            'contactpersons',
            'address',
            ])
        ->whereIn('id_product_invoice', $result)
        ->paginate(25);
    
        return response()->json($products);
    }

    public function ApprovedInvoice(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        foreach ($data as $d) {
            $product = New ProductInvoiceCondition;
            $product->id_product_invoice = $d['id'];
            $product->status = 2;
            $product->user_id = $id_user;
            $product->created_at = time::now();
            $product->updated_at = time::now();
            $product->save();
        }       

        $data=array(
            'success'=>true,
            'message'=>'Approve Success'
        );

        return response()->json($data);

    }

    public function submitPayments(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $product = New ProductPayment;
        $product->id_product_price = $data['id'];
        $product->payment = $data['payment'];
        $product->user_id = $id_user;
        $product->bank = $data['bank'];
        $product->information = $data['information'];
        $product->tgl_bayar = $data['date'];
        $product->created_at = time::now();
        $product->save();

        $data=array(
            'success'=>true,
            'message'=>'Submit Success'
        );

        return response()->json($data);

    }

   
}