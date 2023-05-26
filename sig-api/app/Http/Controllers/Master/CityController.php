<?php
namespace App\Http\Controllers\Master;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Master\City;
class CityController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function index(Request $request)
    {
        $model=City::select('*');
        if($request->has('q')){
            $model=$model->where('city_name','like','%'.$request->input('q').'%');
        }
        $model=$model->get();
        
        return response()->json($model);
    }
    public function show(Request $request,$id)
    {
        $model=City::find($id);
        return $model;
    }
    public function destroy($id)
    {
        $model=City::find($id);
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