<?php

namespace App\Http\Controllers\Hris;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Hris\StatusDesc;
use Firebase\JWT\JWT;
use Carbon\Carbon as time;

class StatusDescController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function index(Request $request)
    {
        $model = StatusDesc::select('*');
        // $model = StatusDesc::all();

        $model = $model->get();

        return response()->json($model);
    }
    
    public function show(Request $request, $id)
    {
        $model = StatusDesc::find($id);
        return $model;
    }


}
