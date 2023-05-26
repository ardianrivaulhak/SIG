<?php 
namespace App\Http\Controllers\Analysis;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Analysis\ContactPerson;
use Firebase\JWT\JWT;
use DB;
use Auth;

class ContactPersonController extends Controller
{
    /**
     * Create a new controller instance.
     * bachtiar
     * @return void
    */

    public function index(Request $request)
    {
        if(!empty($request->input('search'))){
            $model = ContactPerson::where(DB::raw('upper(name)'),'like','%'.$request->input('search').'%')->paginate(25);
        }else{
            $model = ContactPerson::whereNotNull('name')->paginate(25);
        } 
    
        return response()->json($model);
    }

    public function show(Request $request, $id)
    {
        $model = ContactPerson::find($id);

        return $model;
    }

    public function store(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');
        $model = new ContactPerson();

        $model->name = $data['name'];
        $model->gender = $data['gender'];
        $model->telpnumber = $data['telpnumber'];
        $model->phonenumber = $data['phonenumber'];
        $model->fax = $data['fax'];
        $model->email = $data['email'];
        $model->desc = $data['desc'];
        $model->customer_id = $data['customer_id'];
        $model->active = $data['active'];
        $model->inserted_user = $id_user;
        $result = $model->save();

        if($result){
            $data = array(
                'success'   => true,
                'message'   => 'Success add contact'
            );
        }else{
            $data = array(
                'success'   => false,
                'message'   => 'Failed add contact'
            );
        }
        
        return response()->json($data);
    }

    public function update(Request $request, $id)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        return $data = $request->input('data');

        $model = ContactPerson::find($id);

        $model->name = $data['name'];
        $model->gender = $data['gender'];
        $model->telpnumber = $data['telpnumber'];
        $model->phonenumber = $data['phonenumber'];
        $model->fax = $data['fax'];
        $model->email = $data['email'];
        $model->desc = $data['desc'];
        $model->customer_id = $data['customer_id'];
        $model->active = $data['active'];
        $model->updated_user = $id_user;
        $result = $model->save();
        
        if($result){
            $data = array(
                'success'   => true,
                'message'   => 'Success update contact'
            );
        }else{
            $data = array(
                'success'   => false,
                'message'   => 'Failed update contact'
            );
        }
        
        return response()->json($data);

    }

    public function destroy(Request $request, $id)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        
        $model = ContactPerson::find($id);
        $model->deleted_user = $id_user;
        $model->save();
        
        $delete = $model->delete();

        if($delete){
            $data = array(
                'success'   => true,
                'message'   => 'Data deleted'
            );
        }else{
            $data=array(
                'success'   => false,
                'message'   => 'Data failed to deleted'
            );
        }
        
        return response()->json($data);
    }

}