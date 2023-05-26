<?php
namespace App\Http\Controllers\Products\Lab;
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
use App\Models\Products\Mediartu\Mediartu;
use App\Models\Products\Mediartu\TransactionMediartu;
use App\Models\Products\Mediartu\CoaMediaRtu;
use App\Models\Products\Mediartu\ProgressMediartu;

class LabProductController extends Controller
{   
    public function indexApprove(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $array = array();

        $m = DB::select('SELECT * FROM (	
			SELECT * FROM (            
            SELECT * FROM product_condition pc 
            WHERE pc.category = 14
            GROUP BY pc.id_product_condition
            ORDER BY pc.id_product_condition desc ) as sume         
        GROUP BY sume.id_product_contract ) AS summary
        WHERE summary.position = 2');

        $array = array_map(function ($m) {
            return $m->id_product_contract;
        }, $m);

        $model =  Products::with([
            'customers',
            'contactpersons',
            'address',
            'employee',
            'conditions',
            'productMediaRTU.master_media_rtu'])
        ->whereIn('id_product_contract', $array)
        ->paginate(25);

        return response()->json($model);
    }

      
    public function changeStatus(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');
    
        foreach ($data as $d) {
            $m = TransactionMediartu::where('id', $d['id'])->first();
            if($m->status < 1){
                $m->status = 1;
                $m->save();
            }

            $kont = ConditionProducts::where('id_product_contract', $m->id_product_contract)->latest()->first();
            if($kont->position == 2 && $kont->status == 0){
                $newCont = New ConditionProducts;
                $newCont->id_product_contract = $m->id_product_contract;
                $newCont->status = 1;
                $newCont->category = 14;
                $newCont->position = 2;
                $newCont->user_id = $id_user;
                $newCont->created_at = time::now();
                $newCont->save();
            }
        }

        $data=array(
            'success'=>true,
            'message'=>'Submit Success'
        );
        return response()->json($data);
    }

    public function mediaRtu(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $m = TransactionMediartu::with([
            'master_media_rtu',
            'contract_product',
            'coa_mediartu'
            ])->where('status', 1)->paginate(25);

        return response()->json($m);
    }

    public function detailmediaRtu(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $m = TransactionMediartu::with([
            'master_media_rtu',
            'contract_product',
            'coa_mediartu'])
            ->where('id', $data['id_product'])
            ->where('status', 1)
            ->first();

        return response()->json($m);
    }

    public function coaMediaRtu(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $media = TransactionMediartu::where('id', $data['id'])->first();
        $media->tgl_produksi = $data['tgl_produksi'];
        $media->tgl_expired = $data['tgl_expired'];
        $media->save();

        if(CoaMediaRtu::where('id_transaction_media_rtu', $data['id'])->count() < 1)
        {
            $coa = New coaMediaRtu;
            $coa->id_transaction_media_rtu = $data['id'];
            $coa->data = $data['teks'];
            $coa->save();
        }else{
            $coa = CoaMediaRtu::where('id_transaction_media_rtu', $data['id'])->first();
            $coa->id_transaction_media_rtu = $data['id'];
            $coa->data = $data['teks'];
            $coa->save();
        }

        $data=array(
            'success'=>true,
            'message'=>'Submit Success'
        );
        return response()->json($data);
    }

    public function approveMedia(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('id');


        $model = TransactionMediartu::where('id', $data)->first();    
        $model->status = 2;
        $model->save();
        
        $check = TransactionMediartu::where('id_product_contract', $model->id_product_contract)->where('status', '<>', 2)->count();   
        if($check == 0){
            $prd = ConditionProducts::where('id_product_contract', $model->id_product_contract)->latest()->first();
            $condition = New ConditionProducts;
            $condition->id_product_contract = $model->id_product_contract;
            $condition->status = 2;
            $condition->category = 14;
            $condition->position = 2;
            $condition->user_id =  $id_user;
            $condition->created_at = time::now();
            $condition->save();

        }

        $data=array(
            'success'=>true,
            'message'=>'Submit Success'
        );
        return response()->json($data);

    }

    public function approveContract(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('id');

        return $data;
    }

    public function getProgressMediartu(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = ProgressMediartu::where('id_transaction_mediartu', $data['id_transaction_mediartu'])->get();

        return response()->json($model);
    }

    public function progressMediartu(Request $request)
    {        
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = New ProgressMediartu;
        $model->id_transaction_mediartu = $data['id_transaction_mediartu'];
        $model->unit = $data['unit'];
        $model->id_user = $id_user;
        $model->created_at = time::now();
        $model->save();

        $data=array(
            'success'=>true,
            'message'=>'Submit Success'
        );
        return response()->json($data);
    }

}