<?php
namespace App\Http\Controllers\Master;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Master\Team;
use App\Models\Master\MemberTeam;
use Firebase\JWT\JWT;
use Carbon\Carbon as time;

class TeamController extends Controller
{
    public function getDataTeam(Request $request)
    {   
        try{
            $model=Team::with(['subagian', 'pic']);
            if($request->has('search')){
                $model=$model->where(\DB::raw('UPPER(division_name)'),'like','%'.$request->input('search').'%');        
            }
            if($request->has('all')){
                $model=$model->get();
            } else {
                $model=$model->paginate(25);
            }        
            return response()->json($model);

        } catch(\Exception $e){
            $data=array(
                'success'=>false,
                'message'=>'Update Error'
            );
            return response()->json($data);
        }
    }

    public function detailDataTeam(Request $request, $id)
    {   
        try {

            $model=Team::find($id);
            return response()->json($model);
            
        } catch(\Exception $e){
            $data=array(
                'success'=>false,
                'message'=>'Update Error'
            );
            return response()->json($data);
        }
    }

    public function dataMember(Request $request, $id_group)
    {
        try {

            $model = MemberTeam::with(['group', 'employee'])->find($id_group);
            return response()->json($model);

        } catch(\Exception $e){

            $data=array(
                'success'=>false,
                'message'=>'Update Error'
            );
            return response()->json($data);
        }
    }
}