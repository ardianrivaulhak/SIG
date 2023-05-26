<?php

namespace App\Http\Controllers\Analysis;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Analysis\Customerhandle;
use App\Models\Master\SubSpecificPackage;
use App\Models\Master\DetailSpecificPackage;
use Firebase\JWT\JWT;
use Barryvdh\DomPDF\Facade as PDF;
use Carbon\Carbon as time;
use App\Models\Analysis\Kontrakuji;

class CustomershandleController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function index(Request $request)
    {
        // return $request->all();
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = \DB::table('mstr_customers_handle as a')
            ->selectRaw('a.idch, b.kode_customer, b.customer_name, c.name, b.id_customer, c.id_cp, a.telp as telpnumber, c.gender, a.phone as phonenumber, a.fax, a.email')
            ->leftJoin('mstr_customers_customer as b', 'b.id_customer', 'a.id_customer')
            ->leftJoin('mstr_customers_contactperson as c', 'c.id_cp', 'a.id_cp')->whereNull('a.deleted_at');


        if (!empty($data['search'])) {
            if (strlen($data['search']) > 3) {
                $model = $model->where(\DB::raw('UPPER(customer_name)'), 'like', '%' . strtoupper($data['search']) . '%');
            } else {
                $model = $model->where(\DB::raw('UPPER(customer_name)'), strtoupper($data['search']));
            }
        }

        if ($request->has('all')) {
            $model = $model->get();
        } else {
            $model = $model->paginate(25);
        }

        return response()->json($model);
    }
    public function show(Request $request, $id)
    {
        $model = $model = \DB::table('mstr_customers_handle as a')
            ->selectRaw('
                a.idch, 
                b.kode_customer, 
                b.customer_name, 
                c.name, 
                b.id_customer, 
                c.id_cp, 
                a.telp as telpnumber, 
                c.gender, 
                a.phone as phonenumber, 
                a.fax, 
                a.email,
                d.phone_code
            ')
            ->join('mstr_customers_customer as b', 'b.id_customer', 'a.id_customer')
            ->join('mstr_customers_contactperson as c', 'c.id_cp', 'a.id_cp')
            ->leftJoin('countries as d', 'd.id', 'b.id_countries')
            ->whereNull('a.deleted_at')
            ->where('a.idch', $id)
            ->get();

        return response()->json($model);
    }

    public function update(Request $request, $id)
    {
        try {
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');
            // return $data['kode_lab'];
            $ch = Customerhandle::find($id);
            $ch->email = $data['email'];
            $ch->phone = $data['phone'];
            $ch->telp = $data['telp'];
            $ch->update_user = $id_user;
            $ch->updated_at = time::now();
            $ch->save();
            $data = array(
                'success' => true,
                'message' => 'Update Success'
            );
            return response()->json($data);
        } catch (\Exception $e) {
            $data = array(
                'success' => false,
                'message' => 'Update Error'
            );
            return response()->json($data);
        }
    }


    public function destroy(Request $request, $id)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        //? https://drive.google.com/drive/folders/1q-oyaDlG9cWaONP1gSSOYQs1a9DTULev

        $uji = Kontrakuji::whereNotNull('id_customers_handle')->get();

        if ($uji) {
            $data = array(
                'success' => false,
                'message' => 'Failed to delete data. It is used.'
            );
        } else {
            $model = Customerhandle::find($id);
            if ($model) {
                $model->delete_user = $id_user;
                $model->save();
                $del = $model->delete();
                if ($del) {
                    $data = array(
                        'success' => true,
                        'message' => 'Data deleted'
                    );
                } else {
                    $data = array(
                        'success' => false,
                        'message' => 'Failed to delete data'
                    );
                }
            } else {
                $data = array(
                    'success' => false,
                    'message' => 'Data not found'
                );
            }
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
            $checkdata = Customerhandle::where('id_customer', $data['id_cust'])->where('id_cp', $data['id_cp'])->get();

            // if(count($checkdata) > 0){
            //     $message = array(
            //         "success" => false,
            //         "message" => "Data sudah ada"
            //     );

            //     return response()->json($message);
            // } else {
            $ch = new Customerhandle;
            $ch->id_cp = $data['id_cp'];
            $ch->id_customer = $data['id_cust'];
            $ch->telp = !empty($data['telp']) ? $data['telp'] : '-';
            $ch->phone = !empty($data['phone']) ? $data['phone'] : '-';
            $ch->fax = !empty($data['fax']) ? $data['fax'] : '-';
            $ch->email = !empty($data['email']) ? $data['email'] : '-';
            $ch->insert_user = $id_user;
            $ch->created_at = time::now();
            $ch->save();

            $message = array(
                'success' => true,
                'message' => 'Saving Success',
                "idcusthandle" => $ch->idch
            );
            return response()->json($message);
            // }

        } catch (\Exception $e) {
            $data = array(
                'success' => false,
                'message' => 'Saving Error'
            );
            return response()->json($data);
            // return $e->getMessage();
        }
    }

    public function testing(Request $request)
    {

        // return response()->json(Hash::make('29011995'));
        // $v = SubSpecificPackage::all();

        // foreach($v as $dd){

        //     for($x = 0; $x < $dd->n; $x++){
        //         $detail = new DetailSpecificPackage;
        //         $detail->id_mstr_sub_specific_package = $dd->id;
        //         $detail->parameteruji_id = $dd->idparameter;
        //         $detail->position = $x + 1;
        //         $detail->save();
        //     }

        // }

        return response()->json(array(
            "status" => true,
            "message" => "ini baru"
        ));
    }
}
