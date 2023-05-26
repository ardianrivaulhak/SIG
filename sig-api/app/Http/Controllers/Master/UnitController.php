<?php
namespace App\Http\Controllers\Master;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Master\Unit;
use Firebase\JWT\JWT;
use Carbon\Carbon as time;

class UnitController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    
    public function index(Request $request)
    {
        $model=Unit::select('*');
        if($request->has('search')){
            $model=$model->where(\DB::raw('UPPER(nama_unit)'),'like','%'.$request->input('search').'%');
        }
        if($request->input('page') == 'all'){
            $model=$model->get();
        } else {
            $model=$model->paginate(800);
        }
        return response()->json($model);
    }
    public function show(Request $request,$id)
    {
        $model=Unit::find($id);
        return response()->json($model);
    }

    public function update(Request $request,$id){
        try{
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            $unit = Unit::find($id);
            // $unit->kode_unit = $data['kode_unit'];
            $unit->nama_unit = $data['nama_unit'];
            $unit->description = $data['description'];
            // $unit->active = $data['active'];
            $unit->update_user = $id_user;
            $unit->updated_at = time::now();
            $unit->save();

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
        $checkdata = \DB::table('transaction_parameter as a')->where('a.id_unit',$id)->first();
        if($checkdata){
            return response()->json(array(
                "success"=>false,
                "message"=> "Can`t Delete, Data is used"
            ));
        } else {
            $model=Unit::find($id);
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
            $checkdata = Unit::all();
            $noUnit = count($checkdata) + 1;
            $unit = new Unit;
            $unit->kode_unit = "S".$noUnit;
            $unit->nama_unit = $data['nama_unit'];
            $unit->description = $data['description'];
            $unit->active = 1;
            $unit->insert_user = $id_user;
            $unit->created_at = time::now();
            $unit->updated_at = NULL;
            $unit->save();
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