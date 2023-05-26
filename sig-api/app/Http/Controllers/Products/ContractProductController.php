<?php
namespace App\Http\Controllers\Products;
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
use App\Models\Analysis\Customerhandle;
use App\Models\Hris\Employee;
use App\Models\Products\Products;
use App\Models\Products\ConditionProducts;
use App\Models\Products\ProductPrice;
use App\Models\Products\ProductPayment;
use App\Models\Products\ProductInvoiceCondition;
use App\Models\Products\ProductInvoice;
use App\Models\Products\TransactionProductInvoice;
use App\Models\Products\Mediartu\Mediartu;
use App\Models\Products\Mediartu\TransactionMediartu;
use App\Models\Products\Dioxine\DioxineUdara;
use App\Models\Products\Dioxine\TransactionDioxineUdara;
use App\Models\Products\ProductAttachment;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Route;

class ContractProductController extends Controller
{   
    public function getRomawi($month)
    {
        switch ($month){
            case 1:
                return "I";
                break;
            case 2:
                return "II";
                break;
            case 3:
                return "III";
                break;
            case 4:
                return "IV";
                break;
            case 5:
                return "V";
                break;
            case 6:
                return "VI";
                break;
            case 7:
                return "VII";
                break;
            case 8:
                return "VIII";
                break;
            case 9:
                return "IX";
                break;
            case 10:
                return "X";
                break;
            case 11:
                return "XI";
                break;
            case 12:
                return "XII";
                break;
      }
    }

    private function leftPad($number, $targetLength)
    {
        $output = strlen((string)$number);
        $selisih = intval($targetLength) - intval($output);
        $nol = '';
        for ($i = 0; $i < $selisih; $i++) {
            $nol .= '0';
        }
        $nol .= strval($number);
        return $nol;
    }


