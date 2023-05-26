<?php
namespace App\Http\Controllers\Master;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Master\Subcatalogue;
use Firebase\JWT\JWT;
use Carbon\Carbon as time;

class SubcatalogueController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function index(Request $request)
    {
        // return $request->all();
        $model=Subcatalogue::with(['catalogue'])->select('*');
       
        if($request->has('search')){
            $model=$model->where(\DB::raw('UPPER(sub_catalogue_name)'),'like','%'.$request->input('search').'%')
            ->orWhere(\DB::raw('UPPER(sub_catalogue_code)'),'like','%'.$request->input('search').'%')
            ->orderBy(\DB::raw('CAST(CHAR_LENGTH(sub_catalogue_name) AS UNSIGNED)'),'asc');        
        }
        // if($request->input('id_catalogue') !== "null"){
        //     $model = $model->where('id_catalogue',$request->input('id_catalogue'));
        // }
        if($request->has('all')){
            $model=$model->get();
        } else {
            $model=$model->paginate(25);
        }
        
        return response()->json($model);
    }
    public function show(Request $request,$id)
    {
        $model=Subcatalogue::with(['catalogue'])->find($id);
        return response()->json($model);
    }

    public function update(Request $request,$id){
        try{
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');
            // return $data['kode_lab'];
            $subcatalogue = Subcatalogue::find($id);
            $subcatalogue->id_catalogue = $data['id_catalogue'];
            // $subcatalogue->sub_catalogue_code = $data['sub_catalogue_code'];
            $subcatalogue->sub_catalogue_name = $data['sub_catalogue_name'];
            $subcatalogue->description = $data['description'];
            $subcatalogue->update_user = $id_user;
            $subcatalogue->updated_at = time::now();
            $subcatalogue->save();
            $data=array(
                'success'=>true,
                'message'=>'Update Success'
            );
            return response()->json($data);
        } catch(\Exception $e){
            $data=$e->getMessage();
            return response()->json($data);
        }
        
    }
    public function destroy(Request $request, $id)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;

        $h = \DB::table('transaction_sample as a')->where('id_subcatalogue',$id)->get();
        if(count($h) > 0){
            return response()->json(array(
                "success" => false,
                "message" => 'Can`t Delete, Data is used'
            ));
        } else {
            $model=Subcatalogue::find($id);
            $model->delete_user = $id_user;
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
            $check = Subcatalogue::all();
            $nomer = count($check) + 1;
            $subcatalogue = new Subcatalogue;
            $subcatalogue->id_catalogue = $data['id_catalogue'];
            $subcatalogue->sub_catalogue_code = 'KS'.$nomer;
            $subcatalogue->sub_catalogue_name = $data['sub_catalogue_name'];
            $subcatalogue->description = $data['description'];
            $subcatalogue->insert_user = $id_user;
            $subcatalogue->created_at = time::now();
            $subcatalogue->save();
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