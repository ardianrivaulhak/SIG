<?php

namespace App\Http\Controllers\Analysis;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Analysis\Customer;
use App\Models\Master\InfoKeuanganCust;
use App\Models\Master\Regencies;
use App\Models\Master\Provinces;
use App\Models\Master\Npwp;
use Firebase\JWT\JWT;
use DB;
use Auth;
use Carbon\Carbon as time;

class CustomerController extends Controller
{
    /**
     * Create a new controller instance.
     * test
     * @return void
     */

    public function index(Request $request)
    {

        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');


        $model = Customer::with([
            'city',
            'info_keu_cust',
            'customer_npwp'
        ]);

        // return $request->input('search');

        if (!empty($data['search'])) {
            $model = $model->where(\DB::raw('UPPER(customer_name)'), 'like', '%' . strtoupper($data['search']) . '%')
                ->paginate(25);
        } else {
            $model = $model->paginate(25);
        }

        return response()->json($model);
    }

    public function getall(Request $request)
    {

        $model = Customer::with([
            'city',
            'info_keu_cust',
            'customer_npwp'
        ])->get();
        return response()->json($model);
    }


    public function show(Request $request, $id)
    {
        $model = Customer::with([
            'customer_npwp',
            'countries',
            'customer_mou',
            'customer_address',
            'customer_taxaddress6',
            'customers_handle6'
        ])->find($id);
        return response()->json($model);
    }