    public function addContractMediaRTU(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub; 
        $data = $request->input('data');


        // atribut kontrak
        $string = "SIG.MARK";  
        $stringInvoice = "SIG.INV";      
        $category = ContractCategory::where('id', $data['type_product'])->first();
        $cat = $category->category_code;
        $month =  $this->getRomawi(date('m'));
        $years = date('Y');
        $tot = Products::count() + 1;
        $dgits = $this->leftPad($tot, 6);
        $getNumber = $string .'.'. $cat .'.'. $month .'.'. $years.'.'. $dgits ;        
        $getNumberInvoice = $stringInvoice .'.'. $cat .'.'. $month .'.'. $years.'.'. $dgits ; 
        
        // add contract
        $contract = New Products;
        $contract->contract_number = $getNumber;        
        $contract->id_category = $data['type_product'];
        $contract->id_customer = $data['customer'];
        $contract->id_cp = $data['contactperson'];        
        $contract->id_address = $data['address'];
        $contract->telp_number = $data['telp'];
        $contract->mobile_number = $data['phone'];
        $contract->tgl_terima = date('Y-m-d',strtotime($data['tgl_terima']));
        $contract->estimasi = date('Y-m-d',strtotime($data['estimasi']));
        $contract->desc = $data['desc'];
        $contract->po_number = $data['penawaran'];
        $contract->internal_memo = $data['memo_internal'];
        $contract->user_id = $id_user;
        $contract->created_at = time::now();
        $contract->save();

        // add invoice
        $prod_invoice = New ProductInvoice;
        $prod_invoice->id_product_contract = $contract['id_product_contract'];
        $prod_invoice->id_customer = $data['customer'];
        $prod_invoice->id_cp = $data['contactperson'];        
        $prod_invoice->id_address = $data['address'];
        $prod_invoice->no_invoice = $getNumberInvoice;
        $prod_invoice->bank = $data['bank'];
        $prod_invoice->no_po = $data['penawaran'];
        $prod_invoice->tgl_faktur = null;
        $prod_invoice->tgl_jatuhtempo = null;
        $prod_invoice->termin = null;
        $prod_invoice->price = $data['price_product'];
        $prod_invoice->discount = $data['discount'];
        $prod_invoice->shipping_cost = $data['shipping_cost'];
        $prod_invoice->subtotal = $data['subtotal'];
        $prod_invoice->ppn = $data['ppn'];
        $prod_invoice->total = $data['total'];
        $prod_invoice->save();


       
        
        foreach( $data['products'] as $product)
        {

            //media RTU
            if($data['type_product'] == 14)
            {
                // add product
                $addproduct = New TransactionMediartu;            
                $addproduct->id_mstr_mediartu = $product['id'];            
                $addproduct->id_product_contract = $contract['id_product_contract'];
                $addproduct->price = $product['price'];
                $addproduct->unit = $product['unit'];
                $addproduct->subtotal = $product['subtotal'];
                $addproduct->discount = $product['discount'];
                $addproduct->total = $product['total'];
                $addproduct->created_at = time::now();
                $addproduct->save();
            }

            //dioxineUdara
            if($data['type_product'] == 20)
            {
                  // add product
                  $addproduct = New TransactionDioxineUdara;            
                  $addproduct->id_mstr_dioxin = $product['id'];            
                  $addproduct->id_product_contract = $contract['id_product_contract'];
                  $addproduct->price = $product['price'];
                  $addproduct->unit = $product['unit'];
                  $addproduct->subtotal = $product['subtotal'];
                  $addproduct->discount = $product['discount'];
                  $addproduct->total = $product['total'];
                  $addproduct->created_at = time::now();
                  $addproduct->save();
            }
           

            // add product to invoice
            $trans_invoice = New TransactionProductInvoice;
            $trans_invoice->id_product_invoice = $prod_invoice['id_product_invoice'];
            $trans_invoice->price = $product['price'];
            $trans_invoice->unit = $product['unit'];
            $trans_invoice->subtotal = $product['subtotal'];
            $trans_invoice->discount = $product['discount'];
            $trans_invoice->total = $product['total'];
            $trans_invoice->save();

        }

        // condition contract product 
        $condition = New ConditionProducts;
        $condition->id_product_contract = $contract['id_product_contract'];
        $condition->status = 0 ;
        $condition->position = 1 ;
        $condition->category = $data['type_product'];
        $condition->user_id = $id_user ;
        $condition->created_at = time::now();
        $condition->save();


        // condition invoice product        
        $con_invoice = New ProductInvoiceCondition;
        $con_invoice->id_product_invoice = $prod_invoice['id_product_invoice'];
        $con_invoice->status = 0 ;
        $con_invoice->user_id = $id_user ;
        $con_invoice->created_at = time::now();
        $con_invoice->save();
        
        // price 
        $price = New ProductPrice;
        $price->id_product_contract = $contract['id_product_contract'];
        $price->price = $data['price_product'];
        $price->discount = $data['discount'];
        $price->shippingcost = $data['shipping_cost'];
        $price->price = $data['price_product'];
        $price->subtotal = $data['subtotal'];
        $price->ppn = $data['ppn'];
        $price->total = $data['total'];
        $price->save();

        if($data['payment'] > 0 || $data['payment'] != NULL)
        {
            // payment
            $pay = New ProductPayment;
            $pay->id_product_price = $price['id_product_price'];
            $pay->payment = $data['payment'];
            $pay->tgl_bayar = $data['tgl_bayar'];
            $pay->bank = $data['bank'];
            $pay->information = $data['info_payment'];
            $pay->user_id = $id_user;
            $pay->created_at = time::now();
            $pay->save();
        }
       

        
        $message=array(
            'success'=>true,
            'message'=>'Saving Success'
        );
        return response()->json($message);
    }

