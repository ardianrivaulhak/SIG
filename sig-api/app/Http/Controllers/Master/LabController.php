<?php
namespace App\Http\Controllers\Master;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Master\Lab;
use Firebase\JWT\JWT;
use Carbon\Carbon as time;

class LabController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function index(Request $request)
    {
        // return $request->all();
        $model=Lab::select('*');
        if($request->has('search')){
            $model=$model->where(\DB::raw('UPPER(nama_lab)'),'like','%'.$request->input('search').'%')
            ->orWhere(\DB::raw('UPPER(kode_lab)'),'like','%'.$request->input('search').'%')
            ->orderBy('kode_lab','DESC');
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
        $model=Lab::find($id);
        return response()->json($model);
    }

    public function update(Request $request,$id){
        try{
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');
            // return $data['kode_lab'];
            $lab = Lab::find($id);
            // $lab->kode_lab = $data['kode_lab'];
            $lab->nama_lab = $data['nama_lab'];
            $lab->ket_lab = $data['ket_lab'];
            $lab->update_user = $id_user;
            $lab->updated_at = time::now();
            $lab->save();
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
        $var = \DB::table('transaction_parameter as a')->where('id_lab',$id)->get();
        if(count($var) > 0){
            $data=array(
                'success'=>false,
                'message'=>'Can`t Delete Data is used'
            );
            return response()->json($data);
        } else {

            $model=Lab::find($id);
            $del=$model->delete();
            if($del){
                $data=array(
                    'success'=>true,
                    'message'=>'Data deleted'
                );
            }else{
                $data=array(
                    'success'=>false,
                    'message'=>'Can`t Delete Data is used'
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
            
            $checkdataLab = Lab::all();
            $noseri = count($checkdataLab) + 1;
            $lab = new Lab;
            $lab->kode_lab = 'LAB-'.$noseri;
            $lab->nama_lab = $data['nama_lab'];
            $lab->ket_lab = $data['ket_lab'];
            $lab->insert_user = $id_user;
            $lab->created_at = time::now();
            $lab->save();
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