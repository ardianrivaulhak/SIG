<?php
namespace App\Http\Controllers\Analysis;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Master\Group;
use App\Models\Analysis\ConditionContract;
use App\Models\Analysis\TransactionSample;
use App\Models\Analysis\Transaction_parameter;
use App\Models\Analysis\Kontrakuji;
use App\Models\Analysis\Description;
use App\Models\Analysis\ConditionContractNew;
use App\Models\Ecert\Ecertlhu;
use App\Models\Ecert\ConditionCert;
use App\Models\Ecert\CustomerCert;
use App\Models\Ecert\ParameterCert;
use DB;
use Auth;
use Firebase\JWT\JWT;
use Carbon\Carbon as time;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use App\Models\Master\Team;
use App\Models\Master\MemberTeam;

class ResultofAnalystController extends Controller
{

    public function getDataResult(Request $request)
    {
        try {
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            $array = array();

            $cek = DB::select('SELECT aw.contract_id FROM (
                SELECT zz.contract_id, zz.position, zz.status FROM (
                  SELECT bb.contract_id, bb.sample_id, bb.position, bb.status FROM (
                     SELECT cc.id_condition_contract, cc.contract_id, cc.sample_id, cc.position, cc.status  FROM condition_contracts cc
                     GROUP BY cc.id_condition_contract
                     ORDER BY cc.id_condition_contract DESC) AS bb
                  GROUP BY bb.sample_id) AS zz
               WHERE zz.position = 4 AND zz.status = 1 ) aw
            GROUP BY aw.contract_id');

            $result = array_map(function ($cek) {
                return $cek->contract_id;
            }, $cek);

            $m = ConditionContractNew::with('conditionCert')->selectRaw('contract_id')
            ->whereIn('contract_id', $result)
            ->groupBy('contract_id')
            ->get() 
            ->toArray();

            foreach($m as $asd){
                if($asd['condition_cert'] == '' || $asd['condition_cert'] == null){
                    
                    array_push($array, $asd['contract_id']);
                }
            }


            // $datagroup =  array_map(function($b) {
            //             return $b['contract_id'];
            //     }, $array);

            //     return $datagroup;

            $model = Kontrakuji::with([
                'contract_category',
                'customers_handle',
                'customers_handle.customers',
                'customers_handle.contact_person',
                'count_samplelab' => function($q){
                    return $q->selectRaw('COUNT(id) as countid')->groupBy('id_contract');
                },
                'status_sample_certificate'
            ])->whereIn('id_kontrakuji',$array);


            if(!empty($data['marketing'])){
                $model=$model->where('contract_no','like','%'.$data['marketing'].'%');
            }

            if(!empty($data['category'])){
                $model = $model->where('id_contract_category',$data['category']);
            }

            if(!empty($data['customer'])){
                $customer_name = $data['customer'];
                $model = $model->whereHas('customers_handle',function($query) use ($customer_name){
                        $query->where('id_customer',  $customer_name );
                });
            }

            if($data['download'] == true){
                $model=$model->get();
            }else{
                $model=$model->paginate(100);
            }
            return response()->json( $model);

        }
        catch(\Exception $e){
            $data=array(
                'success'=>false,
                'message'=>'Update Error'
            );
            return response()->json($data);
        }
    }


