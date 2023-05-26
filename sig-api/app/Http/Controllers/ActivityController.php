<?php 
namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Analysis\ConditionContractNew;
use DB;
use Auth;
use Firebase\JWT\JWT;
use Carbon\Carbon as time;

class ActivityController extends Controller
{
    public function saveActivity(Request $request){
        try {
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');
    
            $s = new ConditionContractNew;
            $s->contract_id = $data['contract_id'];
            $s->sample_id =  !empty($data['sample_id']) ? $data['sample_id'] : 0 ;
            $s->parameter_id =  !empty($data['parameter_id']) ? $data['parameter_id'] : 0 ;
            $s->user_id = $id_user;
            $s->status = $data['status'];
            $s->inserted_at = time::now();
            $s->groups = $data['groups'];
            $s->save();
            
            $data = array(
                "data" => "success",
                "message" => "Success saving the activity"
            );

            return response()->json($data);

        } catch(\Exception $e){
            
            $data = array(
                "data" => "Fail",
                "message" => "Failed to save activity"
            );

            return response()->json($data);

        }
    }

    public function editActivity(Request $request,$id){
        try {
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');
    
            $s = ConditionContractNew::find($id);
            $s->contract_id = $data['contract_id'];
            $s->sample_id = !empty($data['sample_id']) ? $data['sample_id'] : 0 ;
            $s->parameter_id =!empty($data['parameter_id']) ? $data['parameter_id'] : 0 ;
            $s->user_id = $id_user;
            $s->status = $data['status'];
            $s->inserted_at = time::now();
            $s->groups = $data['groups'];
            $s->save();
            
            $data = array(
                "data" => "success",
                "message" => "Success updating the activity"
            );

            return response()->json($data);

        } catch(\Exception $e){
            
            $data = array(
                "data" => "Fail",
                "message" => "Failed to update activity"
            );

            return response()->json($data);

        }
    }
}