<?php 
namespace App\Http\Controllers\Analysis;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Analysis\CustomerTaxAddress;
use Firebase\JWT\JWT;
use DB;
use Auth;

class CustomerTaxAddressController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
    */

    public function index(Request $request)
    {
        $model = CustomerTaxAddress::with(['customers'])->has('customers');

        if($request->has('search')){
            $model = $model->whereHas('customers', function ($q) use ($request){
                $q->where(\DB::raw('UPPER(customer_name)'),'like','%'.strtoupper($request->input('search')).'%');
            });
        }

        $model = $model->paginate(25);
    
        return response()->json($model);
    }

    public function show(Request $request, $id)
    {
        $model = CustomerTaxAddress::with(['customers'])->find($id);

        return $model;
    }

    public function store(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');
        
        $model = new CustomerTaxAddress();

        $model->address = $data['alamat'];
        // $model->desc = $data['desc'];
        $model->customer_id = $data['customer_id'];
        $model->insert_user = $id_user;
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

        // return $request->all();
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');
        $model = CustomerTaxAddress::find($id);

        $model->address = $data['alamat'];
        // $model->desc = $data['desc'];
        $model->customer_id = $data['customer_id'];
        $model->update_user = $id_user;
        $result =  $model->save();

        
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
        
        $model = CustomerTaxAddress::find($id);
        $model->delete_user = $id_user;
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