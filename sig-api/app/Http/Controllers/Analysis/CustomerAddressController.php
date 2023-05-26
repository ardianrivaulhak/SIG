<?php

namespace App\Http\Controllers\Analysis;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Analysis\CustomerAddress;
use Firebase\JWT\JWT;
use DB;
use Auth;
use App\Models\Analysis\Kontrakuji;

class CustomerAddressController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */

    public function index(Request $request)
    {
        $model = CustomerAddress::with(['customers'])->has('customers');

        if ($request->has('search')) {
            $model = $model
                ->whereHas('customers', function ($s) use ($request) {
                    return $s->where(\DB::raw('UPPER(customer_name)'), 'like', '%' . $request->input('search') . '%');
                });
        }
        $model = $model->orderBy('created_at', 'DESC')->paginate(25);
        return response()->json($model);
    }

    public function show(Request $request, $id)
    {
        $model = CustomerAddress::with(['customers'])->find($id);

        return response()->json($model);
    }

    public function store(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;

        $model = new CustomerAddress();
        $data = $request->input('data');
        $model->address = $data['alamat'];
        // $model->desc = $request->input('desc');
        $model->customer_id = $data['customer_id'];
        $model->insert_user = $id_user;
        $result = $model->save();

        if ($result) {
            $data = array(
                'success'   => true,
                'message'   => 'Success add CustomerAddress'
            );
        } else {
            $data = array(
                'success'   => false,
                'message'   => 'Failed add CustomerAddress'
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
        $model = CustomerAddress::find($id);
        $model->address = $data['alamat'];
        // $model->desc = $request->input('desc');
        $model->customer_id = $data['customer_id'];
        $model->update_user = $id_user;
        $result =  $model->save();

        if ($result) {
            $data = array(
                'success'   => true,
                'message'   => 'Success update CustomerAddress'
            );
        } else {
            $data = array(
                'success'   => false,
                'message'   => 'Failed update CustomerAddress'
            );
        }

        return response()->json($data);
    }

    public function destroy(Request $request, $id)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;

        $model = CustomerAddress::find($id);
        $check = Kontrakuji::where('id_alamat_customer', $id)->get();
        if (count($check) > 0) {
            $data = array(
                'success'   => false,
                'message'   => 'Can`t Delete, Data is used'
            );
            return response()->json($data);
        } else {
            $model->delete_user = $id_user;
            $model->save();
            $delete = $model->delete();
            if ($delete) {
                $data = array(
                    'success'   => true,
                    'message'   => 'Data deleted'
                );
            } else {
                $data = array(
                    'success'   => false,
                    'message'   => 'Data failed to deleted'
                );
            }
            return response()->json($data);
        }
    }

    public function selectedAddress(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model=CustomerAddress::selectRaw('*')
        ->where('customer_id', $data['id_customer']);

        $model=$model->paginate(25);

        return response()->json($model);
    }
}
