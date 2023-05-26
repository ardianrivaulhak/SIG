<?php
namespace App\Http\Controllers\Master;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Master\Standart;
use Firebase\JWT\JWT;
use Carbon\Carbon as time;

class StandartController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function index(Request $request)
    {
        $model=Standart::select('*');
        if($request->has('search')){
            $model=$model->where(\DB::raw('UPPER(kode_standart)'),'like','%'.$request->input('search').'%')
            ->orWhere(\DB::raw('UPPER(nama_standart)'),'like','%'.$request->input('search').'%');
        }
        if($request->input('page') == 'all'){
            $model=$model->get();
        } else {
            $model=$model->paginate(25);
        }
        
        return response()->json($model);
    }
    public function show(Request $request,$id)
    {
        $model=Standart::find($id);
        return response()->json($model);
    }

    public function update(Request $request,$id){
        try{
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            $standart = Standart::find($id);
            $standart->nama_standart = $data['nama_standart'];
            $standart->ket_standart = !empty($data['ket_standart']) ? $data['ket_standart'] : null;
            $standart->update_user = $id_user;
            $standart->updated_at = time::now();
            $standart->save();
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
      $v = \DB::table('transaction_parameter as a')->where('a.id_standart',$id)->get();
      if(count($v) > 0){
        return response()->json(array(
            "success" => false,
            'message' => 'Can`t Delete, Data is used'
        ));
      } else {
        $model=Standart::find($id);
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
            
            $checkdata = Standart::all();

            $standart = new Standart;
            $standart->kode_standart = 'S'.count($checkdata);
            $standart->nama_standart = $data['nama_standart'];
            $standart->ket_standart = !empty($data['ket_standart']) ? $data['ket_standart'] : null;
            $standart->insert_user = $id_user;
            $standart->created_at = time::now();
            $standart->save();
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