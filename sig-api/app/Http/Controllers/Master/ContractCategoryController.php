<?php
namespace App\Http\Controllers\Master;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Master\ContractCategory;
use Firebase\JWT\JWT;
use Carbon\Carbon as time;

class ContractCategoryController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function index(Request $request)
    {
        $model=ContractCategory::select('*');
        // ->where('id','<>',3);
        if($request->has('search')){
            $model=$model->where(\DB::raw('UPPER(title)'),'like','%'.$request->input('search').'%')
            ->orWhere(\DB::raw('UPPER(title)'),'like','%'.$request->input('search').'%');
        }
        $model=$model->paginate(25);
        
        return response()->json($model);
    }
    public function show(Request $request,$id)
    {
        $model=ContractCategory::find($id);
        return response()->json($model);
    }

    public function update(Request $request,$id){
        //try{
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            $contactcategory = ContractCategory::find($id);
            $contactcategory->title = $data['title'];
            $contactcategory->category_code = $data['category_code'];
            $contactcategory->cover_code = $data['cover_code'];
            $contactcategory->lhu_code = $data['lhu_code'];
            $contactcategory->sample_code = $data['sample_code'];
            $contactcategory->description = $data['description'];
            $contactcategory->active = 1;
            $contactcategory->update_user = $id_user;
            $contactcategory->updated_at = time::now();
            $contactcategory->save();
            $data=array(
                'success'=>true,
                'message'=>'Update Success'
            );
            return response()->json($data);
        // } catch(\Exception $e){
        //     $data=array(
        //         'success'=>false,
        //         'message'=>'Update Error'
        //     );
        //     return response()->json($data);
        // }
        
    }
    public function destroy($id)
    {
        $model=ContractCategory::find($id);
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
    
            $contractcategory = new ContractCategory;
            $contractcategory->title = $data['title'];
            $contractcategory->category_code = $data['category_code'];
            $contractcategory->cover_code = $data['cover_code'];
            $contractcategory->lhu_code = $data['lhu_code'];
            $contractcategory->sample_code = $data['sample_code'];
            $contractcategory->description = $data['description'];
            $contractcategory->active = 1;
            $contractcategory->insert_user = $id_user;
            $contractcategory->created_at = time::now();
            $contractcategory->updated_at = NULL;
            $contractcategory->save();
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
        }
        
    }
}