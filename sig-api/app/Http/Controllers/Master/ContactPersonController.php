<?php 
namespace App\Http\Controllers\Master;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Analysis\ContactPerson;
use App\Models\Analysis\Customerhandle;
use Firebase\JWT\JWT;
use Carbon\Carbon as time;
use DB;
use Auth;

class ContactPersonController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
    */

    public function index(Request $request)
    {
        if(!empty($request->input('search'))){
            $model = ContactPerson::select('*');
            if(strlen($request->input('search')) < 6){
                $model = $model->where(\DB::raw('UPPER(name)'),strtoupper($request->input('search')))->paginate(25);
            } else {
                $model = $model->where(\DB::raw('UPPER(name)'),'like','%'.strtoupper($request->input('search').'%'))->paginate(25);
            }
        }else{
            $model = ContactPerson::paginate(25);
        } 
    
        return response()->json($model);
    }

    public function getall(Request $request){
        $model = ContactPerson::all();

        return response()->json($model);
    }

    public function show(Request $request, $id)
    {
        $model = ContactPerson::find($id);

        return response()->json($model);
    }

    public function store(Request $request)
    {
        try{
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');
            
            $model = new ContactPerson;
            $model->name = $data['name'];
            $model->gender = $data['gender'];
            $model->telpnumber = $data['telpnumber'];
            $model->phonenumber = $data['phonenumber'];
            $model->fax = $data['fax'];
            $model->email = $data['email'];
            $model->desc = $data['desc'];
            // $model->customer_id = $data['customer_id'];
            $model->active = $data['active'];
            $model->inserted_user = $id_user;
            $model = $model->save();

            $data=array(
                'success'=>true,
                'message'=>'Saving Success'
            );
            return response()->json($data);
        } catch(\Exception $e){
            $data=array(
                'success'=>false,
                'message'=>'Saving Error'
            );
            return response()->json($e->getMessage());
        }
    }

    public function update(Request $request, $id)
    {
        try{
            $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = ContactPerson::find($id);

        $model->name = $data['name'];
        $model->gender = $data['gender'];
        $model->telpnumber = $data['telpnumber'];
        $model->phonenumber = $data['phonenumber'];
        $model->fax = $data['fax'];
        $model->email = $data['email'];
        $model->desc = $data['desc'];
        // $model->customer_id = $data['customer_id'];
        $model->active = $data['active'];
        $model->updated_user = $id_user;
        $model->save();

        
            $message=array(
                'success'=>true,
                'message'=>'Update Success'
            );

            return response()->json($message);

        } catch(\Exception $e){
            $message=array(
                'success'=>false,
                'message'=>'Update Error'
            );
            return response()->json($e->getMessage());
        }
            

    }

    public function destroy(Request $request, $id)
    {
        $t = \DB::table('mstr_customers_handle')->where('id_cp',$id)->get();
        if(count($t)>0){
            return response()->json(array(
                "success"=>false,
                "message"=>"Can`t Delete, Data is used"
            ));
        } else{
            $model = ContactPerson::find($id);
            $del = $model->delete();
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
    }

    public function selectedContact(Request $request){

        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = Customerhandle::with(['contact_person']);

        if(!empty($data['id_cp'])){
            $model=$model->where('id_cp', $data['id_cp']);;
        }

        if(!empty($data['id_customer'])){
            $model=$model->where('id_customer', $data['id_customer']);;
        }

        if(!empty($data['search'])){
            $search = $data['search'];
            $model = $model->whereHas('contact_person',function($query) use ($search){
                    $query->where(\DB::raw('UPPER(name)'),'like','%'.strtoupper($search).'%');
            });
        }

        $model = $model->groupBy('id_cp')->paginate(25);

        return response()->json($model);
    }

}