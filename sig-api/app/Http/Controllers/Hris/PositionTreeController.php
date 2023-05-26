<?php

namespace App\Http\Controllers\Hris;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Hris\PositionTree;
use Firebase\JWT\JWT;
use Carbon\Carbon as time;
use App\Models\Hris\Employee;

class PositionTreeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function index(Request $request)
    {
        $model = PositionTree::with(['position_head', 'division','subdiv'])->select('*');

        if (!empty($request->input('company'))) {
            if ($request->input('company') > 1) {
                $model = $model->where('company_id', $request->input('company'));
            }
        }

        $model = $model->get();

        return response()->json($model);
    }
    public function show(Request $request, $id)
    {
        $model = PositionTree::with(['position_head', 'division','subdiv'])->find($id);
        return $model;
    }
    public function destroy($id)
    {
        $model = PositionTree::find($id);
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
            $emp = Employee::where('user_id',$id_user)->first();
        
            $positiontree = new PositionTree;
            $positiontree->position_name = $data['position_name'];
            $positiontree->id_subdiv = $data['id_subdiv'];
            $positiontree->id_div = $data['id_div'];
            $positiontree->head_position = $data['head_position'];
            $positiontree->company_id = !empty($data['company_name']) ? $data['company_name'] : $emp->id_company;

            $positiontree->save();

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
            $emp = Employee::where('user_id',$id_user)->first();

            $positiontree = PositionTree::find($id);
            $positiontree->position_name = $data['position_name'];
            $positiontree->id_subdiv = $data['id_subdiv'];
            $positiontree->id_div = $data['id_div'];
            $positiontree->head_position = $data['head_position'];
            $positiontree->company_id = !empty($data['company_name']) ? $data['company_name'] : $emp->id_company;
            $positiontree->save();

            return response()->json(array(
                "success" => true,
                "message" => "success adding data"
            ));
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }
}