    public function getSample(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        try {
            $model = TransactionSample::with([
             'Ecertlhu',
             'statuspengujian',
             'kontrakuji.customers_handle',
             'kontrakuji.customers_handle.contact_person',
             'sample_condition_cert' => function($q){
                return $q->orderBy('inserted_at', 'DESC')->get();
              },
              'sample_condition_cert.user',
              'parametersub', 'parametersub' => function($q){
                  return $q->selectRaw('id_sample, count(*) as aggregate')
                  ->groupBy('id_sample');
              },
              'transactionparameter', 'transactionparameter' => function ($q){
                    return $q->selectRaw('id_sample, info_id')
                    ->groupBy('info_id');
              }
             ])
            ->where('id_contract', $data['id_contract'])
            ->select('id', 'sample_name', 'no_sample', 'id_statuspengujian', 'tgl_estimasi_lab', 'tgl_selesai')
            ->orderBy('id', 'desc');

             if(!empty($data['type'])){
                if($data['type']=='all'){
                    $model=$model->get();
                } else {
                    $model=$model->paginate(50);
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


    public function getDetailSample($id_sample)
    {

        try {
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;

            $model = Ecertlhu::with([
                'TransactionSample',
                'TransactionSample.kontrakuji'
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

    public function getParameter(Request $request)
    {
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            $model = ParameterCert::where('id_transaction_sample', $data['id_transaction'])
            ->orderBy('position', 'asc')
            ->paginate(50);

            return response()->json($model);

        }catch(\Exception $e){
            $data=array(
                'success'=>false,
                'message'=>'Update Error'
            );
            return response()->json($data);
        }
    }

    public function getTeamCertificate(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        try{
            $model=Team::with(['subagian', 'pic'])
            ->where('id_sub_div', 30)
            ->orderBy('id', 'desc')
            ->get();

            return response()->json($model);

        } catch(\Exception $e){
            $data=array(
                'success'=>false,
                'message'=>'Update Error'
            );
            return response()->json($data);
        }
    }

    public function selectTeam(Request $request)
    {
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');
            $form = $request->input('form');

            foreach($data['data'] as $d){

                //check data condition
                $check = ConditionContractNew::where('contract_id', $d['id'])
                ->where('parameter_id', '==', 0)
                ->where('sample_id', '<>', 0)
                ->where('position', '=', 4)
                ->where('status', 1)
                ->groupBy('sample_id')
                ->orderBy('sample_id', 'asc')
                ->get();

               // condition sample in db 1
               foreach($check as $c){
                    $addCondition = new ConditionContractNew;
                    $addCondition->contract_id = $d['id'];
                    $addCondition->sample_id = $c->sample_id;
                    $addCondition->status = 0;
                    $addCondition->user_id = $id_user;
                    $addCondition->groups = 'CERTIFICATE';
                    $addCondition->inserted_at = time::now();
                    $addCondition->position = 5;
                    $addCondition->save();
               }

                // condition sample in db 2              
               foreach($check as $index => $ti){
                $urutan = $index + 1;
                $transactionSampleLab = TransactionSample::with(
                    'kontrakuji',
                    'kontrakuji.cust_address',
                    'kontrakuji.customers_handle',
                    'kontrakuji.customers_handle.customers',
                    'kontrakuji.customers_handle.contact_person'
                    )
                ->where('id', $ti->sample_id)
                ->first();

                $addTransactionSampleCert = New Ecertlhu;
                $addTransactionSampleCert->id_transaction_sample = $transactionSampleLab->id;
                $addTransactionSampleCert->customer_name = $transactionSampleLab->kontrakuji->customers_handle->id_customer;
                $addTransactionSampleCert->customer_address = $transactionSampleLab->kontrakuji->id_alamat_customer;
                $addTransactionSampleCert->customer_telp = 
                $transactionSampleLab->kontrakuji->customers_handle->telp == NULL || $transactionSampleLab->kontrakuji->customers_handle->telp == "NOT SET" ? "-" : "+62".$transactionSampleLab->kontrakuji->customers_handle->telp;
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

                //$ecert = Ecertlhu::latest('id')->first();
                $conditionSample = ConditionCert::where('id_contract', $transactionSampleLab->id_contract)->first();
                $addcondition = new ConditionCert();
                $addcondition->id_transaction_cert = $addTransactionSampleCert->id;
                $addcondition->id_contract =  $transactionSampleLab->id_contract;
                $addcondition->status = 1;
                $addcondition->cert_status = 1;
                $addcondition->user_id = $id_user;
                $addcondition->id_team =  $form['team'];
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
                        a.actual_result,
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
                        a.desc,
                        IF(a.status = 4, i.c, NULL) as value_c,
                        IF(a.status = 4, i.m, NULL) as value_m ,
                        IF(a.status = 4, i.mm, NULL) as value_mm,
                        IF(a.status = 4, a.position, NULL) as value_n'
                            )
                ->get();

                foreach($transactionparams as $index => $param){
                    $position = $index + 1;
                    $addparameter = new ParameterCert();
                    $addparameter->id_transaction_sample = $addTransactionSampleCert->id;
                    $addparameter->id_parameteruji = $param->id_parameteruji;
                    $addparameter->parameteruji_id = $param->name_id;
                    $addparameter->parameteruji_en = $param->name_en;
                    $addparameter->simplo = $param->simplo;
                    $addparameter->duplo = $param->duplo;
                    $addparameter->triplo = $param->triplo;
                    $addparameter->hasiluji = $param->hasiluji;
                    $addparameter->actual_result = $param->actual_result;
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
                    $addparameter->desc = $param->desc;
                    $addparameter->save();                  
                }
               }
            }

            $message=array(
                'success'=>true,
                'message'=>'Saving Success'
            );
            return response()->json($message);

        }catch(\Exception $e){
            $data=array(
                'success'=>false,
                'message'=>'Update Error'
            );
            return response()->json($data);
        }
    }

    public function getDataFollow(Request $request)
    {
        try {
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');



            $lhudata = Ecertlhu::select('id_transaction_sample as sample_id')->orderBy('date_at', 'desc')->get()->toArray();            
            $lhu_id = array_map(function ($lhudata) {
                return $lhudata['sample_id'];
            }, $lhudata);


            $sql = ConditionContractNew::select('sample_id')->where('position', 4)->where('status', 1)->get()->toArray();           

            $sql_id = array_map(function ($sql) {
                return $sql['sample_id'];
            }, $sql);

            $array = array_diff($sql_id, $lhu_id);
          
            $arrayval = array_values($array);

            $a = TransactionSample::select('id_contract')->whereIn('id', $arrayval)->groupBy('id_contract')->get()->toArray();
            $z = array_map(function ($a) {
                return $a['id_contract'];
            }, $a);

            $cc = ConditionCert::select('id_contract')->whereIn('id_contract', $z)->groupBy('id_contract')->get()->toArray();
            $zz = array_map(function ($cc) {
                return $cc['id_contract'];
            }, $cc);
           

            $sam = ConditionContractNew::select('sample_id', 'contract_id')->whereIn('contract_id', $zz)->where('position', 4)->where('status', 1)->get()->toArray(); 
            $zzz = array_map(function ($sam) {
                return $sam['sample_id'];
            }, $sam);
            $arraysss = array_diff($zzz, $lhu_id);
            $arrayvalsss = array_values($arraysss);
           
            // $pp = ConditionCert::select('id_contract')->whereIn('id_contract', $z)->get()->toArray();
            // $y = array_map(function ($pp) {
            //     return $pp['id_contract'];
            // }, $pp);

            // $tt = TransactionSample::select('id')->whereIn('id', $y)->get()->toArray();
            // $aa = array_map(function ($tt) {
            //     return $tt['id'];
            // }, $tt);

            // return $aa;

            // $asu = array_diff($aa, $lhu_id);
            // $count = DB::table(\DB::raw("({$sql->toSql()}) as sub"))
            // ->mergeBindings($sql->getQuery())
            // ->whereNotIn('sub.sample_id', $lhudata)
            // ->get();

            // return $count;
         
            //  

            // $m = DB::connection('mysqlcertificate')->select('SELECT z.id_transaction_sample  
            // FROM transaction_sample_cert z 
            // WHERE MONTH(z.date_at) > 11 LIMIT 50');

            // $result = array_map(function ($m) {
            //     return $m->id_transaction_sample;
            // }, $m);

            // $cek = implode(",", $result);
         


            // $model = DB::select('SELECT zz.sample_id FROM (
            //     SELECT * FROM condition_contracts a
            //     WHERE a.position = 4 AND a.`status` = 1 ) AS zz
            // WHERE zz.sample_id NOT IN ('. $cek .')
            // GROUP BY zz.sample_id LIMIT 50');
            

            // $array_sample = array_map(function ($model) {
            //     return $model->sample_id;
            // }, $model);


            $samples = TransactionSample::with([
            'kontrakuji',
            'kontrakuji.customers_handle.customers',
            'kontrakuji.customers_handle.contact_person',
            'statuspengujian',
            'tujuanpengujian',
            'condition_contract_lab'
            ])->whereIn('id', $arrayvalsss);
        
            if(!empty($data['marketing'])){
                $marketing = $data['marketing'];
                $samples = $samples->whereHas('kontrakuji',function($query) use ($marketing){
                        $query->where(\DB::raw('UPPER(contract_no)'),'like','%'.$marketing.'%');
                });
            }

            if(!empty($data['customer'])){
                $customer = $data['customer'];
                $samples = $samples->whereHas('kontrakuji.customers_handle',function($query) use ($customer){
                        $query->where('id_customer', $customer);
                });
            }

            if(!empty($data['sample_name'])){
                $samples=$samples->where(\DB::raw('UPPER(sample_name)'),'like','%'.$data['sample_name'].'%');
            }

            $samples = $samples->orderBy('id', 'desc')->paginate(50);
            return response()->json($samples);
        }
        catch(\Exception $e){
            $data=array(
                'success'=>false,
                'message'=>'Update Error'
            );
            return response()->json($data);
        }


    }

    public function ApproveDataFollow(Request $request){

        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $samples = TransactionSample::with([
            'kontrakuji',
            'kontrakuji.customers_handle.customers',
            'kontrakuji.customers_handle.contact_person',
            'statuspengujian',
            'tujuanpengujian',
            'condition_contract_lab'
            ])->whereIn('id',  $data)->get();

        $urutan = 1;
        foreach($samples as $sample)
        {
            $addTransactionSampleCert = New Ecertlhu;
            $addTransactionSampleCert->id_transaction_sample = $sample->id;
            $addTransactionSampleCert->customer_name = $sample->kontrakuji->customers_handle->id_customer;
            $addTransactionSampleCert->customer_address = $sample->kontrakuji->id_alamat_customer;
            $addTransactionSampleCert->customer_telp = $sample->kontrakuji->customers_handle->telp;
            $addTransactionSampleCert->contact_person = $sample->kontrakuji->customers_handle->id_cp;
            $addTransactionSampleCert->sample_name = $sample->sample_name;
            $addTransactionSampleCert->no_sample = $sample->no_sample;
            $addTransactionSampleCert->kode_sample = $sample->kode_sample;
            $addTransactionSampleCert->batch_number = $sample->batch_number;
            $addTransactionSampleCert->tgl_mulai = $sample->tgl_input;
            $addTransactionSampleCert->tgl_input = $sample->tgl_input;
            $addTransactionSampleCert->tgl_selesai = $sample->tgl_selesai;
            $addTransactionSampleCert->tgl_estimasi_lab = $sample->tgl_estimasi_lab;
            $addTransactionSampleCert->nama_pabrik = $sample->nama_pabrik;
            $addTransactionSampleCert->alamat_pabrik = $sample->alamat_pabrik;
            $addTransactionSampleCert->no_notifikasi = $sample->no_notifikasi;
            $addTransactionSampleCert->no_pengajuan = $sample->no_pengajuan;
            $addTransactionSampleCert->no_registrasi = $sample->no_registrasi;
            $addTransactionSampleCert->no_principalcode = $sample->no_principalcode;
            $addTransactionSampleCert->nama_dagang = $sample->nama_dagang;
            $addTransactionSampleCert->lot_number = $sample->lot_number;
            $addTransactionSampleCert->jenis_kemasan = $sample->jenis_kemasan;
            $addTransactionSampleCert->tgl_produksi = $sample->tgl_produksi;
            $addTransactionSampleCert->tgl_kadaluarsa = $sample->tgl_kadaluarsa;
            $addTransactionSampleCert->price = $sample->price;
            $addTransactionSampleCert->keterangan_lain = $sample->keterangan_lain;
            $addTransactionSampleCert->id_tujuanpengujian = $sample->id_tujuanpengujian;
            $addTransactionSampleCert->id_statuspengujian = $sample->id_statuspengujian;
            $addTransactionSampleCert->id_subcatalogue = $sample->id_subcatalogue;
            $addTransactionSampleCert->format = 1;
            $addTransactionSampleCert->urutan = $urutan;
            $addTransactionSampleCert->save();
            
            $ecert = Ecertlhu::latest('id')->first();
            $conditionSample = ConditionCert::where('id_contract', $sample->id_contract)->first();
            
            $addcondition = new ConditionCert();
            $addcondition->id_transaction_cert =  $ecert->id;
            $addcondition->id_contract =  $sample->id_contract;
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
            ->where('a.id_sample', $sample->id)
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
                    a.actual_result,
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
                    a.desc,
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
                $addparameter->actual_result = $param->actual_result;
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
                $addparameter->desc = $param->desc;
                $addparameter->save();
                $position++;
            }

           $urutan++;
        }

        $message=array(
            'success'=>true,
            'message'=>'Saving Success'
        );
        return response()->json($message);
    }
}
