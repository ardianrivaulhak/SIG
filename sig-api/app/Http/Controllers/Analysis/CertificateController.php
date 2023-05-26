<?php
namespace App\Http\Controllers\Analysis;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Master\Group;
use App\Models\Master\Format;
use App\Models\Master\ParameterUji;
use App\Models\Analysis\ConditionContract;
use App\Models\Analysis\TransactionSample;
use App\Models\Analysis\Transaction_parameter;
use App\Models\Analysis\Kontrakuji;
use App\Models\Analysis\Description;
use App\Models\Analysis\ConditionContractNew;
use App\Models\Analysis\ContactPerson;
use App\Models\Analysis\Customer;
use App\Models\Ecert\Ecertlhu;
use App\Models\Ecert\Akgfile;
use App\Models\Ecert\ConditionCert;
use App\Models\Ecert\CustomerCert;
use App\Models\Ecert\ParameterCert;
use App\Models\Ecert\AutoSend;
use App\Models\Analysis\Customerhandle;
use App\Models\Analysis\CustomerAddress;
use App\Models\Ecert\RevConditionCert;
use App\Models\Ecert\RevEcertlhu;
use App\Models\Ecert\RevParameterCert;
use App\Models\Ecert\AttachmentRevFile;
use App\Models\Ecert\ManualData;
use App\Models\Ecert\Complain;
use App\Models\Master\MemberTeam;
use App\Models\Master\TransactionTeam;
use App\Models\Hris\Employee;
use App\Models\Ecert\AkgHeader;
use App\Models\Ecert\AkgDetail;
use App\Models\Ecert\AkgCondition;
use App\Models\Ecert\AkgParameter;
use App\Models\Ecert\AkgMasterParameter;
use DB;
use Auth;
use Firebase\JWT\JWT;
use Carbon\Carbon as time;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Intervention\Image\ImageManagerStatic as Image;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;
use Illuminate\Support\Facades\Response;

use App\Models\Ecert\ClickHistory;

class CertificateController extends Controller
{
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // MANAGER /////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

    public function certificate(Request $request)
    {
        try{
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            if(!empty($data['status'])){
                 $m = DB::connection('mysqlcertificate')
                    ->select('SELECT * FROM (
                        SELECT * FROM (
                            SELECT * FROM (
                                SELECT b.* FROM condition_sample_cert b
                                GROUP BY b.id
                                ORDER BY b.id DESC ) AS zz
                            GROUP BY zz.id_transaction_cert) AS aa
                        WHERE aa.status = '.$data['status'].') cc
                    GROUP BY cc.id_contract
                    ORDER BY cc.id_contract DESC');
            }else{
                $m = DB::connection('mysqlcertificate')
                    ->select('SELECT * FROM (
                        SELECT * FROM (
                            SELECT * FROM (
                                SELECT b.* FROM condition_sample_cert b
                                GROUP BY b.id
                                ORDER BY b.id DESC ) AS zz
                            GROUP BY zz.id_transaction_cert) AS aa
                        WHERE aa.status = 2 OR aa.status = 3) cc
                    GROUP BY cc.id_contract
                    ORDER BY cc.id_contract DESC');
            }

            $result = array_map(function ($m) {
                return $m->id_contract;
            }, $m);


            $model = Kontrakuji::with([
                'contract_category',
                'customers_handle',
                'customers_handle.customers',
                'customers_handle.contact_person',
                'count_samplelab',
                'conditionContractCert',
                'conditionContractCert.team',
            ])->whereIn('id_kontrakuji',$result);


            if(!empty($data['contract'])){
                $model=$model->where(\DB::raw('UPPER(contract_no)'),'like','%'.$data['contract'].'%');
            }

            if(!empty($data['category'])){
                $model = $model->where('id_contract_category',$data['category']);
            }

            if(!empty($data['customer_name'])){
                $customer_name = $data['customer_name'];
                $model = $model->whereHas('customers_handle.customers',function($query) use ($customer_name){
                        $query->where(\DB::raw('UPPER(customer_name)'),'like','%'.$customer_name.'%');
                });
            }

            if(!empty($data['team'])){
                $team = $data['team'];
                $model = $model->whereHas('conditionContractCert.team',function($query) use ($team){
                    $query->where(\DB::raw('UPPER(group_name)'),'like','%'.$team.'%');
                });
            }

            if(!empty($data['desc'])){
                $model = $model->where('desc',$data['desc']);
            }

            if(!empty($data['type'])){
                if($data['type']=='all'){
                    $model=$model->get();
                } else {
                    $model=$model->paginate(50);
                }
            }
            $model->groupBy('id_contract');

            return response()->json($model);
        }
        catch(\Exception $e){
            $data=array(
                'success'=>false,
                'message'=>'Data Not Found'
            );
            return response()->json($data);
        }
    }

    public function certificateDetail(Request $request, $id_kontrakuji)
    {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            $array = array();

            $m = ConditionCert::select('id_transaction_cert')
            ->where('id_contract', $id_kontrakuji)
            ->groupBy('id_transaction_cert')
            ->get();

            foreach ($m as $ksd) {
                $bb = ConditionCert::where('id_transaction_cert', $ksd->id_transaction_cert)->get();
                if($bb[count($bb) - 1]->status == 2 || $bb[count($bb) - 1]->status == 3){
                    array_push($array,$bb[count($bb) - 1]->id_transaction_cert);
                }
            }

            $model = Ecertlhu::with([
                'condition_many'
                ,'condition_many' => function($q) {
                    return $q->orderby('id', 'desc');
                }
                ,'status_pengujian',
                'ConditionCertinSample',
                'TransactionSample',
                'TransactionSample.condition_contract_lab',
                'autosend'
            ])
            ->whereIn('id', $array)
            ->orderby('urutan', 'asc');


            $model=$model->paginate(50);

            return $model;

    }

    public function certificateContractDetail($id_kontrakuji)
    {
        $model= kontrakuji::with([
        'customers_handle',
        'customers_handle.customers',
        'customers_handle.contact_person',
        'cust_address',
        'akgTrans'
        ])
        ->where('id_kontrakuji', $id_kontrakuji)->first();

        return $model;
    }

    public function draft(Request $request)
    {
       try{
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');
            $idcontract = $request->input('idcontract');

            $array = array();

            $contract = DB::table('mstr_transaction_kontrakuji as a')
            ->leftjoin('mstr_customers_handle as b', 'b.idch', '=', 'a.id_customers_handle')
            ->leftjoin('mstr_customers_customer as c', 'c.id_customer', '=', 'b.id_customer')
            ->leftjoin('mstr_customers_contactperson as d', 'd.id_cp', '=', 'b.id_cp')
            ->where('id_kontrakuji', $idcontract)
            ->select(
                'a.id_kontrakuji',
                'a.contract_no',
                'a.id_customers_handle',
                'b.idch',
                'b.email',
                'c.id_customer',
                'c.customer_name',
                'd.id_cp',
                'd.name',
                'a.hold')
            ->first();

            foreach ($data as $d) {
                array_push($array, $d['id']);
            }

            $cert = Ecertlhu::whereIn('id', $array)->get();
            $senddata = array(
                'contract' => $contract,
                'cert' =>  $cert
            );

            Mail::send('certificate/draft', $senddata, function($message) use($contract) {
               $message->to(preg_replace('/\s+/', '', $contract->email), $contract->name)->subject('Status Certificate , '. $contract->contract_no . ' Confirm Draft');
               $message->bcc('admin.sig@saraswanti.com', 'Admin Sertifikat');
               $message->bcc('bachtiar.sig@saraswanti.com', 'Bachtiar Oktavian');
               $message->from('certificate@sigconnect.co.id','SIG Connect');
            });

            foreach($data as $d){
                $model = ConditionCert::where('id_transaction_cert', $d['id'])->orderBy('inserted_at', 'desc')->first();
                if($model->status !== 4){
                    $add = New ConditionCert;
                    $add->id_transaction_cert = $model['id_transaction_cert'];
                    $add->id_contract = $model['id_contract'];
                    $add->status = 3;
                    $add->user_id = $id_user;
                    $add->cert_status = 1;
                    $add->id_team = $model['id_team'];
                    $add->inserted_at = time::now();
                   $add->save();
                }
            }


            $data=array(
                'success'=>true,
                'message'=>'Draft Success'
            );

            return response()->json($data);

        } catch(\Exception $e){
            $data=array(
                'success'=>false,
                'message'=>'Update Error'
            );
            return response()->json($data);
        }

    }

    public function release(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;


        // try {
            $data = $request->input('data');
            $array = array();

            $kont = ConditionCert::where('id_transaction_cert', $data[0]['id'])->orderBy('inserted_at', 'desc')->first();

            $contract = DB::table('mstr_transaction_kontrakuji as a')
            ->leftjoin('mstr_customers_handle as b', 'b.idch', '=', 'a.id_customers_handle')
            ->leftjoin('mstr_customers_customer as c', 'c.id_customer', '=', 'b.id_customer')
            ->leftjoin('mstr_customers_contactperson as d', 'd.id_cp', '=', 'b.id_cp')
            ->where('a.id_kontrakuji', $data[0]['id_contract'])
            ->select(
                'a.id_kontrakuji',
                'a.contract_no',
                'a.id_customers_handle',
                'b.idch',
                'b.email',
                'c.id_customer',
                'c.customer_name',
                'd.id_cp',
                'd.name',
                'a.hold')
            ->first();

            foreach ($data as $d) {
                array_push($array, $d['id']);
            }

            $cert = Ecertlhu::whereIn('id', $array)->get();
       
            $senddata = array(
                'contract' => $contract,
                'cert' =>  $cert,
                'enkripsi' => $data,
            );

            try{
                    Mail::send('certificate/release', $senddata, function($message) use($contract) {
                    $message->to(preg_replace('/\s+/', '', $contract->email), $contract->name)->subject('Status Certificate, '. $contract->contract_no . ' Release');
                    $message->bcc('admin.sig@saraswanti.com', 'Admin Sertifikat');
                    $message->bcc('bachtiar.sig@saraswanti.com', 'Bachtiar Oktavian');
                    $message->from('certificate@sigconnect.co.id','SIG Connect');
                    });

                    foreach($data as $d){
                        $model = ConditionCert::where('id_transaction_cert', $d['id'])->orderBy('inserted_at', 'desc')->first();
                        $counts = AutoSend::where('id_certificate', $model->id_transaction_cert)->where('status', 0)->count();

                        if($model->status !== 4){
                            $add = New ConditionCert;
                            $add->id_transaction_cert = $model['id_transaction_cert'];
                            $add->id_contract = $model['id_contract'];
                            $add->status = 4;
                            $add->user_id = $id_user;
                            $add->cert_status = 1;
                            $add->id_team = $model['id_team'];
                            $add->inserted_at = time::now();
                            $add->save();

                            if($counts > 0){
                                $auto = AutoSend::where('id_certificate', $model->id_transaction_cert)->first();
                                $auto->status = 2;
                                $auto->save();
                            }
                        }
                    }


                    $data=array(
                        'success'=>true,
                        'message'=>'Certificate Success to Create'
                    );

                    return response()->json($data);

            }catch(\Exception $e){
               
                $data=array(
                    'success'=>false,
                    'message'=>'Mohon cek kembali email yang tercantum'
                );

                return response()->json($data);
            }

            

        // } catch(\Exception $e){
        //     $data=array(
        //         'success'=>false,
        //         'message'=>'Update Error'
        //     );
        //     return response()->json($data);
        // }
    }


    public function resendEmail(Request $request)
    {
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');


            $kont = ConditionCert::where('id_transaction_cert', $data[0]['id'])->orderBy('inserted_at', 'desc')->first();

            $array = array();

            $contract = DB::table('mstr_transaction_kontrakuji as a')
            ->join('mstr_customers_handle as b', 'b.idch', '=', 'a.id_customers_handle')
            ->join('mstr_customers_customer as c', 'c.id_customer', '=', 'b.id_customer')
            ->join('mstr_customers_contactperson as d', 'd.id_cp', '=', 'b.id_cp')
            ->where('id_kontrakuji',  $kont->id_contract)
            ->select(
                'a.id_kontrakuji',
                'a.contract_no',
                'a.id_customers_handle',
                'b.idch',
                'b.email',
                'c.id_customer',
                'c.customer_name',
                'd.id_cp',
                'd.name',
                'a.hold')
            ->first();

            foreach ($data as $d) {
                array_push($array, $d['id']);
            }

            $cert = Ecertlhu::whereIn('id', $array)->get();
            $senddata = array(
                'contract' => $contract,
                'cert' =>  $cert
            );

            Mail::send('certificate/release', $senddata, function($message) use($contract) {
                $message->to(preg_replace('/\s+/', '', $contract->email), $contract->name)->subject('Status Certificate, '. $contract->contract_no . ' Release');
                $message->cc('admin.sig@saraswanti.com', 'Admin Sertifikat');
                $message->bcc('bachtiar.sig@saraswanti.com', 'Bachtiar Oktavian');
                $message->from('certificate@sigconnect.co.id','SIG Connect');
            });


            $data=array(
                'success'=>true,
                'message'=>'Certificate Success to Resend'
            );

            return response()->json($data);
    }

    public function releaseWithOutEmail(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;

        try {
            $data = $request->input('data');

            $array = array();

            $kont = ConditionCert::where('id_transaction_cert', $data[0]['id'])->orderBy('inserted_at', 'desc')->first();

            $contract = DB::table('mstr_transaction_kontrakuji as a')
            ->leftjoin('mstr_customers_handle as b', 'b.idch', '=', 'a.id_customers_handle')
            ->leftjoin('mstr_customers_customer as c', 'c.id_customer', '=', 'b.id_customer')
            ->leftjoin('mstr_customers_contactperson as d', 'd.id_cp', '=', 'b.id_cp')
            ->where('a.id_kontrakuji', $data[0]['id_contract'])
            ->select(
                'a.id_kontrakuji',
                'a.contract_no',
                'a.id_customers_handle',
                'b.idch',
                'b.email',
                'c.id_customer',
                'c.customer_name',
                'd.id_cp',
                'd.name',
                'a.hold')
            ->first();

            foreach ($data as $d) {
                array_push($array, $d['id']);
            }

            $cert = Ecertlhu::whereIn('id', $array)->get();
            $senddata = array(
                'contract' => $contract,
                'cert' =>  $cert
            );

            foreach($data as $d){
                $model = ConditionCert::where('id_transaction_cert', $d['id'])->orderBy('inserted_at', 'desc')->first();
                if($model->status !== 4){
                    $add = New ConditionCert;
                    $add->id_transaction_cert = $model['id_transaction_cert'];
                    $add->id_contract = $model['id_contract'];
                    $add->status = 4;
                    $add->user_id = $id_user;
                    $add->cert_status = 1;
                    $add->id_team = $model['id_team'];
                    $add->inserted_at = time::now();
                   $add->save();
                }
            }


            $data=array(
                'success'=>true,
                'message'=>'Certificate Success to Create'
            );

            return response()->json($data);

        } catch(\Exception $e){
            $data=array(
                'success'=>false,
                'message'=>'Update Error'
            );
            return response()->json($data);
        }
    }

    public function releaseWithOutEmailinCertificate(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;

        try {
            $data = $request->input('data');

            foreach($data as $d){
                $model = ConditionCert::where('id_transaction_cert', $d['id'])->orderBy('inserted_at', 'desc')->first();
                if($model->cert_status == 3 || $model->cert_status == 2){
                    if($model->status !== 4){
                        $add = New ConditionCert;
                        $add->id_transaction_cert = $model['id_transaction_cert'];
                        $add->id_contract = $model['id_contract'];
                        $add->status = 4;
                        $add->user_id = $id_user;
                        $add->cert_status = 1;
                        $add->id_team = $model['id_team'];
                        $add->inserted_at = time::now();
                       $add->save();
                    }
                }
            }


            $data=array(
                'success'=>true,
                'message'=>'Certificate Success to Archive'
            );

            return response()->json($data);

        } catch(\Exception $e){
            $data=array(
                'success'=>false,
                'message'=>'Update Error'
            );
            return response()->json($data);
        }
    }

    public function getPrintInfo($id_sample)
    {
        $model = Ecertlhu::where('id', $id_sample)->first();
        return $model;
    }

    public function addPrintInfo(Request $request, $id_sample)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $editdesc = Ecertlhu::where('id', $id_sample)->first();
        $editdesc->print_info = $data['information'];
        $editdesc->save();

        $data=array(
            'success'=>true,
            'message'=>'Update Success'
        );

