<?php
namespace App\Http\Controllers\Analysis;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Master\Group;
use App\Models\Analysis\ConditionContract;
use App\Models\Analysis\TransactionSample;
use App\Models\Analysis\Transaction_parameter;
use App\Models\Analysis\Kontrakuji;
use App\Models\Analysis\Description;
use App\Models\Analysis\ConditionContractNew;
use App\Models\Ecert\Ecertlhu;
use App\Models\Ecert\ConditionCert;
use App\Models\Ecert\CustomerCert;
use App\Models\Ecert\ParameterCert;
use DB;
use Auth;
use Firebase\JWT\JWT;
use Carbon\Carbon as time;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use App\Models\Analysis\UserCustomer;
use App\Models\Analysis\RoleUserCustomer;

class UserCustomerController extends Controller
{
    public function index(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = UserCustomer::with(['customers'])
        ->orderBy('id', 'desc')
        ->paginate(25);
        return response()->json( $model);
    }

    public function addUserCustomer(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');
        
        $chekemail = UserCustomer::where('email', $data['email'])->count();
        if($chekemail > 0){            
            $data=array(
                'success'=>false,
                'message'=>'NotUnique'
            );
            return response()->json('not unique');
        }else{
            $model = New UserCustomer;
            $model->id_customer = $data['id_customer'];
            $model->email = $data['email'];
            $model->name = $data['name'];
            $model->password = app('hash')->make($data['password']); 
            $model->save();
    
            $check = UserCUstomer::latest('id')->first();
    
            $roles = New RoleUserCustomer;
            $roles->role_id = 1;
            $roles->user_id = $check->id;
            $roles->created_at = time::now();
            $roles->save();         
            
            $data=array(
                'success'=>true,
                'message'=>'Success Add'
            );

            return response()->json($data);
        }

    }

    public function updateUserCustomer(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = UserCUstomer::where('id', $data['id'])->first();
        $model->email = $data['email'];
        $model->name = $data['name'];
        $model->id_customer = $data['id_customer'];
        $model->save();

        $data=array(
            'success'=>true,
            'message'=>'Success Updated'
        );

        return response()->json($data);
    }

    public function deleteUserCustomer(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = UserCUstomer::where('id', $data['id'])->first();
        $model->delete();

        $data=array(
            'success'=>true,
            'message'=>'Success Deleted'
        );

        return response()->json($data);
    }
}