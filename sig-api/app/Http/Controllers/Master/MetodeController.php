<?php
namespace App\Http\Controllers\Master;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Master\Metode;
use Firebase\JWT\JWT;
use Carbon\Carbon as time;

class MetodeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function index(Request $request)
    {
        $model=Metode::select('*');
        if($request->has('search')){
            $model=$model->where(\DB::raw('UPPER(metode)'),'like','%'.$request->input('search').'%');
        }
        if($request->input('page') == 'all'){
            $model=$model->orderBy('kode_metode','ASC')->get();
        } else {
            $model=$model->orderBy('kode_metode','ASC')->paginate(25);
        }
        
        return response()->json($model);
    }
    public function show(Request $request,$id)
    {
        $model=Metode::find($id);
        return response()->json($model);
    }

    public function update(Request $request,$id){
        try{
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            $metode = Metode::find($id);
            $metode->metode = $data['metode'];
            $metode->keterangan = !empty($data['keterangan']) ? $data['keterangan'] : '-';

            $metode->update_user = $id_user;
            $metode->updated_at = time::now();
            $metode->save();
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
            return response()->json($e->getMessage());
        }
        
    }
    public function destroy($id)
    {
        $model=Metode::find($id);
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

            $checkdata = Metode::all();
            $nometode = count($checkdata) + 1;
    
            $metode = new Metode;
            $metode->kode_metode = "MTD".$nometode;
            $metode->metode = $data['metode'];
            $metode->keterangan = !empty($data['keterangan']) ? $data['keterangan'] : '-';
            $metode->insert_user = $id_user;
            $metode->created_at = time::now();
            $metode->updated_at = NULL;
            $metode->save();
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