    public function editMediaRtu(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');


        $prod = Products::where('id_product_contract', $data['id_product_contract'])->first();
        $prod->id_customer = $data['id_customer'];
        $prod->id_cp = $data['id_cp'];
        $prod->id_address = $data['id_address'];
        $prod->telp_number = $data['telp'];
        $prod->mobile_number = $data['mobile'];
        $prod->tgl_terima = $data['tgl_terima'];
        $prod->estimasi = $data['estimasi'];
        $prod->desc = $data['desc'];
        $prod->po_number = $data['penawaran'];
        $prod->internal_memo = $data['memo_internal'];
        $prod->save();

        foreach($data['deleteProduct'] as $d)
        {
            $transProdDel = TransactionMediartu::where('id', $d['id'])->first();
            $transProdDel->delete();
        }

        foreach($data['products'] as $p)
        {
            $counttransmedia = TransactionMediartu::where('id_product_contract',  $data['id_product_contract'])->where('id_mstr_mediartu', $p['id_master_mediartu'])->count();
            if($counttransmedia < 1){
                $transProdAddnew = New TransactionMediartu;
                $transProdAddnew->id_mstr_mediartu = $p['id_master_mediartu'];
                $transProdAddnew->id_product_contract = $data['id_product_contract'];
                $transProdAddnew->price = $p['price'];
                $transProdAddnew->unit = $p['unit'];
                $transProdAddnew->status = 0;
                $transProdAddnew->subtotal = $p['subtotal'];
                $transProdAddnew->discount = $p['discount'];
                $transProdAddnew->total = $p['total'];
                $transProdAddnew->created_at = time::now();
                $transProdAddnew->save();
            }
        }
       

        $pay = ProductPrice::where('id_product_contract', $data['id_product_contract'])->first();
        $pay->shippingcost = $data['shipping_cost'];
        $pay->price = $data['price_product'];
        $pay->discount = $data['discount'];
        $pay->ppn = $data['ppn'];
        $pay->subtotal = $data['subtotal'];
        $pay->total = $data['total'];
        $pay->save();

        $prodinv = ProductInvoice::where('id_product_contract', $data['id_product_contract'])->first();
        $prodinv->id_customer = $data['id_customer'];
        $prodinv->id_cp = $data['id_cp'];
        $prodinv->id_address = $data['id_address'];
        $prodinv->no_po = $data['penawaran'];
        $prodinv->price = $data['price_product'];
        $prodinv->discount = $data['discount'];
        $prodinv->shipping_cost = $data['shipping_cost'];
        $prodinv->ppn = $data['ppn'];
        $prodinv->subtotal = $data['subtotal'];
        $prodinv->total = $data['total'];
        $prodinv->save();
        
        $transinv = TransactionProductInvoice::where('id_product_invoice', $prodinv['id_product_invoice'])->get();

        foreach ($transinv as $t) {
            $transinv = TransactionProductInvoice::where('id_transaction_product_invoice', $t->id_transaction_product_invoice)->first();
            $transinv->delete(); 
        }

        foreach($data['products'] as $p)
        {
            $transProdInvAdd = New TransactionProductInvoice;
            $transProdInvAdd->id_product_invoice = $prodinv['id_product_invoice'];
            $transProdInvAdd->price = $p['price'];
            $transProdInvAdd->unit = $p['unit'];
            $transProdInvAdd->subtotal = $p['subtotal'];
            $transProdInvAdd->discount = $p['discount'];
            $transProdInvAdd->total = $p['total'];
            $transProdInvAdd->save();
        }

        $message=array(
            'success'=>true,
            'message'=>'Saving Success'
        );
        return response()->json($message);
    }

    public function getDetail(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = Products::with([
            'conditions',
            'productprice.product_payment',
            'productMediaRTU.master_media_rtu',
            'productDioxin.master_dioxin'
        ])->where('id_product_contract', $data['id_product'])
        ->first();

        return $model;
    }

    public function sendAttachment(Request $request, $id)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $response = null;

