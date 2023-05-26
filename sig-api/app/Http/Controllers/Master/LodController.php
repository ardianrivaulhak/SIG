<?php
namespace App\Http\Controllers\Master;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Master\Lod;
use Firebase\JWT\JWT;
use Carbon\Carbon as time;

class LodController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function index(Request $request)
    {
        $model=Lod::select('*');
        if($request->has('search')){
            $model=$model->where(function($u) use ($request){
                $u->where(\DB::raw('UPPER(nama_lod)'),'like','%'.strtoupper($request->input('search')).'%')
                ->orWhere(\DB::raw('UPPER(kode_lod)'),'like','%'.strtoupper($request->input('search')).'%');
            });
        }
        if($request->input('page') == 'all'){
            $model=$model->get();
        } else {
            $model=$model->simplePaginate(25);
        }
        
        return response()->json($model);
    }
    public function show(Request $request,$id)
    {
        $model=Lod::find($id);
        return response()->json($model);
    }

    public function update(Request $request,$id){
        try{
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            $lod = Lod::find($id);
            $lod->nama_lod = $data['nama_lod'];
            $lod->ket_lod = !empty($data['ket_lod']) ? $data['ket_lod'] : null;
            $lod->active = 1;
            $lod->update_user = $id_user;
            $lod->updated_at = time::now();
            $lod->save();
            
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
        $t = \DB::table('transaction_parameter as a')->where('a.id_lod',$id)->get();
        if(count($t)>0){
            return response()->json(array(
                "success"=>false,
                "message"=> "Can`t Delete, Data is used"
            ));
        } else {
            $model=Lod::find($id);
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
            
            $checkdata = Lod::all();

            $lod = new Lod;
            $lod->kode_lod = 'L'.count($checkdata);
            $lod->nama_lod = $data['nama_lod'];
            $lod->ket_lod = !empty($data['ket_lod']) ? $data['ket_lod'] : null;
            $lod->active = 1;
            $lod->insert_user = $id_user;
            $lod->update_user = NULL;
            $lod->created_at = time::now();
            $lod->save();
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