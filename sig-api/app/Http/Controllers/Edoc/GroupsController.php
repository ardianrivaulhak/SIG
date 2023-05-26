<?php
namespace App\Http\Controllers\Edoc;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Firebase\JWT\JWT;
use Carbon\Carbon as time;
use App\Models\Edoc\Masterdocuments;
use App\Models\Edoc\AttachmentDocuments;
use App\Models\Edoc\DocumentInheritances;
use App\Models\Edoc\Documents;
use App\Models\Edoc\Groups;
use App\Models\Hris\Employee;
use App\Models\Hris\Employee_education;
use App\Models\Hris\Competence;
use App\Models\Hris\EmployementDetail;
use App\User;
use App\Models\Edoc\TransactionGroups;
use App\Models\Edoc\DocumentViewers;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use DB;
use Auth;

use Intervention\Image\ImageManagerStatic as Image;

class GroupsController extends Controller
{
     /**
     * Create a new controller instance.
     *
     * @return void
     */

     public function index(Request $request)
     {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = Groups::with(['Employee']);

        if(!empty($data['namegroup'])){
            $model=$model->where(\DB::raw('UPPER(group_name)'),'like','%'.$data['namegroup'].'%');
        }

        $model= $model->paginate(25);

        return response()->json($model); 

     }

     public function groupDetail(Request $request)
     {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = Groups::with(['Employee'])->where('id', $data['id'])->first();

        return response()->json($model); 

     }

     public function groupDetailEmployee(Request $request)
     {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        

        $model = TransactionGroups::with([
            'Group',
            'Employee.bagian',
            'EmployeeCreate'
        ])->where('id_group', $data['id_group']);

        if(!empty($data['search'])){
            $employee = Employee::where(\DB::raw('UPPER(employee_name)'),'like','%'.$data['search'].'%')->get()->toArray();
            $emp_id = array_map(function ($employee) {
                return $employee['employee_id'];
            }, $employee);

            $model = $model->whereIn('id_user', $emp_id);
        }
        $model = $model->paginate(100);

        return response()->json($model);
     }

     public function AddEmployeetoGroup(Request $request)
     {

        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = New TransactionGroups;
        $model->id_group = $data['id_group'];
        $model->id_user = $data['id_user'];
        $model->user_create = $id_user;
        $model->save();

        $message = array(
            'status' => true,
            'message' => 'success'
        );

        return response()->json($message);

     }

     public function DeleteEmployeeinGroup(Request $request)
     {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = TransactionGroups::where('id', $data)->first();
        $model->delete();

        $message = array(
            'status' => true,
            'message' => 'success'
        );

        return response()->json($message);
        
     }

     public function employeeData(Request $request)
    {
        // return $request->all();
        $var = $request->input('datasend');
        // return $request->input('datasend')['pages'];
        $w = $var['added'];
        $model=Employee::with(
            [
                'city',
                'user',
                'position',
                'level',
                'desc',
                'bagian',
                'dept',
                'subagian',
                'groupiso' => function($q) use ($w) {
                    $q->where('id_group', $w);
                }
           
            ])
            // ->where('status',1)
            ->where('user_id','<>',309)
            ->orderBy('employee_name','ASC');

        if(!empty($var['search'])){
            $model=$model->where(DB::raw('UPPER(employee_name)'),'like','%'.strtoupper($var['search']).'%')
            ->orWhereHas('user',function($q) use ($var){
                return $q->where(DB::raw('UPPER(email)'),'like','%'.strtoupper($var['search']).'%');
            });
        }

      //   if(!empty($var['added'])){
      //    $model=$model->where(\DB::raw('UPPER(sample_name)'),'like','%'.$data['sample'].'%');
      //   }

        $model=$model->paginate(500);
        
        return response()->json($model);
    }

    public function addNewGroup(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

         $groups = New Groups;
         $groups->group_name = $data['group_name'];
         $groups->id_user = $id_user;
         $groups->save();

         foreach($data['employee'] as $employee)
         {
            $trans = New TransactionGroups;
            $trans->id_group = $groups->id;
            $trans->id_user = $employee['id'];
            $trans->user_create = $id_user;
            $trans->save();
         } 

            $message = array(
               'status' => true,
               'message' => 'success'
         );

         return response()->json($message);
    }
}