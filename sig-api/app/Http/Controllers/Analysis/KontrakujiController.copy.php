<?php

namespace App\Http\Controllers\Analysis;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Analysis\Kontrakuji;
use App\Models\Analysis\Description;
use App\Models\Ecert\ConditionCert;
use App\Models\Analysis\Customerhandle;
use App\Models\Analysis\ConditionContractNew;
use App\Models\Analysis\ContractAttachment;
use App\Models\Analysis\ConditionContract;
use App\Models\Analysis\TransactionSample;
use App\Models\Analysis\Transaction_parameter;
use App\Models\Analysis\CustomerAddress;
use App\Models\Analysis\CustomerTaxAddress;
use App\Models\Analysis\BobotSample;
use App\Models\Analysis\AkgTransaction;
use App\Models\Analysis\SamplingTransaction;
use App\Models\Analysis\PaymentCondition;
use App\Models\Analysis\PaymentData;
use App\Models\Master\Photo;
use App\Models\Master\Paketuji;
use App\Models\Master\ContractCategory;
use App\Models\Analysis\ContractMessage;
use App\Models\Hris\Employee;
use App\Models\Master\Mou;
use App\Models\Analysis\TransactionDiscount;
use App\Models\Analysis\ConditionLabCome;
use App\Models\Analysis\ConditionLabProccess;
use App\Models\Analysis\ConditionLabDone;
// use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Response;
// use App\CheckMail;
use Firebase\JWT\JWT;
use Carbon\Carbon as time;
use Intervention\Image\ImageManagerStatic as Image;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Mail;
use DB;
use GrahamCampbell\Flysystem\Facades\Flysystem;
use App\Models\Ecert\Ecertlhu;

