<?php
namespace App\Http\Controllers\Master;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Master\ParameterType;
use Firebase\JWT\JWT;
use Carbon\Carbon as time;

class ParameterTypeController extends Controller
{

    public function index(Request $request)
    {
        $model=ParameterType::select('*');
        if($request->has('search')){
            $model=$model->where(\DB::raw('UPPER(name)'),'like','%'.$request->input('search').'%');   
        }
        if($request->has('all')){
            $model=$model->get();
        } else {
            $model=$model->paginate(25);
        }
                
        return response()->json($model);
    }

    public function show(Request $request,$id)
    {
        $model=ParameterType::find($id);

        return response()->json($model);
    }

    public function update(Request $request,$id){

        try{
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            $ParameterType = ParameterType::find($id);
            $ParameterType->name = $data['name'];
            $ParameterType->description = $data['description'];
            $ParameterType->active = $data['active'];
            $ParameterType->update_user = $id_user;
            $ParameterType->updated_at = time::now();
            $ParameterType->save();

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

    public function destroy($id)
    {
        $var = \DB::table('mstr_laboratories_parameteruji')->where('mstr_laboratories_parametertype_id',$id)->get();

        if(count($var) > 0){
            $data=array(
                'success'=>false,
                'message'=>'Can`t Delete Data is used'
            );
            return response()->json($data);
        } else {
            $model=ParameterType::find($id);
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
    }

    public function store(Request $request){
        try{
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');
    
            $ParameterType = new ParameterType;
            $ParameterType->name = $data['name'];
            $ParameterType->description = $data['description'];
            $ParameterType->active = 0;
            $ParameterType->insert_user = $id_user;
            $ParameterType->created_at = time::now();
            $ParameterType->save();

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