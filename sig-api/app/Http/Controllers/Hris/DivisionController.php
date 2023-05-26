<?php
namespace App\Http\Controllers\Hris;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Hris\Division;
use Firebase\JWT\JWT;
use App\Models\Hris\Employee;
use Carbon\Carbon as time;
class DivisionController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */

    public function index(Request $request)
    {
        // ->where('id_status', $request->input('statusattendance'))

        $model=Division::with(['dept'])->select('*');

        if(!empty($request->input('company'))){
            if($request->input('company') > 1){
                $model = $model->where('company_id',$request->input('company'));
            }
        }

        if($request->has('search')){
            $model=$model->where(\DB::raw('UPPER(division_name)'),'like','%'.strtoupper($request->input('search')).'%');
        }

        $model=$model->orderBy('division_name','asc')->get();     
        // $model=$model->get();     
        return response()->json($model);
    }

    public function show(Request $request,$id)
    {
        $model=Division::find($id);
        return $model;
    }

    public function destroy($id)
    {
        $model=Division::find($id);
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


            $s = new Division;
            $s->division_name = $data['division_name'];
            $s->id_dept = $data['dept_id'];
            $s->company_id = !empty($data['company_name']) ? $data['company_name'] : $emp->id_company;
            $s->insert_user = $id_user;
            $s->created_at = time::now();
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

            $s = Division::find($id);
            $s->division_name = $data['division_name'];
            $s->id_dept = $data['dept_id'];
            $s->company_id = !empty($data['company_name']) ? $data['company_name'] : $emp->id_company;
            $s->update_user = $id_user;
            $s->updated_at = time::now();
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