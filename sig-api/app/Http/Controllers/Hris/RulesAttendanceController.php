<?php
namespace App\Http\Controllers\Hris;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Hris\RulesAttendance;
use Firebase\JWT\JWT;
use Carbon\Carbon as time;
class RulesAttendanceController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function index(Request $request)
    {
        $model=RulesAttendance::select('*')->get();
        
        return response()->json($model);
    }
    public function show(Request $request,$id)
    {
        $model=RulesAttendance::find($id);
        return $model;
    }
    public function destroy($id)
    {
        $model=RulesAttendance::find($id);
        $del=$model->delete();
        if($del){
            $data=array(
                'success'=>true,
                'message'=>'Data deleted'
            );
        }else{
            $data=array(
                'success'=>false,
                'message'=>'Data failed to deleted'
            );
        }
        return response()->json($data);
    }

    public function store(Request $request){
        try {
            
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            foreach ($data as $v) {
                $s = is_null($v['id']) ? new RulesAttendance : RulesAttendance::find($v['id']);
                $s->jam_masuk = $v['jam_masuk'];
                $s->jam_keluar = $v['jam_keluar'];
                $s->name = $v['name'];
                $s->tolerance_time = $v['tolerance_time'];
                $s->worktime = $v['worktime'];
                $s->save();
            }

            return response()->json(array(
                "success" => true,
                "message" => "success adding data"
            ));


        } catch (\Exception $e){
            return response()->json($e->getMessage());
        }
    }

    public function update(Request $request, $id){
        try {
            
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            $s = RulesAttendance::find($id);
            $s->name = $data['subdivision_name'];
            $s->update_user = $id_user;
            $s->updated_at = time::now();
            $s->save();

            return response()->json(array(
                "success" => true,
                "message" => "success adding data"
            ));


        } catch (\Exception $e){
            return response()->json($e->getMessage());
        }
    }
}