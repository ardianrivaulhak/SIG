<?php
namespace App\Http\Controllers\Master;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Master\Catalogue;
use Firebase\JWT\JWT;
use Carbon\Carbon as time;

class CatalogueController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function index(Request $request)
    {
        // return $request->all();
        $model=Catalogue::select('*');
        if($request->has('search')){
            $model=$model->where(\DB::raw('UPPER(catalogue_name)'),'like','%'.$request->input('search').'%')
            ->orWhere(\DB::raw('UPPER(catalogue_code)'),'like','%'.$request->input('search').'%');        
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
        $model=Catalogue::find($id);
        return response()->json($model);
    }

    public function update(Request $request,$id){
        try{
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');
            // return $data['kode_lab'];
            $catalogue = Catalogue::find($id);
            $catalogue->catalogue_name = $data['catalogue_name'];
            $catalogue->description = !empty($data['description']) ? $data['description'] : '-';
            $catalogue->update_user = $id_user;
            $catalogue->updated_at = time::now();
            $catalogue->save();
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
       $t = \DB::table('mstr_transaction_sub_catalogue')->where('id_catalogue',$id)->get();
       if(count($t)>0){
        return response()->json(array(
            "success" => false,
            "message"=> "Can`t Delete, Data is used"
        ));
       } else {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;

        $model=Catalogue::find($id);
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
    }

    public function store(Request $request){
        try{
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');
            $chekdata = Catalogue::all();
            $nokatalog = count($chekdata) + 1;
            $catalogue = new Catalogue;
            $catalogue->catalogue_code = "KTLG".$nokatalog;
            $catalogue->catalogue_name = $data['catalogue_name'];
            $catalogue->description = !empty($data['description']) ? $data['description'] : '-';
            $catalogue->insert_user = $id_user;
            $catalogue->created_at = time::now();
            $catalogue->save();
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