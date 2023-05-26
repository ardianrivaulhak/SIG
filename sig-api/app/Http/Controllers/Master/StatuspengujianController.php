<?php
namespace App\Http\Controllers\Master;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Master\Statuspengujian;
use Firebase\JWT\JWT;
use Carbon\Carbon as time;

class StatuspengujianController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function index(Request $request)
    {
        // return $request->all();
        $model=Statuspengujian::select('*');
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
        $model=Statuspengujian::find($id);
        return response()->json($model);
    }

    public function update(Request $request,$id){
        try{
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');
            // return $data['kode_lab'];
            $statuspengujian = Statuspengujian::find($id);
            $statuspengujian->name = $data['name'];
            $statuspengujian->description = $data['description'];
            $statuspengujian->update_user = $id_user;
            $statuspengujian->updated_at = time::now();
            $statuspengujian->save();
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

        $model=Statuspengujian::find($id);
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
    
            $statuspengujian = new Statuspengujian;
            $statuspengujian->name = $data['name'];
            $statuspengujian->description = $data['description'];
            $statuspengujian->insert_user = $id_user;
            $statuspengujian->created_at = time::now();
            $statuspengujian->save();
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