        $getContract = Products::find($id);
        $attachmentContract = ProductAttachment::where('id_product_contract', $id)->get();

        
        $data = (object) ['file' => ""];
        if ($request->hasFile('file')) {
            
            $original_filename = $request->file('file')->getClientOriginalName();
            $original_filename_arr = explode('.', $original_filename);
            $file_ext = end($original_filename_arr);
            $destination_path = './' . $getContract->contract_number . '/attachment/';
            $filename = 'attachment_' . (count($attachmentContract) + 1) . '-' . $getContract->contract_number . '.' . $file_ext;

            if ($request->file('file')->move($destination_path, $filename)) {
                $data->file = '/' . $getContract->contract_number . '/attachment/' . $filename;

                $setAttachment = new ProductAttachment;
                $setAttachment->id_product_contract = $id;
                $setAttachment->filename = $filename;
                $setAttachment->type = 'file';
                $setAttachment->date = time::now();
                $setAttachment->ext = $request->file('file')->getClientOriginalExtension();
                $setAttachment->user_id = $id_user;
                $setAttachment->save();

                return $this->responseRequestSuccess($data);
            } else {
                return $this->responseRequestError('Cannot upload file');
            }
        } else {
            return $this->responseRequestError('File not found');
        }
    }

    protected function responseRequestSuccess($ret)
    {
        return response()->json(['status' => 'success', 'data' => $ret], 200)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    }

    protected function responseRequestError($message = 'Bad request', $statusCode = 200)
    {
        return response()->json(['status' => 'error', 'error' => $message], $statusCode)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    }

    public function sendAttachmentBlob(Request $request)
    {
        try {
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            $attachmentContract = ProductAttachment::where('id_product_contract', $data['id_contract'])->get();

            $foldername = $data['contract_no'] . '/attachment';
            if (!File::exists($foldername)) {
                File::makeDirectory($foldername, 0777, true);
            }

            $zl = Image::make($data['photo']);
            $zl->resize(null, 1240, function ($constraint) {
                $constraint->aspectRatio();
            });
            $filename = 'attachment_' . (count($attachmentContract) + 1) . '-' . $data['contract_no'] . '.jpeg';

            $setAttachment = new ProductAttachment;
            $setAttachment->id_product_contract = $data['id_contract'];
            $setAttachment->filename = $filename;
            $setAttachment->type = 'image';
            $setAttachment->date = time::now();
            $setAttachment->ext = 'jpeg';
            $setAttachment->user_id = $id_user;
            $setAttachment->save();


            $zl->save(public_path($foldername . '/' . $filename));

            return response()->json(array(
                "success" => true,
                "data" => $setAttachment
            ));


        } catch (\Exception $e){
            return response()->json($e->getMessage());
        }
    }

    public function getPhotoContractProduct(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = ProductAttachment::with(['contract'])->where('id_product_contract', $data)->get();
        
        return response()->json($model);
    }


    public function deleteAttachment(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $id = $request->input('id');

        $model = ProductAttachment::with(['contract'])->where('id_product_image', $id)->first();
        
        $destinationPath = public_path('' . $model->contract['contract_number'] . '/attachment');
        $checkfile = File::delete($destinationPath . '/' . $model->filename);

        $model->delete();

        $message=array(
            'success'=>true,
            'message'=>'Saving Success'
        );
        return response()->json($message);
    }

    public function createContactPerson(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');
        
        $m = New ContactPerson;
        $m->name = $data['name'];
        $m->gender = $data['gender'];
        $m->telpnumber = $data['telpnumber'];
        $m->phonenumber = $data['phonenumber'];
        $m->fax = $data['fax'];
        $m->email = $data['email'];
        $m->desc = $data['desc'];
        $m->active = 1;
        $m->inserted_user = $id_user;
        $m->save();

        $handle = New Customerhandle;
        $handle->id_cp = $m->id_cp;
        $handle->id_customer = $data['id_customer'];
        $handle->email = $data['email'];
        $handle->phone = $data['phonenumber'];
        $handle->fax = $data['fax'];
        $handle->telp = $data['telpnumber'];
        $handle->insert_user = $id_user;
        $handle->save();
    
        $message=array(
            'success'=>true,
            'message'=>'Saving Success'
        );

        return response()->json($message);

    }


    
}