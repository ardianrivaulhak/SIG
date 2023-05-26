<?php
namespace App\Http\Controllers\Master;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Master\Paketuji;
use Firebase\JWT\JWT;
use Carbon\Carbon as time;

class PaketujiController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function index(Request $request)
    {
        $model=Paketuji::with([
            'standart',
            'unit',
            'lod',
            'metode'
        ]);
        if($request->has('search')){
            $model=$model->where(\DB::raw('UPPER(nama_paketuji)'),'like','%'.$request->input('search').'%')
            ->orWhere(\DB::raw('UPPER(kode_paketuji)'),'like','%'.$request->input('search').'%');
        }
        $model=$model->paginate(25);
        
        return response()->json($model);
    }
    public function show(Request $request,$id)
    {
        $model=Paketuji::with([
            'standart',
            'unit',
            'lod',
            'metode'
        ])->find($id);
        return response()->json($model);
    }

    public function update(Request $request,$id){
        try{
            // return $request->all();
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');
            // return $data['kode_lab'];
            $paketuji = Paketuji::find($id);
            $paketuji->kode_paketuji = $data['kode_paketuji'];
            $paketuji->nama_paketuji = $data['nama_paketuji'];
            $paketuji->price_is = $data['price_is'];
            if(empty($data['price_id'])){
                $paketuji->price_id = NULL;
            } else {
                $paketuji->price_id = $data['price_id'];
            }
            if(empty($data['price_it'])){
                $paketuji->price_it = NULL;
            } else {
                $paketuji->price_it = $data['price_it'];
            }
            if(empty($data['price_ie'])){
                $paketuji->price_ie = NULL;
            } else {
                $paketuji->price_ie = $data['price_ie'];
            }
            $paketuji->id_lod = $data['lod'];
            $paketuji->id_standart = $data['standart'];
            $paketuji->id_unit = $data['unit'];
            $paketuji->id_metode = $data['metode'];
            $paketuji->description = $data['description'];
            $paketuji->discount = $data['discount'];
            $paketuji->update_user = $id_user;
            $paketuji->updated_at = time::now();
            $paketuji->save();
            $data=array(
                'success'=>true,
                'message'=>'Update Success'
            );
            return response()->json($data);
        } catch(\Exception $e){
            $data=array(
                'success'=>false,
                'message'=> $e->getMessage()
            );
            return response()->json($data);
        }
        
    }
    public function destroy($id)
    {
        $model=Paketuji::find($id);
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
            $paketuji = new Paketuji;
            $paketuji->kode_paketuji = $data['kode_paketuji'];
            $paketuji->nama_paketuji = $data['nama_paketuji'];
            $paketuji->price = $data['price'];
            
            $paketuji->id_lod = $data['id_lod'];
            $paketuji->id_standart = $data['id_standart'];
            $paketuji->id_unit = $data['id_unit'];
            $paketuji->id_metode = $data['id_metode'];
            $paketuji->description = $data['description'];
            $paketuji->discount = $data['discount'];
            $paketuji->insert_user = $id_user;
            $paketuji->created_at = time::now();
            $paketuji->updated_at = NULL;
            $paketuji->save();
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
            return response()->json($e->getMessage());
            // return $e->getMessage();
        }
        
    }
}