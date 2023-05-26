<?php
namespace App\Http\Controllers\Master;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Master\Analystgroup;
use Firebase\JWT\JWT;
use Carbon\Carbon as time;

class AnalystgroupController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function index(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');
        
        $models = Analystgroup::with([
            'user',
            'pic'
        ])->where('user_id','<>',0);
        
        if($request->has('search')){
            $models=$models->where(\DB::raw('UPPER(team_name)'),'like','%'.$request->input('search').'%');        
        }

        if($request->has('all')){
            $models=$models->get();
        } else {
            $models=$models->paginate(25);
        }
        
        return response()->json($models);
    }

    public function show(Request $request,$id)
    {
        $model=Akg::find($id);
        return response()->json($model);
    }

    public function update(Request $request,$id){
        try{
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');
            // return $data['kode_lab'];
            $akg = Akg::find($id);
            $akg->akg_name = $data['akg_name'];
            $akg->price = $data['price'];
            $akg->desc = $data['desc'];
            $akg->update_user = $id_user;
            $akg->updated_at = time::now();
            $akg->save();
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

        $model=Akg::find($id);
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
    
            $akg = new Akg;
            $akg->akg_name = $data['akg_name'];
            $akg->price = $data['price'];
            $akg->desc = $data['desc'];
            $akg->insert_user = $id_user;
            $akg->created_at = time::now();
            $akg->save();
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
