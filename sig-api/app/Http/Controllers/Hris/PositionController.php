<?php
namespace App\Http\Controllers\Hris;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Hris\Position;
use App\Models\Hris\PositionTree;

class PositionController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function index(Request $request)
    {
        $model=PositionTree::select("*");
        if($request->has('q')){
            $model=$model->where('position_name','like','%'.$request->input('q').'%');
        }
        if(!empty($request->input('company'))){
            $model=$model->where('company_id',$request->input('company'));
        }
        $model=$model->paginate(200);
        
        return response()->json($model);
    }
    public function show(Request $request,$id)
    {
        $model=PositionTree::find($id);
        return $model;
    }
    public function destroy($id)
    {
        $model=PositionTree::find($id);
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