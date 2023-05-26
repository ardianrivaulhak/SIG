<?php

namespace App\Http\Controllers\Hris;

use App\Http\Controllers\Controller;
use App\Models\Hris\Employee;
use App\Models\Hris\Leave;
use Illuminate\Http\Request;
use App\User;

use Illuminate\Support\Facades\Hash;
use DB;
use Illuminate\Support\Facades\File;
use Firebase\JWT\JWT;
use Carbon\Carbon as time;
use Intervention\Image\ImageManagerStatic as Image;

class LeaveController extends Controller
{
   
    public function leavehistory(Request $request)
    {
        $var = Leave::with(['statusattendance','employee','employee.bagian']);
        $var = $var->get();
        return response()->json($var);
    }

    public function leavedetail(Request $request){
        
        $var = Leave::with(['statusattendance','employee'])
        ->find($request->input('id'));

        return response()->json($var);
    }

    public function leaveadd(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $id_leave = isset($data['id_leave']) ? $data['id_leave'] : 'new';
        $va = $id_leave === 'new' ? new Leave : Leave::find($id_leave);

        // $va = $data['id_leave'] === 'new' ? new Leave : Leave::find($data['id_leave']);
        // $va = $id_leave === 'new' ? new Leave : Leave::find($id_leave);
        $va->employee_id = $data['me'];
        $va->id_status = $data['status_leave'];
        $va->start_date = $data['start_date'];
        $va->end_date = $data['end_date'];
        $va->clock_in = $data['clock_in'];
        $va->clock_out = $data['clock_out'];
        $va->desc = $data['desc'];
        $va->inserted_at = time::now();
        $va->save();

        return response()->json(array(
            "message" => "Success",
            "status" => true
        ));
    }

    public function delete_leave_history(Request $request, $id){

        $var = Leave::find($id)->forceDelete();

        return response()->json(array(
            "message" => "Success",
            "status" => true
        ));
    }

    
}