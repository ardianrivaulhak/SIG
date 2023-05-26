<?php
namespace App\Http\Controllers\Hris;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Hris\TimetableFor;
use Firebase\JWT\JWT;
use Carbon\Carbon as time;

class TimetableForController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function index(Request $request)
    {
        $model=TimetableFor::select('*');
        if($request->has('search')){
            $model=$model->where(\DB::raw('UPPER(name)'),'like','%'.strtoupper($request->input('search')).'%');
        }
        $model=$model->get();
        
        return response()->json($model);
    }
    public function show(Request $request,$id)
    {
        $model=TimetableFor::find($id);
        return $model;
    }
    public function destroy($id)
    {
        $model=TimetableFor::find($id);
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
        try {
            
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');
            foreach($data as $v){
                $s = is_null($v['id']) ? new TimetableFor : TimetableFor::find($v['id']);
                $s->id_subdiv = intval($v['id_subdiv']);
                $s->save();
            }
            

            return response()->json(array(
                "success" => true,
                "message" => "success adding data"
            ));


        } catch (\Exception $e){
            return response()->json($e->getMessage());
        }
    }

    public function update(Request $request, $id){
        try {
            
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            $s = TimetableFor::find($id);
            $s->id_subdiv = $data['id_subdiv'];
            $s->save();

            return response()->json(array(
                "success" => true,
                "message" => "success adding data"
            ));


        } catch (\Exception $e){
            return response()->json($e->getMessage());
        }
    }
}