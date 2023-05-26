<?php
namespace App\Http\Controllers\Hris;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Hris\Employee;

class HrisController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function employee(Request $request){
        // return $request->all();
        $model=Employee::with(
            [
                'city'
            
            ])->where('status',1);
        if(!empty($request->input('search'))){
            $model=$model->where('employee_name','like','%'.$request->input('search').'%');
        }
        if(!empty($request->input('martial'))){
            $model=$model->where('martial_status','like','%'.$request->input('martial').'%');
        }
        if(!empty($request->input('gender'))){
            $model=$model->where('gender','like','%'.$request->input('gender').'%');
        }
        if(!empty($request->input('religion'))){
            $model=$model->where('religion','like','%'.$request->input('religion').'%');
        }
        $model=$model->paginate(20);
        
        return response()->json($model);
    }

    public function level(Request $request){
        
    }
}