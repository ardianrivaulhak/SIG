<?php
namespace App\Http\Controllers\Hris;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Hris\Level;
use Firebase\JWT\JWT;
use Carbon\Carbon as time;
use App\Models\Hris\Employee;

class LevelController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function index(Request $request)
    {
        $model=Level::select('*');

        if(!empty($request->input('company'))){
            if($request->input('company') > 1){
                $model = $model->where('company_id',$request->input('company'));
            }
        }

        if($request->has('q')){
            $model=$model->where('level_name','like','%'.$request->input('search').'%');
        }
        $model=$model->get();
        
        return response()->json($model);
    }
    
    public function show(Request $request,$id)
    {
        $model=Level::find($id);
        return response()->json($model);
    }

    public function destroy($id)
    {
        $model=Level::find($id);
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
            $emp = Employee::where('user_id',$id_user)->first();
            // return $data['kode_lab'];
            $level = Level::find($id);
            $level->level_name = $data['level_name'];
            $level->company_id = !empty($data['company_name']) ? $data['company_name'] : $emp->id_company;
            $level->save();

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
            $emp = Employee::where('user_id',$id_user)->first();

            $level = new Level;
            $level->level_name = $data['level_name'];
            $level->company_id = !empty($data['company_name']) ? $data['company_name'] : $emp->id_company;
            $level->save();

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