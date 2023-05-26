<?php
namespace App\Http\Controllers\Hris;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Hris\EmployeeDesc;
use Firebase\JWT\JWT;
use Carbon\Carbon as time;

class EmployeeNotesController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */

    public function index(Request $request)
    {
        // ->where('id_status', $request->input('statusattendance'))

        $model=Division::select('*');

        if(!empty($request->input('company'))){
            if($request->input('company') > 1){
                $model = $model->where('company_id',$request->input('company'));
            }
        }

        if($request->has('search')){
            $model=$model->where(\DB::raw('UPPER(division_name)'),'like','%'.strtoupper($request->input('search')).'%');
        }

        $model=$model->get();     
        // $model=$model->get();     
        return response()->json($model);
    }

    public function show(Request $request,$id)
    {
        $model=EmployeeDesc::with([
            'employee'
        ])->find($id);
        
        return response()->json($model);
    }

    public function destroy($id)
    {
        $model=EmployeeDesc::find($id);
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

            $s = new EmployeeDesc;
            $s->id_employee = $data['employee_id'];
            $s->category = $data['category'];
            $s->desc = $data['desc'];
            $s->inserted_at = time::now();
            $s->save();

            return response()->json(array(
                "success" => true,
                "message" => "success adding data"
            ));


        } catch (\Exception $e){
            return response()->json($e->getMessage());
        }
    }

    public function update(Request $request,$id){
        try {
            
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            $s = EmployeeDesc::find($id);
            $s->id_employee = $data['employee_id'];
            $s->category = $data['category'];
            $s->desc = $data['desc'];
            $s->inserted_at = time::now();
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