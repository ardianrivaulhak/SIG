<?php

namespace App\Http\Controllers\Ecert;
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
use App\Models\Ecert\Ecertlhu;
use App\Models\Ecert\Akgfile;
use App\Models\Ecert\ConditionCert;
use App\Models\Ecert\CustomerCert;
use App\Models\Ecert\ParameterCert;
use App\Models\Analysis\Customerhandle;
use App\Models\Analysis\CustomerAddress;
use App\Models\Ecert\RevConditionCert;
use App\Models\Ecert\RevEcertlhu;
use App\Models\Ecert\RevParameterCert;
use App\Models\Ecert\AttachmentRevFile;
use App\Models\Ecert\ManualData;
use App\Models\Master\MemberTeam;
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

class EcertContractController extends Controller
{
        public function contract(Request $request)
        { 
            try {
                $token = $request->bearerToken();
                $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
                $id_user = $users->sub;
                $data = $request->input('data');

                $model = Kontrakuji::with([
                    'contract_category',
                    'transactionsample',
                    'customers_handle'
                ])->whereHas('customers_handle', function ($query) use ($data){
                        return $query->where('id_customer', $data['id_customer']);
                    });

                if(!empty($data['marketing'])){
                    $model = $model->where(\DB::raw('UPPER(contract_no)'),'like','%'. $data['marketing'] .'%');
                }

                if(!empty($data['date'])){
                    $model=$model->where(\DB::raw('date(created_at)'),'like','%'.date('Y-m-d',strtotime($data['date'])).'%');
                }

                if(!empty($data['month'])){
                    $model=$model->whereMonth('created_at', $data['month']);
                }

                if(!empty($data['no_penawaran'])){
                    $model=$model->where('no_penawaran','like','%'.$data['no_penawaran'].'%');
                }

                $model = $model->orderBy('id_kontrakuji', 'DESC')->paginate(24);

                return response()->json($model);

            } catch(\Exception $e){
                $data=array(
                    'success'=>false,
                    'message'=>'Error'
                );
                return response()->json($data);
            }
        }

        public function contractDetail(Request $request, $id_kontrakuji)
        {
            try {
                $token = $request->bearerToken();
                $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
                $id_user = $users->sub;

                $model = Kontrakuji::with([
                    'contract_category',
                    'payment_data'
                    ])->where('id_kontrakuji', $id_kontrakuji)
                ->first();

                return response()->json($model);

            } catch(\Exception $e){
                $data=array(
                    'success'=>false,
                    'message'=>'Error'
                );
                return response()->json($data);
            }
        }

        public function checkCondition(Request $request, $id_kontrakuji)
        {
            try {
                $token = $request->bearerToken();
                $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
                $id_user = $users->sub;

                $model = ConditionContractNew::where('contract_id', $id_kontrakuji)
                ->orderby('inserted_at', 'DESC')
                ->first();

                return response()->json($model);

            } catch(\Exception $e){
                $data=array(
                    'success'=>false,
                    'message'=>'Error'
                );
                return response()->json($data);
            }
        }

}
