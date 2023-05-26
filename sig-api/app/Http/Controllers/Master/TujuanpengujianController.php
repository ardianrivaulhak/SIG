<?php
namespace App\Http\Controllers\Master;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Master\Tujuanpengujian;
use Firebase\JWT\JWT;
use Carbon\Carbon as time;

class TujuanpengujianController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function index(Request $request)
    {
        // return $request->all();
        $model=Tujuanpengujian::select('*');
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
        $model=Tujuanpengujian::find($id);
        return response()->json($model);
    }

    public function update(Request $request,$id)
    {
        try{
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');
           
            $Tujuanpengujian = Tujuanpengujian::find($id);
            $Tujuanpengujian->name = $data['name'];
            $Tujuanpengujian->description = $data['description'];
            $Tujuanpengujian->update_user = $id_user;
            $Tujuanpengujian->updated_at = time::now();
            $Tujuanpengujian->save();

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

        $model=Tujuanpengujian::find($id);
        $model->delete_user = $id_user;
        $model->save();
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
        try{
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');
    
            $Tujuanpengujian = new Tujuanpengujian;
            $Tujuanpengujian->name = $data['name'];
            $Tujuanpengujian->description = $data['description'];
            $Tujuanpengujian->insert_user = $id_user;
            $Tujuanpengujian->created_at = time::now();
            $Tujuanpengujian->save();
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
            // return $e->getMessage();
        }
        
    }
}