        return response()->json($data);
    }

    public function emailUpdate(Request $request, $id_kontrakuji)
    {

        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $cont = Kontrakuji::where('id_kontrakuji', $id_kontrakuji)->first();

        $ch = Customerhandle::where('idch', $cont->id_customers_handle)->first();
        $ch->email = $data['email'];
        $ch->save();

        $data=array(
            'success'=>true,
            'message'=>'Update Success'
        );

        return response()->json($data);
    }

    public function getDataKpi(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');
        
        $case = Ecertlhu::with([
            'transaction_sample',
            'transaction_sample.kontrakuji',
            'condition_check_last.team'
        ])->whereMonth('date_at', $data['month'])
        ->whereYear('date_at', $data['year'])
        ->limit(10)->get();

        return response()->json($case);
    }




    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // STAFF /////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////

    public function index(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');
        $employee = Employee::where('user_id', $id_user)->first();

        $member = TransactionTeam::select('id_group')->where('id_employee', $employee->employee_id)->groupBy('id_group')->get()->toArray();
        
        $arrayLhu = array_map(function ($member) {
            return $member['id_group'];
        }, $member);

        $implodeArray = implode(",", $arrayLhu);

        $array = array();

        if(!empty($data['status'])){
            // $m = DB::connection('mysqlcertificate')
            // ->select('SELECT * FROM (
            //     SELECT * FROM (
            //         SELECT * FROM (
            //             SELECT b.* FROM condition_sample_cert b
            //             GROUP BY b.id
            //             ORDER BY b.id DESC ) AS zz
            //         GROUP BY zz.id_transaction_cert) AS aa
            //     WHERE aa.status = '. $data['status'] .') cc
            // GROUP BY cc.id_contract
            // ORDER BY cc.id_contract DESC');
        
        $m = DB::connection('mysqlcertificate')->select('
            SELECT * FROM ( 	
				SELECT * FROM (
                SELECT * FROM (
                    SELECT * FROM (
                        SELECT b.* FROM condition_sample_cert b
                        GROUP BY b.id
                        ORDER BY b.id DESC ) AS zz
                    GROUP BY zz.id_transaction_cert) AS aa
                    WHERE aa.status = '. $data['status'] .') cc
            GROUP BY cc.id_contract
            ORDER BY cc.id_contract DESC ) AS dd
         WHERE dd.id_team IN ('.$implodeArray.')');

        }else{

            // $m = DB::connection('mysqlcertificate')
            // ->select('SELECT * FROM (
            //     SELECT * FROM (
            //         SELECT * FROM (
            //             SELECT b.* FROM condition_sample_cert b
            //             GROUP BY b.id
            //             ORDER BY b.id DESC ) AS zz
            //         GROUP BY zz.id_transaction_cert) AS aa
            //     WHERE aa.status = 1 OR aa.status = 2 OR aa.status = 3) cc
            // GROUP BY cc.id_contract
            // ORDER BY cc.id_contract DESC');

            $m = DB::connection('mysqlcertificate')->select('
            SELECT * FROM ( 	
				SELECT * FROM (
                SELECT * FROM (
                    SELECT * FROM (
                        SELECT b.* FROM condition_sample_cert b
                        GROUP BY b.id
                        ORDER BY b.id DESC ) AS zz
                    GROUP BY zz.id_transaction_cert) AS aa
                WHERE aa.status = 1 OR aa.status = 2 OR aa.status = 3) cc
            GROUP BY cc.id_contract
            ORDER BY cc.id_contract DESC ) AS dd
         WHERE dd.id_team IN ('.$implodeArray.')');
        }

        $result = array_map(function ($m) {
            return $m->id_contract;
        }, $m);

        //return $result;

        // foreach($m as $ksd)
        // {
        //     $member = MemberTeam::where('id_group', $ksd->id_team)->get();
        //     foreach($member as $mem){
        //         if($mem->id_employee == $employee->employee_id){
        //             array_push($array,$ksd->id_contract);
        //         }
        //     }
        // }

        $model = Kontrakuji::with([
            'contract_category',
            'customers_handle',
            'customers_handle.customers',
            'customers_handle.contact_person',
            'count_samplelab' => function($q){
                return $q->selectRaw('id_contract')->groupBy('id');
            },
            'condition_cert' => function($q){
                return $q->groupBy('id_transaction_cert');
            },
        ])->whereIn('id_kontrakuji',$result);


        if(!empty($data['marketing'])){
            $model=$model->where(\DB::raw('UPPER(contract_no)'),'like','%'.$data['marketing'].'%');
        }

        if(!empty($data['category'])){
            $model = $model->where('id_contract_category',$data['category']);
        }

        if(!empty($data['customer_name'])){
            $customer_name = $data['customer_name'];
            $model = $model->whereHas('customers_handle',function($query) use ($customer_name){
                    $query->where('id_customer', $customer_name);
            });
        }

        if(!empty($data['lhu'])){
            $arrayin = array();

            $check = Ecertlhu::with(['ConditionCert'])->where('lhu_number', 'LIKE', '%'.$data['lhu'].'%')->get()->toArray();
            foreach ($check as $c) {
                foreach( $c['condition_cert'] as $d){
                    array_push($arrayin, $d['id_contract']);
                }
            }
            $model = $model->whereIn('id_kontrakuji',$arrayin);
        }

        if(!empty($data['type'])){
            if($data['type']=='all'){
                $model=$model->get();
            } else {
                $model=$model->paginate(25);
            }
        }

        $model->groupBy('id_contract');
        return response()->json($model);
    }

    public function showContract($id_contract)
    {
        try{
            $model=Kontrakuji::with([
                'contract_category',
                'customers_handle',
                'customers_handle.customers',
                'customers_handle.contact_person',
                'user',
                'akgTrans',
                'totalAkg',
                'count_samplelab', 'count_samplelab'=> function($q){
                    return $q->selectRaw('id_statuspengujian, COUNT(id_statuspengujian) as countid')
                    ->groupBy('id_statuspengujian');
                },
                'status_sample_certificate',
                'description_cs',
                'description_kendali'
            ])
            ->where('id_kontrakuji', $id_contract)
            ->first();

            return response()->json($model);
        }
        catch(\Exception $e){
            $data=array(
                'success'=>false,
                'message'=>'Data Not Found'
            );
            return response()->json($data);
        }
    }

    public function showSampleLab(Request $request, $id_contract)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        try {

            $array = array();

            $m = ConditionContractNew::with('conditionCert')
            ->where('parameter_id', '=', 0)
            ->where('sample_id', '<>', 0)
            ->where('groups', "LAB")
            ->where('status', '=', 1)
            ->where('contract_id', '=', $id_contract)
            ->get();

            foreach ($m as $ksd) {
                $bac = ConditionContractNew::where('sample_id', '=', $ksd->sample_id)
                ->first();
                array_push($array, $bac->sample_id);
            }


            $model = TransactionSample::with([
             'kontrakuji',
             'statuspengujian',
             'tujuanpengujian',
             'Ecertlhu',
             'sample_condition_cert',
             'sample_condition_cert.user'
             ])
            ->whereIn('id', $array)
            ->select('id', 'sample_name', 'no_sample', 'id_statuspengujian', 'tgl_estimasi_lab', 'tgl_selesai')
            ->orderBy('id', 'desc');

             if(!empty($data['type'])){
                if($data['type']=='all'){
                    $model=$model->get();
                } else {
                    $model=$model->paginate(300);
                }
            }

             return response()->json($model);
        }
        catch(\Exception $e){
            $data=array(
                'success'=>false,
                'message'=>'Update Error'
            );
            return response()->json($data);
        }

    }

    public function showDetailSampleLab($id_sample)
    {
        try {
            $model = TransactionSample::with([
                'kontrakuji',
                'kontrakuji.customers_handle.customers',
                'kontrakuji.customers_handle.contact_person',
                'kontrakuji.cust_address',
                'kontrakuji.contract_category',
                'statuspengujian',
                'tujuanpengujian'
             ])->where('id', $id_sample)
             ->first();

             return response()->json($model);
        }
        catch(\Exception $e){
           $data=array(
               'success'=>false,
               'message'=>'Update Error'
           );
           return response()->json($data);
        }
    }

    public function showDetailSample($id_sample)
    {
        try {
            $model = Ecertlhu::with([
                'TransactionSample',
                'TransactionSample.kontrakuji',
                'status_pengujian',
                'tujuan_pengujian',
                'subcatalog',
                'manual',
                'parameters',
                'format'
             ])->where('id', $id_sample)
             ->first();

             return response()->json($model);
        }
        catch(\Exception $e){
           $data=array(
               'success'=>false,
               'message'=>'Update Error'
           );
           return response()->json($data);
        }

    }

    public function searchCustomer(Request $request, $id_sample){
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = Customer::where('id_customer', $data)->first();
        return response()->json($model);
    }

    public function showParameterData($id_sample)
    {

        try {
            $model = Transaction_parameter::with([
                'parameteruji',
                'metode',
                'lod',
                'unit',
                'standart'
            ])->where('id_sample', $id_sample)->paginate(25);
            return response()->json($model);
        }
        catch(\Exception $e){
           $data=array(
               'success'=>false,
               'message'=>'Data Error'
           );
           return response()->json($data);
        }
    }



    public function getFormat(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $datas = $request->all();

        $model = Format::paginate(25);
        return response()->json($model);

    }


    public function makeLhu(Request $request)
    {
       try{
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $datas = $request->all();

            $checkcontract = TransactionSample::where('id', $datas[0]['id'])->first();
            $checkEcert = ConditionCert::where('id_contract', $checkcontract->id_contract)->where('status', 1)->count();

            $urutan = $checkEcert;

            foreach($datas as $data)
            {
                foreach ($data as $key)
                {
                  // ceck sample
                  $transactionSampleLab = TransactionSample::with(
                      'kontrakuji',
                      'kontrakuji.cust_address',
                      'kontrakuji.customers_handle',
                      'kontrakuji.customers_handle.customers',
                      'kontrakuji.customers_handle.contact_person'
                      )
                  ->where('id', $key)
                  ->first();

                // check condition
                $checkCondition = ConditionContractNew::where('sample_id', $key)->where('position', 5)->count();
                if($checkCondition < 1){
                    $addCondition = New ConditionContractNew;
                    $addCondition->contract_id = $transactionSampleLab->id_contract;
                    $addCondition->sample_id = $key;
                    $addCondition->parameter_id = null;
                    $addCondition->user_id = $id_user ;
                    $addCondition->status = 0;
                    $addCondition->inserted_at = time::now();
                    $addCondition->groups = 'CERTIFICATE';
                    $addCondition->position = '5';
                    $addCondition->save();
                }

                //add new sample cert
                $addTransactionSampleCert = New Ecertlhu;
                $addTransactionSampleCert->id_transaction_sample = $transactionSampleLab->id;
                $addTransactionSampleCert->customer_name = $transactionSampleLab->kontrakuji->customers_handle->id_customer;
                $addTransactionSampleCert->customer_address = $transactionSampleLab->kontrakuji->id_alamat_customer;
                $addTransactionSampleCert->customer_telp = $transactionSampleLab->kontrakuji->customers_handle->telp;
                $addTransactionSampleCert->contact_person = $transactionSampleLab->kontrakuji->customers_handle->id_cp;
                $addTransactionSampleCert->sample_name = $transactionSampleLab->sample_name;
                $addTransactionSampleCert->no_sample = $transactionSampleLab->no_sample;
                $addTransactionSampleCert->kode_sample = $transactionSampleLab->kode_sample;
                $addTransactionSampleCert->batch_number = $transactionSampleLab->batch_number;
                $addTransactionSampleCert->tgl_mulai = $transactionSampleLab->tgl_input;
                $addTransactionSampleCert->tgl_input = $transactionSampleLab->tgl_input;
                $addTransactionSampleCert->tgl_selesai = $transactionSampleLab->tgl_selesai;
                $addTransactionSampleCert->tgl_estimasi_lab = $transactionSampleLab->tgl_estimasi_lab;
                $addTransactionSampleCert->nama_pabrik = $transactionSampleLab->nama_pabrik;
                $addTransactionSampleCert->alamat_pabrik = $transactionSampleLab->alamat_pabrik;
                $addTransactionSampleCert->no_notifikasi = $transactionSampleLab->no_notifikasi;
                $addTransactionSampleCert->no_pengajuan = $transactionSampleLab->no_pengajuan;
                $addTransactionSampleCert->no_registrasi = $transactionSampleLab->no_registrasi;
                $addTransactionSampleCert->no_principalcode = $transactionSampleLab->no_principalcode;
                $addTransactionSampleCert->nama_dagang = $transactionSampleLab->nama_dagang;
                $addTransactionSampleCert->lot_number = $transactionSampleLab->lot_number;
                $addTransactionSampleCert->jenis_kemasan = $transactionSampleLab->jenis_kemasan;
                $addTransactionSampleCert->tgl_produksi = $transactionSampleLab->tgl_produksi;
                $addTransactionSampleCert->tgl_kadaluarsa = $transactionSampleLab->tgl_kadaluarsa;
                $addTransactionSampleCert->price = $transactionSampleLab->price;
                $addTransactionSampleCert->keterangan_lain = $transactionSampleLab->keterangan_lain;
                $addTransactionSampleCert->id_tujuanpengujian = $transactionSampleLab->id_tujuanpengujian;
                $addTransactionSampleCert->id_statuspengujian = $transactionSampleLab->id_statuspengujian;
                $addTransactionSampleCert->id_subcatalogue = $transactionSampleLab->id_subcatalogue;
                $addTransactionSampleCert->format = 1;
                $addTransactionSampleCert->urutan = $urutan;
                $addTransactionSampleCert->save();

                $ecert = Ecertlhu::latest('id')->first();

                $conditionSample = ConditionCert::where('id_contract', $transactionSampleLab->id_contract)->first();

                $addcondition = new ConditionCert();
                $addcondition->id_transaction_cert =  $ecert->id;
                $addcondition->id_contract =  $transactionSampleLab->id_contract;
                $addcondition->status = 1;
                $addcondition->cert_status = 1;
                $addcondition->user_id = $id_user;
                $addcondition->id_team =  $conditionSample->id_team;
                $addcondition->inserted_at = time::now();
               $addcondition->save();

                $transactionparams = \Db::table('transaction_parameter as a')
                ->leftjoin('mstr_laboratories_parameteruji as b', 'b.id', '=', 'a.id_parameteruji')
                ->leftjoin('mstr_laboratories_lab as c', 'c.id', '=', 'a.id_lab')
                ->leftjoin('mstr_laboratories_standart as d', 'd.id', '=', 'a.id_standart')
                ->leftjoin('mstr_laboratories_lod as e', 'e.id', '=', 'a.id_lod')
                ->leftjoin('mstr_laboratories_unit as f', 'f.id', '=', 'a.id_unit')
                ->leftjoin('mstr_laboratories_metode as g', 'g.id', '=', 'a.id_metode')
                ->leftJoin('mstr_sub_specific_package as h','h.id','a.info_id')
                ->leftJoin('mstr_standard_perka as i','i.id_sub_specific_catalogue','h.id')
                ->where('a.id_sample', $transactionSampleLab->id)
                ->selectRaw(
                        'a.id,
                        a.id_sample,
                        a.id_parameteruji,
                        a.id_lab,
                        a.id_lod,
                        a.id_metode,
                        a.id_unit,
                        a.id_standart,
                        a.hasiluji,
                        a.simplo,
                        a.duplo,
                        a.triplo,
                        a.format_hasil,
                        a.status,
                        a.position,
                        a.info_id,
                        b.name_id,
                        b.name_en,
                        c.nama_lab,
                        d.nama_standart,
                        e.nama_lod,
                        f.nama_unit,
                        g.metode,
                        IF(a.status = 4, i.c, NULL) as value_c,
                        IF(a.status = 4, i.m, NULL) as value_m ,
                        IF(a.status = 4, i.mm, NULL) as value_mm,
                        IF(a.status = 4, a.position, NULL) as value_n'
                            )
                ->get();


                $position = 1;
                foreach($transactionparams as $param){
                    $addparameter = new ParameterCert();
                    $addparameter->id_transaction_sample = $ecert->id;
                    $addparameter->id_parameteruji = $param->id_parameteruji;
                    $addparameter->parameteruji_id = $param->name_id;
                    $addparameter->parameteruji_en = $param->name_en;
                    $addparameter->simplo = $param->simplo;
                    $addparameter->duplo = $param->duplo;
                    $addparameter->triplo = $param->triplo;
                    $addparameter->hasiluji = $param->hasiluji;
                    $addparameter->standart = $param->nama_standart;
                    $addparameter->lod = $param->nama_lod;
                    $addparameter->lab = $param->nama_lab;
                    $addparameter->unit = $param->nama_unit;
                    $addparameter->metode = $param->metode;
                    $addparameter->c = $param->value_c;
                    $addparameter->n = $param->value_n;
                    $addparameter->m = $param->value_m;
                    $addparameter->mm = $param->value_mm;
                    $addparameter->format_hasil = $param->format_hasil;
                    $addparameter->status = $param->status;
                    $addparameter->info_id = $param->info_id;
                    $addparameter->position = $position;
                    $addparameter->save();
                    $position++;
                }

              }
              $urutan++;
            }

            $message=array(
                'success'=>true,
                'message'=>'Saving Success'
            );
            return response()->json($message);

        } catch(\Exception $e){
            $data=array(
                'success'=>false,
                'message'=>'Saving Error'
            );
            return response()->json($data);
         }
    }

    public function getRomawi($month)
    {
        switch ($month){
            case 1:
                return "I";
                break;
            case 2:
                return "II";
                break;
            case 3:
                return "III";
                break;
            case 4:
                return "IV";
                break;
            case 5:
                return "V";
                break;
            case 6:
                return "VI";
                break;
            case 7:
                return "VII";
                break;
            case 8:
                return "VIII";
                break;
            case 9:
                return "IX";
                break;
            case 10:
                return "X";
                break;
            case 11:
                return "XI";
                break;
            case 12:
                return "XII";
                break;
      }
    }

    public function dataLhu(Request $request, $id_contract)
    {

        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $array = array();


            $m = DB::connection('mysqlcertificate')->select('
            SELECT * FROM (
                SELECT * FROM (
                    SELECT * FROM condition_sample_cert cond 
                    WHERE cond.id_contract = '. $id_contract .'
                    GROUP BY cond.id
                    ORDER BY cond.id DESC ) AS a
                GROUP BY a.id_transaction_cert ) AS b
            WHERE b.status = 1 OR b.status = 2 OR b.status = 3
            ');

            $result = array_map(function ($m) {
                return $m->id_transaction_cert;
            }, $m);

            $model = Ecertlhu::with([
                'TransactionSample',
                'TransactionSample.kontrakuji',
                'TransactionSample.condition_contract_lab',
                'ConditionCert',
                'format',
                'customer',
                'contact_person',
                'address',
                'revision',
                'attachment'
            ])->whereIn('id',$result)
            ->orderBy(DB::raw('CAST(SUBSTRING_INDEX(no_sample, ".", -1) AS UNSIGNED)'), 'asc');

            if(!empty($data['lhu'])){
                $model = $model->where(\DB::raw('UPPER(lhu_number)'),'like','%'.$data['lhu'].'%');
            }

            if(!empty($data['nama_sample'])){
                $model = $model->where(\DB::raw('UPPER(sample_name)'),'like','%'.$data['nama_sample'].'%');
            }

            if(!empty($data['no_sample'])){
                $model = $model->where(\DB::raw('UPPER(no_sample)'),'like','%'.$data['no_sample'].'%');
            }
    
            if(!empty($data['status'])){

                $trans = TransactionSample::where('id_contract', $id_contract)
                ->where('id_statuspengujian', $data['status'])->get()->toArray();

                $arr = array_map(function ($trans) {
                    return $trans['id'];
                }, $trans);

                $model = $model->whereIn('id_transaction_sample', $arr);
            }

            if($data['paginated'] == "all")
            {
                return response()->json($model->paginate(1000));
            }else{

                return response()->json($model->paginate(50));
            }
    


        // } catch(\Exception $e){
        //     $data=array(
        //         'success'=>false,
        //         'message'=>'Update Error'
        //     );
        //     return response()->json($data);
        // }
    }

    public function dataLhuwithParameter(Request $request, $id_contract)
    {

        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $array = array();

       try {

            $m = ConditionCert::selectRaw('id_transaction_cert')
            ->where('status',1)
            ->where('id_contract',$id_contract)
            ->groupBy('id_transaction_cert')
            ->get();

            foreach ($m as $ksd) {
                $bb = ConditionCert::where('id_transaction_cert',$ksd->id_transaction_cert)->get();
                foreach($bb as $b){
                    $c =  ConditionCert::where('id_transaction_cert',$ksd->id_transaction_cert)->latest('id')->first();
                    array_push($array,$bb[count($bb) - 1]->id_transaction_cert);
                }
            }

            $model = Ecertlhu::with([
                'TransactionSample',
                'TransactionSample.condition_contract_lab',
                'TransactionSample.kontrakuji',
                'ConditionCert',
                'parameters',
                'customer',
                'contact_person',
                'address',
                'manual'
            ])->whereIn('id',$array)
            ->orderBy('urutan', 'asc');


            return response()->json($model->paginate(50));

        } catch(\Exception $e){
            $data=array(
                'success'=>false,
                'message'=>'Update Error'
            );
            return response()->json($data);
        }
    }

   

    public function detailSample(Request $request , $id_sample)
    {
        $model = Ecertlhu::with(
            'TransactionSample',
            'TransactionSample.kontrakuji',
            'ConditionCert',
            'format',
            'customer',
            'contact_person',
            'address'
        )
        ->where('id', $id_sample)->first();

        return $model;
    }

    public function detailLHU(Request $request , $id_sample)
    {
        $model = Ecertlhu::with(
            'TransactionSample',
            'TransactionSample.kontrakuji',
            'parameters',
            'ConditionCert',
            'format',
            'customer',
            'contact_person',
            'address',
            'employee_sampling',
            'manual'
        )
        ->where('id', $id_sample)->first();

        return $model;
    }



    public function getNumber(Request $request)
    {
       try {
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->all();

            $datenow = date('dHis');
            $coverletter = "SIG.CL.". $this->getRomawi(date('m')).".". date('Y').".".$datenow ;
            $no=1;

            // $models = DB::connection('mysqlcertificate')->table('condition_sample_cert')
            // ->leftjoin('transaction_sample_cert', 'transaction_sample_cert.id', '=', 'condition_sample_cert.id_transaction_cert')
            // ->where('condition_sample_cert.id_contract', $data)
            // ->where('condition_sample_cert.status', '!=', 4)
            // ->orderBy(DB::raw('CAST(SUBSTRING_INDEX(transaction_sample_cert.no_sample, ".", -1) AS UNSIGNED)'), 'desc')
            // ->groupBy('condition_sample_cert.id_transaction_cert')
            // ->toSql();
            $m = DB::connection('mysqlcertificate')->select('
            SELECT * FROM ( 
                SELECT * FROM  ( 
                   SELECT * from condition_sample_cert 
                   WHERE condition_sample_cert.id_contract = '. $data['data'].'
                   GROUP BY condition_sample_cert.id
                   ORDER BY condition_sample_cert.id  DESC ) AS css
                GROUP BY css.id_transaction_cert
                ORDER BY css.id_transaction_cert DESC ) AS dss
          INNER JOIN transaction_sample_cert tsc ON tsc.id = dss.id_transaction_cert
          WHERE dss.status <> 4
          ORDER BY CAST(SUBSTRING_INDEX(tsc.no_sample, ".", -1) AS UNSIGNED) ASC
            ');
            $result = array_map(function ($m) {
                return $m->id_transaction_cert;
            }, $m);

            foreach($result as $model)
            {
                $edit = Ecertlhu::where('id', $model)->first();
                $edit->cl_number = $coverletter;
                $edit->lhu_number = "SIG.LHP.". $this->getRomawi(date('m')).".". date('Y').".".$datenow.$no ;
                $edit->date_at = time::now();
                $edit->save();
                $no++;
            }

            $message=array(
                'success'=>true,
                'message'=>'Saving Success'
            );
            return response()->json($message);

        } catch(\Exception $e){
            $data=array(
                'success'=>false,
                'message'=>'Saving Error'
            );
            return response()->json($data);
         }


    }

    public function getNumberRevision(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $datenow = date('dHis');
        $coverletter = "SIG.CL.". $this->getRomawi(date('m')).".". date('Y').".".$datenow ;
        $no=1;

        foreach($data as $d)
        {
            $edit = Ecertlhu::where('id', $d['id'])->first();
            $edit->cl_number = $coverletter;
            $edit->lhu_number = "SIG.LHP.". $this->getRomawi(date('m')).".". date('Y').".".$datenow.$no ;
            $edit->date_at = time::now();
            $edit->save();
            $no++;
        }

        $message=array(
            'success'=>true,
            'message'=>'Saving Success'
        );
        return response()->json($message);
    }


    public function duplicateCertificate(Request $request)
    {

        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            $model = Ecertlhu::with(
                'TransactionSample',
                'TransactionSample.kontrakuji',
                'TransactionSample.kontrakuji.cust_address',
                'TransactionSample.kontrakuji.customers_handle',
                'TransactionSample.kontrakuji.customers_handle.customers',
                'TransactionSample.kontrakuji.customers_handle.contact_person'
            )
            ->where('id', $data)
            ->first();


            $ecert = Ecertlhu::latest('id')->first();
            $count_data = Ecertlhu::where('id_transaction_sample', $ecert->id_transaction_sample)->count();
            $conditioncert = ConditionCert::where('id_transaction_cert', $ecert->id)->first();

            $addTransactionSampleCert = New Ecertlhu;
            $addTransactionSampleCert->id_transaction_sample = $model->id_transaction_sample;
            $addTransactionSampleCert->customer_name = $model->customer_name;
            $addTransactionSampleCert->customer_address = $model->customer_address;
            $addTransactionSampleCert->customer_telp = $model->customer_telp;
            $addTransactionSampleCert->contact_person = $model->contact_person;
            $addTransactionSampleCert->sample_name = $model->sample_name;
            $addTransactionSampleCert->no_sample = $model->no_sample;
            $addTransactionSampleCert->kode_sample = $model->kode_sample;
            $addTransactionSampleCert->batch_number = $model->batch_number;
            $addTransactionSampleCert->tgl_mulai = $model->tgl_mulai;
            $addTransactionSampleCert->tgl_input = $model->tgl_input;
            $addTransactionSampleCert->tgl_selesai = $model->tgl_selesai;
            $addTransactionSampleCert->tgl_estimasi_lab = $model->tgl_estimasi_lab;
            $addTransactionSampleCert->nama_pabrik = $model->nama_pabrik;
            $addTransactionSampleCert->alamat_pabrik = $model->alamat_pabrik;
            $addTransactionSampleCert->no_notifikasi = $model->no_notifikasi;
            $addTransactionSampleCert->no_pengajuan = $model->no_pengajuan;
            $addTransactionSampleCert->no_registrasi = $model->no_registrasi;
            $addTransactionSampleCert->no_principalcode = $model->no_principalcode;
            $addTransactionSampleCert->nama_dagang = $model->nama_dagang;
            $addTransactionSampleCert->lot_number = $model->lot_number;
            $addTransactionSampleCert->jenis_kemasan = $model->jenis_kemasan;
            $addTransactionSampleCert->tgl_produksi = $model->tgl_produksi;
            $addTransactionSampleCert->tgl_kadaluarsa = $model->tgl_kadaluarsa;
            $addTransactionSampleCert->tgl_sampling= $model->tgl_sampling;
            $addTransactionSampleCert->price = $model->price;
            $addTransactionSampleCert->id_tujuanpengujian = $model->id_tujuanpengujian;
            $addTransactionSampleCert->id_statuspengujian = $model->id_statuspengujian;
            $addTransactionSampleCert->id_subcatalogue = $model->id_subcatalogue;
            $addTransactionSampleCert->keterangan_lain = $model->keterangan_lain;
            $addTransactionSampleCert->metode = $model->metode;
            $addTransactionSampleCert->location = $model->location;
            $addTransactionSampleCert->pic = $model->pic;
            $addTransactionSampleCert->kondisi_lingkungan = $model->kondisi_lingkungan;
            $addTransactionSampleCert->print_info = $model->print_info;
            $addTransactionSampleCert->urutan = $model->urutan.'.'.$count_data;
            $addTransactionSampleCert->format = $model->format;
            $addTransactionSampleCert->date_at = $model->date_at;
            $addTransactionSampleCert->save();


            $ecert2 = Ecertlhu::latest('id')->first();

            $ec = Ecertlhu::where('id', $model->id)->first();
            $transactioncert = ConditionCert::where('id_transaction_cert', $ec->id)->orderBy('inserted_at', 'DESC')->first();

            $addcondition = new ConditionCert();
            $addcondition->id_transaction_cert =  $ecert2->id;
            $addcondition->id_contract =  $transactioncert->id_contract;
            $addcondition->status = 1;
            $addcondition->id_team = $transactioncert->id_team;
            $addcondition->user_id = $id_user;
            $addcondition->cert_status = $transactioncert->cert_status;
            $addcondition->inserted_at = time::now();
            $addcondition->save();

            $transactionparams = ParameterCert::where('id_transaction_sample', $model->id)->get();

            $position = 1;
            foreach($transactionparams as $param ){
                $addparameter = new ParameterCert();
                $addparameter->id_transaction_sample = (int)$ecert2->id;
                $addparameter->id_parameteruji = $param->id_parameteruji;
                $addparameter->parameteruji_id = $param->parameteruji_id;
                $addparameter->parameteruji_en = $param->parameteruji_en;
                $addparameter->simplo = $param->simplo;
                $addparameter->duplo = $param->duplo;
                $addparameter->triplo = $param->triplo;
                $addparameter->hasiluji = $param->hasiluji;
                $addparameter->standart = $param->standart;
                $addparameter->lod = $param->lod;
                $addparameter->lab = $param->lab;
                $addparameter->unit = $param->unit;
                $addparameter->metode = $param->metode;
                $addparameter->c = $param->c;
                $addparameter->n = $param->n;
                $addparameter->m = $param->m;
                $addparameter->mm = $param->mm;
                $addparameter->format_hasil = $param->format_hasil;
                $addparameter->status = $param->status;
                $addparameter->info_id = $param->info_id;
                $addparameter->position = $position;
                $addparameter->save();
                $position++;
            }

            $message = array(
                'success'=>true,
                'message'=>'Saving Success'
            );
            return response()->json($message);

        } catch(\Exception $e){
            $data=array(
                'success'=>false,
                'message'=>'Update Error'
            );
            return response()->json($data);
        }
    }

    public function duplicateCertificateRev(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = Ecertlhu::where('id', $data)->first();

        $ecert = Ecertlhu::latest('id')->first();
        $count_data = Ecertlhu::where('id_transaction_sample', $ecert->id_transaction_sample)->count();
        $conditioncert = ConditionCert::where('id_transaction_cert', $ecert->id)->first();
        $count_lhu =  Ecertlhu::where('lhu_number', 'LIKE',  '%'.$model->lhu_number.'%')->count();

        $addTransactionSampleCert = New Ecertlhu;
        $addTransactionSampleCert->id_transaction_sample = $model->id_transaction_sample;
        $addTransactionSampleCert->cl_number = $model->cl_number;
        $addTransactionSampleCert->lhu_number = $model->lhu_number .'-'. $count_lhu;
        $addTransactionSampleCert->customer_name = $model->customer_name;
        $addTransactionSampleCert->customer_address = $model->customer_address;
        $addTransactionSampleCert->customer_telp = $model->customer_telp;
        $addTransactionSampleCert->contact_person = $model->contact_person;
        $addTransactionSampleCert->sample_name = $model->sample_name;
        $addTransactionSampleCert->no_sample = $model->no_sample;
        $addTransactionSampleCert->kode_sample = $model->kode_sample;
        $addTransactionSampleCert->batch_number = $model->batch_number;
        $addTransactionSampleCert->tgl_mulai = $model->tgl_mulai;
        $addTransactionSampleCert->tgl_input = $model->tgl_input;
        $addTransactionSampleCert->tgl_selesai = $model->tgl_selesai;
        $addTransactionSampleCert->tgl_estimasi_lab = $model->tgl_estimasi_lab;
        $addTransactionSampleCert->nama_pabrik = $model->nama_pabrik;
        $addTransactionSampleCert->alamat_pabrik = $model->alamat_pabrik;
        $addTransactionSampleCert->no_notifikasi = $model->no_notifikasi;
        $addTransactionSampleCert->no_pengajuan = $model->no_pengajuan;
        $addTransactionSampleCert->no_registrasi = $model->no_registrasi;
        $addTransactionSampleCert->no_principalcode = $model->no_principalcode;
        $addTransactionSampleCert->nama_dagang = $model->nama_dagang;
        $addTransactionSampleCert->lot_number = $model->lot_number;
        $addTransactionSampleCert->jenis_kemasan = $model->jenis_kemasan;
        $addTransactionSampleCert->tgl_produksi = $model->tgl_produksi;
        $addTransactionSampleCert->tgl_kadaluarsa = $model->tgl_kadaluarsa;
        $addTransactionSampleCert->tgl_sampling= $model->tgl_sampling;
        $addTransactionSampleCert->price = $model->price;
        $addTransactionSampleCert->id_tujuanpengujian = $model->id_tujuanpengujian;
        $addTransactionSampleCert->id_statuspengujian = $model->id_statuspengujian;
        $addTransactionSampleCert->metode = $model->metode;
        $addTransactionSampleCert->location = $model->location;
        $addTransactionSampleCert->pic = $model->pic;
        $addTransactionSampleCert->kondisi_lingkungan = $model->kondisi_lingkungan;
        $addTransactionSampleCert->id_subcatalogue = $model->id_subcatalogue;
        $addTransactionSampleCert->keterangan_lain = $model->keterangan_lain;
        $addTransactionSampleCert->print_info = $model->print_info;
        $addTransactionSampleCert->urutan = $model->urutan.'.'.$count_data;
        $addTransactionSampleCert->format = $model->format;
        $addTransactionSampleCert->date_at = $model->date_at;
        $addTransactionSampleCert->save();


        $ecert2 = Ecertlhu::latest('id')->first();

        $ec = Ecertlhu::where('id', $model->id)->first();
        $transactioncert = ConditionCert::where('id_transaction_cert', $ec->id)->orderBy('inserted_at', 'DESC')->first();

        $addcondition = new ConditionCert();
        $addcondition->id_transaction_cert =  $ecert2->id;
        $addcondition->id_contract =  $transactioncert->id_contract;
        $addcondition->status = 1;
        $addcondition->id_team = $transactioncert->id_team;
        $addcondition->user_id = $id_user;
        $addcondition->cert_status = $transactioncert->cert_status;
        $addcondition->inserted_at = time::now();
        $addcondition->save();
        $transactionparams = ParameterCert::where('id_transaction_sample', $model->id)->get();


        $position = 1;
        foreach($transactionparams as $param ){
            $addparameter = new ParameterCert();
            $addparameter->id_transaction_sample = (int)$ecert2->id;
            $addparameter->id_parameteruji = $param->id_parameteruji;
            $addparameter->parameteruji_id = $param->parameteruji_id;
            $addparameter->parameteruji_en = $param->parameteruji_en;
            $addparameter->simplo = $param->simplo;
            $addparameter->duplo = $param->duplo;
            $addparameter->triplo = $param->triplo;
            $addparameter->hasiluji = $param->hasiluji;
            $addparameter->standart = $param->standart;
            $addparameter->lod = $param->lod;
            $addparameter->lab = $param->lab;
            $addparameter->unit = $param->unit;
            $addparameter->metode = $param->metode;
            $addparameter->c = $param->c;
            $addparameter->n = $param->n;
            $addparameter->m = $param->m;
            $addparameter->mm = $param->mm;
            $addparameter->format_hasil = $param->format_hasil;
            $addparameter->status = $param->status;
            $addparameter->info_id = $param->info_id;
            $addparameter->position = $position;
            $addparameter->save();
            $position++;
        }

        $message = array(
            'success'=>true,
            'message'=>'Saving Success'
        );
        return response()->json($message);
    }

    public function deleteResultOfAnalisys(Request $request, $id_sample)
    {
        try {

            $certificate = Ecertlhu::find($id_sample);
            $conditions = ConditionCert::where('id_transaction_cert', $id_sample)->get();

            foreach($conditions as $condition)
            {
                $c= ConditionCert::where('id', $condition->id)->first();
                $c->delete();
            }

            $parameters = ParameterCert::where('id_transaction_sample', $id_sample)->get();
            foreach($parameters as $parameter)
            {
                $p = ParameterCert::where('id', $parameter->id)->first();
                return $p;
                $p->delete();
            }

            $del = $certificate->delete();

            $message = array(
                'success'=>true,
                'message'=>'Delete Success'
            );
            return response()->json($message);
        }
        catch(\Exception $e){
            $data=array(
                'success'=>false,
                'message'=>'Update Error'
            );
            return response()->json($data);
        }
    }

    public function bulkdeleteResultOfAnalisys(Request $request)
    {
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');


            foreach( $data as $d){

                $certificate = Ecertlhu::find($d['id']);
                $conditions = ConditionCert::where('id_transaction_cert', $d['id'])->get();

                foreach($conditions as $condition)
                {
                    $c= ConditionCert::where('id', $condition->id)->first();
                    $c->delete();
                }

                $parameters = ParameterCert::where('id_transaction_sample', $d['id'])->get();
                foreach($parameters as $parameter)
                {
                    $p = ParameterCert::where('id', $parameter->id)->first();
                    $p->delete();
                }

                $del = $certificate->delete();
            }


            $message = array(
                'success'=>true,
                'message'=>'Delete Success'
            );
            return response()->json($message);
        }
        catch(\Exception $e){
            $data=array(
                'success'=>false,
                'message'=>'Update Error'
            );
            return response()->json($data);
        }
    }

    public function bulkUpdateSample(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');
        $update = $request->input('update');

        try {
            foreach($data['checkData'] as $c){
                $z = Ecertlhu::where('id', $c['id'])->first();

                foreach($update as $u){

                        switch ($u['data']){
                            case 'format':
                                $z->format = $u['value'];
                                break;

                            case 'coverletter':
                                $z->cl_number = $u['value'];
                                break;

                            case 'lhu_number':
                                $z->lhu_number = $u['value'];
                                break;

                            case 'customer_name':
                                $z->customer_name = $u['value'];
                                break;

                            case 'telephone':
                                $z->customer_telp = $u['value'];
                                break;

                            case 'contact_person':
                                $z->contact_person = $u['value'];
                                break;

                            case 'address':
                                $z->customer_address = $u['value'];
                                break;

                            case 'sample_name':
                                $z->sample_name = $u['value'];
                                break;

                            case 'sample_number':
                                $z->no_sample = $u['value'];
                                break;

                            case 'batch_number':
                                $z->batch_number = $u['value'];
                                break;

                            case 'sample_code':
                                $z->kode_sample = $u['value'];
                                break;

                            case 'tgl_mulai':
                                $z->tgl_mulai = date('Y-m-d',strtotime($u['value']));
                                break;

                            case 'tgl_selesai':
                                $z->tgl_selesai = date('Y-m-d',strtotime($u['value']));
                                break;

                            case 'tgl_input':
                                $z->tgl_input = date('Y-m-d',strtotime($u['value']));
                                break;

                            case 'factory':
                                $z->nama_pabrik = $u['value'];
                                break;

                            case 'merk':
                                $z->nama_dagang = $u['value'];
                                break;

                            case 'lot_number':
                                $z->lot_number = $u['value'];
                                break;

                            case 'packaging':
                                $z->jenis_kemasan = $u['value'];
                                break;

                            case 'factory_address':
                                $z->alamat_pabrik = $u['value'];
                                break;

                            case 'no_notifikasi':
                                $z->no_notifikasi = $u['value'];
                                break;

                            case 'no_pengajuan':
                                $z->no_pengajuan = $u['value'];
                                break;

                            case 'no_registrasi':
                                $z->no_registrasi = $u['value'];
                                break;

                            case 'no_principalcode':
                                $z->no_principalcode = $u['value'];
                                break;

                            case 'production_date':
                                $z->tgl_produksi = $u['value'];
                                break;

                            case 'expired_date':
                                $z->tgl_kadaluarsa = $u['value'];
                                break;

                            case 'sampling_date':
                                $z->tgl_sampling = date('Y-m-d',strtotime($u['value']));
                                break;

                            case 'print_info':
                                $z->print_info = $u['value'];
                                break;

                            case 'other_information':
                                $z->keterangan_lain = $u['value'];
                                break;

                            case 'metode':
                                $z->metode = $u['value'];
                                break;

                            case 'location':
                                $z->location = $u['value'];
                                break;

                            case 'pic':
                                $z->pic = $u['value'];
                                break;

                            case 'kondisi_lingkungan':
                                $z->kondisi_lingkungan = $u['value'];
                                break;


                            case 'date_at':
                                $z->date_at = date('Y-m-d',strtotime($u['value']));
                                break;
                        }
                }
            $z->save();
            }

            $message = array(
                'success'=>true,
                'message'=>'Update Success'
            );
            return response()->json($message);
        }
        catch(\Exception $e){
            $data=array(
                'success'=>false,
                'message'=>'Update Error'
            );
            return response()->json($data);
        }
    }

    public function showParameterInCertificate(Request $request)
    {
       try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            $model = ParameterCert::where('id_transaction_sample', $data['id_transaction'])
            ->orderBy('position', 'asc');

            if(!empty($data['parameter_id'])){
                $model=$model->where(\DB::raw('UPPER(parameteruji_id)'),'like','%'.$data['parameter_id'].'%');
            }

            if(!empty($data['parameter_en'])){
                $model=$model->where(\DB::raw('UPPER(parameteruji_en)'),'like','%'.$data['parameter_en'].'%');
            }

            $model = $model->paginate(500);

            
            return response()->json($model);

        }catch(\Exception $e){
            $data=array(
                'success'=>false,
                'message'=>'Update Error'
            );
            return response()->json($data);
        }
    }

    public function addCertificateParameter(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $param = ParameterUji::where('id', $data['id_parameter'])->first();
        $count = ParameterCert::where('id_transaction_sample', $data['id_sample'])->count();

        $model = New ParameterCert;
        $model->id_transaction_sample = $data['id_sample'];
        $model->id_parameteruji = $data['id_parameter'];
        $model->parameteruji_id = $param->name_en;
        $model->parameteruji_en = $param->name_en;
        $model->position = $count + 1;
        $model->save();

        $data=array(
            'success'=>true,
            'message'=>'Update Success'
        );
        return response()->json($data);

    }

    public function updateCertificateData(Request $request)
    {
        try {
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            $id = $request->input('id');

            $models = Ecertlhu::where('id', $id)->first();
            $models->format = $data['format'];
            $models->cl_number = $data['cl_number'];
            $models->lhu_number = $data['lhu_number'];
            $models->customer_name = $data['customer_name'];
            $models->customer_address = $data['customer_address'];
            $models->customer_telp = $data['customer_telp'];
            $models->contact_person = $data['contact_person'];
            $models->sample_name =  $data['sample_name'];
            $models->no_sample =  $data['no_sample'];
            $models->kode_sample =  $data['kode_sample'];
            $models->batch_number =  $data['batch_number'];
            $models->tgl_input =  date('Y-m-d',strtotime($data['tgl_input']));
            $models->tgl_mulai =  date('Y-m-d',strtotime($data['tgl_mulai']));
            $models->tgl_selesai = date('Y-m-d',strtotime($data['tgl_selesai']));
            $models->tgl_estimasi_lab = date('Y-m-d',strtotime($data['tgl_selesai']));
            $models->nama_pabrik = $data['nama_pabrik'];
            $models->alamat_pabrik = $data['alamat_pabrik'];
            $models->no_notifikasi =  $data['no_notifikasi'];
            $models->no_pengajuan = $data['no_pengajuan'];
            $models->no_registrasi = $data['no_registrasi'];
            $models->no_principalcode =  $data['no_principalcode'];
            $models->nama_dagang =  $data['nama_dagang'];
            $models->lot_number =  $data['lot_number'];
            $models->jenis_kemasan =  $data['jenis_kemasan'];
            $models->tgl_produksi =  $data['tgl_produksi'];
            $models->tgl_kadaluarsa =  $data['tgl_kadaluarsa'];
            $models->tgl_sampling =  $data['tgl_sampling'] == null ? null : date('Y-m-d',strtotime($data['tgl_sampling']));
            $models->id_tujuanpengujian =  $data['id_tujuanpengujian'];
            $models->id_statuspengujian =  $data['id_statuspengujian'];
            $models->id_subcatalogue = $data['id_subcatalogue'];
            $models->metode = $data['metode'];
            $models->location = $data['location'];
            $models->pic = $data['pic'];
            $models->kondisi_lingkungan = $data['kondisi_lingkungan'];
            $models->keterangan_lain = $data['keterangan_lain'];
            $models->print_info = $data['print_info'];
            $models->date_at = date('Y-m-d',strtotime($data['date_cert']));

            if(!empty($data['datamanual'])){
                $cek = ManualData::where('id_transaction_sample', $id)->count();

                if($cek == 0){

                    $manual = new ManualData;
                    $manual->id_transaction_sample = $id;
                    $manual->datamanual = $data['datamanual'];
                    $manual->save();

                }else{
                    $manual = ManualData::where('id_transaction_sample',  $id)->first();
                    $manual->datamanual = $data['datamanual'];
                    $manual->save();

                }
            }

            $models->save();

            $data=array(
                'success'=>true,
                'message'=>'Update Success'
            );
            return response()->json($data);

        }catch(\Exception $e){
            $data=array(
                'success'=>false,
                'message'=>'Update Error'
            );
            return response()->json($data);
        }
    }

    public function ApproveCert(Request $request)
    {
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');


            foreach($data as $data)
            {
               $cert = ConditionCert::where('id_transaction_cert', $data['id'])->orderby('id', 'desc')->first();
                if($cert->status == 1){
                    $models = new ConditionCert;
                    $models->id_transaction_cert = $data['id'];
                    $models->id_contract = $data['id_contract'];
                    $models->status = 2;
                    $models->user_id = $id_user;
                    $models->id_team = $cert->id_team;
                    $models->cert_status = $cert->cert_status;
                    $models->inserted_at =  time::now();
                    $models->save();
                }
            }

            $data=array(
                'success'=>true,
                'message'=>'Approve Success'
            );
            return response()->json($data);

        }catch(\Exception $e){
            $data=array(
                'success'=>false,
                'message'=>'Update Error'
            );
            return response()->json($data);
        }
    }



    // Manager
    public function resultofanalisys(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $array = array();

        try {

            $m = ConditionCert::selectRaw('id_transaction_cert')
            ->where('status',2)
            ->groupBy('id_transaction_cert')
            ->get();

            foreach ($m as $ksd) {
                $bb = ConditionCert::where('id_transaction_cert',$ksd->id_transaction_cert)->get();
                foreach($bb as $b){
                    $c =  ConditionCert::where('id_transaction_cert',$ksd->id_transaction_cert)->latest('id')->first();
                    if($c->status == 2){
                        array_push($array,$bb[count($bb) - 1]->id_transaction_cert);
                    }
                }
            }

            $model = Ecertlhu::with([
                'TransactionSample',
                'TransactionSample.kontrakuji',
                'ConditionCert'
            ])->whereIn('id',$array);

             return response()->json($model->paginate(50));

        } catch(\Exception $e){
            $data=array(
                'success'=>false,
                'message'=>'Update Error'
            );
            return response()->json($data);
        }
    }

    public function showContractinRoa($id_contract)
    {
        try{
            $model=Kontrakuji::with([
                'description',
                'description.user',
                'description.user.bagian',
                'description.user.subagian',
                'contract_category',
                'customers_handle',
                'customers_handle.customers',
                'customers_handle.contact_person',
                'user'
            ])
            ->where('id_kontrakuji', $id_contract)
            ->first();

            return response()->json($model);
        }
        catch(\Exception $e){
            $data=array(
                'success'=>false,
                'message'=>'Data Not Found'
            );
            return response()->json($data);
        }


    }

    public function getRoainContract(Request $request, $id_contract)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $array = array();

        try {

            $m = ConditionCert::selectRaw('id_transaction_cert')
            ->where('status',2)
            ->where('id_contract', $id_contract)
            ->groupBy('id_transaction_cert')
            ->get();


            foreach ($m as $ksd) {
                $bb = ConditionCert::where('id_transaction_cert',$ksd->id_transaction_cert)->get();
                foreach($bb as $b){
                    $c =  ConditionCert::where('id_transaction_cert',$ksd->id_transaction_cert)->latest('id')->first();
                    if($c->status == 2){
                        array_push($array,$bb[count($bb) - 1]->id_transaction_cert);
                    }
                }
            }

            $model = Ecertlhu::with([
                'TransactionSample',
            ])->whereIn('id',$array);

             return response()->json($model->paginate(50));

        } catch(\Exception $e){
            $data=array(
                'success'=>false,
                'message'=>'Update Error'
            );
            return response()->json($data);
        }
    }

    public function parameterUpdate(Request $request)
    {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $datas = $request->input('data');
            $deleted = $request->input('deleted');

            $no = 1;
            foreach($datas as $data){

              $c =  ParameterCert::where('id', $data['id'])->first();
              $c->position = $no;
              $c->parameteruji_id = $data['parameteruji_id'];
              $c->parameteruji_en = $data['parameteruji_en'];
              $c->hasiluji = $data['hasiluji'];
              $c->simplo = $data['simplo'];
              $c->duplo = $data['duplo'];
              $c->triplo = $data['triplo'];
              $c->standart = $data['standart'];
              $c->lod = $data['lod'];
              $c->lab = $data['lab'];
              $c->metode = $data['metode'];
              $c->unit = $data['unit'];
              $c->n = $data['n'];
              $c->c = $data['c'];
              $c->m = $data['m'];
              $c->mm = $data['mm'];
              $c->save();
              $no++;
            }

            foreach($deleted as $d){
                $b = ParameterCert::where('id', $d)->first();
                $b->delete();
            }

            $data=array(
                'success'=>true,
                'message'=>'Update Success'
            );
            return response()->json($data);



    }

    public function parameterListing(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $datas = $request->input('data');


        $no = 1;
        foreach($datas as $data){
            $mod =  ParameterCert::where('id', $data['id'])->first();
            $mod->position = $no;
            $mod->save();

        $no ++;

        }

        $data=array(
            'success'=>true,
            'message'=>'Update Success'
        );
        return response()->json($data);
    }

    public function ApproveManager(Request $request)
    {
        try {
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $datas = $request->all();

            foreach($datas as $data){
                $ceksample = ConditionCert::where('id_transaction_cert', $data['id'])->orderBy('inserted_at', 'desc')->first();

                // if draft
                if($data['data'] == 1){
                    $draft = new ConditionCert;
                    $draft->id_transaction_cert = $data['id'];
                    $draft->id_contract = $ceksample->id_contract;
                    $draft->status = 2;
                    $draft->user_id =  $id_user;
                    $draft->cert_status = 1;
                    $draft->inserted_at = time::now();
                    $draft->save();

                    $data=array(
                        'success'=>true,
                        'message'=>'Draft Success'
                    );
                    return response()->json($data);
                }

                // if release
                if($data['data'] == 2){
                    $draft = new ConditionCert;
                    $draft->id_transaction_cert = $data['id'];
                    $draft->id_contract = $ceksample->id_contract;
                    $draft->status = 3;
                    $draft->user_id =  $id_user;
                    $draft->cert_status = 2;
                    $draft->inserted_at = time::now();
                    $draft->save();

                    $data=array(
                        'success'=>true,
                        'message'=>'Release Success'
                    );
                    return response()->json($data);
                }
            }


        }
        catch(\Exception $e){
            $data=array(
                'success'=>false,
                'message'=>'Data Not Found'
            );
            return response()->json($data);
        }

    }

    public function getParameterAll(Request $request, $id_contract)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $array = array();

        foreach($data['checkData'] as $item){
            $model = ParameterCert::where('id_transaction_sample', $item['id'])->get();
            foreach($model as $m){
                $param = ParameterCert::where('id', $m->id)->first();
                array_push($array, [ 'name' => $param->parameteruji_id, 'id' => $param->id ]);
            }
        }

        $unique_array = [];
        foreach($array as $element) {
            $hash = $element['name'];
            $unique_array[$hash] = $element;
        }
        $result = array_values($unique_array);
        return $result;
    }

    public function updateParameterAll(Request $request, $id_contract)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $id = $request->input('id');
        $data = $request->input('data');
        $selectParameter = $request->input('selectParameter');

        foreach($id['checkData'] as $item){
            $model = ParameterCert::where('id_transaction_sample', $item['id'])->get();

            foreach($model as $m){
                $param = ParameterCert::where('id', $m->id)->first();

                if($param->parameteruji_id == $selectParameter){
                    foreach($data as $u){
                        switch ($u['data']){
                            case 'parameter_id':
                                $param->parameteruji_id = $u['value'];
                            break;

                            case 'parameter_en':
                                $param->parameteruji_en = $u['value'];
                            break;

                            case 'hasiluji':
                                $param->hasiluji = $u['value'];
                            break;

                            case 'unit':
                                $param->unit = $u['value'];
                            break;

                            case 'lod':
                                $param->lod = $u['value'];
                            break;

                            case 'metode':
                                $param->metode = $u['value'];
                            break;

                            case 'standart':
                                $param->standart = $u['value'];
                            break;

                        }

                    }
                }
                $param->save();
            }
        }

        $data=array(
            'success'=>true,
            'message'=>'Release Success'
        );
        return response()->json($data);
    }

    public function activedcertificate(Request $request)
    {

        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $id = $request->input('id');
        $data = $request->input('data');

        $model = Ecertlhu::where('id', $data['id'])->first();
        $model->active = $data['data'];
        $model->save();

        $data=array(
            'success'=>true,
            'message'=>'data Success'
        );
        return response()->json($data);

    }

    public function getParameterinOtherLhu(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $id = $request->input('id');
        $data = $request->input('data');

        $models = ParameterCert::where('id_transaction_sample', $data['send_id'])->get();
        foreach($models as $m){
            $add = new ParameterCert;
            $add->id_transaction_sample = $data['id_lhu'];
            $add->id_parameteruji = $m->id_parameteruji;
            $add->parameteruji_id = $m->parameteruji_id;
            $add->parameteruji_en = $m->parameteruji_en;
            $add->simplo = $m->simplo;
            $add->duplo = $m->duplo;
            $add->triplo = $m->triplo;
            $add->hasiluji = $m->hasiluji;
            $add->standart = $m->standart;
            $add->lod = $m->lod;
            $add->lab = $m->lab;
            $add->unit = $m->unit;
            $add->metode = $m->metode;
            $add->m = $m->m;
            $add->mm = $m->mm;
            $add->n = $m->n;
            $add->c = $m->c;
            $add->format_hasil = $m->format_hasil;
            $add->status = $m->status;
            $add->info_id = $m->info_id;
            $add->save();
        }
        $data=array(
            'success'=>true,
            'message'=>'data Success'
        );
        return response()->json($data);
    }

    public function getListLhu(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;

        $data = $request->input('data');

        $model = ConditionCert::with(['transaction_cert_light'])
        ->where('id_contract', $data['contract'])
        ->groupBy('id_transaction_cert')
        ->get();

        return response()->json($model);
    }

    public function getcertinLHU(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;

        $datainput = $request->input('data');
        $data = $request->input('id');

        $model = ParameterCert::where('id_transaction_sample', $datainput)->get();

        foreach($model as $m)
        {
            $countp = ParameterCert::where('id_transaction_sample', $data)->count();

            $param = New ParameterCert;
            $param->id_transaction_sample =  $data;
            $param->id_parameteruji = $m['id_parameteruji'];
            $param->parameteruji_id = $m['parameteruji_id'];
            $param->parameteruji_en = $m['parameteruji_en'];
            $param->simplo = $m['simplo'];
            $param->duplo = $m['duplo'];
            $param->triplo = $m['triplo'];
            $param->hasiluji = $m['hasiluji'];
            $param->actual_result = $m['actual_result'];
            $param->standart = $m['standart'];
            $param->lod = $m['lod'];
            $param->lab = $m['lab'];
            $param->unit = $m['unit'];
            $param->metode = $m['metode'];
            $param->m = $m['m'];
            $param->mm = $m['mm'];
            $param->n = $m['n'];
            $param->c = $m['c'];
            $param->format_hasil = $m['format_hasil'];
            $param->status = $m['status'];
            $param->info_id = $m['info_id'];
            $param->position = $countp + 1;
            $param->desc = $m['desc'];
            $param->save();
        }

        $data=array(
            'success'=>true,
            'message'=>'data Success'
        );
        return response()->json($data);
    }
    




    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // ARCHIVE /////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

    public function updateParameter(Request $request)
    {
        //try {
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            foreach($data as $d)
            {
                $model = ParameterCert::where('id', $d['id'])->first();

                $model->id_parameteruji = $d['id_parameteruji'];
                $model->parameteruji_id = $d['parameteruji_id'];
                $model->parameteruji_en = $d['parameteruji_en'];
                $model->simplo = $d['simplo'];
                $model->duplo = $d['duplo'];
                $model->triplo = $d['triplo'];
                $model->hasiluji = $d['hasiluji'];
                $model->actual_result = $d['actual_result'];
                $model->standart = $d['standart'];
                $model->lod = $d['lod'];
                $model->unit = $d['unit'];
                $model->metode = $d['metode'];
                $model->c = $d['c'];
                $model->n = $d['n'];
                $model->m = $d['m'];
                $model->mm = $d['mm'];
                $model->save();
            }

            $data=array(
                'success'=>true,
                'message'=>'data Success'
            );
            return response()->json($data);
        // }catch(\Exception $e){
        //     $data=array(
        //         'success'=>false,
        //         'message'=>'Data Not Found'
        //     );
        //     return response()->json($data);
        // }


    }

    public function deleteBUlkParameter(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        foreach($data as $d){
            $model = ParameterCert::where('id', $d['id'])->first();
            $model->delete();
        }

        $data=array(
            'success'=>true,
            'message'=>'Delete Success'
        );
        return response()->json($data);
    }



    public function addParameterinLhu(Request $request)

    {
      $token = $request->bearerToken();
      $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
      $id_user = $users->sub;
      $data = $request->input('data');

      $model = ParameterUji::where('id', $data)->first();
      $count = ParameterCert::where('id_transaction_sample', $request->input('id'))->count();

      $check = New ParameterCert;
      $check->id_transaction_sample = $request->input('id');
      $check->id_parameteruji = $model->id;
      $check->parameteruji_id = $model->name_id;
      $check->parameteruji_en = $model->name_en;
      $check->position = $count + 1;
      $check->save();

      $data=array(
          'success'=>true,
          'message'=>'Add Success'
      );
      return response()->json($data);
  }

    public function copyParameterinLhu(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');
        $ids = $request->input('id');


        $new = New ParameterCert;
        $new->id_transaction_sample =  $ids;
        $new->id_parameteruji = $data['id_parameteruji'];
        $new->parameteruji_id = $data['parameteruji_id'];
        $new->parameteruji_en = $data['parameteruji_en'];
        $new->simplo = $data['simplo'];
        $new->duplo = $data['duplo'];
        $new->triplo = $data['triplo'];
        $new->hasiluji = $data['hasiluji'];
        $new->actual_result = $data['actual_result'];
        $new->standart = $data['standart'];
        $new->lod = $data['lod'];
        $new->lab = $data['lab'];
        $new->unit = $data['unit'];
        $new->metode = $data['metode'];
        $new->m = $data['m'];
        $new->mm = $data['mm'];
        $new->c = $data['c'];
        $new->format_hasil = $data['format_hasil'];
        $new->status = $data['status'];
        $new->info_id = $data['info_id'];
        $new->position = $data['position'];
        $new->desc = $data['desc'];
        $new->save();


        $data = array(
            'success'=>true,
            'message'=>'Add Success'
        );
        return response()->json($data);
    }

    public function deleteUnitParameter(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = ParameterCert::where('id', $data)->first();
        $model->delete();

        $data = array(
            'success'=>true,
            'message'=>'Delete Success'
        );
        return response()->json($data);
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // ARCHIVE /////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

    public function archive(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $clear_array = array();
        $marketingMaps = [];            
        $marketingcheck = $data['marketing'];
        $categorycheck = $data['category'];   
        $statuscheck = $data['status'];   
        $customercheck = $data['customer_name'];
        $lhucheck = $data['lhu'];
        $arraylhu = array();
        $datelhucheck = $data['date_lhu'];
        $teamcheck = $data['team'];
        $holdcheck = $data['hold'];



        $model = ConditionCert::with([
            'transaction_cert_light',
            'contract_master.customers_handle.customers',
            'contract_master.customers_handle.contact_person',
            'team'
        ]);

        if(!empty($data['lhu']) || !empty($data['date_lhu'])){
            
            $lhudata = Ecertlhu::with(['ConditionCert'])->select('id', 'lhu_number', 'date_at');
            if(!empty($data['lhu'])){
                $lhudata = $lhudata->where('lhu_number', 'LIKE', '%'.$data['lhu'].'%');
            }
            if(!empty($data['date_lhu'])){
                $lhudata = $lhudata->where('date_at', 'LIKE', '%'. date('Y-m-d',strtotime($datelhucheck)) .'%');
            }
            $lhudata = $lhudata->get()
            ->toArray();

            foreach ($lhudata as $lhu) {
                foreach( $lhu['condition_cert'] as $d){
                    array_push($arraylhu, $d['id_contract']);
                }
            }
            $clear_array = array_unique($arraylhu);
        }


        if(!empty($marketingcheck) || 
        !empty($categorycheck) || 
        !empty($customercheck) || 
        !empty($lhucheck) ||
        !empty($datelhucheck) || 
        !empty($holdcheck)){

            
            $marketingQuery = Kontrakuji::with([
                'customers_handle',
                ])->select('id_kontrakuji', 'id_customers_handle');
            if(!empty($marketingcheck)){
                $marketingQuery = $marketingQuery->where(\DB::raw('UPPER(contract_no)'),'like','%'.$marketingcheck.'%');
            }
            if(!empty($categorycheck)){
                $marketingQuery = $marketingQuery->where('id_contract_category', $categorycheck);
            } 
            if(!empty($customercheck)){
                $marketingQuery = $marketingQuery->whereHas('customers_handle',function($marketingQuery) use ($customercheck){
                        $marketingQuery->where('id_customer', $customercheck);
                });
            }
            if(!empty($lhucheck) || !empty($datelhucheck)){
                $marketingQuery = $marketingQuery->whereIn('id_kontrakuji', $clear_array);
            } 

            if(!empty($holdcheck)){
                $marketingQuery = $marketingQuery->where('hold', $holdcheck);
            } 

            $marketingQuery = $marketingQuery->get()->toArray();
            
            $marketingMaps = array_map(function ($marketingQuery) {
                return $marketingQuery['id_kontrakuji'];
            }, $marketingQuery);

        }

        
        if(!empty($statuscheck)){
            $model =  $model->where(function ($query) use (
                $marketingMaps, 
                $marketingcheck, 
                $statuscheck, 
                $customercheck,
                $lhucheck,
                $datelhucheck,
                $teamcheck,
                $holdcheck ) {
                $query->where('status', '=', $statuscheck);
                if(!empty($teamcheck)){
                    $query->where('id_team', $teamcheck);
                }
                if(!empty($marketingcheck) || 
                !empty($categorycheck) || 
                !empty($customercheck) ||
                !empty($lhucheck) ||
                !empty($datelhucheck || 
                !empty($holdcheck))){
                    $query->whereIn('id_contract', $marketingMaps);
                }
            });
        }else{
            $model =  $model->where(function ($query) use (
                $marketingMaps, 
                $marketingcheck, 
                $customercheck,
                $lhucheck,
                $datelhucheck,
                $teamcheck,
                $holdcheck) {
                $query->where('status', '=', 4);
                if(!empty($teamcheck)){
                    $query->where('id_team', $teamcheck);
                }
                if(!empty($marketingcheck) || 
                !empty($categorycheck) || 
                !empty($customercheck) ||
                !empty($lhucheck) ||
                !empty($datelhucheck)|| 
                !empty($holdcheck)){
                    $query->whereIn('id_contract', $marketingMaps);
                }
            })->orwhere(function ($query) use (
                $marketingMaps, 
                $marketingcheck, 
                $customercheck,
                $lhucheck,
                $datelhucheck,
                $teamcheck,
                $holdcheck) {
                $query->where('status', '=', 3);
                if(!empty($teamcheck)){
                    $query->where('id_team', $teamcheck);
                }
                if(!empty($marketingcheck) || 
                !empty($categorycheck) || 
                !empty($customercheck) ||
                !empty($lhucheck) ||
                !empty($datelhucheck)|| 
                !empty($holdcheck)){
                    $query->whereIn('id_contract', $marketingMaps);
                }
            });
        }

        
        
        $model = $model->groupBy('id_contract')
        ->orderBy('id_contract', 'desc');

        return response()->json($model->paginate(25));

        // if(!empty($data['status'])){
        //    if(!empty($data['team'])){
        //     // $m = DB::connection('mysqlcertificate')->select('SELECT * FROM (
        //     //     select * from condition_sample_cert ) AS ww
        //     //     where ww.status = '. $data['status'].'
        //     //     and ww.id_team = '.$data['team'].'
        //     //     GROUP BY ww.id_contract');
        //     $m = DB::connection('mysqlcertificate')->select('
        //         SELECT * from condition_sample_cert 
        //         WHERE condition_sample_cert.status = '. $data['status'].'
        //         AND condition_sample_cert.id_team = '.$data['team'].'
        //         AND MONTH(condition_sample_cert.inserted_at) > 1
        //         GROUP BY condition_sample_cert.id_contract
        //     ');
        //     }else{
        //         // $m = DB::connection('mysqlcertificate')->select('SELECT * FROM (
        //         // select * from condition_sample_cert ) AS ww
        //         // where ww.status = '. $data['status'].'
        //         // GROUP BY ww.id_contract');
        //         $m = DB::connection('mysqlcertificate')->select('
        //         SELECT * from condition_sample_cert 
        //         WHERE condition_sample_cert.status = '. $data['status'].'
        //         AND MONTH(condition_sample_cert.inserted_at) > 1
        //         GROUP BY condition_sample_cert.id_contract
        //     ');
        //     }
        // }else{
        //     if(!empty($data['team'])){
        //         // $m = DB::connection('mysqlcertificate')->select('SELECT * FROM (
        //         //     select * from condition_sample_cert ) AS ww
        //         //     where ww.status = 4  and ww.id_team = '.$data['team'].' or ww.status = 3   and ww.id_team = '.$data['team'].'
        //         //     GROUP BY ww.id_contract');
        //         $m = DB::connection('mysqlcertificate')->select('SELECT * FROM condition_sample_cert 
        //         where condition_sample_cert.status = 4  and condition_sample_cert.id_team = '.$data['team'].' AND MONTH(condition_sample_cert.inserted_at) > 1 
        //                 or condition_sample_cert.status = 3   and condition_sample_cert.id_team = '.$data['team'].' AND MONTH(condition_sample_cert.inserted_at) > 1
        //         GROUP BY condition_sample_cert.id_contract');
        //     }else{
        //         $m = DB::connection('mysqlcertificate')->select('SELECT * FROM condition_sample_cert
        //         where condition_sample_cert.status = 4  AND MONTH(condition_sample_cert.inserted_at) > 2 or condition_sample_cert.status = 3  AND MONTH(condition_sample_cert.inserted_at) > 2
        //         GROUP BY condition_sample_cert.id_contract');
        //     }

        // }
        
        
        // $model = $model->where('status', 4)
        // ->orWhere('status', 3)
        // ->groupBy('id_contract');

        // // if(!empty($data['marketing'])){
        // //     $marketing = $data['marketing'];
        // //     $model = $model->whereHas('contract_master',function($query) use ($marketing){
        // //             $query->where(\DB::raw('UPPER(contract_no)'),'like','%'.$marketing.'%');
        // //     });
        // // }

        // $model = $model->paginate(100);
        // return response()->json($model);

        // $result = array_map(function ($m) {
        //     return $m->id_contract;
        // }, $m);


        // $model = Kontrakuji::with([
        //     'customers_handle',
        //     'customers_handle.customers',
        //     'customers_handle.contact_person',
        //     'contract_category',
        //     'conditionContractCertificate',
        //     'count_samplelab',
        //     'conditionContractCert',
        //     'conditionContractCert.team',
        //     ])
        // ->whereIn('id_kontrakuji',$result);

        // if(!empty($data['marketing'])){
        //     $model=$model->where(\DB::raw('UPPER(contract_no)'),'like','%'.$data['marketing'].'%');
        // }

        //  if(!empty($data['category'])){
        //     $model = $model->where('id_contract_category',$data['category']);
        // }

        // if(!empty($data['customer_name'])){
        //     $customer_name = $data['customer_name'];
        //     $model = $model->whereHas('customers_handle',function($query) use ($customer_name){
        //             $query->where('id_customer', $customer_name);
        //     });
        // }

        // if(!empty($data['lhu'])){
        //     $arrayin = array();

        //     $check = Ecertlhu::with(['ConditionCert'])->where('lhu_number', 'LIKE', '%'.$data['lhu'].'%')->get()->toArray();
        //     foreach ($check as $c) {
        //         foreach( $c['condition_cert'] as $d){
        //             array_push($arrayin, $d['id_contract']);
        //         }
        //     }
        //     $model = $model->whereIn('id_kontrakuji',$arrayin);
        // }

        // if(empty($data['category']) && 
        // empty($data['customer_name']) && 
        // empty($data['lhu']) && 
        // empty($data['marketing']) && 
        // empty($data['status']) && 
        // empty($data['team']) )
        // {
        //     $model = $model->whereMonth('created_at', date('m'))
        //     ->whereYear('created_at', date('Y'));
        // }

        // $model = $model->groupBy('id_kontrakuji');
        // return response()->json($model->paginate(25));
    }

    public function archiveDetail(Request $request, $id_contract)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');   

        $lhu = $data['lhu'];
        $no_sample = $data['no_sample'];
        $nama_sample = $data['nama_sample'];

        
        $model = ConditionCert::with([
            'transaction_sample_cert',
            'transaction_sample_cert.status_pengujian',
            'transaction_sample_cert.ConditionCert',
            'transaction_sample_cert.TransactionSample.status_lab',
            'Akgdatas'
        ])->where('id_contract', $id_contract)->where('status', 4);

        $model->where(function ($query) use ($id_contract, $lhu, $no_sample, $nama_sample) {
            $query->where('id_contract', $id_contract)->where('status', 4);
            if(!empty($lhu)){
                $query = $query->whereHas('transaction_sample_cert',function($q) use ($lhu){
                         $q->where(\DB::raw('UPPER(lhu_number)'),'like','%'.$lhu.'%');
                });
            }
    
            if(!empty($no_sample)){
                $query = $query->whereHas('transaction_sample_cert',function($q) use ($no_sample){
                         $q->where(\DB::raw('UPPER(no_sample)'),'like','%'.$no_sample.'%');
                });
            }
    
            if(!empty($nama_sample)){
                $query = $query->whereHas('transaction_sample_cert',function($q) use ($nama_sampleple){
                         $q->where(\DB::raw('UPPER(sample_name)'),'like','%'.$sample.'%');
                });
            }
        });
        $model->orWhere(function ($query) use ($id_contract, $lhu, $no_sample, $nama_sample) {
            $query->where('id_contract', $id_contract)->where('status', 3);
            if(!empty($lhu)){
                $query = $query->whereHas('transaction_sample_cert',function($q) use ($lhu){
                         $q->where(\DB::raw('UPPER(lhu_number)'),'like','%'.$lhu.'%');
                });
            }
    
            if(!empty($no_sample)){
                $query = $query->whereHas('transaction_sample_cert',function($q) use ($no_sample){
                         $q->where(\DB::raw('UPPER(no_sample)'),'like','%'.$no_sample.'%');
                });
            }
    
            if(!empty($nama_sample)){
                $query = $query->whereHas('transaction_sample_cert',function($q) use ($nama_sampleple){
                         $q->where(\DB::raw('UPPER(sample_name)'),'like','%'.$sample.'%');
                });
            }
        });

        

        $model = $model->whereHas('transaction_sample_cert',function($query){
            $query->orderBy(DB::raw('CAST(SUBSTRING_INDEX(no_sample, ".", -1) AS UNSIGNED)'), 'desc');
        });
        
        return response()->json($model->paginate(500));
    }




    public function samplecertinfo(Request $request){
            try {
                $test = $request->input('id_contract');
                $data = DB::connection('mysqlcertificate')
                ->select('
                SELECT a.sample_name, a.no_sample, a.cl_number, a.lhu_number, a.kode_sample, a.batch_number, a.nama_pabrik, a.alamat_pabrik, a.no_notifikasi, a.no_pengajuan, a.no_registrasi, a.no_principalcode, a.nama_dagang, a.lot_number, a.jenis_kemasan FROM (
                    SELECT * FROM (
                        SELECT * FROM condition_sample_cert c WHERE c.id_contract = '. $test .')  AS cc
                    GROUP BY cc.id_transaction_cert ) AS ccc
                LEFT JOIN transaction_sample_cert a ON a.id = ccc.id_transaction_cert
                ');

                return response()->json($data);

            } catch (\Exception $e){
                return response()->json($e->getMessage());
            }
    }

    public function uploadAkg(Request $request)
    {
        try{
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');
            $id = $request->input('id');
            $file = $request->input('file');

            $sample_cert = Ecertlhu::where('id', $id)->first();

            $sample_lab = TransactionSample::with('kontrakuji')->where('id', $sample_cert->id_transaction_sample)->first();

            if($sample_cert->lhu_number == null || $sample_cert->lhu_number == ''){
                $data=array(
                    'success'=>false,
                    'message'=>'LHU numbers cannot be empty'
                );
                return response()->json($data);
            }
            else{
                $foldername = $sample_lab->kontrakuji->contract_no.'/akg';
                if (! File::exists($foldername)) {
                    File::makeDirectory(public_path().'/'.$foldername,0777,true);
                }
                $pathname = ''.$sample_lab->kontrakuji->contract_no.'-'.($sample_cert->lhu_number .'-'.time::now()->format('His') ).'.pdf';
                $attachment = new Akgfile;
                $attachment->fileakg = $pathname;
                $attachment->id_transaction_sample = $id;
                $attachment->id_user = $id_user;
                $attachment->id_contract = $sample_lab->kontrakuji->id_kontrakuji;
                $attachment->inserted_at = time::now();
                $attachment->save();
                $file = substr($file, strpos($file, ',') + 1);
                $test = base64_decode($file);
                $gas = File::put($foldername .'/'. $pathname, $test);
                $data=array(
                    'success'=>true,
                    'message'=>'Upload Success'
                );
                return response()->json($data);
        }

        }
        catch(\Exception $e){
            $data=array(
                'success'=>false,
                'message'=>'Data Not Found'
            );
            return response()->json($data);
        }
    }

    public function allAkgData(Request $request)
    {
        try{
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            $model = Akgfile::with(['Ecertlhu', 'user'])->where('id_contract', $data['idcontract']);
            return response()->json($model->paginate(25));

        }
        catch(\Exception $e){
            $data=array(
                'success'=>false,
                'message'=>'Data Not Found'
            );
            return response()->json($data);
        }

    }

   public function deleteAkg(Request $request)
   {
        try {
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');


            $model = AkgFile::with(['Ecertlhu', 'kontrakuji'])->where('id', $data)->first();
            $foldername = $model->kontrakuji->contract_no.'/akg';
            $pathname = ''.$model->fileakg;
            File::delete($foldername.'/'. $pathname);

            $model->delete();

            $message = array(
                'success'=>true,
                'message'=>'Delete Success'
            );
            return response()->json($message);
        }
        catch(\Exception $e){
            $data=array(
                'success'=>false,
                'message'=>'Update Error'
            );
            return response()->json($data);
        }
   }

   public function sendEmailAkg(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        return $data;
    }

    public function changeCondition(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');
        $form = $request->input('form');

        foreach($data['data'] as $d){

            // add new condition
            $conditions = ConditionCert::where('id_transaction_cert', $d['id'])->orderBy('id', 'desc')->first();
      
            $s = Ecertlhu::where('id', $d['id'])->first();

            $click = New ClickHistory;
            $click->id_user = $id_user;
            $click->id_lhp = $s->id;
            $click->created_at = time::now();
            $click->save();

            $addLhu = new RevEcertlhu;
            $addLhu->id_sample_cert = $s->id;
            $addLhu->id_transaction_sample = $s->id_transaction_sample;
            $addLhu->format = $s->format;
            $addLhu->cl_number = $s->cl_number;
            $addLhu->lhu_number = $s->lhu_number;
            $addLhu->customer_name = $s->customer_name;
            $addLhu->customer_address = $s->customer_address;
            $addLhu->customer_telp = $s->customer_telp;
            $addLhu->contact_person = $s->contact_person;
            $addLhu->sample_name = $s->sample_name;
            $addLhu->no_sample = $s->no_sample;
            $addLhu->kode_sample = $s->kode_sample;
            $addLhu->batch_number = $s->batch_number;
            $addLhu->tgl_input = $s->tgl_input;
            $addLhu->tgl_mulai = $s->tgl_mulai;
            $addLhu->tgl_selesai = $s->tgl_selesai;
            $addLhu->tgl_estimasi_lab = $s->tgl_estimasi_lab;
            $addLhu->nama_pabrik = $s->nama_pabrik;
            $addLhu->alamat_pabrik = $s->alamat_pabrik;
            $addLhu->no_notifikasi = $s->no_notifikasi;
            $addLhu->no_pengajuan = $s->no_pengajuan;
            $addLhu->no_registrasi = $s->no_registrasi;
            $addLhu->no_principalcode = $s->no_principalcode;
            $addLhu->nama_dagang = $s->nama_dagang;
            $addLhu->lot_number = $s->lot_number;
            $addLhu->jenis_kemasan = $s->jenis_kemasan;
            $addLhu->tgl_produksi = $s->tgl_produksi;
            $addLhu->tgl_kadaluarsa = $s->tgl_kadaluarsa;
            $addLhu->id_tujuanpengujian = $s->id_tujuanpengujian;
            $addLhu->id_statuspengujian = $s->id_statuspengujian;
            $addLhu->id_subcatalogue = $s->id_subcatalogue;
            $addLhu->print_info = $s->print_info;
            $addLhu->keterangan_lain = $s->keterangan_lain;
            $addLhu->metode = $s->metode;
            $addLhu->location = $s->location;
            $addLhu->pic = $s->pic;
            $addLhu->kondisi_lingkungan = $s->kondisi_lingkungan;
            $addLhu->tgl_sampling = $s->tgl_sampling;
            $addLhu->urutan = $s->urutan;
            $addLhu->cert_info = $s->cert_info;
            $addLhu->reason = $form['reason'];
            $addLhu->save();

            if($conditions->status != 3) {
                if(!preg_match("/LHPR/i", $s->lhu_number)) {
                    $s->cl_number = str_replace('CL', 'CLR', $s->cl_number);
                    $s->lhu_number = str_replace('LHP', 'LHPR', $s->lhu_number);                
                    $s->save();
                }  
            } 

            // copy data condition
            $c = ConditionCert::where('id_transaction_cert', $conditions->id_transaction_cert)->first();

            $addCondition = new RevConditionCert;
            $addCondition->id_transaction_cert = $c->id_transaction_cert;
            $addCondition->id_contract = $c->id_contract;
            $addCondition->status = $c->status;
            $addCondition->cert_status = $form['condition'];
            $addCondition->user_id = $c->user_id;
            $addCondition->id_team = $c->id_team;
            $addCondition->inserted_at = time::now();
            $addCondition->save();

            $con = ConditionCert::where('id_transaction_cert', $d['id'])->get();
            foreach($con as $cc){
                $c = ConditionCert::where('id_transaction_cert', $cc->id_transaction_cert)->first();
                $c->delete();
            }

            // copy data parameter
            $ps = ParameterCert::where('id_transaction_sample',  $conditions->id_transaction_cert)->get();
            foreach($ps as $p){
                $addParameter = new RevParameterCert;
                $addParameter->id_transaction_sample = $p->id_transaction_sample;
                $addParameter->id_parameteruji = $p->id_parameteruji;
                $addParameter->parameteruji_id = $p->parameteruji_id;
                $addParameter->parameteruji_en = $p->parameteruji_en;
                $addParameter->simplo = $p->simplo;
                $addParameter->duplo = $p->duplo;
                $addParameter->triplo = $p->triplo;
                $addParameter->hasiluji = $p->hasiluji;
                $addParameter->standart = $p->standart;
                $addParameter->lod = $p->lod;
                $addParameter->lab = $p->lab;
                $addParameter->unit = $p->unit;
                $addParameter->metode = $p->metode;
                $addParameter->m = $p->m;
                $addParameter->c = $p->c;
                $addParameter->mm = $p->mm;
                $addParameter->n = $p->n;
                $addParameter->format_hasil = $p->format_hasil;
                $addParameter->status = $p->status;
                $addParameter->info_id = $p->info_id;
                $addParameter->position = $p->position;
                $addParameter->save();
            }

            $addNewCondition = new ConditionCert;
            $addNewCondition->id_transaction_cert = $conditions->id_transaction_cert;
            $addNewCondition->id_contract = $conditions->id_contract;
            $addNewCondition->status = 1;
            $addNewCondition->cert_status = $form['condition'];
            $addNewCondition->user_id = $conditions->user_id;
            $addNewCondition->id_team = $conditions->id_team;
            $addNewCondition->inserted_at = time::now();
            $addNewCondition->save();
        }

        $message = array(
            'success'=>true,
            'message'=>'Data Success'
        );
        return response()->json($message);



    }

    public function changeConditionDraft(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');
        $form = $request->input('form');

        foreach($data['data'] as $d){
            $model = ConditionCert::where('id_transaction_cert', $d['id'])->orderBy('id', 'desc')->first();

            if($model['status'] == 3){
                // code here
                $s = Ecertlhu::where('id', $d['id'])->first();

                $click = New ClickHistory;
                $click->id_user = $id_user;
                $click->id_lhp = $s->id;
                $click->created_at = time::now();
                $click->save();

                $addLhu = new RevEcertlhu;
                $addLhu->id_sample_cert = $s->id;
                $addLhu->id_transaction_sample = $s->id_transaction_sample;
                $addLhu->format = $s->format;
                $addLhu->cl_number = $s->cl_number;
                $addLhu->lhu_number = $s->lhu_number;
                $addLhu->customer_name = $s->customer_name;
                $addLhu->customer_address = $s->customer_address;
                $addLhu->customer_telp = $s->customer_telp;
                $addLhu->contact_person = $s->contact_person;
                $addLhu->sample_name = $s->sample_name;
                $addLhu->no_sample = $s->no_sample;
                $addLhu->kode_sample = $s->kode_sample;
                $addLhu->batch_number = $s->batch_number;
                $addLhu->tgl_input = $s->tgl_input;
                $addLhu->tgl_mulai = $s->tgl_mulai;
                $addLhu->tgl_selesai = $s->tgl_selesai;
                $addLhu->tgl_estimasi_lab = $s->tgl_estimasi_lab;
                $addLhu->nama_pabrik = $s->nama_pabrik;
                $addLhu->no_notifikasi = $s->no_notifikasi;
                $addLhu->no_pengajuan = $s->no_pengajuan;
                $addLhu->no_registrasi = $s->no_registrasi;
                $addLhu->no_principalcode = $s->no_principalcode;
                $addLhu->nama_dagang = $s->nama_dagang;
                $addLhu->lot_number = $s->lot_number;
                $addLhu->jenis_kemasan = $s->jenis_kemasan;
                $addLhu->tgl_produksi = $s->tgl_produksi;
                $addLhu->tgl_kadaluarsa = $s->tgl_kadaluarsa;
                $addLhu->id_tujuanpengujian = $s->id_tujuanpengujian;
                $addLhu->id_statuspengujian = $s->id_statuspengujian;
                $addLhu->id_subcatalogue = $s->id_subcatalogue;
                $addLhu->print_info = $s->print_info;
                $addLhu->keterangan_lain = $s->keterangan_lain;
                $addLhu->metode = $s->metode;
                $addLhu->location = $s->location;
                $addLhu->pic = $s->pic;
                $addLhu->kondisi_lingkungan = $s->kondisi_lingkungan;
                $addLhu->tgl_sampling = $s->tgl_sampling;
                $addLhu->urutan = $s->urutan;
                $addLhu->cert_info = $s->cert_info;
                $addLhu->reason = $form['reason'];
                $addLhu->save();
                
                
                // copy data condition
            $c = ConditionCert::where('id_transaction_cert', $model->id_transaction_cert)->first();

            $addCondition = new RevConditionCert;
            $addCondition->id_transaction_cert = $c->id_transaction_cert;
            $addCondition->id_contract = $c->id_contract;
            $addCondition->status = $c->status;
            $addCondition->cert_status = $form['condition'];
            $addCondition->user_id = $c->user_id;
            $addCondition->id_team = $c->id_team;
            $addCondition->inserted_at = time::now();
            $addCondition->save();

            $con = ConditionCert::where('id_transaction_cert', $d['id'])->get();
             foreach($con as $cc){
                $c = ConditionCert::where('id_transaction_cert', $cc->id_transaction_cert)->first();
                $c->delete();
              }

            // copy data parameter
            $ps = ParameterCert::where('id_transaction_sample',  $model->id_transaction_cert)->get();
            foreach($ps as $p){
                $addParameter = new RevParameterCert;
                $addParameter->id_transaction_sample = $p->id_transaction_sample;
                $addParameter->id_parameteruji = $p->id_parameteruji;
                $addParameter->parameteruji_id = $p->parameteruji_id;
                $addParameter->parameteruji_en = $p->parameteruji_en;
                $addParameter->simplo = $p->simplo;
                $addParameter->duplo = $p->duplo;
                $addParameter->triplo = $p->triplo;
                $addParameter->hasiluji = $p->hasiluji;
                $addParameter->standart = $p->standart;
                $addParameter->lod = $p->lod;
                $addParameter->lab = $p->lab;
                $addParameter->unit = $p->unit;
                $addParameter->metode = $p->metode;
                $addParameter->m = $p->m;
                $addParameter->c = $p->c;
                $addParameter->mm = $p->mm;
                $addParameter->n = $p->n;
                $addParameter->format_hasil = $p->format_hasil;
                $addParameter->status = $p->status;
                $addParameter->info_id = $p->info_id;
                $addParameter->position = $p->position;
                $addParameter->save();
            }

            $addNewCondition = new ConditionCert;
            $addNewCondition->id_transaction_cert = $model->id_transaction_cert;
            $addNewCondition->id_contract = $model->id_contract;
            $addNewCondition->status = 1;
            $addNewCondition->cert_status = $form['condition'];
            $addNewCondition->user_id = $model->user_id;
            $addNewCondition->id_team = $model->id_team;
            $addNewCondition->inserted_at = time::now();
            $addNewCondition->save();
                // end code
            }
        }

        $data=array(
            'success'=>true,
            'message'=>'Success Bachtiar'
        );

        return response()->json($data);
    }

    public function uploadAttachmentRev(Request $request)
    {

        try{
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $response = null;
            $data = (object) ['file' => ""];
            $id = $request->input('id');

            $sample_cert = Ecertlhu::where('id', $id)->first();
            $sample_lab = TransactionSample::with('kontrakuji')
                          ->where('id', $sample_cert->id_transaction_sample)
                          ->first();

            if($sample_cert->lhu_number == null || $sample_cert->lhu_number == ''){
                $data=array(
                    'success'=>false,
                    'message'=>'LHU numbers cannot be empty'
                );
                return response()->json($data);
            }
            else{

                if ($request->hasFile('file')) {
            
                    $original_filename = $request->file('file')->getClientOriginalName();
                    $original_filename_arr = explode('.', $original_filename);
                    $withoutExt = preg_replace('/\\.[^.\\s]{3,4}$/', '', $original_filename);
                    
                    $file_ext = end($original_filename_arr);
                    $destination_path = 'certificate/'. time::now()->format('Y').'/'.time::now()->format('m').'/' . $sample_lab->kontrakuji->contract_no.'/attachment/';
                    $namedirectory = str_replace(' ', '', $withoutExt) .'.'. $file_ext;
                    $filename = str_replace(' ', '', $withoutExt);
                    $pathname = ''.$sample_lab->kontrakuji->contract_no.'-'.($sample_cert->lhu_number .'-'.time::now()->format('His') ).'.'.$file_ext;
                    
                    if ($request->file('file')->move($destination_path, $pathname)) {        
                       
                        $attachment = new AttachmentRevFile;
                        $attachment->file = $pathname;
                        $attachment->id_transaction_sample = $id;
                        $attachment->id_user = $id_user;
                        $attachment->title = $sample_cert->lhu_number .'-'. time::now()->format('His') ;
                        $attachment->created_at = time::now();
                        $attachment->save();        
                        return $this->responseRequestSuccess($data, $attachment);

                    } else {
                        return $this->responseRequestError('Cannot upload file');
                    }
                } else {
                    return $this->responseRequestError('File not found');
                }

                $data=array(
                    'success'=>true,
                    'message'=>'Upload Success'
                );
                return response()->json($data);
            }
        } catch(\Exception $e){
            $data=array(
                'success'=>false,
                'message'=>'Data Not Found'
            );
            return response()->json($data);
        }
    }

    protected function responseRequestSuccess($ret, $setAttachment)
    {
        return response()->json(['status' => 'success', 'data' => $ret, 'file' => $setAttachment], 200)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    }

    protected function responseRequestError($message = 'Bad request', $statusCode = 200)
    {
        return response()->json(['status' => 'error', 'error' => $message], $statusCode)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    }

    public function attachmentData(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = AttachmentRevFile::where('id_transaction_sample', $data['id'])->paginate(100);
        return response()->json($model);
    }

    public function revisionHistory(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        // $model = Ecertlhu::where('id', $data['id'])->paginate(50);

        $model = Ecertlhu::with([
            'TransactionSample',
            'TransactionSample.kontrakuji',
         ])->where('id', $data['id'])
         ->paginate(50);


        return response()->json($model);
    }

    public function getListAddress(Request $request)
    {

        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $idcust = $request->input('id');

        $model = CustomerAddress::where('customer_id', $idcust)
        ->paginate(50);

        return $model;
    }

    public function ContactPerson(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $idcust = $request->input('id');

        $model = Customerhandle::with('contact_person')
        ->where('id_customer', $idcust)
        ->paginate(50);

        return response()->json($model);
    }

    public function getParameterinLab(Request $request, $id)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');


        $model = Ecertlhu::where('id', $data)->first();
        $paramlab = Transaction_parameter::with([
            'parameteruji',
            'metode',
            'lod',
            'unit',
            'standart',
            'lab'
            ])
        ->where('id_sample', $model->id_transaction_sample)
        ->get();

        foreach($paramlab as $lab )
        {
            $check = ParameterCert::where('id_parameteruji', $lab->id_parameteruji)->where('id_transaction_sample', $data)->count();
            if($check == 0){
                $add = New ParameterCert;
                $add->id_transaction_sample = $model->id;
                $add->id_parameteruji       = $lab->id_parameteruji;
                $add->parameteruji_id       = $lab->parameteruji->name_id;
                $add->parameteruji_en       = $lab->parameteruji->name_en;
                $add->simplo                = $lab->simplo;
                $add->duplo                 = $lab->duplo;
                $add->triplo                = $lab->triplo;
                $add->hasiluji              = $lab->hasiluji;
                $add->standart              = $lab->standart == '' ||  $lab->standart == null ? '-' : $lab->standart->nama_standart;
                $add->lod                   = $lab->lod == '' ||  $lab->lod == null ? '-' : $lab->lod->nama_lod;
                $add->lab                   = $lab->lab == '' ||  $lab->lab == null ? '-' : $lab->lab->nama_lab;
                $add->unit                  = $lab->unit == '' ||  $lab->unit == null ? '-' : $lab->unit->nama_unit;
                $add->metode                = $lab->metode == '' ||  $lab->metode == null ? '-' : $lab->metode->metode;
                $add->m                     = '';
                $add->mm                    = '';
                $add->n                     = '';
                $add->c                     = '';
                $add->format_hasil          = $lab->format_hasil;
                $add->status                = $lab->status;
                $add->info_id               = $lab->info_id;
                $add->position              = $lab->position;

                $add->desc                   = $lab->desc;

                $add->save();
            }
        }
        $data=array(
            'success'=>true,
            'message'=>'Upload Success'
        );

        return response()->json($data);
    }

    public function getParameterHasBeenDelete(Request $request, $id)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $onlySoftDeleted = ParameterCert::onlyTrashed()->where('id_transaction_sample', $data)->get();
        foreach($onlySoftDeleted as $item){
            $oneData = ParameterCert::withTrashed()->where('id', $item->id)->restore();

        }
        $data=array(
            'success'=>true,
            'message'=>'Data Restore'
        );

        return response()->json($data);

    }

    public function copyDataParameter(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');
        $id = $request->input('id');

       $add = New ParameterCert;
       $add->id_transaction_sample = $id;
       $add->id_parameteruji       = $data['id_parameteruji'];
       $add->parameteruji_id       = $data['parameteruji_id'];
       $add->parameteruji_en       = $data['parameteruji_en'];
       $add->simplo                = $data['simplo'];
       $add->duplo                 = $data['duplo'];
       $add->triplo                = $data['triplo'];
       $add->hasiluji              = $data['hasiluji'];
       $add->standart              = $data['standart'];
       $add->lod                   = $data['lod'];
       $add->lab                   = $data['lab'];
       $add->unit                  = $data['unit'];
       $add->metode                = $data['metode'];
       $add->m                     = $data['m'];
       $add->mm                    = $data['mm'];
       $add->n                     = $data['n'];
       $add->c                     = $data['c'];
       $add->format_hasil          = $data['format_hasil'];
       $add->status                = $data['status'];
       $add->info_id               = $data['info_id'];
       $add->position              = $data['position'];
       $add->save();

       $data=array(
        'success'=>true,
        'message'=>'Add Success'
        );
        return response()->json($data);
    }

    public function removeAttachment(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');


        $model = AttachmentRevFile::where('id', $data['id'])->first();
        $lhu = ConditionCert::where('id_transaction_cert', $data['id_transaction_sample'])->first();
        $kont = Kontrakuji::where('id_kontrakuji', $lhu->id_contract)->first();
        
        $pathImg = public_path().'/certificate/'. time::now()->format('Y').'/'.time::now()->format('m').'/'. $kont->contract_no .'/attachment/'.$data['file'];
      
       
        if (File::exists($pathImg)) {
            File::delete($pathImg);
        }

        $model->delete();

        $message = array(
            'status' => true,
            'message' => 'success'
        );

        return response()->json($message);
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // TRACK /////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////

    public function track(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');
        $employee = Employee::where('user_id', $id_user)->first();
        
    
        $array = array();

        if(!empty($data['lhu']) || !empty($data['lhu_date'])){

            $lhunumber = Ecertlhu::select('*');

            if(!empty($data['lhu'])){
                $lhunumber = $lhunumber->where('lhu_number', 'LIKE', '%'.$data['lhu'].'%');
            }

            if(!empty($data['lhu_date'])){
            $lhunumber = $lhunumber->where('date_at', date('Y-m-d',strtotime($data['lhu_date'])) );
            }

            $lhunumber = $lhunumber->get()->toArray();

            $arrayLhu = array_map(function ($lhunumber) {
                return $lhunumber['id'];
            }, $lhunumber);

            $implodeArray = implode(",", $arrayLhu);
        }

        if(!empty($data['lhu']) || !empty($data['lhu_date'])){
            if(!empty($data['team'])){
                $m = DB::connection('mysqlcertificate')
                ->select('SELECT * FROM (    
                    SELECT * FROM (
                        SELECT * FROM (
                            SELECT * FROM (
                                SELECT b.* FROM condition_sample_cert b
                                WHERE b.id_transaction_cert IN ('.$implodeArray.')
                                GROUP BY b.id
                                ORDER BY b.id DESC ) AS zz
                            GROUP BY zz.id_transaction_cert) AS aa
                        WHERE aa.status <> 4 ) cc
                    GROUP BY cc.id_contract
                    ORDER BY cc.id_contract DESC ) AS aak
                    WHERE aak.id_team = '. $data['team']);
            }else{
                $m = DB::connection('mysqlcertificate')
                ->select(' SELECT * FROM (
                    SELECT * FROM (
                        SELECT * FROM (
                            SELECT b.* FROM condition_sample_cert b
                            WHERE b.id_transaction_cert IN ('.$implodeArray.')
                            GROUP BY b.id
                            ORDER BY b.id DESC ) AS zz
                        GROUP BY zz.id_transaction_cert) AS aa
                    WHERE aa.status <> 4 ) cc
                GROUP BY cc.id_contract
                ORDER BY cc.id_contract DESC');
            }
        }else{
           if(!empty($data['team'])){
            $m = DB::connection('mysqlcertificate')
            ->select('SELECT * FROM (    
                SELECT * FROM (
                    SELECT * FROM (
                        SELECT * FROM (
                            SELECT b.* FROM condition_sample_cert b
                            GROUP BY b.id
                            ORDER BY b.id DESC ) AS zz
                        GROUP BY zz.id_transaction_cert) AS aa
                    WHERE aa.status <> 4 ) cc
                GROUP BY cc.id_contract
                ORDER BY cc.id_contract DESC ) AS aak
                WHERE aak.id_team ='. $data['team']);
           }else{
            $m = DB::connection('mysqlcertificate')
            ->select('SELECT * FROM (
                SELECT * FROM (
                    SELECT * FROM (
                        SELECT b.* FROM condition_sample_cert b
                        GROUP BY b.id
                        ORDER BY b.id DESC ) AS zz
                    GROUP BY zz.id_transaction_cert) AS aa
                WHERE aa.status <> 4 ) cc
            GROUP BY cc.id_contract
            ORDER BY cc.id_contract DESC');
           }
        }

        

        $result = array_map(function ($m) {
            return $m->id_contract;
        }, $m);

        $model = Kontrakuji::with([
            'contract_category',
            'customers_handle',
            'customers_handle.customers',
            'customers_handle.contact_person',
            'count_samplelab',
            'conditionContractCert',
            'conditionContractCert.team',
        ])->whereIn('id_kontrakuji',$result);


        if(!empty($data['marketing'])){
            $model=$model->where(\DB::raw('UPPER(contract_no)'),'like','%'.$data['marketing'].'%');
        }

        if(!empty($data['hold'])){
            $model=$model->where('hold', $data['hold']);
        }


        if(!empty($data['customer_name'])){
            $customer_name = $data['customer_name'];
            $model = $model->whereHas('customers_handle',function($query) use ($customer_name){
                    $query->where('id_customer', $customer_name);
            });
        }

        if(!empty($data['type'])){
            if($data['type']=='all'){
                $model=$model->get();
            } else {
                $model=$model->paginate(25);
            }
        }
        return response()->json($model);
    }


    public function getSampleFollow(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $m = ConditionContractNew::with('conditionCert')->selectRaw('*')
            ->where('sample_id', '<>', 0)
            ->where('status', 1)
            ->where('groups', 'LAB')
            ->where('position', 4)
            ->get()
            ->toArray();

            $array = array();

            foreach($m as $asd){

                if($asd['condition_cert'] == '' || $asd['condition_cert'] == null){
                    array_push($array, $asd);
                }
            }

            return $array;

    }

    public function getDraftforAuto()
    {

        $dateNow = new Carbon(date('Y-m-d'));
        $getDate = date('Y-m-d', strtotime('-6days', strtotime($dateNow)));
        $getDraft = Ecertlhu::select('id')->where('date_at', $getDate)->get()->toArray();
       
        $result = array_map(function ($getDraft) {
            return $getDraft['id'];
        }, $getDraft);       

        $arr = implode(",", $result);

        $cond = DB::connection('mysqlcertificate')
        ->select('
        SELECT dd.id_transaction_cert FROM (
            SELECT * FROM (
                SELECT b.* FROM condition_sample_cert b
                WHERE b.id_transaction_cert IN ('. $arr .')
                GROUP BY b.id
                ORDER BY b.id DESC ) AS zz
            GROUP BY zz.id_transaction_cert
            ORDER BY zz.id_transaction_cert DESC) AS dd
        WHERE dd.status = 3');

        $resultCond = array_map(function ($cond) {
            return $cond->id_transaction_cert;
        }, $cond);   

        $notAvaliable = RevEcertlhu::whereIn('id_sample_cert', $resultCond)->get()->toArray();
        $z = array_diff($resultCond, $notAvaliable);

        foreach($z as $a)
        {
            $conds = ConditionCert::where('id_transaction_cert', $a)->first();
            $autoGet = New AutoSend;
            $autoGet->id_certificate = $a;
            $autoGet->id_contract = $conds->id_contract;
            $autoGet->status = 0;
            $autoGet->save();
        }

        $data=array(
            'success'=>true,
            'message'=>'Draft Success'
        );

        return response()->json($data);

    }

    public function autoSendDraft()
    {
        ini_set('max_execution_time', 500);

        $dateNow = new Carbon(date('Y-m-d'));
        $getDate = date('Y-m-d', strtotime('-1days', strtotime($dateNow)));
        
        
        $getData = AutoSend::whereDate('created_at', $getDate)->where('status', 0)->groupBy('id_contract')->get();

        foreach ($getData as $data) {
            $contract = DB::table('mstr_transaction_kontrakuji as a')
            ->leftjoin('mstr_customers_handle as b', 'b.idch', '=', 'a.id_customers_handle')
            ->leftjoin('mstr_customers_customer as c', 'c.id_customer', '=', 'b.id_customer')
            ->leftjoin('mstr_customers_contactperson as d', 'd.id_cp', '=', 'b.id_cp')
            ->where('a.id_kontrakuji',$data->id_contract)
            ->select(
                'a.id_kontrakuji',
                'a.contract_no',
                'a.id_customers_handle',
                'b.idch',
                'b.email',
                'c.id_customer',
                'c.customer_name',
                'd.id_cp',
                'd.name',
                'a.hold')
            ->first();

            $samp = AutoSend::select('id_certificate')->where('status', 0)->where('id_contract', $data->id_contract)->get();
            
            $array = array();

            foreach ($samp as $d) {
                array_push($array, $d['id_certificate']);
            }

            $cert = Ecertlhu::whereIn('id', $array)->get();
       
            $senddata = array(
                'contract' => $contract,
                'cert' =>  $cert,
                'enkripsi' => '',
            );

            try{
                Mail::send('certificate/release', $senddata, function($message) use($contract) {
                    $message->to(preg_replace('/\s+/', '', $contract->email), $contract->name)->subject('Status Certificate, '. $contract->contract_no . ' Auto Release');
                    $message->bcc('admin.sig@saraswanti.com', 'Admin Sertifikat');
                    $message->bcc('bachtiar.sig@saraswanti.com', 'Bachtiar Oktavian');
                    $message->from('certificate@sigconnect.co.id','SIG Connect');
                });
                $stats = 1;
                $stats_cert = 4;
            }catch(\Exception $e){
                    Mail::send('certificate/failedmail', $senddata, function($message) use($contract) {
                        $message->to('admin.sig@saraswanti.com', $contract->name)->subject('Failed Sending Email With Contract Number, '. $contract->contract_no);
                        $message->bcc('bachtiar.sig@saraswanti.com', 'Bachtiar Oktavian');
                        $message->from('certificate@sigconnect.co.id','SIG Connect');
                    });
                $stats = 3;
                $stats_cert = 3;
            }  

            $change_status = AutoSend::where('status', 0)->where('id_contract', $data->id_contract)->get();
            foreach ($change_status as $changes) {
                $get = AutoSend::where('id', $changes->id)->first();
                $get->status = $stats;
                $get->save();

                $cond = ConditionCert::where('id_transaction_cert', $changes->id_certificate)->orderBy('id', 'desc')->first();
                $create = New ConditionCert;
                $create->id_transaction_cert = $cond->id_transaction_cert;
                $create->id_contract = $cond->id_contract;
                $create->status = $stats_cert;
                $create->user_id = 1;
                $create->cert_status = $cond->cert_status;
                $create->id_team = $cond->id_team;
                $create->inserted_at = time::now();
                $create->save();
            } 
            
          
        }

        $data=array(
            'success'=>true,
            'message'=>'Certificate Success to Create'
        );

        return response()->json($data);



    }

    public function getDataForApp(Request $request)
    {

        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = Autosend::with([
            'certificate.ConditionCert.team',
            'contract.customers_handle',
            'contract.customers_handle.customers',
            'contract.customers_handle.contact_person',
            'contract.customers_handle.address_customer'
        ]);


        if(!empty($data['contract'])){
            $contract = Kontrakuji::where(\DB::raw('UPPER(contract_no)'),'like','%'.$data['contract'].'%')->get()->toArray();         

            $resultcontract= array_map(function ($contract) {
                return $contract['id_kontrakuji'];
            }, $contract);

            $model = $model->whereIn('id_contract', $resultcontract);
        }

        if(!empty($data['customer'])){
            $customer = Customerhandle::where('id_customer', $data['customer'])->get()->toArray();
           
            $resultcustomer= array_map(function ($customer) {
                return $customer['idch'];
            }, $customer);

            $kontrakuji = Kontrakuji::whereIn('id_customers_handle', $resultcustomer)->get()->toArray();     
            $checkkontrak= array_map(function ($kontrakuji) {
                return $kontrakuji['id_kontrakuji'];
            }, $kontrakuji);
            $model = $model->whereIn('id_contract', $checkkontrak); 

        }

        if(!empty($data['status'])){
            $model = $model->where('status',$data['status']);
        }

        
        if(!empty($data['date'])){
            $model = $model->whereDate('created_at', date('Y-m-d',strtotime($data['date'])));
        }


        $model = $model->paginate(50);

        return response()->json($model);
    }

    public function removeAutosend(Request $request)
    {
        
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        foreach($data as $d)
        {
            $mod = AutoSend::where('id', $d['id'])->first();
            $mod->status = 2;
            $mod->save();
        }

        $data=array(
            'success'=>true,
            'message'=>'Success Update Data'
        );

        return response()->json($data);
    }

    public function changeSelectTeam(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $condition = ConditionCert::where('id_contract', $data['id_contract'])->get();
        foreach($condition as $cond)
        {
            $change = ConditionCert::where('id', $cond['id'])->first();
            $change->id_team = $data['team'];
            $change->save();
        }
        
        $data=array(
            'success'=>true,
            'message'=>'Success Update Data'
        );

        return response()->json($data);
    }

    public function getLhuinContract(Request $request)
    {

        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');
        
        $m = DB::connection('mysqlcertificate')
            ->select('SELECT aa.id_transaction_cert FROM (
                    SELECT * FROM (
                        SELECT b.* FROM condition_sample_cert b
                        GROUP BY b.id
                        ORDER BY b.id DESC ) AS zz
                    GROUP BY zz.id_transaction_cert) AS aa
                WHERE aa.status <> 4
                AND aa.id_contract = '.$data['id_contract']);

        $result = array_map(function ($m) {
            return $m->id_transaction_cert;
        }, $m);

        $model = Ecertlhu::whereIn('id', $result)->get();

        return $model;

    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // NUTRITION FACTS /////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    public function getKontrak(Request $request)
    {   
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        try {
            $model = Kontrakuji::selectRaw('id_kontrakuji, contract_no');
                if(!empty($data['search'])){
                    $model = $model->where(\DB::raw('UPPER(contract_no)'),'like','%'.$data['search'].'%');
                }
            $model = $model->whereYear('created_at','>=', 2022)->paginate(25);

            return response()->json($model);
        }catch (\Exception $e){
            return response()->json($e->getMessage());
        }
    }

    public function GetAkg(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = AkgHeader::with([
            'akgDetail',
            'akgDetail.akgInLhu',
            'akgCondition',
            'akgCondition.user',
            'formatAkg'
            ])->where('id_contract', $data['idcontract'])
        ->paginate(50);

        return response()->json($model);
    }

    public function getLhuInAkg(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $m = DB::connection('mysqlcertificate')->select('
        SELECT cert.id_transaction_cert FROM (
            SELECT * FROM condition_sample_cert cond 
                    WHERE cond.id_contract = '. $data['id_contract'] .'
                    GROUP BY cond.id
                    ORDER BY cond.id DESC ) AS cert
            GROUP BY cert.id_transaction_cert');
        
        $result = array_map(function ($m) {
            return $m->id_transaction_cert;
        }, $m);

        $model = EcertLhu::select('id', 'lhu_number')->whereIn('id', $result)->paginate(100);
        return $model;
    }

    public function getParameterinLhu(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $c = AkgMasterParameter::select('id_parameter')->get()->toArray();
        $array = array_map(function ($c) {
            return $c['id_parameter'];
        }, $c);

        $m = ParameterCert::with([
            'AkgMaster',
            'AkgMaster.masterUnit'
        ])->where('id_transaction_sample', $data['id_lhu'])->whereIn('id_parameteruji', $array)->get();
        return response()->json($m);
    }

    public function dataLhuwithOneParameter(Request $request)
    {

        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        // $c = AkgMasterParameter::select('id_parameter')->get()->toArray();
        // $array = array_map(function ($c) {
        //     return $c['id_parameter'];
        // }, $c);

        $model = ParameterCert::with([
            'AkgMaster',
            'AkgMaster.masterUnit'])
        ->where('id', $data['data'])->first();


        return response()->json($model);
        

    }

    public function submitAkg(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $akgHeader = New AkgHeader;
        $akgHeader->format = $data['identity']['format'];
        $akgHeader->id_contract = $data['identity']['id_contracts'];
        $akgHeader->takaran_saji = $data['identity']['takaran_saji'];
        $akgHeader->bj = $data['identity']['bj'];
        $akgHeader->energi = $data['identity']['energi'];
        $akgHeader->servingperpack = $data['identity']['servingperpack'];
        $akgHeader->size = $data['identity']['size'];
        $akgHeader->id_user = $id_user;
        $akgHeader->created_at = time::now();
        $akgHeader->save();

        foreach ($data['parameter'] as $parameter) {

            $check = AkgDetail::where('id_akg_header',  $akgHeader->id)->where('id_contract', $parameter['id_contract'])->where('id_lhu', $parameter['id_lhu'])->count();

            if($check < 1){
                $akgDetail = New AkgDetail;
                $akgDetail->id_akg_header = $akgHeader->id;
                $akgDetail->id_contract = $parameter['id_contract'];
                $akgDetail->id_lhu = $parameter['id_lhu'];
                $akgDetail->created_at = time::now();
                $akgDetail->save();
            }

            $akgParameter = New AkgParameter;
            $akgParameter->id_akg_header = $akgHeader->id;
            $akgParameter->id_trans_parameter = $parameter['id'];
            $akgParameter->id_parameter = $parameter['id_parameteruji'];
            $akgParameter->satuan_akg = $parameter['unit_akg'];
            $akgParameter->satuan_lhp = $parameter['unit_lhp'];
            $akgParameter->hasil_satuan_akg = $parameter['result_akg'];
            $akgParameter->hasil_pertakaran_saji = $parameter['result_lhp'];
            $akgParameter->pencantuman = $parameter['pencantuman'];
            $akgParameter->nilai_acuan = $parameter['ref'];
            $akgParameter->persen = $parameter['akg'];
            $akgParameter->pencantuman_akg = $parameter['pencantuman_akg']; 
            $akgParameter->created_at = time::now();
            $akgParameter->save();
        }

        $akgCondition = New AkgCondition;
        $akgCondition->id_akg_header = $akgHeader->id;
        $akgCondition->status = 0;
        $akgCondition->position = 1;
        $akgCondition->id_user = $id_user;
        $akgCondition->created_at = time::now();
        $akgCondition->save();

        $msg = array(
            'success'=>true,
            'message'=>'Success Added Data'
        );

        return response()->json($msg);


    }

    public function approveAkg(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = New AkgCondition;
        $model->id_akg_header = $data;
        $model->status = 1;
        $model->position = 1;
        $model->id_user = $id_user;
        $model->save();

        $msg = array(
            'success'=>true,
            'message'=>'Success Saved Data'
        );

        return response()->json($msg);

    }

    public function akgFormat(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = Format::where('status', 2)->get();
        return $model;
    }

    public function listApproveAkg(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $m = DB::connection('mysqlcertificate')->select('
        SELECT * FROM (
			SELECT * FROM (
            SELECT * FROM akg_condition 
            GROUP BY akg_condition.id
            ORDER BY akg_condition.id DESC ) AS cond
        GROUP BY cond.id_akg_header ) AS cc
      WHERE cc.position = 1 AND cc.status = 1');

        $result = array_map(function ($m) {
            return $m->id_akg_header;
        }, $m);

        $model = AkgHeader::with([
            'contract',
            'akgDetail',
            'akgDetail.akgInLhu',
            'akgCondition',
            'akgCondition.user',
            'formatAkg'])
        ->wherein('id', $result);
            
        if(!empty($data['contract'])){
            $contract = $data['contract'];
            $model = $model->whereHas('contract',function($query) use ($contract){
                    $query->where(\DB::raw('UPPER(contract_no)'),'like','%'.$contract.'%');
            });
        }

        $model = $model->paginate(50);

        return $model;

    }

    public function approveChecklistAkg(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        foreach ($data as $d) {
            $model = New AkgCondition;
            $model->id_akg_header = $d['id'];
            $model->status = 1;
            $model->position = 2;
            $model->id_user = $id_user;
            $model->created_at = time::now();
            $model->save();
        }

        $msg = array(
            'success'=>true,
            'message'=>'Success Saved Data'
        );

        return response()->json($msg);


    }

    public function showAkg(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = AkgHeader::with([
            'contract',
            'akgDetail.akgInLhu.customer',
            'akgParameter.parameters',
            'akgParameter.data_lab_parameter',
            'akgParameter.akg_master'
        ])->where('id', $data['id'])->first();

        return $model;
    }

    




}