    public function getPhoneCode(Request $request)
    {
        try {

            $var = \DB::table('countries');

            if ($request->has('search')) {
                $var = $var->where('country_name', 'like', '%' . $request->input('search') . '%');
            }

            $var = $var->paginate(300);

            return response()->json($var);
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    // public function address(Request $request, $id)
    // {
    //     $model = DB::table('mstr_customers_customer')
    //         ->join('mstr_customers_address', 'mstr_customers_address.customer_id', '=', 'mstr_customers_customer.id_customer')
    //         ->where('mstr_customers_customer.id_customer', $id)
    //         ->get();

    //     return $model;
    // }

    // public function tax_addess(Request $request, $id)
    // {
    //     $model = DB::table('mstr_customers_taxaddress')
    //         ->join('mstr_customers_customer', 'mstr_customers_taxaddress.customer_id', '=', 'mstr_customers_customer.id_customer')
    //         ->where('mstr_customers_customer.id_customer', $id)
    //         ->select('mstr_customers_taxaddress.address as taxaddress', 'mstr_customers_taxaddress.desc as desc_tax')
    //         ->get();

    //     return $model;
    // }

    public function npwpadd(Request $request)
    {
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            $var = new Npwp;
            $var->id_customer = $data['idcust'];
            $var->npwp_number = $data['numbernpwpktp'];
            $var->name = $data['namanpwp'];
            $var->address = $data['alamatnpwp'];
            $var->info = $data['valuenpwpktp'];
            $var->user_id = $id_user;
            $var->save();

            return response()->json($var);
        } catch (\Exception $e) {
            return response($e->getMessage());
        }
    }

    public function npwpdelete(Request $request, $id)
    {

        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = Npwp::find($id);

        $delete = $model->delete();

        if ($delete) {
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

            $check = Customer::all();
            $nosetelah = count($check) + 1;
            $aa = $check->last();

            $va_account = '68277' . str_pad($aa->id_customer, 6, '0', STR_PAD_LEFT);

            $customer = new Customer;
            $customer->kode_customer = 'N' . $nosetelah;
            $customer->customer_name = $data['customer_name'];
            $customer->termin = $data['termin'];
            $customer->id_city = !empty($data['city']) ? $data['city'] : null;
            $customer->id_province = !empty($data['province']) ? $data['province'] : null;
            $customer->id_regenci = !empty($data['regencies']) ? $data['regencies'] : null;
            $customer->status_invoice = !empty($data['status_invoice']) ? $data['status_invoice'] : 2;
            $customer->status_cust = $data['status_cust'];
            $customer->id_user_ar = $data['id_ar'];
            $customer->description = $data['description'];
            $customer->select_va = $data['select_va'];
            $customer->no_va = $va_account;
            $customer->created_at = time::now();
            $customer->save();

            foreach ($data['npwp'] as $npwp) {
                $m = new Npwp;
                $m->id_customer = $customer->id_customer;
                $m->info = $npwp['file'];
                $m->npwp_number = $npwp['number'];
                $m->name = $npwp['name'];
                $m->address = $npwp['address'];
                $m->user_id = $id_user;
                $m->save();
            }

            $asd = array(
                'success' => true,
                'message' => 'Saving Success',
                'data' => $customer
            );
            return response()->json($asd);
        } catch (\Exception $e) {
            $data = array(
                'success' => false,
                'message' => 'Saving Error'
            );
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

            $customer = Customer::find($id);
            $customer->customer_name = $data['customer_name'];
            $customer->termin = $data['termin'];
            $customer->id_city = !empty($data['city']) ? $data['city'] : null;
            $customer->id_province = !empty($data['province']) ? $data['province'] : null;
            $customer->id_regenci = !empty($data['regencies']) ? $data['regencies'] : null;
            $customer->status_invoice = !empty($data['status_invoice']) ? $data['status_invoice'] : 2;
            $customer->status_cust = $data['status_cust'];
            $customer->id_user_ar = $data['id_ar'];
            $customer->description = $data['description'];
            $customer->select_va = $data['select_va'];
            $customer->no_va = $data['no_va'];

            foreach ($data['npwp'] as $npwp) {

                if ($npwp['id'] == 'add') {
                    $m = new Npwp;
                    $m->id_customer = $id;
                    $m->info = $npwp['file'];
                    $m->npwp_number = $npwp['number'];
                    $m->name = $npwp['name'];
                    $m->address = $npwp['address'];
                    $m->save();
                } else {

                    $m = Npwp::where('id', $npwp['id'])->first();
                    $m->info = $npwp['file'];
                    $m->npwp_number = $npwp['number'];
                    $m->name = $npwp['name'];
                    $m->address = $npwp['address'];
                    $m->save();
                }
            }

            foreach ($data['deletenpwp'] as $deletenpwp) {
                if ($deletenpwp['id'] != 'add') {
                    $m = Npwp::where('id', $deletenpwp['id'])->first();
                    $m->delete();
                }
            }

            $customer->save();
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

    public function info_keu_cust(Request $request)
    {
        try {
            $var = DB::table('info_keu_customer')->where('id_cust', $request->input('id_cust'))->get();


            return response()->json($var);
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function add_info_keu_cust(Request $request)
    {
        try {
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;

            $data = $request->input('data');
            $checkData = InfoKeuanganCust::where('id_cust', $data['id_cust'])->get();

            if (count($checkData) > 0) {
                $var = InfoKeuanganCust::find($checkData[0]->id);
                $var->id_cust = $data['id_cust'];
                // $var->coa = $data['coa'];
                // $var->giro = $data['gr'];
                // $var->po = $data['po'];
                // $var->berita_acara = $data['ba'];
                // $var->ttb = $data['ttb'];
                // $var->spk = $data['spk'];
                $var->lunas = $data['lunas'];
                $var->save();
            } else {
                $var = new InfoKeuanganCust;
                $var->id_cust = $data['id_cust'];
                // $var->coa = $data['coa'];
                // $var->giro = $data['gr'];
                // $var->po = $data['po'];
                // $var->berita_acara = $data['ba'];
                // $var->ttb = $data['ttb'];
                // $var->spk = $data['spk'];
                $var->lunas = $data['lunas'];
                $var->save();
            }


            return response()->json(array(
                "status" => true,
                "message" => "Success Adding Info Customer"
            ));
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function destroy(Request $request, $id)
    {
        $model = Customer::find($id);

        $kontrak = \DB::table('mstr_customers_handle')->where('id_customer', $id)->get();

        if (count($kontrak) > 0) {
            return response()->json(array(
                'success' => false,
                'message' => 'Can`t Delete, Data is used'
            ));
        } else {
            $delete = $model->delete();

            if ($delete) {
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
    }

    public function provinces(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;

        $data = $request->input('data');

        $model = Provinces::select('*');
        if (!empty($data['search'])) {
            $model = $model->where(\DB::raw('UPPER(name)'), 'like', '%' . trim($data['search']) . '%');
        }

        $model = $model->get();

        return response()->json($model);
    }

    public function regencies(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = Regencies::where('province_id', $data)->get();
        return response()->json($model);
    }

    public function selectedCustomer(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = Customer::selectRaw('*');

        if (!empty($data['id_customer'])) {
            $model = $model->where('id_customer', $data['id_customer']);;
        }

        if (!empty($data['search'])) {
            $model = $model->where(\DB::raw('UPPER(customer_name)'), 'like', '%' . strtoupper($data['search']) . '%');
        }
        $model = $model->paginate(25);

        return response()->json($model);
    }

    public function generateVA(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $cust = Customer::all();
        foreach ($cust as $c) {
            $satuan = Customer::where('id_customer', $c->id_customer)->first();
            $satuan->no_va =  '68277' . str_pad($c->id_customer, 6, '0', STR_PAD_LEFT);
            $satuan->save();
        }
    }
}