class KontrakujiController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */

    public function indexlight(Request $request)
    {
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input("data");

            $v = ConditionContractNew::with([
                'user',
                'kontrakuji.tgl_selesai',
                'kontrakuji.contract_category',
                'kontrakuji.customers_handle.customers',
                'kontrakuji.customers_handle.contact_person',
                'kontrakuji.status_invoices'
            ])
                ->select(
                    'id_condition_contract',
                    'position',
                    // 'inserted_at',
                    \DB::raw('DATE_FORMAT(inserted_at, "%d/%m/%Y %H:%i:%s") as inserted_at'),
                    'contract_id',
                    'user_id',
                    'status'
                )
                ->where('position', 1)
                ->where('status', '<>', 5)
                // ->has('kontrakuji.tgl_selesai')
                ->whereIn('contract_id', [\DB::raw('SELECT id_contract FROM transaction_sample')]);
            // if(!empty($data['pagefor'])){
            //     if($data['pagefor']  == 'cs'){
            //         $v = $v->whereNotIn('contract_id',[\DB::raw('SELECT contract_id FROM condition_contracts h where h.position = 4  and h.status = 1 group by h.contract_id')]);
            //     }
            // }

            if (!empty($data['search'])) {
                if ($data['search'] !== "") {
                    $v = $v->whereHas('kontrakuji', function ($q) use ($data) {
                        $y = TransactionSample::where(\DB::raw('UPPER(sample_name)'), 'like', '%'.trim(strtoupper($data['search'])).'%')->select('id_contract')->get()->toArray();
                        $ya = Kontrakuji::where(\DB::raw('UPPER(contract_no)'), 'like', '%'.trim(strtoupper($data['search'])). '%')->select(\DB::raw('id_kontrakuji as id_contract'))->get()->toArray();
                        $yb = TransactionSample::where(\DB::raw('UPPER(no_sample)'), 'like', '%'.trim(strtoupper($data['search'])).'%')->select('id_contract')->get()->toArray();
                        $zc = array_merge($y, $ya, $yb);
                        return $q->whereIn('id_kontrakuji', $zc);
                    });
                }
            }

            if (!is_null($data['user'])) {
                if ($data['user'] > 0) {
                    $v = $v->whereHas('user', function ($q) use ($data) {
                        return $q->where('user_id', $data['user']);
                    });
                }
            }

            if (!is_null($data['contract_category'])) {
                if ($data['contract_category'] > 0) {
                    $v = $v->whereHas('kontrakuji', function ($q) use ($data) {
                        return $q->where('id_contract_category', $data['contract_category']);
                    });
                }
            }

            if (!is_null($data['customers'])) {
                if ($data['customers'] > 0) {
                    $v = $v->whereHas('kontrakuji', function ($q) use ($data) {
                        return $q->whereHas('customers_handle', function ($y) use ($data) {
                            return $y->where('id_customer', $data['customers']);
                        });
                    });
                }
            }

            if (!is_null($data['tgl_selesai'])) {
                $v = $v->whereHas('kontrakuji', function ($q) use ($data) {
                    return $q->whereHas('tgl_selesai', function ($y) use ($data) {
                        return $y->where(\DB::raw('DATE_FORMAT(tgl_selesai,"%Y-%m-%d")'), $data['tgl_selesai']);
                    });
                });
            }

            if (($data['status']) > 0) {
                   $v = $v->whereHas('kontrakuji',function($q) use($data) {
                        return $q->where('contract_type',$data['status']);
                   });
               }

            if($data['statuscontract'] > 0){
                $st = $data['statuscontract'] == 1 ? 0 : 1;
                $v = $v->where('status',$st);
            }

            $v = $v->orderBy('contract_id', 'desc')
                ->groupBy('contract_id')
                ->paginate(25);

            return response()->json($v);
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function allowContractRevision(Request $request){
        try {
            $var = Kontrakuji::find($request->input('contract_id'));
            $var->status_inv = 2;
            $var->save();

            return response()->json(array(
                "status" => true,
                "message" => "Success updating Data !"
            ));

        } catch (\Exception $e){
            return response()->json($e->getMessage());
        }
    }

    public function indexlightfinder(Request $request)
    {
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input("data");

           

            if (!empty($data['excel'])) {
                return $a = $this->excelForSales($request->merge(['data',$data]));
                return response()->json($a->original);
            } else {
                $v = Kontrakuji::with([
                    'tgl_selesai',
                    'condition_cert',
                    'contract_category',
                    'customers_handle.customers',
                    'customers_handle.contact_person'
                ])
                    ->select(
                        'mstr_transaction_kontrakuji.*',
                        'condition_contracts.status',
                        \DB::raw('DATE_FORMAT(condition_contracts.inserted_at, "%d/%m/%Y %H:%i:%s") as inserted_at'),
                        'hris_employee.employee_name'
                    )
                    ->join('condition_contracts', 'condition_contracts.contract_id', 'mstr_transaction_kontrakuji.id_kontrakuji')
                    ->join('hris_employee', 'hris_employee.user_id', 'condition_contracts.user_id')
                    ->where('condition_contracts.position', 1)
                    ->where('condition_contracts.status', '<>', 5)
                    ->whereIn('mstr_transaction_kontrakuji.id_kontrakuji', [\DB::raw('SELECT id_contract FROM transaction_sample')]);
    
    
                if (!empty($data['search'])) {
    
                    $samplename = \DB::table('transaction_sample as bz')
                        ->select('bz.id_contract')
                        ->where(\DB::raw('UPPER(bz.sample_name)'), 'like', '%' . trim(strtoupper($data['search'])) . '%')
                        ->get()
                        ->toArray();
    
                    if (count($samplename) < 1) {
    
                        $check = \DB::table('transaction_sample as a')
                            ->select('a.id_contract')
                            ->where(\DB::raw('UPPER(a.no_sample)'), trim(strtoupper($data['search'])))
                            ->get();
    
                        if (count($check) > 0) {
                            $v = $v->where('mstr_transaction_kontrakuji.id_kontrakuji', $check[0]->id_contract);
                        } else {
                            $v = $v->where(\DB::raw('UPPER(mstr_transaction_kontrakuji.contract_no)'), 'like', '%' . trim(strtoupper($data['search'])) . '%');
                        }
                    } else {
    
                        $azz = array_map(function ($q) {
                            return $q->id_contract;
                        }, $samplename);
    
                        $v = $v->whereIn('mstr_transaction_kontrakuji.id_kontrakuji', $azz);
                    }
                }
    
                if (!empty($data['user_created'])) {
                    if ($data['user_created'] > 0) {
                        $v = $v->where('condition_contracts.user_id', $data['user_created']);
                    }
                }
    
                if (!is_null($data['contract_category'])) {
                    if ($data['contract_category'] > 0) {
                        $v = $v->where('mstr_transaction_kontrakuji.id_contract_category', $data['contract_category']);
                    }
                }
    
                if (!is_null($data['customers'])) {
                    if ($data['customers'] > 0) {
                        $v = $v->whereHas('customers_handle', function ($y) use ($data) {
                            return $y->where('id_customer', $data['customers']);
                        });
                    }
                }
    
                if (!is_null($data['no_po'])) {
                    if ($data['no_po'] !== '-') {
                        $v = $v->where('mstr_transaction_kontrakuji.no_po', trim($data['no_po']));
                    }
                }
    
                if (!is_null($data['no_penawaran'])) {
                    if ($data['no_penawaran'] !== '-') {
                        $v = $v->where('mstr_transaction_kontrakuji.no_penawaran', trim($data['no_penawaran']));
                    }
                }
    
                if (!is_null($data['tgl_selesai'])) {
                    $t = \DB::table('transaction_sample as a')
                    ->selectRaw('a.id_contract')
                    ->where(\DB::raw('DATE_FORMAT(a.tgl_selesai,"%Y-%m-%d")'), $data['tgl_selesai'])
                    ->get()
                    ->toArray();
    
                    $xc = array_map(function ($q) {
                        return $q->id_contract;
                    }, $t);
    
                    $v = $v->whereIn('mstr_transaction_kontrakuji.id_kontrakuji', $xc);
                }
    
                if (!empty($data['statuskontrak'])) {
                    if ($data['statuskontrak'] !== 'all') {
                        if ($data['statuskontrak'] == 1) {
    
                            $v = $v->where('condition_contracts.status', 0);
                        } else if ($data['statuskontrak'] == 2) {
                            $dz = \DB::connection('mysqlcertificate')
                                ->table('condition_sample_cert as az')
                                ->select('az.id_contract')
                                ->whereIn('az.status', [4, 3])
                                ->orderBy('az.status', 'desc')
                                ->groupBy('az.id_contract')
                                ->get()->toArray();
    
                            $z = array_map(function ($da) {
                                return $da->id_contract;
                            }, $dz);
    
                            $v = $v->whereNotIn('mstr_transaction_kontrakuji.id_kontrakuji', $z)
                                ->where('condition_contracts.status', 1);
                        } else if ($data['statuskontrak'] == 3) {
    
                            // return  'a';
    
                            $dzz = \DB::connection('mysqlcertificate')
                                ->table('condition_sample_cert as az')
                                ->select('az.id_contract')
                                ->whereIn('az.status', [4])
                                ->orderBy('az.status', 'desc')
                                ->groupBy('az.id_contract')
                                ->get()->toArray();
    
                            $zsd = array_map(function ($xda) {
                                return $xda->id_contract;
                            }, $dzz);
    
                            $v = $v->whereIn('mstr_transaction_kontrakuji.id_kontrakuji', $zsd);
                        } else if ($data['statuskontrak'] == 4) {
    
                            $dza = \DB::connection('mysqlcertificate')
                                ->table('condition_sample_cert as az')
                                ->select('az.id_contract')
                                ->where('az.status', 3)
                                ->whereNotIn('az.id_contract', [\DB::raw('SELECT id_contract FROM condition_sample_cert where status = 4')])
                                ->orderBy('az.status', 'desc')
                                ->groupBy('az.id_contract')
                                ->get()->toArray();
    
                            $za = array_map(function ($dab) {
                                return $dab->id_contract;
                            }, $dza);
    
                            $v = $v->whereIn('mstr_transaction_kontrakuji.id_kontrakuji', $za);
                        }
                    }
                }
    
                $v = $v->orderBy('mstr_transaction_kontrakuji.created_at', 'desc')
                    ->groupBy('mstr_transaction_kontrakuji.id_kontrakuji')->paginate(25);
            }

            return response()->json($v);
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }


    public function checkcontractsamplelab(Request $request){
        try{

            $v = \DB::table('invoice_detail as a')
            ->where('a.id_contract',$request->input('contract_id'))
            ->get();

            return response()->json($v);

        } catch(\Exception $e){
            return response()->json($e->getMessage());
        }
    }
    public function index(Request $request)
    {

        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $now = time::parse(time::now())->format('Y');
        $nowmonth = time::parse(time::now())->format('m');
        $v = [];
        // $data = $request->input('data');
        $var = \DB::table('condition_contracts as a')
            ->selectRaw('
            b.contract_no,
            c.title,
            b.id_contract_category,
            e.customer_name,
            f.name,
            b.no_po,
            b.no_penawaran,
            d.id_customer,
            DATE_FORMAT(a.inserted_at, "%d/%m/%Y - %H:%i:%s") as inserted_at,
            a.user_id,
            g.employee_name,
            b.status_inv,
            a.status,
            b.hold,
            b.id_kontrakuji,
            d.phone,
            d.telp,
            d.email,
            IFNULL(labapp.status,0) as status_lab
        ')
            ->leftJoin('mstr_transaction_kontrakuji as b', 'b.id_kontrakuji', 'a.contract_id')
            ->leftJoin('mstr_products_contactcategory as c', 'c.id', 'b.id_contract_category')
            ->leftJoin('mstr_customers_handle as d', 'd.idch', 'b.id_customers_handle')
            ->leftJoin('mstr_customers_customer as e', 'e.id_customer', 'd.id_customer')
            ->leftJoin('mstr_customers_contactperson as f', 'f.id_cp', 'd.id_cp')
            ->leftJoin('hris_employee as g', 'g.user_id', 'a.user_id')
            ->leftJoin(\DB::raw('(SELECT * FROM condition_contracts h where h.position = 4 group by h.contract_id) as labapp'), 'labapp.contract_id', 'b.id_kontrakuji')
            ->where('a.position', 1)
            // ->where(\DB::raw('MONTH(a.inserted_at)'),$now)
            ->whereNotNull('b.id_kontrakuji')
            ->groupBy('b.id_kontrakuji');

        if (
            $request->input('status') == 0 &&
            $request->input('category') == 0 &&
            $request->input('month') == 0 &&
            ($request->input('no_penawaran') == 'undefined' || $request->input('no_penawaran') == '-') &&
            ($request->input('no_po') == 'undefined' || $request->input('no_po') == '-') &&
            $request->input('customers') == 0 &&
            $request->input('user_created') == 0 &&
            empty($request->input('search'))
        ) {
            $var = $var->where(\DB::raw('YEAR(a.inserted_at)'), $now);
        }

        if (!empty($request->input('statuskontrak')) && $request->input('statuskontrak') !== 'all') {
            if ($request->input('statuskontrak') == 3) {

                $d = \DB::connection('mysqlcertificate')
                    ->table('condition_sample_cert as az')
                    ->where('az.status', 4)
                    ->orderBy('az.status', 'desc')
                    ->groupBy('az.id_contract')
                    ->get()->toArray();

                $z = array_map(function ($d) {
                    return $d->id_contract;
                }, $d);

                $var = $var->whereIn('a.contract_id', $z);
            } else if ($request->input('statuskontrak') == 4) {

                $d = \DB::connection('mysqlcertificate')
                    ->table('condition_sample_cert as az')
                    ->select('az.id_contract')
                    ->where('az.status', 3)
                    ->whereNotIn('az.id_contract', [\DB::raw('SELECT id_contract FROM condition_sample_cert where status = 4')])
                    ->orderBy('az.status', 'desc')
                    ->groupBy('az.id_contract')
                    ->get()->toArray();

                $z = array_map(function ($d) {
                    return $d->id_contract;
                }, $d);

                $var = $var->whereIn('a.contract_id', $z);
            } else if ($request->input('statuskontrak') == 2) {

                $d = \DB::connection('mysqlcertificate')
                    ->table('condition_sample_cert as az')
                    ->select('az.id_contract')
                    ->whereIn('az.status', [3, 4])
                    ->orderBy('az.status', 'desc')
                    ->groupBy('az.id_contract')
                    ->get()->toArray();

                $z = array_map(function ($d) {
                    return $d->id_contract;
                }, $d);

                $var = $var->whereNotIn('a.contract_id', $z)->where('a.status', 1);
            } else {

                $d = \DB::connection('mysqlcertificate')
                    ->table('condition_sample_cert as az')
                    ->select('az.id_contract')
                    ->whereIn('az.status', [3, 4])
                    ->orderBy('az.status', 'desc')
                    ->groupBy('az.id_contract')
                    ->get()->toArray();

                $z = array_map(function ($d) {
                    return $d->id_contract;
                }, $d);


                $var = $var->whereNotIn('a.contract_id', $z)->where('a.status', 0);
            }
        }

        if ($request->input('status') > 0) {
            if ($request->input('status') == 2) {
                $var = $var->where('a.status', 0);
            } else {
                $var = $var->where('a.status', 1);
            }
        }
        if ($request->input('no_po') !== 'undefined') {
            if ($request->input('no_po') !== "-") {
                $var = $var->where(\DB::raw('UPPER(b.no_po)'), 'like', '%' . strtoupper($request->input('no_po') . '%'));
            }
        }

        if ($request->input('no_penawaran') !== 'undefined') {
            if ($request->input('no_penawaran') !== "-") {
                $var = $var->where(\DB::raw('UPPER(b.no_penawaran)'), 'like', '%' . strtoupper($request->input('no_penawaran') . '%'));
            }
        }


        if (!empty($request->input('search'))) {
            $samplename = \DB::table('transaction_sample as bz')->select('bz.id_contract')->where(\DB::raw('UPPER(bz.sample_name)'), 'like', '%' . strtoupper($request->input('search')) . '%')->get()->toArray();
            if (count($samplename) < 1) {
                $check = \DB::table('transaction_sample as a')->select('a.id_contract')->where(\DB::raw('UPPER(a.no_sample)'), strtoupper($request->input('search')))->get();
                if (count($check) > 0) {
                    $var = $var->where('b.id_kontrakuji', $check[0]->id_contract);
                } else {
                    $var = $var->where(\DB::raw('UPPER(b.contract_no)'), 'like', '%' . strtoupper($request->input('search') . '%'));
                }
            } else {
                $azz = array_map(function ($q) {
                    return $q->id_contract;
                }, $samplename);
                // return $azz;
                $var = $var->whereIn('b.id_kontrakuji', $azz);
            }
        }

        if ($request->input('category') > 0) {
            $var = $var->where('b.id_contract_category', $request->input('category'));
        }

        if (!empty($request->input('tgl_selesai'))) {

            $samplename = \DB::table('transaction_sample as bz')->select('bz.id_contract')->where(\DB::raw('DATE_FORMAT(bz.tgl_selesai, "%Y-%m-%d")'), $request->input('tgl_selesai'))->get()->toArray();

            if (count($samplename) > 0) {
                $azz = array_map(function ($q) {
                    return $q->id_contract;
                }, $samplename);
                $var = $var->whereIn('b.id_kontrakuji', $azz);
            }
        }

        // if(empty($request->input('tgl_selesai'))){
        //     $var = $var
        // }

        if ($request->input('customers') > 0) {
            $var  = $var->where('d.id_customer', $request->input('customers'));
        }

        if ($request->input('user_created') > 0) {
            $var = $var->where('a.user_id', $request->input('user_created'));
        }

        if ($request->input('month') > 0) {
            $var = $var->where(\DB::raw('MONTH(a.inserted_at)'), $request->input('month'));
        }
        if (!empty($request->input('excel'))) {
            $var = $var->orderBy('a.inserted_at', 'desc')->groupBy('a.contract_id')->get()->toArray();
            foreach ($var as $k) {
                $checkstatuscert = \DB::connection('mysqlcertificate')->table('condition_sample_cert as a')->where('id_contract', $k->id_kontrakuji)->orderBy('status', 'desc')->get()->toArray();

                $h = \DB::table('transaction_sample')
                    ->where('id_contract', $k->id_kontrakuji)
                    ->orderBy('id_statuspengujian', 'desc')
                    ->first();
                array_push($v, array(
                    "contract_no" => $k->contract_no,
                    "title" => $k->title,
                    "id_contract_category" => $k->id_contract_category,
                    "customer_name" => $k->customer_name,
                    "id_customer" => $k->id_customer,
                    "name" => $k->name,
                    "inserted_at" => $k->inserted_at,
                    "user_id" => $k->user_id,
                    "employee_name" => $k->employee_name,
                    "status" => $k->status,
                    "id_kontrakuji" => $k->id_kontrakuji,
                    "phone" => $k->phone,
                    "telp" => $k->telp,
                    "hold" => $k->hold,
                    "email" => $k->email,
                    "no_po" => $k->no_po,
                    "no_penawaran" => $k->no_penawaran,
                    "status_lab" => $k->status_lab,
                    "status_cert" => $checkstatuscert,
                    "tgl_selesai" => time::parse($h->tgl_selesai)->format('d/m/Y')
                ));
            }

            $var = $v;
            return response()->json($var);
        } else {
            $var = $var->orderBy('a.inserted_at', 'desc')->groupBy('a.contract_id')->paginate(50)->toArray();
            foreach ($var['data'] as $k) {
                $checkstatuscert = \DB::connection('mysqlcertificate')->table('condition_sample_cert as a')->where('id_contract', $k->id_kontrakuji)->orderBy('status', 'desc')->get()->toArray();

                $h = \DB::table('transaction_sample')
                    ->where('id_contract', $k->id_kontrakuji)
                    ->orderBy('id_statuspengujian', 'desc')
                    ->first();
                array_push($v, array(
                    "contract_no" => $k->contract_no,
                    "title" => $k->title,
                    "id_contract_category" => $k->id_contract_category,
                    "customer_name" => $k->customer_name,
                    "id_customer" => $k->id_customer,
                    "name" => $k->name,
                    "inserted_at" => $k->inserted_at,
                    "user_id" => $k->user_id,
                    "employee_name" => $k->employee_name,
                    "status" => $k->status,
                    "id_kontrakuji" => $k->id_kontrakuji,
                    "phone" => $k->phone,
                    "telp" => $k->telp,
                    "hold" => $k->hold,
                    "email" => $k->email,
                    "no_po" => $k->no_po,
                    "no_penawaran" => $k->no_penawaran,
                    "status_lab" => $k->status_lab,
                    "status_cert" => $checkstatuscert,
                    "tgl_selesai" => time::parse($h->tgl_selesai)->format('d/m/Y')
                ));
            }

            $var['data'] = $v;
            return response()->json($var);
        }
    }


    public function getnopo(Request $request)
    {
        $v = \DB::table('mstr_transaction_kontrakuji as a')
        ->selectRaw('IFNULL(a.no_po,"-") as no_po')
        ->groupBy('a.no_po')
        ->paginate(25);

        return response()->json($v);
    }

    public function getnopenawaran(Request $request)
    {
        $v = \DB::table('mstr_transaction_kontrakuji as a')
        ->selectRaw('IFNULL(UPPER(a.no_penawaran),"-") as no_penawaran')
        ->groupBy('a.no_penawaran')
        ->paginate(25);
       
        return response()->json($v);
    }


    public function get_data_akg_contract(Request $request)
    {
        try {

            $var = \DB::table('transaction_akg_contract as a')
                ->leftJoin('mstr_transaction_akg as b', 'b.id', 'a.id_mstr_transaction_akg')
                ->where('a.id_transaction_kontrakuji', $request->input('id_contract'))->get();

            return response()->json($var);
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function get_data_sampling_contract(Request $request)
    {
        try {

            $var = SamplingTransaction::with(['samplingmaster'])->where('id_transaction_contract', $request->input('id_contract'))->get();

            return response()->json($var);
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function add_transaction_akg_contract(Request $request)
    {
        try {

            $data = $request->input('data');
            $del = AkgTransaction::where('id_transaction_kontrakuji', $data[0]['id_transaction_kontrakuji'])->get();

            if (count($del) > 0) {
                foreach ($del as $d) {
                    $v = AkgTransaction::find($d['id'])->delete();
                }
            }

            foreach ($data as $v) {
                $g = new AkgTransaction;
                $g->id_transaction_kontrakuji = $v['id_transaction_kontrakuji'];
                $g->id_mstr_transaction_akg = $v['id'];
                $g->jumlah = $v['jumlah'];
                $g->total = $v['total'];
                $g->save();
            }

            $checkharga = TransactionSample::selectRaw('SUM(price) as totalharga')->where('id_contract', $data[0]['id_transaction_kontrakuji'])->first();
            $checkallpaymentcondition = PaymentCondition::where('id_contract', $data[0]['id_transaction_kontrakuji'])->first();

            $akgtotalharga = AkgTransaction::select('total')->where('id_transaction_kontrakuji', $data[0]['id_transaction_kontrakuji'])->first();

            $totalhargapembayaran = ($checkharga->totalharga - $checkallpaymentcondition->discount_lepas) + $akgtotalharga->total;

            $b = PaymentCondition::find($checkallpaymentcondition->id_payment_contract);
            $b->ppn = $totalhargapembayaran * 0.11;
            $b->save();

            return response()->json(array(
                "success" => true,
                "message" => "data added succesfully"
            ));
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function add_transaction_sampling_contract(Request $request, $id)
    {
        try {

            $data = $request->input('data');
            $del = SamplingTransaction::where('id_transaction_contract', intval($id))->get();
            $x = 0;
            if (count($del) > 0) {
                foreach ($del as $d) {
                    $v = SamplingTransaction::find($d['id'])->delete();
                }
            }
            if(count($data) > 0){
                $j = [];
                foreach ($data as $v) {
                    $g = new SamplingTransaction;
                    $g->id_transaction_contract = $id;
                    $g->id_mstr_transaction_sampling = $v['id'];
                    $g->jumlah = $v['jumlah'];
                    $g->total = $v['total'];
                    $g->kondisi_lingkungan = !empty($v['kondisi']) ? $v['kondisi'] : null;
                    $g->location = !empty($v['kondisi']) ? $v['lokasi'] : null;
                    $g->pic = !empty($v['employee']) ? $v['employee'] : null;
                    $g->metode = !empty($v['metode']) ? $v['metode'] : null;
                    $g->save();

                    array_push($j,$g);
                }

                $c = array_map(function($x){
                    return $x['total'];
                },$j);

                $x = array_reduce($c, function($f,$z){
                    return $f += $z;
                });

            } else {
                $x = 0;
            }
            
            $checkharga = TransactionSample::selectRaw('IFNULL(SUM(price),0) as totalharga')
            ->where('id_contract', intval($id))
            ->first();

            $checkallpaymentcondition = PaymentCondition::where('id_contract', intval($id))
            ->first();
           
            $akgtotal = \DB::table('transaction_akg_contract as a')
            ->select(\DB::raw('IFNULL(SUM(a.total),0) as totalhargaakg'))
            ->where('a.id_transaction_kontrakuji', intval($id))
            ->first();
            

                // $samplingtotalharga = \DB::table('transaction_sampling_contract')
                // ->select(\DB::raw('IFNULL(SUM("total"),0) as total'))
                // ->where('id_transaction_contract', intval($x[0]['id_transaction_contract']))
                // ->first();
           

            $totalhargapembayaran = ((intval($checkharga->totalharga) + 
            intval($x)) - 
            intval($checkallpaymentcondition->discount_lepas)) + intval($akgtotal->totalhargaakg);

            // return array(
            //     'idc' => $id,
            //     'sampling' => $x,
            //     'akg' => $akgtotal->totalhargaakg,
            //     'paymentcond' => $checkallpaymentcondition,
            //     'checkharga' => $checkharga->totalharga,
            //     'totalhargasub' => $totalhargapembayaran,
            //     'ppn' => $totalhargapembayaran * 0.11
            // );
            

            // return (intval($totalhargapembayaran) * 11)/100;

            $b = PaymentCondition::find($checkallpaymentcondition->id_payment_contract);
            $b->ppn = $totalhargapembayaran * 0.11;
            $b->save();

            return response()->json(array(
                "success" => true,
                "message" => "data added succesfully"
            ));
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function delete_data_akg_contract(Request $request, $id)
    {
        try {

            $var = AkgTransaction::where('id_transaction_kontrakuji', $id)->get();
            foreach ($var as $a) {
                $del = AkgTransaction::find($a['id'])->delete();
            }

            return response()->json(array(
                "success" => true,
                "message" => "data deleted"
            ));
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function edit_data_contract(Request $request, $id)
    {
        try {
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');
            $deletedata = $request->input('deletedata');
            if (count($deletedata) > 0) {
                foreach ($deletedata as $d) {

                    $findSampleId = \DB::table('transaction_sample')->where('no_sample', $d['no_sample'])->first();
                    $findParameterId = \DB::table('transaction_parameter')->where('id_sample', $findSampleId->id)->get();

                    foreach ($findParameterId as $p) {
                        $getConditionLabDone = ConditionLabDone::where('id_transaction_parameter', $p->id)->first();
                        $getConditionLabCome = ConditionLabCome::where('id_transaction_parameter', $p->id)->first();
                        $getConditionLabProccess = ConditionLabProccess::where('id_transaction_parameter', $p->id)->first();
                        if ($getConditionLabDone) {
                            $delDone = ConditionLabDone::find($getConditionLabDone->id)->delete();
                        }
                        if ($getConditionLabCome) {
                            $delCome = ConditionLabCome::find($getConditionLabCome->id)->delete();
                        }
                        if ($getConditionLabProccess) {
                            $delProcess = ConditionLabProccess::find($getConditionLabProccess->id)->delete();
                        }

                        $delParam = Transaction_parameter::find($p->id)->forceDelete();
                    }

                    $getConditionContract = ConditionContractNew::where('sample_id', $findSampleId->id)->get();

                    foreach ($getConditionContract as $cc) {
                        $delCc = ConditionContractNew::find($cc->id_condition_contract)->delete();
                    }

                    $delSample = TransactionSample::find($findSampleId->id)->forceDelete();
                }
            }

            $v = Kontrakuji::find($id);

            $paymentContract = PaymentCondition::where('id_contract', $id)->first();

            if ($paymentContract) {
                $y = PaymentCondition::find($paymentContract->id_payment_contract);
                $y->biaya_pengujian = $data['totalbiayapengujian'];
                $y->downpayment = $data['downpayment'];
                $y->biaya_pengujian = $data['totalbiayapengujian'];
                $y->discount_lepas = $data['discount_lepas'];
                $y->ppn = $data['ppn'];
                $y->save();
            }

            if ($v->id_customers_handle == $data['customerhandle']) {

                $g = Customerhandle::find($v->id_customers_handle);

                if ($g->email !== $data['email']) {
                    $g->email = $data['email'];
                }

                if ($g->phone !== $data['phone']) {
                    $g->phone = $data['phone'];
                }

                if ($g->telp !== $data['telp']) {
                    $g->telp = $data['telp'];
                }

                $g->save();
            } else {
                $v->id_customers_handle = $data['customerhandle'];
            }

            $v->contract_type = $data['typeContract'];
            $v->desc = $data['desc'];
            $v->no_penawaran = $data['no_penawaran'];
            $v->no_po = $data['no_po'];
            $v->id_alamat_customer = $data['alamatcustomer'];
            $v->status = 1;
            $v->save();

            if (!empty($data['desc_internal'])) {
                $g = Description::where('id_contract', $id)->where('status', 2)->where('groups', 1)->get();
                foreach ($g as $f) {
                    $x = Description::find($f->id)->delete();
                }
                $d = new Description;
                $d->id_contract = $id;
                $d->id_sample = 0;
                $d->id_parameter = 0;
                $d->desc = $data['desc_internal'];
                $d->status = 2;
                $d->groups = 1;
                $d->created_at = time::now();
                $d->save();
            }

            foreach ($data['sampleFormArray'] as $v) {
                $samplefind = Transactionsample::where('no_sample', $v['no_sample'])->first();
                $setSample = Transactionsample::find($samplefind->id);
                $setSample->kode_sample = $v['kode_sample'];
                $setSample->sample_name = $v['sample_name'];
                $setSample->batch_number = $v['batch_number'];
                $setSample->nama_pabrik = $v['nama_pabrik'];
                $setSample->alamat_pabrik = $v['alamat_pabrik'];
                $setSample->no_notifikasi = $v['no_notifikasi'];
                if (intval($v['statuspengujian']) == 1) {
                    $setSample->tgl_estimasi_lab = time::parse($v['tgl_selesai'])->addWeekdays(-2);
                } else if (intval($v['statuspengujian']) == 2) {
                    $setSample->tgl_estimasi_lab = time::parse($v['tgl_selesai'])->addWeekdays(-1);
                } else {
                    $setSample->tgl_estimasi_lab = time::parse($v['tgl_selesai'])->addWeekdays(0);
                }
                $setSample->tgl_input = $v['tgl_input'];
                $setSample->tgl_selesai = $v['tgl_selesai'];
                $setSample->no_pengajuan = $v['no_pengajuan'];
                $setSample->no_registrasi = $v['no_registrasi'];
                $setSample->no_principalcode = $v['no_principalcode'];
                $setSample->nama_dagang = $v['nama_dagang'];
                $setSample->lot_number = $v['lot_number'];
                $setSample->jenis_kemasan = $v['jenis_kemasan'];
                $setSample->tgl_produksi = $v['tgl_produksi'] ? $v['tgl_produksi'] : null;
                $setSample->tgl_kadaluarsa = $v['tgl_kadaluarsa'] ? $v['tgl_kadaluarsa'] : null;
                $setSample->id_tujuanpengujian = intval($v['tujuanpengujian']);
                $setSample->id_subcatalogue = $v['sub_catalogue'];
                $setSample->certificate_info = intval($v['certificate_info']);
                $setSample->price = $v['sample_price'];
                $setSample->discount = $v['discount'];
                $setSample->id_statuspengujian = intval($v['statuspengujian']);
                $setSample->save();
            }

            return response()->json(array(
                'success' => true,
                "message" => "data saved"
            ));
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function setDescContract(Request $request)
    {
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            $var = new ContractMessage;
            $var->id_contract = $data['id_kontrakuji'];
            $var->user_id = $id_user;
            if ($data['status'] == 'revision') {
                $var->status = 1;
            } else if ($data['status'] == 'edit') {
                $var->status = 2;
            } else {
                $var->status = 0;
            }
            $var->message = $data['desc'];
            $var->inserted_at = time::now();
            $var->save();

            return response()->json(array(
                "status" => true,
                "message" => "Success Create Excuse"
            ));
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function lightcontract(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        if(!empty($data['excel'])){
            $this->excelForSales($request->request->add(['data' => $data]));
        } else {
            $b = Kontrakuji::with([
                'contract_category',
                'customers_handle',
                'customers_handle.customers',
                'customers_handle.contact_person',
                'cust_address',
                'transactionsample',
                'conditionContract',
                'conditionContract.user'
            ])->selectRaw('status,id_kontrakuji,IF(CHAR_LENGTH(SUBSTRING_INDEX(contract_no,".",-1)) > 3, contract_no,SUBSTR(contract_no,1,(CHAR_LENGTH(contract_no) - 8))) AS contract_no,
            IF(CHAR_LENGTH(SUBSTRING_INDEX(contract_no,".",-1)) > 3,"NEW","REVISI") AS status_contract, contract_type,id_customers_handle, id_contract_category, id_alamat_customer')
                // ->where('status',1
                ->has('conditionContract')
                ->orderBy('created_at', 'DESC')
                ->where('status', 1)
                ->paginate(25);
            return response()->json($b);
        }
    }

    public function conditioncontractfind(Request $request, $id)
    {
        try {
            $var = ConditionContractNew::with([
                'kontrakstatus_cs',
                'kontrakstatus_cs.user',
                'kontrakstatus_kendali',
                'kontrakstatus_kendali.user',
                'kontrakstatus_prep',
                'kontrakstatus_prep.user',
                'kontrakstatus_lab',
                'kontrakstatus_lab.user',
                'kontrakstatus_cert',
                'kontrakstatus_cert.user',
                'kontrakstatus_cert.transaction_sample_cert'
            ])->select('contract_id')->where('contract_id', $id)->groupBy('contract_id')->get();

            return response()->json($var);
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function conditionCertStatus(Request $request, $id)
    {
        //BACHTIAR
        try {

            // $connect = DB::table('condition_sample_cert as a')
            // ->selectRaw('a.id, a.id_transaction_cert, a.id_contract, a.status,  he.employee_name,  tsc.id_transaction_sample, tsc.lhu_number, a.inserted_at, a.id_team, mg.group_name')
            // ->where('a.id_contract', DB::raw("$id"))
            // ->leftjoin('transaction_sample_cert as tsc', 'tsc.id', '=', 'a.id_transaction_cert')
            // ->leftjoin('db_siganalyst.mstr_group as mg' , 'mg.id', '=', 'a.id_team')
            // ->leftjoin('db_siganalyst.users as us', 'us.id', '=', 'a.user_id')
            // ->leftjoin('db_siganalyst.hris_employee as he', 'he.user_id', '=', 'us.id')
            // ->groupBy('a.id')
            // ->orderBy('a.id', 'desc')->toSql();


            // $model =  DB::connection('mysqlcertificate')->select('SELECT datas.*, ts.sample_name, ts.no_sample FROM ('.$connect.') AS datas LEFT JOIN db_siganalyst.transaction_sample ts ON ts.id = datas.id_transaction_cert GROUP BY datas.id_transaction_cert');

            $array = array();
            $model =  DB::connection('mysqlcertificate')->table('condition_sample_cert as a')
                ->selectRaw('tsc.lhu_number, tsc.no_sample, tsc.sample_name , a.* ')
                ->leftjoin('transaction_sample_cert as tsc', 'tsc.id', '=', 'a.id_transaction_cert')
                ->where('a.id_contract', $id)
                ->groupBy('a.id')
                ->get();


            foreach ($model as $key => $m) {

                $cek =  DB::connection('mysqlcertificate')->table('condition_sample_cert as a')
                    ->selectRaw('tsc.lhu_number, tsc.no_sample, tsc.sample_name , a.* ')
                    ->leftjoin('transaction_sample_cert as tsc', 'tsc.id', '=', 'a.id_transaction_cert')
                    ->where('a.id_transaction_cert', $m->id_transaction_cert)
                    ->groupBy('a.id')
                    ->get();

                if ($key == count($cek) - 1) {
                    array_push($array, $cek[count($cek) - 1]->id_transaction_cert);
                }
            }
            $wew = Ecertlhu::with([
                'ConditionCert'
            ])->whereIn('id', $array)->get();

            return $wew;
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }


    public function samplingdatatransaction(Request $request)
    {
        try {
            $var = \DB::table('transaction_sampling_contract as a')
                ->leftJoin('mstr_transaction_sampling as b', 'b.id', 'a.id_mstr_transaction_sampling')
                ->where('a.id_transaction_contract', $request->input('idtransampling'))->get();

            return response()->json($var);
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }


    public function akgdatatransaction(Request $request)
    {
        try {
            $var = \DB::table('transaction_akg_contract as a')
                ->leftJoin('mstr_transaction_akg as b', 'b.id', 'a.id_mstr_transaction_akg')
                ->where('a.id_transaction_kontrakuji', $request->input('idtransactionakg'))->get();

            return response()->json($var);
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }


    public function conditioncontractfindDetail(Request $request)
    {
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            $var = ConditionContractNew::with([
                'user'
            ])
                ->where('condition_contracts.position', $data['position'])
                ->where('condition_contracts.contract_id', $data['contract_id']);
            if ($data['position'] == 2 || $data['position'] == 3) {
                $var = $var->leftJoin('transaction_sample as a', 'a.id', 'condition_contracts.sample_id')->where('condition_contracts.sample_id', '<>', 0);
            } else if ($data['position'] == '4') {
                $var = $var->leftJoin('transaction_parameter as a', 'a.id', 'condition_contracts.parameter_id')
                    ->leftJoin('mstr_laboratories_parameteruji as b', 'b.id', 'a.id_parameteruji')
                    ->where('condition_contracts.parameter_id', '<>', 0);
            }
            $var = $var->get();

            return response()->json($var);
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function getMoreHistory(Request $request)
    {
        $var = \DB::table('contract_message as a')
            ->selectRaw('
            b.id_kontrakuji,
            b.contract_no,
            d.title,
            REPLACE(a.message,"Revisi Kontrak ini dan akan kembali lagi ke CS, Dengan Alasan","") AS excuse,
            a.inserted_at,
            c.employee_name,
            a.status,
            c.photo
        ')
            ->leftJoin('mstr_transaction_kontrakuji as b', 'b.id_kontrakuji', 'a.id_contract')
            ->join('hris_employee as c', 'c.user_id', 'a.user_id')
            ->join('mstr_products_contactcategory as d', 'd.id', 'b.id_contract_category')
            ->whereNotNull('b.id_kontrakuji')
            ->orderBy('a.inserted_at', 'DESC');

        if (!empty($request->input('category'))) {
            $var = $var->where('b.id_contract_category', $request->input('category'));
        }

        if (!empty($request->input('search'))) {
            $var = $var->where('b.contract_no', 'like', '%' . strtoupper($request->input('search')) . '%');
        }

        if (!empty($request->input('user'))) {
            $var = $var->where('c.user_id', $request->input('user'));
        }

        if (!empty($request->input('tgl'))) {
            $var = $var->where(\DB::raw('DATE_FORMAT(a.inserted_at,"%Y-%m-%d")'), $request->input('tgl'));
        }


        $var = $var->paginate(25);

        return response()->json($var);
    }

    public function samplephotocontract(Request $request, $id)
    {
        $var = TransactionSample::with([
            'photo'
        ])
            ->select(
                'id',
                'no_sample',
                'sample_name'
            )
            ->where('id_contract', $id)->get();


        return response()->json($var);
    }


    public function addPhoto(Request $request)
    {
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');


            $check = \DB::table('transaction_sample as a')
                ->leftJoin('mstr_transaction_kontrakuji as b', 'b.id_kontrakuji', 'a.id_contract')
                ->where('a.id', $data['idsample'])->get();

            $nosample = '';
            $nokontrak = '';

            if (str_contains($check[0]->no_sample, 'REV')) {
                $nokontrak = explode('.', $check[0]->contract_no)[0] . '.' . explode('.', $check[0]->contract_no)[1] . '.' . explode('.', $check[0]->contract_no)[2] . '.' . explode('.', $check[0]->contract_no)[3] . '.' . explode('.', $check[0]->contract_no)[4] . '.' . explode('.', $check[0]->contract_no)[5];
                $nosample = explode('.', $check[0]->no_sample)[0] . '.' . explode('.', $check[0]->no_sample)[1] . '.' . explode('.', $check[0]->no_sample)[2];
            } else {
                $nosample = $check[0]->no_sample;
                $nokontrak = $check[0]->contract_no;
            }

            $foldername = $nokontrak . '/' . $nosample;
            if (!File::exists($foldername)) {
                File::makeDirectory($foldername, 0777, true);
            }


            // $zl->resize(null, 300, function ($constraint) {
            //     $constraint->aspectRatio();
            // });

            // $foldername = 'public/'.$nokontrak.'/'.$nosample;
            // if (!Flysystem::connection('ftp')->read('public/'.$fo);::exists($foldername)) {
            //     File::makeDirectory($foldername,0777,true);
            // }

            // $zl = Image::make($data['photo']);
            // $zl->resize(null, 300, function ($constraint) {
            //     $constraint->aspectRatio();
            // });
            // $zl->encode();

            $countingFoto = Photo::where('id_sample', $data['idsample'])->get();

            $pathname = '' . $nosample . '-' . ($check[0]->id + 60) . '-' . (count($countingFoto) + 1) . '.jpeg';

            $savephoto = new Photo;
            $savephoto->id_sample = $check[0]->id;
            $savephoto->photo = $pathname;
            $savephoto->insert_user = $id_user;
            $savephoto->save();

            $zl = Image::make($data['photo']);
            // $imagepath = $zl->stream();
            $zl->save(public_path($foldername . '/' . $pathname));

            // Flysystem::connection('ftp')->put(public_path($foldername.'/'.$pathname),$imagepath->__toString());

            return response()->json(array(
                "status" => true,
                "message" => "Success Add Photo",
                "data" => array(
                    "id" => $savephoto->id,
                    "photo" => '' . $check[0]->contract_no . '/' . $check[0]->no_sample . '/' . $savephoto->photo . ''
                )
            ));
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function getSample(Request $request, $id)
    {
        try {
            $var = TransactionSample::with([
                'kontrakuji',
                'transactionparameter'
            ])->find($id);

            return response()->json($var);
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function sampleLight(Request $request, $id)
    {
        $var = TransactionSample::with([
            'kontrakujifull.customers_handle.contact_person',
            'kontrakujifull.customers_handle.customers',
            'kontrakujifull.description_cs',
            'kontrakujifull.payment_condition',
            'kontrakujifull.akgTrans.masterakg',
            'kontrakujifull.samplingTrans.samplingmaster',
            'getonlyprice'
        ])->where('id_contract', $id)->get();

        return response()->json($var);
    }

    public function description(Request $request)
    {
        try {
            // return $request->input('idcontract');
            $var = Description::with([
                'user'
            ])->where('id_contract', $request->input('idcontract'))->where('id_sample', 0)->where('status', 2)->get();

            return response()->json($var);
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function sendchat(Request $request)
    {
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            $var = new Description;
            $var->desc = $data['chat'];
            $var->insert_user = $id_user;
            $var->created_at = time::now();
            $var->id_sample = 0;
            $var->id_contract = $data['idcontract'];
            $var->status = 2;

            $var->save();

            return response()->json(array(
                "success" => true,
                "message" => "Success Saving Data"
            ));
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function show_update(Request $request, $id)
    {
        $var = Kontrakuji::with([
            'cust_address',
            'cust_tax_address',
            'contract_category',
            'customers_handle',
            'attachment',
            'akgTrans',
            'akgTrans.masterakg',
            'samplingTrans',
            'samplingTrans.samplingmaster',
            'payment_condition',
            'customers_handle.customers',
            'customers_handle.contact_person',
            'user',
            'transactionsample',
            'description'
        ])->find($id);
        return response()->json($var);
    }

    public function show(Request $request, $id)
    {
        $var = Kontrakuji::with([
            'cust_address',
            'cust_tax_address',
            'contract_category',
            'customers_handle',
            'attachment',
            'akgTrans',
            'akgTrans.masterakg',
            'samplingTrans',
            'samplingTrans.samplingmaster',
            'payment_condition',
            'customers_handle.customers',
            'customers_handle.contact_person',
            'user',
            'description'
        ])->find($id);

        
        return response()->json($var);
    }


    public function delete_trans_param(Request $request)
    {
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            foreach ($data as $v) {
                $var = Transaction_parameter::find($v['id'])->forceDelete();
            }

            return response()->json(array(
                "status" => true,
                "message" => "success deleting parameter"
            ));
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }


    public function get_sample_from_contract(Request $request, $id)
    {
        try {

            $var = TransactionSample::with([
                'status_lab',
                'status_cert',
                'status_cert.ConditionCert'
            ])->select(
                'id',
                'no_sample',
                'sample_name',
                'id_contract',
                \DB::raw('DATE_FORMAT(tgl_selesai,"%d/%m/%Y") as tgl_selesai'),
                'id_statuspengujian',
                'discount',
                \DB::raw('IF(certificate_info = 1,"Draft","Release") as info_cert'),
                'price'
            )
                ->where('id_contract', $id)->get();

            return response()->json($var);
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function sample_param(Request $request)
    {
        // $var = Transaction_parameter::with([
        //     'transaction_sample.subcatalogue',
        //     'conditionlabdone.user',
        //     'parameter_condition',
        //     'lod',
        //     'metode',
        //     'unit',
        //     'standart',
        //     'lab',
        //     'parameteruji.parametertype',
        // ])->where('id_sample',$request->input('idsample'))->get();
        $var = TransactionSample::with([
            'tujuanpengujian',
            'statuspengujian',
            'subcatalogue',
            'transactionparameter.conditionlabdone.user',
            'transactionparameter.parameter_condition',
            'transactionparameter.lod',
            'transactionparameter.metode',
            'transactionparameter.unit',
            'transactionparameter.standart',
            'transactionparameter.lab',
            'transactionparameter.parameteruji.parametertype'
        ])->find($request->input('idsample'));

        return response()->json($var);
    }

    public function parameterpersample(Request $request)
    {

        $v = Transaction_parameter::with([
            'unit',
            'lod',
            'metode',
            'standart',
            'lab',
            'parameteruji',
            'parameteruji.parametertype'
        ])
            ->select(
                'transaction_parameter.*',
                \DB::raw('IF(transaction_parameter.status = 1,mstr_products_paketuji.price,IF(transaction_parameter.status = 2,parameter_price.price,mstr_sub_specific_package.price)) as price')
            )
            ->leftJoin('parameter_price', 'parameter_price.id', 'transaction_parameter.info_id')
            ->leftJoin('mstr_products_paketuji', 'mstr_products_paketuji.id', 'transaction_parameter.info_id')
            ->leftJoin('mstr_sub_specific_package', 'mstr_sub_specific_package.id', 'transaction_parameter.info_id')
            ->where('id_sample', $request->input('idsample'))
            ->groupBy('transaction_parameter.id')
            ->get();
        return response()->json($v);
    }

    public function getSampleOnly(Request $request)
    {
        try {

            $v = TransactionSample::with([
                'tujuanpengujian',
                'statuspengujian',
                'subcatalogue'
            ])->find($request->input('idsample'));

            return response()->json($v);
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function deletetransparam(Request $request, $id){
        try {
            
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            return $data = $request->input('data');

            // if(count($data['nonpaket']) > 0){

            //     $transparam = Transaction_parameter::where('')
                
            // }



        } catch (\Exception $e){
            return response()->json($e->getMessage());
        }
    }

    public function revision(Request $request, $id)
    {
        // try {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');
        $cust = Customerhandle::with(['customers'])->find($data['idch']);

        $pecahtanggal_waktu = explode('T',time::now());
        $pecahtahun = explode('-', $pecahtanggal_waktu[0]);

        $checklastcontract = \DB::select('SELECT
        MAX(CAST(SUBSTRING_INDEX(DATA_1.contract_no,".",-1) AS SIGNED)) AS terakhir
        FROM ( SELECT
        IF(CHAR_LENGTH(SUBSTRING_INDEX(a.contract_no,".",-1)) > 3, a.contract_no,SUBSTR(a.contract_no,1,(CHAR_LENGTH(a.contract_no) - 8))) AS contract_no
        FROM mstr_transaction_kontrakuji a WHERE a.id_contract_category = ' . $data['contractcategory'] . ' and YEAR(a.created_at) = ' . $pecahtahun[0] . ') AS DATA_1');


        $paymentCondition = PaymentCondition::where('id_contract',$id)->first();
        
        $editp = $paymentCondition ? PaymentCondition::find($paymentCondition->id_payment_contract) : new PaymentCondition;
        $editp->biaya_pengujian = $data['totalhargakontrak'];
        $editp->disc_val = $data['discount_conv'];
        $editp->discount_lepas = $data['discount_price'];
        $editp->downpayment = $data['uangmuka'];
        $editp->ppn = (($data['totalhargakontrak'] - $data['discount_price'] ) + $data['biayasample']) * 0.11;
        $editp->save();

        if(count($data['datasampling']) > 0){
            $v = SamplingTransaction::where('id_transaction_contract',$id)->get();

            foreach($v as $x){
                $f = SamplingTransaction::find($x->id)->forceDelete();
            }


            foreach($data['datasampling'] as $samplingtrans){
                $ca = new SamplingTransaction;
                $ca->id_transaction_contract = $id;
                $ca->id_mstr_transaction_sampling = !empty($samplingtrans['id_sampling']) ? $samplingtrans['id_sampling'] : $samplingtrans['id_mstr_transaction_sampling'];
                $ca->jumlah = $samplingtrans['jumlah'];
                $ca->total = $samplingtrans['total'];
                $ca->save();
            }
        }

        if(count($data['dataakg']) > 0){
            $cakg = AkgTransaction::where('id_transaction_kontrakuji',$id)->get();

            foreach($cakg as $g){
                $h = AkgTransaction::find($g->id)->forceDelete();
            }
            foreach($data['dataakg'] as $xx){
                $addAkg = new AkgTransaction;
                $addAkg->id_transaction_kontrakuji = $id;
                $addAkg->id_mstr_transaction_akg = $xx['id'];
                $addAkg->jumlah = $xx['jumlah'];
                $addAkg->total = $xx['total'];
                $addAkg->save();
            }
        }
        if(!empty($data['internal_desc'])){

            $cDesc = Description::where('id_contract',$id)
            ->where('id_sample',0)
            ->where('id_parameter',0)
            ->where('status',2)
            ->get();

            foreach($cDesc as $xcf){
                $g = Description::find($xcf->id)->forceDelete();
            }

                $desc = new Description;
                $desc->id_contract = $id;
                $desc->id_sample = 0;
                $desc->id_parameter = 0;
                $desc->desc = $data['internal_desc'];
                $desc->status = 2;
                $desc->insert_user = $id_user;
                $desc->created_at = time::now();
                $desc->save();
        }

        $revcontract = Kontrakuji::find($id);

        // gotosample
        
        foreach($data['sample'] as $smple){
            // return $smple['nama_sample'];
            $nosamplec = '';
            if($revcontract->id_contract_category == $data['contractcategory']){
                $z = ContractCategory::find($data['contractcategory']);
                $checklastval = \DB::select('SELECT
                IFNULL(MAX(CAST(IF(SUBSTRING_INDEX(SUBSTRING_INDEX(a.no_sample,".",-2),".",1) = "REV",SUBSTRING_INDEX(SUBSTRING_INDEX(a.no_sample,".",-3),".",1),SUBSTRING_INDEX(a.no_sample,".",-1)) AS SIGNED)),0) AS max
                FROM transaction_sample a WHERE MID(a.no_sample,5,1) = "' . $z->category_code . '" AND MID(a.no_sample,2,2) = DATE_FORMAT(NOW(),"%m") AND LEFT(a.no_sample,1) = RIGHT(YEAR(NOW()),1)');
                $count = $checklastval[0]->max + 1;
                $tested = $count + 1;
                $nosamplec = substr($pecahtahun[0], -1) . '' . $pecahtahun[1] . '.' . $z->category_code . '.' . $count;

            }

         
            // return $smpledet = array_key_exists('detsample',$smple) ? $smple['detsample'] : 'asseeee';
                if(isset($smple['detsample'])){
                    $smpledet = $smple['detsample'];

                    $csample = $smple['status'] == 'edit' ? TransactionSample::find($smple['id']) : new TransactionSample;
                    $csample->kode_sample =  $smpledet['kode_sample'];
                    if($revcontract->id_contract_category !== $data['contractcategory']){
                        $z = ContractCategory::find($data['contractcategory']);
                        $checklastval = \DB::select('SELECT
                        IFNULL(MAX(CAST(IF(SUBSTRING_INDEX(SUBSTRING_INDEX(a.no_sample,".",-2),".",1) = "REV",SUBSTRING_INDEX(SUBSTRING_INDEX(a.no_sample,".",-3),".",1),SUBSTRING_INDEX(a.no_sample,".",-1)) AS SIGNED)),0) AS max
                        FROM transaction_sample a WHERE MID(a.no_sample,5,1) = "' . $z->category_code . '" AND MID(a.no_sample,2,2) = DATE_FORMAT(NOW(),"%m") AND LEFT(a.no_sample,1) = RIGHT(YEAR(NOW()),1)');
                        $count = $checklastval[0]->max + 1;
                        $tested = $count + 1;
                        $nosamplec = substr($pecahtahun[0], -1) . '' . $pecahtahun[1] . '.' . $z->category_code . '.' . $count;
                        $csample->no_sample = $nosamplec;
                    } else if($smple['status'] !== 'edit'){
                        $z = ContractCategory::find($data['contractcategory']);
                        $checklastval = \DB::select('SELECT
                        IFNULL(MAX(CAST(IF(SUBSTRING_INDEX(SUBSTRING_INDEX(a.no_sample,".",-2),".",1) = "REV",SUBSTRING_INDEX(SUBSTRING_INDEX(a.no_sample,".",-3),".",1),SUBSTRING_INDEX(a.no_sample,".",-1)) AS SIGNED)),0) AS max
                        FROM transaction_sample a WHERE MID(a.no_sample,5,1) = "' . $z->category_code . '" AND MID(a.no_sample,2,2) = DATE_FORMAT(NOW(),"%m") AND LEFT(a.no_sample,1) = RIGHT(YEAR(NOW()),1)');
                        $count = $checklastval[0]->max + 1;
                        $tested = $count + 1;
                        $nosamplec = substr($pecahtahun[0], -1) . '' . $pecahtahun[1] . '.' . $z->category_code . '.' . $count;
                        $csample->no_sample = $nosamplec;
                    }
                    $csample->sample_name = $smple['nama_sample'];
                    $csample->batch_number = $smpledet['batchno'];
                    $csample->tgl_input = $smpledet['tgl_input'];
                    $csample->tgl_selesai = $smpledet['tgl_selesai'];
                    
                    if (intval($smpledet['statuspengujian']) == 1) {
                        $csample->tgl_estimasi_lab = time::parse($smpledet['tgl_selesai'])->addWeekdays(-2);
                    } else if (intval($smpledet['statuspengujian']) == 2) {
                        $csample->tgl_estimasi_lab = time::parse($smpledet['tgl_selesai'])->addWeekdays(-1);
                    } else {
                        $csample->tgl_estimasi_lab = time::parse($smpledet['tgl_selesai'])->addWeekdays(0);
                    }

                    $csample->nama_pabrik = $smpledet['factoryname'];
                    $csample->alamat_pabrik = $smpledet['no_notifikasi'];
                    $csample->no_notifikasi = $smpledet['no_pengajuan'];
                    $csample->no_pengajuan = $smpledet['no_pengajuan'];
                    $csample->no_registrasi = $smpledet['no_registrasi'];
                    $csample->no_principalcode = $smpledet['no_principalCode'];
                    $csample->nama_dagang = $smpledet['trademark'];
                    $csample->lot_number = $smpledet['lotno'];
                    $csample->jenis_kemasan = $smpledet['jeniskemasan'];
                    $csample->tgl_produksi = $smpledet['tgl_produksi'];
                    $csample->tgl_kadaluarsa = $smpledet['tgl_kadaluarsa'];
                    $csample->price = $smpledet['price_sample'];
                    $csample->discount = $smpledet['discount_sample'];
                    $csample->id_tujuanpengujian = $smpledet['tujuanpengujian'];
                    $csample->id_statuspengujian = $smpledet['statuspengujian'];
                    $csample->id_contract = $id;
                    $csample->certificate_info = $smpledet['certificate_info'];
                    $csample->id_subcatalogue = $smpledet['subcatalogue'];
                    $csample->keterangan_lain = isset($smpledet['ket_lain']) ? $smpledet['ket_lain'] : null;
                    $csample->save();

                    if($smple['status'] == 'edit'){
                        $paramc = Transaction_parameter::where('id_sample',$csample->id)->get();

                    foreach($paramc as $pc){

                        $vcome = ConditionLabCome::where('id_transaction_parameter',$pc->id)->get();
                        $vprocess = ConditionLabProccess::where('id_transaction_parameter',$pc->id)->get();
                        $vdone = ConditionLabDone::where('id_transaction_parameter',$pc->id)->get();

                        if(count($vcome) > 0){
                            foreach($vcome as $vc){
                                $delcondparam = ConditionLabCome::find($vc->id)->delete();
                            }
                        }

                        if(count($vprocess) > 0){
                            foreach($vprocess as $vp){
                                $delcondparam = ConditionLabProccess::find($vp->id)->delete();
                            }
                        }

                        if(count($vdone) > 0){
                            foreach($vdone as $vd){
                                $delcondparam = ConditionLabDone::find($vd->id)->delete();
                            }
                        }
                        $chParam = Transaction_parameter::find($pc->id);
                        if($chParam){
                            $chParam->forceDelete();
                        }
                        }
                    }
                    

                    if(count($smpledet['nonpaket']) > 0){
                        
                        foreach($smpledet['nonpaket'] as $npadd){
                            
                            $lab = \DB::table('mstr_laboratories_lab as a')->where(\DB::raw('UPPER(a.nama_lab)'),trim(strtoupper($npadd['nama_lab'])))->first();

                            $newparamnon = new Transaction_parameter;
                            $newparamnon->id_parameteruji = $npadd['id_parameteruji'];
                            $newparamnon->id_sample = $csample->id;
                            $newparamnon->idfor = $npadd['idfor'];
                            $newparamnon->format_hasil = $npadd['formathasil'];
                            $newparamnon->id_lab =$lab->id;
                            $newparamnon->status = 2;
                            $newparamnon->info_id = $npadd['id_price'];
                            $newparamnon->save();

                        }
                        
                    }


                    if(count($smpledet['paketparameter']) > 0){

                        foreach($smpledet['paketparameter'] as $paketadd){
                            
                            $findpkt = \DB::table('mstr_products_paketuji')->where(\DB::raw('UPPER(nama_paketuji)'),strtoupper($paketadd['paketname']))->first();

                            foreach($paketadd['parameter'] as $pktadd){
                                $pktpr = new Transaction_parameter;
                                $pktpr->id_parameteruji = $pktadd['id_parameteruji'];
                                $pktpr->id_standart = $pktadd['id_standart'];
                                $pktpr->id_lab = $pktadd['idlab'];
                                $pktpr->id_lod = $pktadd['idlod'];
                                $pktpr->idfor = $paketadd['id'];
                                $pktpr->id_unit = $pktadd['id_unit'];
                                $pktpr->id_metode = $pktadd['id_metode'];
                                $pktpr->id_sample = $csample->id;
                                $pktpr->status = 1;
                                $pktpr->info_id = $findpkt->id;
                                $pktpr->save();
                            }
                            

                        }

                    }

                    if(count($smpledet['paketpkm']) > 0){
                        foreach($smpledet['paketpkm'] as $paktpkm){
                            foreach($paktpkm['subpackage'] as $sbpktpkm){
                               for($t = 0; $t < $sbpktpkm['jumlah']; $t++){
                                $pktpkmadd = new Transaction_parameter;
                                $pktpkmadd->id_parameteruji = $sbpktpkm['detail_specific'][0]['parameteruji_id'];
                                $pktpkmadd->id_standart = $sbpktpkm['detail_specific'][0]['id_standart'];
                                $pktpkmadd->id_lab = $sbpktpkm['detail_specific'][0]['id_lab'];
                                $pktpkmadd->id_lod = $sbpktpkm['detail_specific'][0]['id_lod'];
                                $pktpkmadd->id_metode = $sbpktpkm['detail_specific'][0]['id_metode'];
                                $pktpkmadd->id_unit = $sbpktpkm['detail_specific'][0]['id_unit'];
                                $pktpkmadd->idfor = $paktpkm['id'];
                                $pktpkmadd->id_sample = $csample->id;
                                $pktpkmadd->position = $t + 1;
                                $pktpkmadd->status = 4;
                                $pktpkmadd->info_id = $sbpktpkm['id'];
                                $pktpkmadd->save();
                                
                               }

                            }
                        }
                    }


                } else {
                    
                    $findsamplein = TransactionSample::find($smple['id']);
                    $findsamplein->price = $smple['price'];
                    $findsamplein->sample_name = $smple['nama_sample'];
                    if($revcontract->id_contract_category !== $data['contractcategory']){
                        $z = ContractCategory::find($data['contractcategory']);
                        $checklastval = \DB::select('SELECT
                        IFNULL(MAX(CAST(IF(SUBSTRING_INDEX(SUBSTRING_INDEX(a.no_sample,".",-2),".",1) = "REV",SUBSTRING_INDEX(SUBSTRING_INDEX(a.no_sample,".",-3),".",1),SUBSTRING_INDEX(a.no_sample,".",-1)) AS SIGNED)),0) AS max
                        FROM transaction_sample a WHERE MID(a.no_sample,5,1) = "' . $z->category_code . '" AND MID(a.no_sample,2,2) = DATE_FORMAT(NOW(),"%m") AND LEFT(a.no_sample,1) = RIGHT(YEAR(NOW()),1)');
                        $count = $checklastval[0]->max + 1;
                        $tested = $count + 1;
                        $nosamplec = substr($pecahtahun[0], -1) . '' . $pecahtahun[1] . '.' . $z->category_code . '.' . $count;
                        $findsamplein->no_sample = $nosamplec;
                    }
                    $findsamplein->discount = $smple['disc'];
                    $findsamplein->save();
                }

        }

        if(count($data['sampleremove']) > 0){
            foreach($data['sampleremove'] as $rm){
                
                $condtionall = ConditionContractNew::where('sample_id',$rm['id'])->get();
                if(count($condtionall) > 0){
                    foreach($condtionall as $cdnt){
                        $delcondc = ConditionContractNew::find($cdnt['id_condition_contract'])->forceDelete();
                    }
                }
                
                $descSamp = Description::where('id_sample',$rm['id'])->get();
                if(count($descSamp) > 0){
                    foreach($descSamp as $amp){
                        $cvc = Description::find($amp['id'])->forceDelete();
                    }
                }

                $cekPhoto = Photo::where('id_sample',$rm['id'])->get();

                foreach($cekPhoto as $ph){
                    if(File::exists($rm['no_sample'])){
                        File::deleteDirectory($revcontract->contract_no);
                    }
                    $y = Photo::find($ph['id'])->forceDelete();
                }

                $cekParameter = Transaction_parameter::where('id_sample',$rm['id'])->get();

                if(count($cekParameter) > 0){
                    foreach($cekParameter as $ytr){
                        $vb = Transaction_parameter::find($ytr['id'])->forceDelete();
                    }
                }

                $delSamsam = TransactionSample::find($rm['id'])->forceDelete();


            }
        }


        $revcontract->contract_type = $data['sample_source'];
        $revcontract->created_at = time::now();
        $revcontract->desc = !empty($data['external_desc']) ? $data['external_desc'] : null;
        $revcontract->hold = $cust->customers->status_invoice == 2 ? 'N' : 'Y';
        $revcontract->id_alamat_customer = $data['alamatcustomer'];
        $revcontract->status = !empty($data['clienthandling']) ? $data['clienthandling'] : null;
        if($revcontract->id_contract_category !== $data['contractcategory']){

            $b = $checklastcontract[0]->terakhir + 1;
            $z = ContractCategory::find($data['contractcategory']);
            $c = 'SIG.MARK.' . $z->category_code . '.' . $this->integerToRoman($pecahtahun[1]) . '.' . $pecahtahun[0] . '.' . $this->leftPad($b, 6) . '';
            $revcontract->id_contract_category = $data['contractcategory'];
            $revcontract->contract_no = $c;
        }
        $revcontract->id_customers_handle = $data['idch'];
        $revcontract->no_penawaran = $data['no_penawaran'];
        $revcontract->no_po = $data['no_po'];
        $revcontract->status = 1;
        $revcontract->status_inv = 0;
        $revcontract->status_prep = 1;
        $revcontract->save();
        
        

        $conditionContract = ConditionContractNew::where('contract_id',$id)->get();
        $userbuatcontract = ContractMessage::where('id_contract',$id)->where('status',0)->get();
        foreach($conditionContract as $l){
            $g = ConditionContractNew::find($l['id_condition_contract'])->delete();
        }
        
        $cnew = new ConditionContractNew;
        $cnew->contract_id = $id;
        $cnew->sample_id = 0;
        $cnew->parameter_id = 0;
        $cnew->user_id = count($userbuatcontract) > 0 ? $userbuatcontract[0]['user_id'] : $id_user;
        $cnew->status = 0;
        $cnew->inserted_at = time::now();
        $cnew->groups = "CS";
        $cnew->position = 1;
        $cnew->save();


        $cmess = ContractMessage::where('id_contract',$id)->first();
        $dmess = ContractMessage::find($cmess['id'])->forceDelete();


        $newcmess = new ContractMessage;
        $newcmess->id_contract = $id;
        $newcmess->user_id = $id_user;
        $newcmess->status = 1;
        $newcmess->message = "Revisi Kontrak ini dan akan kembali lagi ke CS, Dengan Alasan" . $data['alasan'];
        $newcmess->inserted_at = time::now();
        $newcmess->save();

        $message = array(
            'success' => true,
            'message' => 'Saving Success',
            'contract_no' => $revcontract->contract_no
        );
        return response()->json($message);
        // } catch (\Exception $e){
        //     return response()->json($e->getMessage());
        // }
    }


    public function editview(Request $request, $id)
    {
        $var = Kontrakuji::with([
            'contract_condition' => function ($q) {
                return $q->where('groups', 'CS');
            },
            'contract_condition.user',
            'cust_address',
            'cust_tax_address',
            'contract_category',
            'customers_handle',
            'attachment',
            'akgTrans',
            'akgTrans.masterakg',
            'samplingTrans',
            'samplingTrans.samplingmaster',
            'payment_condition',
            'payment_condition.voucher',
            'customers_handle.customers',
            'customers_handle.contact_person',
            'user',
            'description',
            'transactionsample' => function ($q) {
                return $q->orderBy('id', 'ASC');
            },
            'transactionsample.nonpaket',
            'transactionsample.paketparameter',
            'transactionsample.paketpkm'
        ])
            ->whereHas('transactionsample', function ($z) {
                return $z->orderBy('id', 'ASC');
            })
            ->find($id);
        return response()->json($var);
    }

    public function sendingemailcontract(Request $request)
    {
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $data = $request->input('data');
            $id_user = $users->sub;
            $email = \DB::table('users')->where('id', $id_user)->first();

            $var = \DB::table('transaction_sample as a')
                ->selectRaw('
                a.id_contract,
                a.no_sample,
                a.sample_name,
                c.email,
                b.contract_no,
                if(b.no_po != "-",b.no_po,NULL) as no_po,
                b.no_penawaran,
                d.customer_name,
                e.name as cp,
                g.name as statuspengujian,
                DATE_FORMAT(a.tgl_selesai,"%d/%m/%Y") as tgl_selesai
            ')
                ->leftJoin('mstr_transaction_kontrakuji as b', 'b.id_kontrakuji', 'a.id_contract')
                ->leftJoin('mstr_customers_handle as c', 'c.idch', 'b.id_customers_handle')
                ->leftJoin('mstr_customers_customer as d', 'd.id_customer', 'c.id_customer')
                ->leftJoin('mstr_customers_contactperson as e', 'e.id_cp', 'c.id_cp')
                ->leftJoin('mstr_transaction_statuspengujian as g', 'g.id', 'a.id_statuspengujian')
                ->leftJoin('mstr_products_contactcategory as f', 'f.id', 'b.id_contract_category')
                ->where('a.id_contract', $data['id_kontrakuji'])
                ->orderBy('a.id_statuspengujian', 'desc')
                ->groupBy('a.id_statuspengujian')
                ->get();

            $countSample = \DB::table('transaction_sample as a')
                ->selectRaw('count(a.id) as totalsample')
                ->where('a.id_contract', $data['id_kontrakuji'])
                ->groupBy('a.id_contract')->get();

            $haa = array(
                'contract' => $var,
                'count' => $countSample
            );

            Mail::send('Kontrak/contract', $haa, function ($message) use ($var, $email, $data) {
                $message->to($var[0]->email, $var[0]->cp)->subject('Contract Review, ' . $var[0]->contract_no);
                foreach ($data['cc'] as $d) {
                    $useremail = Employee::with(['user'])->where('user_id', $d)->first();
                    $message->cc($useremail['user']['email'], $useremail['employee_name']);
                }
                $em = Employee::with(['user'])->where('user_id', $data['from'])->first();
                $message->bcc($em['user']['email'], $em['employee_name']);
                $message->bcc('herdinop.sig@saraswanti.com', 'Checker');
                $message->from($em['user']['email'], 'Customer Service SIG Laboratories');
            });
            return response()->json(array(
                "success" => true,
                'message' => "success"
            ));
            //  return response(view('Kontrak/contract',$haa));
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function deletedelete(Request $request)
    {
        try {
            $varParameter = \DB::table('transaction_parameter as a')
                ->leftJoin('transaction_sample as b', 'b.id', 'a.id_sample')
                ->leftJoin('mstr_transaction_kontrakuji as c', 'c.id_kontrakuji', 'b.id_contract')
                ->where(\DB::raw('MONTH(c.created_at)'), '<>', 8)
                ->get()->toArray();

            $varSample = \DB::table('transaction_sample as a')
                ->leftJoin('mstr_transaction_kontrakuji as b', 'b.id_kontrakuji', 'a.id_contract')
                ->where(\DB::raw('MONTH(b.created_at)'), '<>', 8)
                ->get()->toArray();

            $varContract = \DB::table('mstr_transaction_kontrakuji as a')
                ->where(\DB::raw('MONTH(a.created_at)'), '<>', 8)
                ->get()->toArray();

            foreach ($varParameter as $k) {
                // return $k->id;
                $checkConditionCome = ConditionLabCome::where('id_transaction_parameter', $k->id)->first();
                if ($checkConditionCome) {
                    $delCome = ConditionLabCome::find($checkConditionCome->id)->delete();
                }

                $checkConditionDone = ConditionLabDone::where('id_transaction_parameter', $k->id)->first();
                if ($checkConditionDone) {
                    $delDone = ConditionLabDone::find($checkConditionDone->id)->delete();
                }

                $checkConditionProcess = ConditionLabProccess::where('id_transaction_parameter', $k->id)->first();
                if ($checkConditionProcess) {
                    $delProcess = ConditionLabProccess::find($checkConditionProcess->id)->delete();
                }
                $deleteParameter = Transaction_parameter::find($k->id);
                if ($deleteParameter) {
                    $deleteParameter->forceDelete();
                }
            }

            foreach ($varSample as $l) {
                $deletePhotoSample = Photo::where('id_sample', $l->id)->first();
                if ($deletePhotoSample) {
                    $delp = Photo::find($deletePhotoSample->id)->delete();
                }
                $deleteConditionSample = ConditionContractNew::where('sample_id', $l->id)->first();
                if ($deleteConditionSample) {
                    $del = ConditionContractNew::find($deleteConditionSample->id_condition_contract)->delete();
                }

                $bobotdelete = BobotSample::where('id_sample', $l->id)->first();
                if ($bobotdelete) {
                    $deldel = BobotSample::find($bobotdelete->id)->delete();
                }

                $deleteSample = TransactionSample::find($l->id);
                if ($deleteSample) {
                    $deleteSample->forceDelete();
                }
            }

            foreach ($varContract as $z) {
                $deleteCondition = ConditionContractNew::where('contract_id', $z->id_kontrakuji)->first();
                if ($deleteCondition) {
                    $del = ConditionContractNew::find($deleteCondition->id_condition_contract)->delete();
                }
                $deleteTransactionakg = AkgTransaction::where('id_transaction_kontrakuji', $z->id_kontrakuji)->first();
                if ($deleteTransactionakg) {
                    $delakg = AkgTransaction::find($deleteTransactionakg->id)->delete();
                }

                $deleteTransactionsampling = SamplingTransaction::where('id_transaction_contract', $z->id_kontrakuji)->first();
                if ($deleteTransactionsampling) {
                    $delakg = SamplingTransaction::find($deleteTransactionsampling->id)->delete();
                }

                $delpayment = PaymentCondition::where('id_contract', $z->id_kontrakuji)->first();
                if ($delpayment) {
                    $deldel = PaymentCondition::find($delpayment->id_payment_contract)->delete();
                }

                $delkontrak = Kontrakuji::find($z->id_kontrakuji);
                if ($delkontrak) {
                    $delkontrak->forceDelete();
                }
            }

            return 'mantap';
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function getAttachment(Request $request, $id)
    {
        try {
            $var = ContractAttachment::where('id_contract', $id)->get();
            return response()->json($var);
        } catch (\Exception $e) {
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
            $sampleno = [];
            $contract_no = '';
            $z = ContractCategory::find($data['contract_category']);

            $tanggal_terima = time::now();
            $pecahtanggal_waktu = explode('T', $tanggal_terima);
            $pecahtahun = explode('-', $pecahtanggal_waktu[0]);

            $parameterfind = \DB::table('transaction_parameter as a')
                ->selectRaw('
            a.id as id_parameter,
            b.id as id_sample,
            b.no_sample,
            c.contract_no
            ')
                ->leftJoin('transaction_sample as b', 'b.id', 'a.id_sample')
                ->leftJoin('mstr_transaction_kontrakuji as c', 'c.id_kontrakuji', 'b.id_contract')
                ->where('b.id_contract', $id)->get();

            if (count($parameterfind) > 0) {
                foreach ($parameterfind as $h) {
                    array_push($sampleno, $h->no_sample);
                }
                $contract_no = $parameterfind[0]->contract_no;

                File::deleteDirectory($parameterfind[0]->contract_no);

                foreach ($parameterfind as $v) {
                    $parameterdelete = Transaction_parameter::find($v->id_parameter)->forceDelete();
                }

                $samplefind = TransactionSample::where('id_contract', $id)->get();

                foreach ($samplefind as $d) {
                    $sampledelete = TransactionSample::find($d->id)->forceDelete();
                }

                $paymentfind = PaymentCondition::where('id_contract', $id)->get();

                foreach ($paymentfind as $p) {
                    $paymentdelete = PaymentCondition::find($p->id_payment_contract)->Delete();
                }

                $akgtransfind = AkgTransaction::where('id_transaction_kontrakuji', $id)->get();

                if (count($akgtransfind) > 0) {
                    foreach ($akgtransfind as $akg) {
                        $akgdelete = AkgTransaction::find($akg->id)->Delete();
                    }
                }

                $samplingtransfind = SamplingTransaction::where('id_transaction_contract', $id)->get();

                if (count($samplingtransfind) > 0) {
                    foreach ($samplingtransfind as $samp) {
                        $samplingdelete = SamplingTransaction::find($samp->id)->Delete();
                    }
                }

                $attachmentfind = ContractAttachment::where('id_contract', $id)->get();

                if (count($attachmentfind) > 0) {
                    foreach ($attachmentfind as $attach) {
                        $attachmentDelete = ContractAttachment::find($attach->id_contract_attachment)->Delete();
                    }
                }

                $conditionFind = ConditionContractNew::where('contract_id', $id)->get();

                foreach ($conditionFind as $cond) {
                    $ConditionDelete = ConditionContractNew::find($cond->id_condition_contract)->Delete();
                }

                $kontrakDelete = Kontrakuji::find($id)->forceDelete();
            }


            if (!File::exists($contract_no)) {
                File::makeDirectory($contract_no);
            }

            $samplenokasih = array();
            $kontrak = new Kontrakuji;
            $kontrak->contract_no = $contract_no;
            $kontrak->no_penawaran = !empty($data['no_penawaran']) ? $data['no_penawaran'] : null;
            $kontrak->no_po = !empty($data['no_po']) ? $data['no_po'] : null;
            $kontrak->desc = $data['desc'];
            $kontrak->contract_type = $data['typeContract'];
            $kontrak->id_customers_handle = $data['customerhandle'];
            $kontrak->id_alamat_customer = $data['alamatcustomer'];

            $kontrak->id_contract_category = $data['contract_category'];
            $kontrak->created_at = time::now();
            $kontrak->status = !empty($data['clienthandling']) ? $data['clienthandling'] : null;
            $kontrak->save();

            if (!empty($data['desc_internal'])) {
                $desc = new Description;
                $desc->id_contract = $kontrak->id_kontrakuji;
                $desc->id_sample = 0;
                $desc->desc = $data['desc_internal'];
                $desc->status = 1;
                $desc->insert_user = $id_user;
                $desc->created_at = time::now();
                $desc->save();
            }

            if (!empty($data['foto'][0]['photo'])) {
                foreach ($data['foto'] as $g) {

                    $foldername = $contract_no . '/attachment';

                    if (!File::exists($foldername)) {
                        File::makeDirectory($foldername);
                    }

                    $zattachment = Image::make($g['photo']);
                    $zattachment->resize(null, 300, function ($constraint) {
                        $constraint->aspectRatio();
                    });

                    $pathname = '' . $contract_no . '-' . ($g['id'] + 1) . '.jpeg';


                    $zattachment->save(public_path($foldername . '/' . $pathname));

                    $attachment = new ContractAttachment;
                    $attachment->filename = $pathname;
                    $attachment->id_contract = $kontrak->id_kontrakuji;
                    $attachment->save();
                }
            }


            // return $kontrak->contract_no;

            foreach ($data['sample'] as $sample) {
                // return count($data['sample']);
                $sampleselect = TransactionSample::where(\DB::raw('YEAR(tgl_input)'), $pecahtahun[0])
                    ->where(\DB::raw('MONTH(tgl_input)'), $pecahtahun[1])->get();
                $jumlahsample = count($sampleselect);
                $nosamplec = substr($pecahtahun[0], -1) . '' . $pecahtahun[1] . '.' . $z->category_code . '.' . ($jumlahsample + 1);
                $checksample = TransactionSample::where('no_sample', 'like', '%' . $nosamplec . '%')->get();
                if (count($checksample) > 0) {
                    foreach ($checksample as $ff) {
                        $asd = TransactionSample::find($ff->id)->forceDelete();
                    }
                }
                $a = new TransactionSample;
                $a->no_sample = $nosamplec;
                $a->sample_name = $sample['samplename'];
                $a->id_tujuanpengujian = $sample['parameter']['tujuanpengujian'];
                $a->id_statuspengujian = $sample['parameter']['statuspengujian'];
                $a->batch_number = !empty($sample['parameter']['batchno']) ? $sample['parameter']['batchno'] : null;
                $a->lot_number = $sample['parameter']['lotno'];
                $a->no_notifikasi = $sample['parameter']['no_notifikasi'];
                $a->no_registrasi = $sample['parameter']['no_registrasi'];
                $a->no_pengajuan = $sample['parameter']['no_pengajuan'];
                $a->no_principalcode = $sample['parameter']['no_principalCode'];
                $a->nama_pabrik = $sample['parameter']['factoryname'];
                $a->nama_dagang = $sample['parameter']['trademark'];
                $a->jenis_kemasan = $sample['parameter']['jeniskemasan'];
                $a->tgl_input = $sample['parameter']['tgl_input'];
                $a->tgl_selesai = $sample['parameter']['tgl_selesai'];
                $a->id_subcatalogue = !empty($sample['parameter']['subcatalogue']) ? $sample['parameter']['subcatalogue'] : NULL;
                $a->tgl_produksi = !empty($sample['parameter']['tgl_produksi']) ? $sample['parameter']['tgl_produksi'] : null;
                $a->tgl_kadaluarsa = !empty($sample['parameter']['tgl_kadaluarsa']) ? $sample['parameter']['tgl_kadaluarsa'] : null;
                $a->certificate_info = intval($sample['parameter']['certificate_info']);
                $a->price = $sample['parameter']['totalpricesample'];
                $a->id_contract = $kontrak->id_kontrakuji;
                $a->save();



                $samplenokasih[] = $nosamplec;
                if (count($sample['parameter']['paketparameter']) > 0) {
                    foreach ($sample['parameter']['paketparameter'] as $paketparameter) {
                        // // if($paketparameter['discount'] > 0){
                        // //     $discount = new TransactionDiscount;
                        // //     $discount->status = 2;
                        // //     $discount->info_id = $paketparameter['id_paketuji'];
                        // //     $discount->discount = $paketparameter['discount'];
                        // //     $discount->save();
                        // // }

                        foreach ($paketparameter['paketparameter'] as $c) {
                            $b = new Transaction_parameter;
                            $b->id_parameteruji = !empty($c['id_parameter_uji']) ? $c['id_parameter_uji'] : $c['id_parameteruji'];
                            $b->id_sample = $a->id;
                            $b->id_lod = $c['id_lod'];
                            $b->id_lab = $c['id_lab'];
                            $b->id_metode = $c['id_metode'];
                            $b->id_unit = $c['id_unit'];
                            $b->disc_parameter = $paketparameter['discount'];
                            $b->id_standart = $c['id_standart'];
                            $b->format_hasil = NULL;
                            $b->status = 1;
                            $b->info_id = $paketparameter['id_paketuji'];
                            $b->idfor = !empty($paketparameter['id_for']) ? $paketparameter['id_for'] : $paketparameter['idfor'];
                            $b->save();
                        }
                    }
                }
                if (count($sample['parameter']['nonpaketparameter']) > 0) {
                    foreach ($sample['parameter']['nonpaketparameter'] as $satuanparameter) {
                        // // return 'bubur ayam';
                        // if($satuanparameter['discount'] > 0){
                        //     $discount = new TransactionDiscount;
                        //     $discount->status = 1;
                        //     $discount->info_id = $satuanparameter['id_parameter_uji'];
                        //     $discount->discount = $satuanparameter['discount'];
                        //     $discount->save();
                        // }
                        $x = new Transaction_parameter;
                        $x->id_parameteruji = !empty($satuanparameter['id_parameter_uji']) ? $satuanparameter['id_parameter_uji'] : $satuanparameter['id_parameteruji'];
                        $x->id_sample = $a->id;
                        $x->disc_parameter = $a->discount;
                        $x->format_hasil =  !empty($satuanparameter['formathasil']) ? $satuanparameter['formathasil'] : $satuanparameter['format_hasil'];
                        $x->status = 2;
                        $x->idfor = !empty($satuanparameter['id_for']) ? $satuanparameter['id_for'] : $satuanparameter['idfor'];
                        $x->id_lab = $satuanparameter['id_lab'];
                        $x->info_id = !empty($satuanparameter['id_price']) ? $satuanparameter['id_price'] : $satuanparameter['info_id'];
                        $x->save();
                    }
                }


                if (count($sample['parameter']['paketPKM']) > 0) {
                    foreach ($sample['parameter']['paketPKM'] as $paketpkm) {
                        foreach ($paketpkm['subpackage'] as $sub) {
                            $bbb = \DB::table('mstr_detail_specific_package as a')
                                ->selectRaw('*')
                                ->leftJoin('mstr_sub_specific_package as b', 'b.id', 'a.id_mstr_sub_specific_package')
                                ->leftJoin('mstr_specific_package as c', 'c.id', 'b.mstr_specific_package_id')
                                ->where('b.id', $sub['id'])->get();

                            foreach ($bbb as $sz => $vaz) {
                                $zxc = new Transaction_parameter;
                                $zxc->id_parameteruji = $vaz->parameteruji_id;
                                $zxc->id_sample = $a->id;
                                $zxc->format_hasil = null;
                                $zxc->status = 4;
                                $zxc->id_metode = $vaz->id_metode;
                                $zxc->id_lab = $vaz->id_lab;
                                $zxc->idfor = !empty($paketpkm['id_for']) ? $paketpkm['id_for'] : $paketpkm['idfor'];
                                $zxc->id_unit = $vaz->id_unit;
                                $zxc->position = $sz + 1;
                                $zxc->info_id = $vaz->id_mstr_sub_specific_package;
                                $zxc->save();
                            }
                        }
                    }
                }
            }
            if (count($data['dataakg']) > 0) {
                // return 'a';
                foreach ($data['dataakg'] as $biayakg) {
                    // return $biayakg;
                    $akg = new AkgTransaction;
                    $akg->id_transaction_kontrakuji = $kontrak->id_kontrakuji;
                    $akg->id_mstr_transaction_akg = $biayakg['id'];
                    $akg->jumlah = $biayakg['jumlah'];
                    $akg->total = $biayakg['total'];
                    $akg->save();
                }
            }

            if (count($data['datasampling']) > 0) {

                foreach ($data['datasampling'] as $biayasample) {
                    $sampl = new SamplingTransaction;
                    $sampl->id_transaction_contract = $kontrak->id_kontrakuji;
                    $sampl->id_mstr_transaction_sampling = $biayasample['id'];
                    $sampl->jumlah = $biayasample['jumlah'];
                    $sampl->total = $biayasample['total'];
                    $sampl->save();
                }
            }


            $payment = new PaymentCondition;
            $payment->id_contract = $kontrak->id_kontrakuji;
            $payment->biaya_pengujian = $data['totalpembayaran'];
            $payment->discount_lepas = $data['hasilDiscount'];
            $payment->ppn = $data['ppn'];
            $payment->downpayment = $data['uangmuka'];
            $payment->save();



            $conditioncontract = new ConditionContractNew;
            $conditioncontract->contract_id = $kontrak->id_kontrakuji;
            $conditioncontract->sample_id = 0;
            $conditioncontract->parameter_id = 0;
            $conditioncontract->user_id = $id_user;
            $conditioncontract->status = 0;
            $conditioncontract->groups = 'CS';
            $conditioncontract->position = 1;
            $conditioncontract->inserted_at = time::now();
            $conditioncontract->save();
            $ga = TransactionSample::where('id_contract', $kontrak->id_kontrakuji)->get();

            $checkMessageContract = ContractMessage::where('id_contract', $kontrak->id_kontrakuji)->get();

            $setmessage = count($checkMessageContract) > 0 ? ContractMessage::find($checkMessageContract[0]['id']) : new ContractMessage;
            $setmessage->id_contract = $kontrak->id_kontrakuji;
            $setmessage->user_id = $id_user;
            $setmessage->status = 1;
            $setmessage->message = "Kontrak ini akan kembali lagi ke CS karena Revisi, Dengan Alasan" . $data['alasan'];
            $setmessage->inserted_at = time::now();
            $setmessage->save();

            $message = array(
                'success' => true,
                'message' => 'Saving Success',
                'contract-no' => $kontrak,
                'sample' => $ga
            );


            return response()->json($message);
        } catch (\Exception $e) {
            $data = array(
                'success' => false,
                'message' => 'Update Error'
            );
            return response()->json($e->getMessage());
            return $e;
        }
    }

    public function acceptContractNew(Request $request)
    {
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;

            $var = ConditionContractNew::where('contract_id', $request->input('contract_id'))->where('position', 1)->where('groups', 'CS')->where('status', '<>', 5)->first();

            $acceptCondition = ConditionContractNew::find($var->id_condition_contract);
            $acceptCondition->status = 1;
            // $acceptCondition->inserted_at = time::now();
            // $acceptCondition->user_id = $id_user;
            $acceptCondition->save();


            $cj = new ContractMessage;
            $cj->id_contract = $var->contract_id;
            $cj->user_id = $id_user;
            $cj->status = 4;
            $cj->message = 'approving contract';
            $cj->inserted_at = time::now();
            $cj->save();

            $acceptConditionKendali = new ConditionContractNew;
            $acceptConditionKendali->status = 0;
            $acceptConditionKendali->contract_id = $var->contract_id;
            $acceptConditionKendali->sample_id = $var->sample_id;
            $acceptConditionKendali->parameter_id = $var->parameter_id;
            $acceptConditionKendali->inserted_at = time::now();
            $acceptConditionKendali->user_id = $var->user_id;
            $acceptConditionKendali->groups = 'KENDALI';
            $acceptConditionKendali->position = 2;
            $acceptConditionKendali->save();

            return response()->json(array(
                "status" => true,
                "message" => "Success Accepting Contract"
            ));
        } catch (\Exception $e) {
            return response()->json(array(
                "status" => false,
                "message" => "Failed"
            ));
        }
    }

    public function check_attachment(Request $request)
    {
        try {
            $var = \DB::table('contract_attachment')->where('id_contract', $request->input('id_contract'))->first();
            if ($var) {
                return response(array(
                    "success" => true,
                    "message" => 'Attachment found'
                ));
            } else {
                return response(array(
                    "success" => false,
                    "message" => 'Attachment not found'
                ));
            }
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function tambahdownpayment(Request $request)
    {
        try {

            $var = PaymentCondition::where('id_contract', $request->input('id_contract'))->first();

            $r = \DB::table('payment_data as a')
                ->selectRaw('SUM(payment) as total')
                ->where('a.id_contract', $request->input('id_contract'))
                ->get();

            $v = PaymentCondition::find($var->id_payment_contract);
            $v->downpayment = $r[0]->total;
            $v->save();

            return response()->json(array(
                "success" => true,
                "message" => "data updated successfuly"
            ));
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function destroy(Request $request, $id)
    {
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            // $data = $request->input('desc');
            $id_user = $users->sub;

            $conditionFind = ConditionContractNew::where('contract_id', $id)->get();
            if (count($conditionFind) > 0) {
                foreach ($conditionFind as $cond) {
                    $ConditionDelete = ConditionContractNew::find($cond->id_condition_contract)->Delete();
                }
            }


            $parameter = \DB::table('transaction_parameter as a')
                ->select('a.id')
                ->leftJoin('transaction_sample as b', 'b.id', 'a.id_sample')
                ->where('b.id_contract', $id)->get()->toArray();

            $sample = \DB::table('transaction_sample as a')
                ->where('a.id_contract', $id)->get()->toArray();

            $kontrak = Kontrakuji::find($id);

            if (count($parameter) > 0) {
                foreach ($parameter as $va) {
                    $g = Transaction_parameter::find($va->id)->forceDelete();

                    $c = ConditionLabCome::where('id_transaction_parameter', $va->id)->first();
                    if ($c) {
                        $del = ConditionLabCome::find($c->id)->Delete();
                    }

                    $d = ConditionLabProccess::where('id_transaction_parameter', $va->id)->first();
                    if ($c) {
                        $del = ConditionLabProccess::find($d->id)->Delete();
                    }

                    $e = ConditionLabDone::where('id_transaction_parameter', $va->id)->first();
                    if ($c) {
                        $del = ConditionLabDone::find($e->id)->Delete();
                    }
                }
            }

            if (count($sample) > 0) {
                foreach ($sample as $vv) {
                    $f = TransactionSample::find($vv->id)->forceDelete();
                    $checkphoto = Photo::where('id_sample', $vv->id)->get();
                    if (count($checkphoto) > 0) {
                        foreach ($checkphoto as $o) {
                            $destinationPath = public_path('' . $kontrak->contract_no . '/' . $vv->sample_name . '');
                            $checkfile = File::delete($destinationPath . '/' . $o['photo']);
                            $de = Photo::find($o->id)->forceDelete();
                        }
                    }
                }
            }


            $payment = PaymentCondition::where('id_contract', $id)->first();
            if ($payment) {
                $del = PaymentCondition::find($payment->id_payment_contract)->forceDelete();
            }
            $akgtrans = AkgTransaction::where('id_transaction_kontrakuji', $id)->first();
            if ($akgtrans) {
                $del = AkgTransaction::find($akgtrans->id)->forceDelete();
            }

            $sampling = SamplingTransaction::where('id_transaction_contract', $id)->get();
            if (count($sampling) > 0) {
                foreach ($sampling as $ss) {
                    $c = SamplingTransaction::find($ss->id)->forceDelete();
                }
            }

            $paymentData = PaymentData::where('id_contract', $id)->get();
            if (count($paymentData) > 0) {
                foreach ($paymentData as $d) {
                    $del = PaymentData::find($d->id)->forceDelete();
                }
            }
            $deleteContractMess = ContractMessage::where('id_contract', $kontrak->id_kontrakuji)->get();
            if (count($deleteContractMess) > 0) {
                foreach ($deleteContractMess as $m) {
                    $x = ContractMessage::find($m->id)->delete();
                }
            }

            $d = new ContractMessage;
            $d->id_contract = $kontrak->id_kontrakuji;
            $d->status = 3;
            $d->message = $request->input('desc');
            $d->user_id = $id_user;
            $d->inserted_at = time::now();
            $d->save();

            $v = ConditionContractNew::where('contract_id', $id)->get();
            foreach ($v as $c) {
                $gf = ConditionContractNew::find($c->id_condition_contract)->delete();
            }

            $kontrak->delete();

            $message = array(
                "status" => true,
                "message" => "Success Deleted Contract",
            );

            return response()->json($message);
        } catch (\Exception $e) {
            $message = array(
                "status" => false,
                "message" => "Fail Deleting Contract"
            );
            return response()->json($e->getMessage());
        }
    }

    public function getUserCreate(Request $request)
    {
        try {

            $var = \DB::table('condition_contracts as a')
                ->select('a.user_id', 'b.employee_name')
                ->leftJoin('hris_employee as b', 'b.user_id', 'a.user_id')
                ->where('sample_id', 0)
                ->where('parameter_id', 0)
                ->where('groups', 'CS')
                // ->groupBy('contract_id')
                ->groupBy('a.user_id')->paginate(25);

            return response()->json($var);
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    private function setNumber($id)
    {
    }

    public function store(Request $request)
    {
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');
            $tanggal_terima = time::now();

            $pecahtanggal_waktu = explode('T', $tanggal_terima);
            $pecahtahun = explode('-', $pecahtanggal_waktu[0]);

            $c = '';

            $checklastcontract = \DB::select('SELECT
            MAX(CAST(SUBSTRING_INDEX(DATA_1.contract_no,".",-1) AS SIGNED)) AS terakhir
            FROM ( SELECT
            IF(CHAR_LENGTH(SUBSTRING_INDEX(a.contract_no,".",-1)) > 3, a.contract_no,SUBSTR(a.contract_no,1,(CHAR_LENGTH(a.contract_no) - 8))) AS contract_no
            FROM mstr_transaction_kontrakuji a WHERE a.id_contract_category = ' . $data['contract_category'] . ' and YEAR(a.created_at) = ' . $pecahtahun[0] . ') AS DATA_1');

            $b = $checklastcontract[0]->terakhir + 1;
            $z = ContractCategory::find($data['contract_category']);
            $c = 'SIG.MARK.' . $z->category_code . '.' . $this->integerToRoman($pecahtahun[1]) . '.' . $pecahtahun[0] . '.' . $this->leftPad($b, 6) . '';
            $checknumber = Kontrakuji::where('contract_no', $c)->get();

            if (count($checknumber) > 0) {
                $checklastcontract = \DB::select('SELECT
                MAX(CAST(SUBSTRING_INDEX(DATA_1.contract_no,".",-1) AS SIGNED)) AS terakhir
                FROM ( SELECT
                IF(CHAR_LENGTH(SUBSTRING_INDEX(a.contract_no,".",-1)) > 3, a.contract_no,SUBSTR(a.contract_no,1,(CHAR_LENGTH(a.contract_no) - 8))) AS contract_no
                FROM mstr_transaction_kontrakuji a WHERE a.id_contract_category = ' . $data['contract_category'] . ' and YEAR(a.created_at) = ' . $pecahtahun[0] . ') AS DATA_1');

                $b = $checklastcontract[0]->terakhir + 1;
                $z = ContractCategory::find($data['contract_category']);
                $c = 'SIG.MARK.' . $z->category_code . '.' . $this->integerToRoman($pecahtahun[1]) . '.' . $pecahtahun[0] . '.' . $this->leftPad($b, 6) . '';

                $checknumber1 = Kontrakuji::where('contract_no', $c)->get();
                if (count($checknumber1) > 0) {
                    $checklastcontract1 = \DB::select('SELECT
                    MAX(CAST(SUBSTRING_INDEX(DATA_1.contract_no,".",-1) AS SIGNED)) AS terakhir
                    FROM ( SELECT
                    IF(CHAR_LENGTH(SUBSTRING_INDEX(a.contract_no,".",-1)) > 3, a.contract_no,SUBSTR(a.contract_no,1,(CHAR_LENGTH(a.contract_no) - 8))) AS contract_no
                    FROM mstr_transaction_kontrakuji a WHERE a.id_contract_category = ' . $data['contract_category'] . ' and YEAR(a.created_at) = ' . $pecahtahun[0] . ') AS DATA_1');

                    $b = $checklastcontract1[0]->terakhir + 1;
                    $z = ContractCategory::find($data['contract_category']);
                    $c = 'SIG.MARK.' . $z->category_code . '.' . $this->integerToRoman($pecahtahun[1]) . '.' . $pecahtahun[0] . '.' . $this->leftPad($b, 6) . '';
                }
            }

            if (!File::exists($c)) {
                File::makeDirectory($c);
            }

            $samplenokasih = array();
            $kontrak = new Kontrakuji;
            $kontrak->contract_no = $c;
            $kontrak->no_penawaran = !empty($data['no_penawaran']) ? $data['no_penawaran'] : null;
            $kontrak->no_po = !empty($data['no_po']) ? $data['no_po'] : null;
            $kontrak->contract_government = !empty($data['contracttypegovernment']) ? $data['contracttypegovernment'] : null;
            $kontrak->desc = $data['desc'];
            $kontrak->contract_type = $data['typeContract'];
            $kontrak->id_customers_handle = $data['customerhandle'];
            $kontrak->status = !empty($data['clienthandling']) ? $data['clienthandling'] : null;
            $kontrak->id_alamat_customer = $data['alamatcustomer'];

            $checkhold = \DB::table('mstr_customers_handle as a')
                ->join('mstr_customers_customer as b', 'b.id_customer', 'a.id_customer')
                ->where('a.idch', $data['customerhandle'])
                ->first();

            $kontrak->hold = $checkhold->status_invoice == 2 ? 'N' : 'Y';
            // $kontrak->id_alamat_taxaddress = $data['alamataxaddress'];
            $kontrak->id_contract_category = $data['contract_category'];
            $kontrak->created_at = time::now();
            $kontrak->save();


            // return count($data['foto']);

            if (!empty($data['desc_internal'])) {
                $desc = new Description;
                $desc->id_contract = $kontrak->id_kontrakuji;
                $desc->id_sample = 0;
                $desc->id_parameter = 0;
                $desc->desc = $data['desc_internal'];
                $desc->status = 2;
                $desc->insert_user = $id_user;
                $desc->created_at = time::now();
                $desc->save();
            }

            foreach ($data['sample'] as $key => $sample) {

                $nosamplec = '';

                $checklastval = \DB::select('SELECT
                IFNULL(MAX(CAST(IF(SUBSTRING_INDEX(SUBSTRING_INDEX(a.no_sample,".",-2),".",1) = "REV",SUBSTRING_INDEX(SUBSTRING_INDEX(a.no_sample,".",-3),".",1),SUBSTRING_INDEX(a.no_sample,".",-1)) AS SIGNED)),0) AS max
                FROM transaction_sample a WHERE MID(a.no_sample,5,1) = "' . $z->category_code . '" AND MID(a.no_sample,2,2) = DATE_FORMAT(NOW(),"%m") AND LEFT(a.no_sample,1) = RIGHT(YEAR(NOW()),1)');
                $count = $checklastval[0]->max + 1;
                $tested = $count + 1;

                $nosamplec = substr($pecahtahun[0], -1) . '' . $pecahtahun[1] . '.' . $z->category_code . '.' . $count;
                $tambahdikit = substr($pecahtahun[0], -1) . '' . $pecahtahun[1] . '.' . $z->category_code . '.' . $tested;

                $checknosample = TransactionSample::where('no_sample', 'like', '%' . $nosamplec . '%')->get();

                // return $checklastval;

                $a = new TransactionSample;
                $a->no_sample = count($checknosample) > 0 ? $tambahdikit : $nosamplec;
                $a->sample_name = $sample['samplename'];
                $a->kode_sample = !empty($sample['kode_sample']) ? $sample['kode_sample'] : null;
                $a->id_tujuanpengujian = $sample['parameter']['tujuanpengujian'];
                $a->id_statuspengujian = $sample['parameter']['statuspengujian'];
                $a->batch_number = !empty($sample['parameter']['batchno']) ? $sample['parameter']['batchno'] : null;
                $a->lot_number = $sample['parameter']['lotno'];
                $a->discount = !empty($sample['parameter']['discountsample']) ? $sample['parameter']['discountsample'] : 0;
                $a->no_notifikasi = $sample['parameter']['no_notifikasi'];
                $a->no_registrasi = $sample['parameter']['no_registrasi'];
                $a->no_pengajuan = $sample['parameter']['no_pengajuan'];
                $a->no_principalcode = $sample['parameter']['no_principalCode'];
                $a->nama_pabrik = $sample['parameter']['factoryname'];
                $a->alamat_pabrik = $sample['parameter']['factory_address'];
                $a->keterangan_lain = !empty($sample['parameter']['ket_lain']) ? $sample['parameter']['ket_lain'] : NULL;
                $a->nama_dagang = $sample['parameter']['trademark'];
                $a->jenis_kemasan = $sample['parameter']['jeniskemasan'];
                $a->tgl_input = time::now()->format('Y-m-d');
                $a->tgl_selesai = $sample['parameter']['tgl_selesai'];
                $a->id_subcatalogue = !empty($sample['parameter']['subcatalogue']) ? $sample['parameter']['subcatalogue'] : NULL;
                $a->tgl_produksi = !empty($sample['parameter']['tgl_produksi']) ? $sample['parameter']['tgl_produksi'] : null;
                $a->tgl_kadaluarsa = !empty($sample['parameter']['tgl_kadaluarsa']) ? $sample['parameter']['tgl_kadaluarsa'] : null;
                $a->certificate_info = intval($sample['parameter']['certificate_info']);
                $a->price = $sample['parameter']['price'];
                $a->id_contract = $kontrak->id_kontrakuji;
                $a->save();

                $samplenokasih[] = $nosamplec;
                if (count($sample['parameter']['paketparameter']) > 0) {
                    foreach ($sample['parameter']['paketparameter'] as $paketparameter) {

                        foreach ($paketparameter['paketparameter'] as $c) {
                            $b = new Transaction_parameter;
                            $b->id_parameteruji = $c['id_parameter_uji'];
                            $b->id_sample = $a->id;
                            $b->id_lod = $c['id_lod'];
                            $b->id_lab = $c['id_lab'];
                            $b->id_metode = $c['id_metode'];
                            $b->id_unit = $c['id_unit'];
                            $b->disc_parameter = $paketparameter['discount'];
                            $b->id_standart = $c['id_standart'];
                            $b->format_hasil = NULL;
                            $b->status = 1;
                            $b->info_id = $paketparameter['id_paketuji'];
                            $b->idfor = $paketparameter['id_for'];
                            $b->save();
                        }
                    }
                }
                if (count($sample['parameter']['nonpaketparameter']) > 0) {
                    foreach ($sample['parameter']['nonpaketparameter'] as $satuanparameter) {

                        $x = new Transaction_parameter;
                        $x->id_parameteruji = $satuanparameter['id_parameter_uji'];
                        $x->id_sample = $a->id;
                        $x->disc_parameter = $a->discount;
                        $x->format_hasil =  $satuanparameter['formathasil'];
                        $x->status = 2;
                        $x->idfor = $satuanparameter['id_for'];
                        $x->id_lab = $satuanparameter['id_lab'];
                        $x->info_id = $satuanparameter['id_price'];
                        $x->save();
                    }
                }


                if (count($sample['parameter']['paketPKM']) > 0) {
                    foreach ($sample['parameter']['paketPKM'] as $paketpkm) {
                        foreach ($paketpkm['subpackage'] as $sub) {
                            $bbb = \DB::table('mstr_detail_specific_package as a')
                                ->selectRaw('*')
                                ->leftJoin('mstr_sub_specific_package as b', 'b.id', 'a.id_mstr_sub_specific_package')
                                ->leftJoin('mstr_specific_package as c', 'c.id', 'b.mstr_specific_package_id')
                                ->where('b.id', $sub['id'])->get();

                            foreach ($bbb as $sz => $vaz) {
                                $zxc = new Transaction_parameter;
                                $zxc->id_parameteruji = $vaz->parameteruji_id;
                                $zxc->id_sample = $a->id;
                                $zxc->format_hasil = null;
                                $zxc->status = 4;
                                $zxc->id_metode = $vaz->id_metode;
                                $zxc->id_lab = $vaz->id_lab;
                                $zxc->idfor = $paketpkm['id_for'];
                                $zxc->id_unit = $vaz->id_unit;
                                $zxc->id_lod = is_null($vaz->id_lod) ? 0 : $vaz->id_lod;
                                $zxc->position = $sz + 1;
                                $zxc->info_id = $vaz->id_mstr_sub_specific_package;
                                $zxc->save();
                            }
                        }
                    }
                }
            }
            if (count($data['dataakg']) > 0) {
                foreach ($data['dataakg'] as $biayakg) {
                    $cke = \DB::table('mstr_transaction_akg as a')->where('id', $biayakg['id'])->first();
                    $akg = new AkgTransaction;
                    $akg->id_transaction_kontrakuji = $kontrak->id_kontrakuji;
                    $akg->id_mstr_transaction_akg = $cke ? $biayakg['id'] : 1;
                    $akg->jumlah = $biayakg['jumlah'];
                    $akg->total = $biayakg['total'];
                    $akg->save();
                }
            }

            if (count($data['datasampling']) > 0) {
                foreach ($data['datasampling'] as $biayasampling) {

                    if (!empty($biayasampling['id_sampling'])) {
                        $cke = \DB::table('mstr_transaction_sampling as a')->where('id', $biayasampling['id_sampling'])->first();
                        if ($cke) {
                            $acx = new SamplingTransaction;
                            $acx->id_transaction_contract = $kontrak->id_kontrakuji;
                            $acx->id_mstr_transaction_sampling = $biayasampling['id_sampling'];
                            $acx->jumlah = $biayasampling['jumlah'];
                            $acx->total = $biayasampling['total'];
                            $acx->metode = !empty($biayasampling['metode']) ? $biayasampling['metode'] : null;
                            $acx->location = !empty($biayasampling['lokasi']) ? $biayasampling['lokasi'] : null;
                            $acx->pic = !empty($biayasampling['employee']) ? $biayasampling['employee'] : null;
                            $acx->kondisi_lingkungan = !empty($biayasampling['kondisi']) ? $biayasampling['kondisi'] : null;
                            $acx->save();
                        } else {
                            $xc = str_toupper(str_replace(' ', '', $biayasampling['sampling_name']));
                            $ckz = \DB::table('mstr_transaction_sampling as a')->where(\DB::raw('UPPER(REPLACE(a.sampling_name," ",""))'), $xc)->first();
                            $acxc = new SamplingTransaction;
                            $acx->id_transaction_contract = $kontrak->id_kontrakuji;
                            $acx->id_mstr_transaction_sampling = $ckz->id;
                            $acx->jumlah = $biayasampling['jumlah'];
                            $acx->total = $biayasampling['total'];
                            $acx->metode = !empty($biayasampling['metode']) ? $biayasampling['metode'] : null;
                            $acx->location = !empty($biayasampling['lokasi']) ? $biayasampling['lokasi'] : null;
                            $acx->pic = !empty($biayasampling['employee']) ? $biayasampling['employee'] : null;
                            $acx->kondisi_lingkungan = !empty($biayasampling['kondisi']) ? $biayasampling['kondisi'] : null;
                            $acx->save();
                        }
                    } else {
                        $xc = strtoupper(str_replace(' ', '', $biayasampling['sampling_name']));
                        $cke = \DB::table('mstr_transaction_sampling as a')->where(\DB::raw('UPPER(REPLACE(a.sampling_name," ",""))'), $xc)->first();
                        if ($cke) {
                            $acx = new SamplingTransaction;
                            $acx->id_transaction_contract = $kontrak->id_kontrakuji;
                            $acx->id_mstr_transaction_sampling = $cke->id;
                            $acx->jumlah = $biayasampling['jumlah'];
                            $acx->total = $biayasampling['total'];
                            $acx->metode = !empty($biayasampling['metode']) ? $biayasampling['metode'] : null;
                            $acx->location = !empty($biayasampling['lokasi']) ? $biayasampling['lokasi'] : null;
                            $acx->pic = !empty($biayasampling['employee']) ? $biayasampling['employee'] : null;
                            $acx->kondisi_lingkungan = !empty($biayasampling['kondisi']) ? $biayasampling['kondisi'] : null;
                            $acx->save();
                        } else {
                            $xc = strtoupper(str_replace(' ', '', $biayasampling['sampling_name']));
                            $ckz = \DB::table('mstr_transaction_sampling as a')->where(\DB::raw('UPPER(REPLACE(a.sampling_name," ",""))'), $xc)->first();
                            $acxc = new SamplingTransaction;
                            $acx->id_transaction_contract = $kontrak->id_kontrakuji;
                            $acx->id_mstr_transaction_sampling = $ckz->id;
                            $acx->jumlah = $biayasampling['jumlah'];
                            $acx->total = $biayasampling['total'];
                            $acx->metode = !empty($biayasampling['metode']) ? $biayasampling['metode'] : null;
                            $acx->location = !empty($biayasampling['lokasi']) ? $biayasampling['lokasi'] : null;
                            $acx->pic = !empty($biayasampling['employee']) ? $biayasampling['employee'] : null;
                            $acx->kondisi_lingkungan = !empty($biayasampling['kondisi']) ? $biayasampling['kondisi'] : null;
                            $acx->save();
                        }
                    }
                }
            }


            $payment = new PaymentCondition;
            $payment->id_contract = $kontrak->id_kontrakuji;
            $payment->biaya_pengujian = $data['totalpembayaran'];
            $payment->discount_lepas = $data['hasilDiscount'];
            $payment->ppn = $data['ppn'];
            $payment->downpayment = $data['uangmuka'];
            $payment->id_voucher = !empty($data['id_voucher']) ? $data['id_voucher'] : null;
            $payment->save();



            $conditioncontract = new ConditionContractNew;
            $conditioncontract->contract_id = $kontrak->id_kontrakuji;
            $conditioncontract->sample_id = 0;
            $conditioncontract->parameter_id = 0;
            $conditioncontract->user_id = $id_user;
            $conditioncontract->status = 0;
            $conditioncontract->groups = 'CS';
            $conditioncontract->position = 1;
            $conditioncontract->inserted_at = time::now();
            $conditioncontract->save();
            $ga = TransactionSample::where('id_contract', $kontrak->id_kontrakuji)->get();

            $checkMessageContract = ContractMessage::where('id_contract', $kontrak->id_kontrakuji)->get();

            $setmessage = count($checkMessageContract) > 0 ? ContractMessage::find($checkMessageContract[0]['id']) : new ContractMessage;
            $setmessage->id_contract = $kontrak->id_kontrakuji;
            $setmessage->user_id = $id_user;
            $setmessage->status = 0;
            $setmessage->inserted_at = time::now();
            $setmessage->save();

            $message = array(
                'success' => true,
                'message' => 'Saving Success',
                'contract-no' => $kontrak,
                'sample' => $ga
            );
            return response()->json($message);
        } catch (\Exception $e) {
            // $this->store($request);
            return response()->json($e->getMessage());
        }
    }

    public function checkprice(Request $request)
    {
        try {
            $var = \DB::table('parameter_price as a')
                ->where('parameteruji_id', $request->input('parameteruji_id'))
                ->where('status', 1)->get();

            return response()->json($var);
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function deleteAttachment(Request $request)
    {

        // $de = Photo::find($o->id)->forceDelete();
        $var = ContractAttachment::find($request->input('id_contract_attachment'));

        $kontrak = Kontrakuji::find($var->id_contract);

        $destinationPath = public_path('' . $kontrak->contract_no . '/attachment');
        $checkfile = File::delete($destinationPath . '/' . $var->filename);


        $var->delete();

        return response()->json(array(
            "success" => true,
            "message" => "delete success"
        ));
    }

    public function sendAttachmentBlob(Request $request)
    {
        // try {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');
        $tanggal_terima = time::now();

        $attachmentContract = ContractAttachment::where('id_contract', $data['id_contract'])->get();

        $foldername = $data['contract_no'] . '/attachment';
        if (!File::exists($foldername)) {
            File::makeDirectory($foldername, 0777, true);
        }

        $zl = Image::make($data['photo']);
        $zl->resize(null, 1240, function ($constraint) {
            $constraint->aspectRatio();
        });
        $filename = 'attachment_' . (count($attachmentContract) + 1) . '-' . $data['contract_no'] . '.jpeg';

        $setAttachment = new ContractAttachment;
        $setAttachment->id_contract = $data['id_contract'];
        $setAttachment->filename = $filename;
        $setAttachment->type = 'image';
        $setAttachment->ext = 'jpeg';
        $setAttachment->insert_user = $id_user;
        $setAttachment->save();


        $zl->save(public_path($foldername . '/' . $filename));

        return response()->json(array(
            "success" => true,
            "data" => $setAttachment
        ));


        // } catch (\Exception $e){
        //     return response()->json($e->getMessage());
        // }
    }

    public function view_attachment(Request $request, $id)
    {
        $p = \DB::table('transaction_sample as a')
            ->leftJoin('mstr_transaction_kontrakuji as b', 'b.id_kontrakuji', 'a.id_contract')
            ->leftJoin('contract_attachment as c', 'c.id_contract', 'b.id_kontrakuji')
            ->where('c.id_contract', $id)->groupBy('c.id_contract_attachment')->get();

        return response()->json($p);
    }

    public function sendAttachment(Request $request, $id)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;

        // return $request->file('file');

        $response = null;

        $getContract = Kontrakuji::find($id);
        $attachmentContract = ContractAttachment::where('id_contract', $id)->get();

        $data = (object) ['file' => ""];

        if ($request->hasFile('file')) {
            $original_filename = $request->file('file')->getClientOriginalName();
            $original_filename_arr = explode('.', $original_filename);
            $file_ext = end($original_filename_arr);
            $destination_path = './' . $getContract->contract_no . '/attachment/';
            $filename = 'attachment_' . (count($attachmentContract) + 1) . '-' . $getContract->contract_no . '.' . $file_ext;

            if ($request->file('file')->move($destination_path, $filename)) {
                $data->file = '/' . $getContract->contract_no . '/attachment/' . $filename;

                $setAttachment = new ContractAttachment;
                $setAttachment->id_contract = $id;
                $setAttachment->filename = $filename;
                $setAttachment->type = 'file';
                $setAttachment->ext = $request->file('file')->getClientOriginalExtension();
                $setAttachment->insert_user = $id_user;
                $setAttachment->save();

                return $this->responseRequestSuccess($data);
            } else {
                return $this->responseRequestError('Cannot upload file');
            }
        } else {
            return $this->responseRequestError('File not found');
        }
    }

    protected function responseRequestSuccess($ret)
    {
        return response()->json(['status' => 'success', 'data' => $ret], 200)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    }

    protected function responseRequestError($message = 'Bad request', $statusCode = 200)
    {
        return response()->json(['status' => 'error', 'error' => $message], $statusCode)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    }

    public function downloadAttachment(Request $request)
    {

        $attach = ContractAttachment::with(['kontrakuji'])->find($request->input('id_attachment'));

        $file = public_path($attach->kontrakuji->contract_no . "/" . $attach->filename);
        $headers = array(
            'Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );

        return Response::download(public_path($attach->kontrakuji->contract_no . "/" . $attach->filename), $headers);
    }

    public function getMessageContract(Request $request)
    {
        try {

            $var = \DB::table('contract_message as a')
                ->select(
                    'c.employee_name',
                    'b.contract_no',
                    'a.id_contract',
                    \DB::raw('IF(a.status = 0,"NEW", IF(a.status = 1, "REVISI", IF(a.status = 2,"EDIT",IF(a.status = 3,"DELETE","APPROVE")))) as status'),
                    \DB::raw('IFNULL(a.message,"-") as message'),
                    \DB::raw('DATE_FORMAT(a.inserted_at,"%d/%m/%Y - %H:%i:%s") as inserted_at')
                )
                ->leftJoin('mstr_transaction_kontrakuji as b', 'b.id_kontrakuji', 'a.id_contract')
                ->leftJoin('hris_employee as c', 'c.user_id', 'a.user_id')
                ->whereNotNull('b.id_kontrakuji')
                ->orderBy('a.inserted_at', 'desc')
                ->groupBy('a.id_contract')
                ->limit(5)->get();

            return response()->json($var);
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function checkinvoice(Request $request)
    {
        try {

            $var = \DB::table('invoice_detail as a')
                ->leftJoin('invoice_header as b', 'b.id', 'a.id_inv_header')
                ->leftJoin('transaction_sample as c', 'c.id', 'a.id_sample')
                ->where('c.id_contract', $request->input('idcontract'))->get();

            return response()->json($var);
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function mouchecktest(Request $request)
    {
        try {

            $var = Mou::with(['customer', 'employee', 'detail'])
                ->whereDate('end_date', '>=', $date)
                ->whereDate('start_date', '<=', $date)
                ->where('status', 1)
                ->where('id_customer', $request->input('idcust'))->get();

            return response()->json($var);
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function back_track_proksimat(Request $request)
    {
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            return $id_user = $users->sub;

            $var = \DB::select('
                SELECT a.id_transaction_parameter FROM condition_lab_come a
                LEFT JOIN condition_lab_done b ON b.id_transaction_parameter = a.id_transaction_parameter
                LEFT JOIN condition_lab_proccess c ON c.id_transaction_parameter = a.id_transaction_parameter
                LEFT JOIN transaction_parameter d ON d.id = a.id_transaction_parameter
                WHERE d.id_lab = 12
                AND c.id IS NULL AND b.id IS NULL
                GROUP BY d.id
            ');


            foreach ($var as $k) {


                $v = ConditionLabProccess::where('id_transaction_parameter', $k->id_transaction_parameter)->first();
                $u = $v ? ConditionLabProccess::find($v['id']) : new ConditionLabProccess;
                $u->id_transaction_parameter = $k->id_transaction_parameter;
                $u->inserted_at = time::now();
                $u->user_id = $id_user;
                $u->save();
            }

            return count($var);
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function excelForSales(Request $request)
    {
        try {
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');
            // return $data;
            $u = \DB::table('hris_employee as a')->where('a.user_id', $id_user)->first();
            
            $var = \DB::table('condition_contracts as a')
            ->leftJoin(\DB::raw('(SELECT SUM(b.total) AS total,b.id_transaction_contract FROM transaction_sampling_contract b GROUP BY b.id_transaction_contract) AS sampling'),'sampling.id_transaction_contract','a.contract_id')
            ->leftJoin(\DB::raw('(SELECT SUM(b.total) AS total,b.id_transaction_kontrakuji FROM transaction_akg_contract b GROUP BY b.id_transaction_kontrakuji) AS akg'),'akg.id_transaction_kontrakuji','a.contract_id')
            ->leftJoin(\DB::raw('(SELECT SUM(m.price) AS total, m.id_contract, m.tgl_input, m.tgl_selesai FROM transaction_sample m GROUP BY m.id_contract) AS sampleprice'),'sampleprice.id_contract','a.contract_id')
            ->join('mstr_transaction_kontrakuji as c','c.id_kontrakuji','a.contract_id')
            ->join('payment_contract as d','d.id_contract','a.contract_id')
            ->join('mstr_products_contactcategory as e','e.id','c.id_contract_category')
            ->leftJoin('mstr_customers_handle as f','f.idch','c.id_customers_handle')
            ->leftJoin('mstr_customers_customer as g','g.id_customer','f.id_customer')
            ->leftJoin('mstr_customers_contactperson as h','h.id_cp','f.id_cp')
            ->leftJoin('hris_employee as i','i.user_id','a.user_id')
            ->leftJoin('hris_employee as j','j.employee_id','c.status')
            ->where('a.position',1)
            ->where('a.sample_id',0)

            // if($u->id_bagian == 13) {
            //     $var = $var->where('c.contract_type',4);
            // } else {
            //     $var = $var->where('c.contract_type','<>',4);
            // }
            // if(empty($data)){
            // $var = $var->whereBetween(\DB::raw('DATE_FORMAT(a.inserted_at,"%Y-%m-%d")'),[$request->input('from'), $request->input('to')]);
            // }
            // $var = $var->groupBy('a.contract_id')
            ->orderBy('a.inserted_at')
            ->selectRaw('
                 g.customer_name,
                 h.name AS cp,
                 i.employee_name as created_by,
                 IFNULL(j.employee_name,"-") as sales,
                 c.contract_no,
                 DATE_FORMAT(sampleprice.tgl_input,"%Y-%m-%d") as tgl_input,
                 DATE_FORMAT(sampleprice.tgl_selesai,"%Y-%m-%d") as tgl_selesai,
                 c.`desc`,
                 c.no_po,
                 c.no_penawaran,
                 CAST(IFNULL(sampleprice.total + IFNULL(sampling.total,0) + IFNULL(akg.total,0),0) AS UNSIGNED) AS totalpembayaransample,
                 d.discount_lepas,
                 CAST(IFNULL((sampleprice.total - d.discount_lepas) + IFNULL(sampling.total,0) + IFNULL(akg.total,0),0) AS UNSIGNED) AS subtotal,
                 a.`status`
             ');

            // if(!empty($data)){
            //     if(!empty($data['customers'])){
            //         $var = $var->where('g.id_customer',$data['customers']);
            //     }
            //     if(!empty($data['no_penawaran'])){
            //         $var = $var->where('c.no_penawaran','like','%'.$data['no_penawaran'].'%');
            //     }
            //     if(!empty($data['no_po'])){
            //         $var = $var->where('c.no_po','like','%'.$data['no_po'].'%');
            //     }

            //     if(!empty($data['statuskontrak'])){
            //         if ($data['statuskontrak'] == 1) {
            //             $var = $var->where('a.status', 0);
            //         } else if ($data['statuskontrak'] == 2) {
            //             $dz = \DB::connection('mysqlcertificate')
            //                 ->table('condition_sample_cert as az')
            //                 ->select('az.id_contract')
            //                 ->whereIn('az.status', [4, 3])
            //                 ->orderBy('az.status', 'desc')
            //                 ->groupBy('az.id_contract')
            //                 ->get()->toArray();

            //             $z = array_map(function ($da) {
            //                 return $da->id_contract;
            //             }, $dz);

            //             $var = $var->whereNotIn('c.id_kontrakuji', $z)
            //                 ->where('a.status', 1);
            //         } else if ($data['statuskontrak'] == 3) {
            //             $dzz = \DB::connection('mysqlcertificate')
            //                 ->table('condition_sample_cert as az')
            //                 ->select('az.id_contract')
            //                 ->whereIn('az.status', [4])
            //                 ->orderBy('az.status', 'desc')
            //                 ->groupBy('az.id_contract')
            //                 ->get()->toArray();

            //             $zsd = array_map(function ($xda) {
            //                 return $xda->id_contract;
            //             }, $dzz);

            //             $var = $var->whereIn('c.id_kontrakuji', $zsd);
            //         } else if ($data['statuskontrak'] == 4) {

            //             $dza = \DB::connection('mysqlcertificate')
            //                 ->table('condition_sample_cert as az')
            //                 ->select('az.id_contract')
            //                 ->where('az.status', 3)
            //                 ->whereNotIn('az.id_contract', [\DB::raw('SELECT id_contract FROM condition_sample_cert where status = 4')])
            //                 ->orderBy('az.status', 'desc')
            //                 ->groupBy('az.id_contract')
            //                 ->get()->toArray();

            //             $za = array_map(function ($dab) {
            //                 return $dab->id_contract;
            //             }, $dza);

            //             $var = $var->whereIn('c.id_kontrakuji', $za);
            //         }
            //     }

            //     if (!empty($data['tgl_selesai'])) {
            //         $t = \DB::table('transaction_sample as a')
            //         ->selectRaw('a.id_contract')
            //         ->where(\DB::raw('DATE_FORMAT(a.tgl_selesai,"%Y-%m-%d")'), $data['tgl_selesai'])
            //         ->get()
            //         ->toArray();
    
            //         $xc = array_map(function ($q) {
            //             return $q->id_contract;
            //         }, $t);
    
            //         $var = $var->whereIn('c.id_kontrakuji', $xc);
            //     }
            // }
            $var =$var->get();

            return response()->json($var);
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function moucheck(Request $request)
    {
        try {

            $message = [];

            $date = time::now()->format('Y-m-d');

            $var = Mou::with(['customer', 'employee', 'detail'])
                ->whereDate('end_date', '>=', $date)
                ->whereDate('start_date', '<=', $date)
                ->where('status', 1)
                ->where('id_customer', $request->input('idcust'))->get();

            if (count($var) < 1) {
                $b = Mou::where('id_customer', $request->input('idcust'))->get();
                if (count($b) > 0) {
                    $message = array(
                        "status" => true,
                        "message" => "Data Mou Expired / Not active",
                        "data" => 'Please Contact Mou PIC'
                    );
                } else {
                    $message = array(
                        "status" => false,
                        "message" => "Data Mou Not Found"
                    );
                }
            } else {
                $message = array(
                    "status" => true,
                    "message" => "Data Mou Found",
                    "data" => $var
                );
            }

            return response()->json($message);
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function photoView(Request $request)
    {
        try {

            $var = Photo::where('id_sample', $request->input('id_sample'))->get();
            return response()->json($var);
        } catch (\Exception $e) {

            return response()->json($e->getMessage());
        }
    }
    public function photoDelete(Request $request)
    {
        try {

            $var = Photo::find($request->input('idphoto'))->Delete();
            return response()->json(array(
                "status" => true,
                "message" => "delete sucess"
            ));
        } catch (\Exception $e) {

            return response()->json($e->getMessage());
        }
    }

    public function acceptContract(Request $request)
    {
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;

            $a = ConditionContractNew::where('contract_id', $request->input('id_contract'))->where('groups', 'CS')->get();

            foreach ($a as $s) {
                $xa  = new ConditionContractNew;
                $xa->contract_id = $s->id_contract;
                $xa->sample_id = $s->id_sample;
                $xa->parameter_id = $s->id;
                $xa->status = 1;
                $xa->user_id = $id_user;
                $xa->inserted_at = time::now();
                $xa->groups = 'PREPARATION';
                $xa->save();
            }

            $data = array(
                'data' => false,
                'message' => 'Success Updating Condition !'
            );

            return response()->json($data);
        } catch (\Exception $e) {
            $data = array(
                'data' => false,
                'message' => 'Cant Updating Condition, Sorry !'
            );
            return $e->getMessage();
            return response()->json($data);
        }
    }

    public function getCustomersAddress(Request $request)
    {
        // try {
        // return 'asdasd';
        $var = CustomerAddress::select('*')
            ->where('customer_id', $request->input('customer_id'));
        if ($request->has('search')) {
            $var = $var->where('address', 'like', '%' . $request->input('search') . '%');
        }
        $var = $var->get();
        return response()->json(array(
            "data" => $var
        ));
        // } catch(\Exception $e) {
        //     $data=array(
        //         'success'=>false,
        //         'message'=>'Get Address Error'
        //     );
        //     return response()->json($data);
        // }
    }

    public function getCustomersTaxAddress(Request $request)
    {
        try {
            $var = CustomerTaxAddress::select('*')
                ->where('customer_id', $request->input('customer_id'))
                ->get();
            return response()->json($var);
        } catch (\Exception $e) {
            $data = array(
                'success' => false,
                'message' => 'Get Address Error'
            );
            return response()->json($data);
        }
    }

    public function getDataContactPerson(Request $request)
    {
        try {
            $var = CustomerTaxAddress::select('*')
                ->where('customer_id', $request->input('customer_id'))
                ->get();
            return response()->json($var);
        } catch (\Exception $e) {
            $data = array(
                'success' => false,
                'message' => 'Failed to Show Data'
            );
            return response()->json($data);
        }
    }

    public function addDesc(Request $request)
    {
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            $v = new Description;
            $v->id_contract = $data['id_contract'];
            if (!is_null($data['id_sample'])) {
                $v->id_sample = $data['id_sample'];
            } else {
                $v->id_sample = 0;
            }
            $v->desc = $data['desc'];
            $v->insert_user = $id_user;
            $v->created_at = time::now();
            $v->save();

            $data = array(
                'success' => true,
                'message' => 'Saving Success'
            );
            return response()->json($data);
        } catch (\Exception $e) {

            $data = array(
                'success' => true,
                'message' => 'Saving Fail'
            );
            return response()->json($data);
        }
    }

    public function deleteDesc(Request $request, $id)
    {
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;

            $model = Description::find($id);
            $del = $model->delete();
            if ($del) {

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
        } catch (\Exception $e) {

            $data = array(
                'success' => false,
                'message' => 'Data failed to deleted'
            );

            return response()->json($data);
        }
    }

    public function trackingContract(Request $request)
    {
        try {

            $var = Kontrakuji::with([
                'contract_condition' => function ($q) {
                    return $q->where('groups', 'CS');
                },
                'contract_condition.user',
                'cust_address',
                'cust_tax_address',
                'contract_category',
                'customers_handle',
                'attachment',
                'akgTrans',
                'akgTrans.masterakg',
                'samplingTrans',
                'samplingTrans.samplingmaster',
                'payment_condition',
                'customers_handle.customers',
                'customers_handle.contact_person',
                'user',
                'description',
                'transactionsample',
                'transactionsample.statuspengujian',
                'transactionsample.transactionparameter',
                'transactionsample.transactionparameter.lab',
                'transactionsample.transactionparameter.metode',
                'transactionsample.transactionparameter.lod',
                'transactionsample.transactionparameter.unit',
                'transactionsample.transactionparameter.standart',
                'transactionsample.transactionparameter.parameteruji',
                'transactionsample.transactionparameter.parameteruji.parametertype',
                'transactionsample.images',
                'transactionsample.statuspengujian',
                'transactionsample.tujuanpengujian',
                'transactionsample.subcatalogue'
            ])->where(\DB::raw('UPPER(contract_no)'), strtoupper(base64_decode($request->input('l'))))->first();

            return response()->json($var);
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    private function integerToRoman($integer)
    {
        // Convert the integer into an integer (just to make sure)
        $integer = intval($integer);
        $result = '';

        // Create a lookup array that contains all of the Roman numerals.
        $lookup = array(
            'M' => 1000,
            'CM' => 900,
            'D' => 500,
            'CD' => 400,
            'C' => 100,
            'XC' => 90,
            'L' => 50,
            'XL' => 40,
            'X' => 10,
            'IX' => 9,
            'V' => 5,
            'IV' => 4,
            'I' => 1
        );

        foreach ($lookup as $roman => $value) {
            // Determine the number of matches
            $matches = intval($integer / $value);

            // Add the same number of characters to the string
            $result .= str_repeat($roman, $matches);

            // Set the integer to be the remainder of the integer and the value
            $integer = $integer % $value;
        }

        // The Roman numeral should be built, return it
        return $result;
    }

    public function excelparameter(Request $request, $id)
    {
        try {
            $var = \DB::table('transaction_parameter as a')
                ->selectRaw('
                i.created_at,
                i.contract_no,
                h.tgl_selesai,
                h.no_sample,
                l.sub_catalogue_name as matriks,
                h.sample_name,
                m.name as status_pengujian,
                n.customer_name,
                b.name_id,
                o.employee_name
            ')
                ->leftJoin('mstr_laboratories_parameteruji as b', 'b.id', 'a.id_parameteruji')
                ->leftJoin('mstr_laboratories_lab as c', 'c.id', 'a.id_lab')
                ->leftJoin('mstr_laboratories_lod as d', 'd.id', 'a.id_lod')
                ->leftJoin('mstr_laboratories_metode as e', 'e.id', 'a.id_metode')
                ->leftJoin('mstr_laboratories_standart as f', 'f.id', 'a.id_standart')
                ->leftJoin('mstr_laboratories_unit as g', 'g.id', 'a.id_unit')
                ->leftJoin('transaction_sample as h', 'h.id', 'a.id_sample')
                ->leftJoin('mstr_transaction_kontrakuji as i', 'i.id_kontrakuji', 'h.id_contract')
                ->leftJoin('mstr_products_contactcategory as j', 'j.id', 'i.id_contract_category')
                ->leftJoin('mstr_customers_handle as k', 'k.idch', 'i.id_customers_handle')
                ->leftJoin('mstr_customers_customer as n', 'n.id_customer', 'k.id_customer')
                ->leftJoin('mstr_transaction_sub_catalogue as l', 'l.id_sub_catalogue', 'h.id_subcatalogue')
                ->leftJoin('mstr_transaction_statuspengujian as m', 'm.id', 'h.id_statuspengujian')
                ->leftJoin(\DB::raw('(select * from condition_contracts where position = 1 group by contract_id) as dd'), 'dd.contract_id', 'i.id_kontrakuji')
                ->leftJoin('hris_employee as o', 'o.user_id', 'dd.user_id')
                ->where('h.id_contract', $id)->get();
            return response()->json($var);
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    private function leftPad($number, $targetLength)
    {
        $output = strlen((string)$number);
        $selisih = intval($targetLength) - intval($output);
        $nol = '';
        for ($i = 0; $i < $selisih; $i++) {
            $nol .= '0';
        }
        $nol .= strval($number);
        return $nol;
    }
}
