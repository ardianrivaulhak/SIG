<?php
namespace App\Http\Controllers\Master;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Master\Sampling;
use Firebase\JWT\JWT;
use Carbon\Carbon as time;

class SamplingController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function index(Request $request)
    {
        // return $request->all();
        $model=Sampling::select('*');
        if($request->has('search')){
            $model=$model->where(\DB::raw('UPPER(sampling_name)'),'like','%'.$request->input('search').'%');        
        }

        if($request->has('all')){
            $model=$model->get();
        } else {
            $model=$model->paginate(100);
        }
        
        return response()->json($model);
    }
    public function show(Request $request,$id)
    {
        $model=Sampling::find($id);
        return response()->json($model);
    }

    public function update(Request $request,$id){
        try{
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');
            // return $data['kode_lab'];
            $sampling = Sampling::find($id);
            $sampling->sampling_name = $data['sampling_name'];
            $sampling->price = $data['price'];
            $sampling->desc = $data['desc'];
            $sampling->update_user = $id_user;
            $sampling->updated_at = time::now();
            $sampling->save();
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

        $model=Sampling::find($id);
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
    
            $sampling = new Sampling;
            $sampling->sampling_name = $data['sampling_name'];
            $sampling->price = $data['price'];
            $sampling->desc = $data['desc'];
            $sampling->insert_user = $id_user;
            $sampling->created_at = time::now();
            $sampling->save();
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
