<?php

namespace App\Http\Controllers\Hris;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Hris\SisterCompany;
use Firebase\JWT\JWT;
use Carbon\Carbon as time;

class SisterCompanyController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function index(Request $request)
    {
        $model = SisterCompany::select('*');
        // $model = SisterCompany::all();

        if(!empty($request->input('company'))){
            if($request->input('company') > 1){
                $model = $model->where('id_company',$request->input('company'));
            }
        }

        $model = $model->get();

        return response()->json($model);
    }
    
    public function show(Request $request, $id)
    {
        $model = SisterCompany::find($id);
        return $model;
    }
    public function destroy($id)
    {
        $model = SisterCompany::find($id);
        $del = $model->delete();
        if ($del) {
            $data = array(
                'success' => true,
                'message' => 'Data deleted'
            );
        } else {
            $data = array(
                'success' => false,
                'message' => 'Data failed to deleted'
            );
        }
        return response()->json($data);
    }

    public function store(Request $request)
    {
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            $s = new SisterCompany;
            $s->company_name = $data['company_name'];
            $s->desc = $data['desc'];
            $s->created_at = time::now();
            $s->inserted_user = $id_user;


            $s->save();

            return response()->json(array(
                "success" => true,
                "message" => "success adding data"
            ));
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function update(Request $request, $id)
    {
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            $s = SisterCompany::find($id);
            $s->company_name = $data['company_name'];
            $s->desc = $data['desc'];
            $s->updated_at = time::now();
            $s->updated_user = $id_user;
            $s->save();

            return response()->json(array(
                "success" => true,
                "message" => "success adding data"
            ));
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }
}
