<?php
namespace App\Http\Controllers\Hris;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Hris\StatusActive;
use Firebase\JWT\JWT;
use Carbon\Carbon as time;

class StatusActiveController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function index(Request $request)
    {
        $model=StatusActive::select('*');
        if($request->has('q')){
            $model=$model->where('level_name','like','%'.$request->input('search').'%');
        }
        $model=$model->get();
        
        return response()->json($model);
    }
    
    public function show(Request $request,$id)
    {
        $model=StatusActive::find($id);
        return response()->json($model);
    }

    public function destroy($id)
    {
        $model=StatusActive::find($id);
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

    public function update(Request $request,$id){
        try{
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');
            // return $data['kode_lab'];
            $StatusActive = StatusActive::find($id);
            $StatusActive->level_name = $data['level_name'];
            $StatusActive->save();

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
    

    public function store(Request $request)
    {
        try{
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');
    
            $StatusActive = new StatusActive;
            $StatusActive->StatusActive = $data['StatusActive'];
            $StatusActive->save();

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