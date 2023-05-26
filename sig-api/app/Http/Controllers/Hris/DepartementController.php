<?php
namespace App\Http\Controllers\Hris;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Hris\Departement;
use Firebase\JWT\JWT;
use App\Models\Hris\Employee;
use Carbon\Carbon as time;
class DepartementController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function index(Request $request)
    {
        $model=Departement::select('*');

        if(!empty($request->input('company'))){
            if($request->input('company') > 1){
                $model = $model->where('company_id',$request->input('company'));
            }
        }

        if($request->has('search')){
            $model=$model->where(\DB::raw('UPPER(dept_name)'),'like','%'.strtoupper($request->input('search')).'%');
        }
        $model=$model->get();
        
        return response()->json($model);
    }

    public function show(Request $request,$id)
    {
        $model=Departement::find($id);
        return $model;
    }

    public function destroy($id)
    {
        $model=Departement::find($id);
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
            $emp = Employee::where('user_id',$id_user)->first();
            
            $s = new Departement;
            $s->dept_code = $data['dept_code'];
            $s->company_id = !empty($data['company_name']) ? $data['company_name'] : $emp->id_company;
            $s->dept_name = $data['dept_name'];
            $s->company_id = $data['company_name'];
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
            $emp = Employee::where('user_id',$id_user)->first();

            $s = Departement::find($id);
            $s->dept_code = $data['dept_code'];
            $s->company_id = !empty($data['company_name']) ? $data['company_name'] : $emp->id_company;
            $s->dept_name = $data['dept_name'];
            $s->company_id = $data['company_name'];
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