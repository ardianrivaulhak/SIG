<?php
namespace App\Http\Controllers\Hris;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Hris\Subdivision;
use App\Models\Hris\Employee;
use Firebase\JWT\JWT;
use Carbon\Carbon as time;
class SubdivisionController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function index(Request $request)
    {
        $model=Subdivision::with(['division'])->select('*');

        if(!empty($request->input('company'))){
            if($request->input('company') > 1){
                $model = $model->where('company_id',$request->input('company'));
            }
        }

        if($request->has('search')){
            $model=$model->where(\DB::raw('UPPER(name)'),'like','%'.strtoupper($request->input('search')).'%');
        }

        $model=$model->orderBy('name','asc')->get();   
        // $model=$model->get();
        
        return response()->json($model);
    }

    public function setsubdiv(Request $request){
        $var = Subdivision::where('id_div',$request->input('idiv'))->get();


        return response()->json($var);
    }
    public function show(Request $request,$id)
    {
        $model=Subdivision::find($id);
        return $model;
    }
    public function destroy($id)
    {
        $model=Subdivision::find($id);
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

            $s = new Subdivision;
            $s->name = $data['subdivision_name'];
            $s->id_div = $data['id_div'];
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

    public function update(Request $request, $id){
        try {
            
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');
            $emp = Employee::where('user_id',$id_user)->first();

            $s = Subdivision::find($id);
            $s->name = $data['subdivision_name'];
            $s->id_div = $data['id_div'];
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