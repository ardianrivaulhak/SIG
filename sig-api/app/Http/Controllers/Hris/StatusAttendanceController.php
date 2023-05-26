<?php
namespace App\Http\Controllers\Hris;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Hris\StatusAttendance;
use Firebase\JWT\JWT;
use Carbon\Carbon as time;

class StatusAttendanceController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function index(Request $request)
    {
        // return $request->all();
        $model=StatusAttendance::select('*');
        if($request->has('search')){
            $model=$model->where(\DB::raw('UPPER(status_name)'),'like','%'.$request->input('search').'%');        
        }

        if($request->has('all')){
            $model=$model->orderBy('status_name','asc')->get();
        } else {
            $model=$model->orderBy('status_name','asc')->paginate(25);
        }
        
        return response()->json($model);
    }
    public function show(Request $request,$id)
    {
        $model=StatusAttendance::find($id);
        return response()->json($model);
    }

    public function update(Request $request,$id){
        try{
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');
            // return $data['kode_lab'];
            $statusattendance = StatusAttendance::find($id);
            $statusattendance->status_code = $data['status_code'];
            $statusattendance->status_name = $data['status_name'];
            $statusattendance->point_status = floatVal($data['point_status']);
            $statusattendance->save();

            $data=array(
                'success'=>true,
                'message'=>'Update Success'
            );
            return response()->json($data);
        } catch(\Exception $e){
            $data=array(
                'success'=>false,
                'message'=>'Update Error'
            );
            return response()->json($data);
        }
        
    }
    
    public function destroy(Request $request, $id)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;

        $statusattendance = StatusAttendance::find($id)->delete();

        if($statusattendance){
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

    public function store(Request $request)
    {
        try{
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');
    
            $statusattendance = new StatusAttendance;
            $statusattendance->status_code = $data['status_code'];
            $statusattendance->status_name = $data['status_name'];
            $statusattendance->point_status = floatVal($data['point_status']);
            $statusattendance->save();

            $data=array(
                'success'=>true,
                'message'=>'Saving Success'
            );
            return response()->json($data);
        } catch(\Exception $e){
            $data=array(
                'success'=>false,
                'message'=>'Saving Error'   
            );
            return response()->json($data);
        }
        
    }
}
