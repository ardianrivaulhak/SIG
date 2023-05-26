<?php
namespace App\Http\Controllers\Analysis;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Analysis\ConditionContract;
use App\Models\Analysis\TransactionSample;
use App\Models\Analysis\Transaction_parameter;
use App\Models\Analysis\Kontrakuji;
use App\Models\Analysis\Description;
use App\Models\Analysis\ReasonTrackBack;
use App\Models\Analysis\ConditionContractNew;
use App\Models\Analysis\TransactionPhoto;
use App\Models\Analysis\Customerhandle;
use Firebase\JWT\JWT;
use DB;
use Auth;
use Carbon\Carbon as time;
use Barryvdh\DomPDF\Facade as PDF;
use App\Models\Hris\Employee;

class KendaliController extends Controller
{
    /**
     * get data contract
     * POST data
    */
    public function index(Request $request)
    {
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            $array = array();


            if(!empty($data['user'])){
                $m = DB::select('SELECT * FROM (
                    SELECT * FROM (
                        SELECT * FROM condition_contracts cc 
                        GROUP BY cc.id_condition_contract 
                        ORDER BY cc.id_condition_contract DESC) AS bb
                    GROUP BY bb.contract_id) AS zz
                WHERE zz.position = 2 AND zz.user_id =' . $data['user']);
            } else {
                $m = DB::select('SELECT * FROM (
                    SELECT * FROM (
                        SELECT * FROM condition_contracts cc 
                        GROUP BY cc.id_condition_contract 
                        ORDER BY cc.id_condition_contract DESC) AS bb
                    GROUP BY bb.contract_id) AS zz
                WHERE zz.position = 2');
            }

            $result = array_map(function ($m) {
                return $m->contract_id;
            }, $m);

            $model = Kontrakuji::with([
                'contract_condition',
                'contract_condition.user',
                'contract_category',
                'contract_info',
                'customers_handle',
                'customers_handle.customers:id_customer,customer_name',
                'customers_handle.contact_person',
                'transactionsample:id,no_sample,id_contract,sample_name',
                'status_sample_kendali',
                'status_sample_kendali.user',
                'count_samplelab' => function($q){
                    return $q->selectRaw('COUNT(id) as countid')->groupBy('id');
                },
                'memo'
                ])
            ->whereIn('id_kontrakuji',$result);

            if(!empty($data['marketing'])){
                $model=$model->where(\DB::raw('UPPER(contract_no)'),'like','%'.$data['marketing'].'%');
            }

            if(!empty($data['customer'])){
                $customer = $data['customer'];
                $model = $model->whereHas('customers_handle',function($query) use ($customer){
                        $query->where('id_customer', $customer);
                });
            }
            
            if(!empty($data['category'])){
                $model = $model->where('id_contract_category',$data['category']);
            }

            if(!empty($data['sample_name'])){
                $sample_name = $data['sample_name'];
                $model = $model->whereHas('transactionsample', function($query) use ($sample_name){
                    $query->where(\DB::raw('UPPER(sample_name)'),'like','%'.$sample_name.'%');
                });
            }

            if(!empty($data['sample_number'])){
                $sample_number = $data['sample_number'];
                $model = $model->whereHas('transactionsample', function($query) use ($sample_number){
                    $query->where(\DB::raw('UPPER(no_sample)'),'like','%'.$sample_number.'%');
                });
            }

            if(!empty($data['status_rev'])){
                $status_rev = $data['status_rev'];
                $model = $model->whereHas('contract_info', function($query) use ($status_rev){
                    $query->where('status', $status_rev);
                });
            }

            $model = $model->orderBy('created_at', 'DESC');
            return response()->json($model->paginate(50));

        } catch(\Exception $e){
            $data=array(
                'success'=>false,
                'message'=>'Saving Error'
            );
            return response()->json($data);
        }  
    }

    /**
     * approve bulk data contract
     * POST data
    */
    public function ApproveContract(Request $request)
    {
        try{

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->all();

            foreach($data as $k){
                foreach($k as $id){

                $conditionContract = ConditionContractNew::where('contract_id', $id)
                ->groupBy('contract_id')
                ->where('groups', 'KENDALI')
                ->first();

                $conditionContract->status = 1;
                $conditionContract->user_id = $id_user;
                $conditionContract->inserted_at = time::now();
                $conditionContract->save();

                $addData = New ConditionContractNew;
                $addData->status = 0;
                $addData->contract_id = $conditionContract->contract_id;
                $addData->user_id = $id_user;
                $addData->groups = "PREPARATION";
                $addData->position = 3;
                $addData->inserted_at = time::now();
                $addData->save();

                $samples = TransactionSample::where('id_contract', $id['id'])->get();
                    foreach($samples as $sample){
                        $addSample = New ConditionContractNew;
                        $addSample->status = 0;
                        $addSample->sample_id = $sample->id;
                        $addSample->contract_id = $conditionContract->contract_id;
                        $addSample->user_id = $id_user;
                        $addSample->groups = "PREPARATION";
                        $addSample->position = 3;
                        $addSample->inserted_at = time::now();
                        $addSample->save();
                    }
                }
            }

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
            return response()->json($data);

        }
    }

    public function showContract($id_contract)
    {
        try {

            $model = Kontrakuji::with([
                'contract_category',
                'customers_handle',
                'customers_handle.customers',
                'customers_handle.contact_person',
                'user',
                'conditionContractControl.user',
                'description_kendali',
                'description_cs'
            ])
            ->where('id_kontrakuji', $id_contract)
            ->first();

            return response()->json($model);

        } catch(\Exception $e){
            $data=array(
                'success'=>false,
                'message'=>'Saving Error'
            );
            return response()->json($data);
        }

    }

    public function getSampleInContract(Request $request)
    {
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->all();

            $m =  DB::select('SELECT a.id FROM transaction_sample a WHERE a.id_contract = ' . $data['id_contract']);

            $result = array_map(function ($m) {
                return $m->id;
            }, $m);

            $model = TransactionSample::with([
                'kontrakuji',
                'contract_condition',
                'subcatalogue'
            ])->whereIn('id', $result);

            if(!empty($data['status'])){
                $model=$model->where('id_statuspengujian', $data['status']);
            }

            if(!empty($data['sample_name'])){
                $model=$model->where(\DB::raw('UPPER(sample_name)'),'like','%'.$data['sample_name'].'%');
            }

            if(!empty($data['sample_number'])){
                $model=$model->where(\DB::raw('UPPER(no_sample)'),'like','%'.$data['sample_number'].'%');
            }


            $model = $model->paginate(100);

            return response()->json($model);

       } catch(\Exception $e){
           $data=array(
               'success'=>false,
               'message'=>'Saving Error'
           );
           return response()->json($data);
       }
    }

    public function updateDataSample(request $request, $id_sample)
    {
        try{
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            $estimateLab = TransactionSample::find($id_sample);
            $estimateLab->tgl_estimasi_lab = date('Y-m-d',strtotime($data['tgl_estimasi_lab']));
            $estimateLab->save();
            $data=array(
                'success'=>true,
                'message'=>'Update Success'
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


    public function updateBulkDataSample(request $request)
    {
       try{
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');
            $sample = $request->input('sample');
           

            foreach ($sample as $s) {                
                $estimateLab = TransactionSample::find($s['id']);
                $estimateLab->tgl_estimasi_lab = date('Y-m-d',strtotime($data['tgl_estimasi_lab']));
                $estimateLab->save();
            }

            $data=array(
                'success'=>true,
                'message'=>'Update Success'
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

    public function getDescription($id_contract)
    {
        try{
            $desc = Description::where('id_contract', $id_contract)
            ->where('status', 1)
            ->where('groups', 2)
            ->orderBy('created_at', 'desc')
            ->first();

            return response()->json($desc);

        }catch(\Exception $e){

        $data=array(
            'success'=>false,
            'message'=>'Update Error'
        );
        return response()->json($data);
    }

    }

    public function updateDataDescription(request $request, $id_contract)
    {
        try{
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            $desc = Description::where('id_contract', $id_contract)->where('status', 1)->count();

            if($desc != 0){
                $editdesc = Description::where('id_contract', $id_contract)->where('status', 1)->first();
                $editdesc->id_contract = $id_contract;
                $editdesc->desc = $data['desc_internal'];
                $editdesc->insert_user = $id_user;
                $editdesc->status = 1;
                $editdesc->groups = 2;
                $editdesc->save();
            }else{
                $adddesc = new Description;
                $adddesc->desc = $data['desc_internal'];
                $adddesc->id_contract = $id_contract;
                $adddesc->insert_user = $id_user;
                $adddesc->status = 1;
                $adddesc->groups = 2;
                $adddesc->created_at = time::now();
                $adddesc->save();
            }
            $data=array(
                'success'=>true,
                'message'=>'Update Success'
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

    public function pasteDataSample(request $request, $id_sample)
    {
        try{
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            foreach ($data as $val) {
                 $tgl = $val;
            }

            $estimateLab = TransactionSample::find($id_sample);
            $estimateLab->tgl_estimasi_lab = $tgl;
            $estimateLab->save();
            $data=array(
                'success'=>true,
                'message'=>'Update Success'
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

    public function pasteAllEstimateData(Request $request, $id_contract)
    {
        try{

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            foreach ($data as $val) {
                 $tgl = $val;
            }

            $samples = TransactionSample::where('id_contract', $id_contract)->get();
            foreach ( $samples as $sample) {
                $estimasiLab = TransactionSample::where('id', $sample->id)->first();
                $estimasiLab->tgl_estimasi_lab = $tgl;
                $estimasiLab->save();
            }

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

    public function showPhotoSample(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $models = TransactionPhoto::with([
            'sample',
            'sample.kontrakuji'
        ])
        ->where('id_sample', $data['idsample']);

        return  response()->json($models->get());
    }

    public function showSample($id_sample)
    {
        try {
            $model = TransactionSample::with([
                'subcatalogue',
                'kontrakuji',
                'kontrakuji.description',
                'kontrakuji.description.user',
                'kontrakuji.description.user.bagian',
                'kontrakuji.description.user.subagian',
                'transactionparameter',
                'transactionparameter.parameteruji',
                'transactionparameter.parameteruji.lab',
                'transactionparameter.lod',
                'transactionparameter.unit',
                'transactionparameter.metode'
             ])->where('id',$id_sample)
               ->get();
    
               return $model;

        }catch(\Exception $e){
            $data=array(
                'success'=>false,
                'message'=>'Update Error'
            );
            return response()->json($data);
        }
    }

    public function showParameterInSample(Request $request)
    {
      try {
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            $model = Transaction_parameter::select(
                'transaction_parameter.*',
                'mstr_laboratories_parameteruji.name_id',
                'mstr_laboratories_parameteruji.name_en',
                'mstr_laboratories_parametertype.name as parameter_type',
                'mstr_laboratories_lab.nama_lab',
                'mstr_laboratories_lod.nama_lod',
                'mstr_laboratories_metode.metode',
                'mstr_laboratories_unit.nama_unit',
                'mstr_laboratories_standart.nama_standart',
                \DB::raw('IF(transaction_parameter.status = 1, "PAKET",IF(transaction_parameter.status = 2,"NON PAKET",IF(transaction_parameter.status = 3,"REVISI","PAKET PKM"))) AS status_string'),
                \DB::raw('IF(transaction_parameter.status = 1,mstr_products_paketuji.discount,IF(transaction_parameter.status = 4,mstr_specific_package.disc,1)) as discount'),
                'mstr_specific_package.id as id_paketpkm',
                \DB::raw('IF(transaction_parameter.status = 1,mstr_products_paketuji.price,IF(transaction_parameter.status = 4,mstr_sub_specific_package.price,parameter_price.price)) as price'),
                \DB::raw('IF(transaction_parameter.status = 1,CONCAT(mstr_products_paketuji.kode_paketuji," - ",mstr_products_paketuji.nama_paketuji),IF(transaction_parameter.status = 4,CONCAT(mstr_specific_package.package_code," - ",mstr_specific_package.package_name),"NON PAKET")) as info'),
                'transaction_sample.id_contract'
                )
            ->where('id_sample', $data['id_sample'])
            ->leftJoin('transaction_sample','transaction_sample.id','transaction_parameter.id_sample')
            ->leftJoin('mstr_laboratories_parameteruji','mstr_laboratories_parameteruji.id','transaction_parameter.id_parameteruji')
            ->leftJoin('mstr_laboratories_parametertype','mstr_laboratories_parametertype.id','mstr_laboratories_parameteruji.mstr_laboratories_parametertype_id')
            ->leftJoin('mstr_laboratories_lab','mstr_laboratories_lab.id','transaction_parameter.id_lab')
            ->leftJoin('mstr_laboratories_lod','mstr_laboratories_lod.id','transaction_parameter.id_lod')
            ->leftJoin('mstr_laboratories_metode','mstr_laboratories_metode.id','transaction_parameter.id_metode')
            ->leftJoin('mstr_laboratories_unit','mstr_laboratories_unit.id','transaction_parameter.id_unit')
            ->leftJoin('mstr_laboratories_standart','mstr_laboratories_standart.id','transaction_parameter.id_standart')
            ->leftJoin('mstr_products_paketuji','mstr_products_paketuji.id','transaction_parameter.info_id')
            ->leftJoin('mstr_sub_specific_package','mstr_sub_specific_package.id','transaction_parameter.info_id')
            ->leftJoin('mstr_specific_package','mstr_specific_package.id','mstr_sub_specific_package.mstr_specific_package_id')
            ->leftJoin('parameter_price','parameter_price.id','transaction_parameter.info_id')
            ->orderBy('transaction_parameter.status','asc');

            if(!empty($data['parameter_id'])){
                // $parameter_id = $data['parameter_id'];
                // $model = $model->whereHas('parameteruji', function($query) use ($parameter_id){
                //     $query->where(\DB::raw('UPPER(name_id)'),'like','%'.$parameter_id.'%');
                // });
                $model = $model->where(\DB::raw('UPPER(name_id)'),'like','%'.$data['parameter_id'].'%');
            }

            if(!empty($data['parameter_en'])){
                // $parameter_en = $data['parameter_en'];
                // $model = $model->whereHas('parameteruji', function($query) use ($parameter_en){
                //     $query->where(\DB::raw('UPPER(name_en)'),'like','%'.$parameter_en.'%');
                // });
                $model = $model->where(\DB::raw('UPPER(name_en)'),'like','%'.$data['parameter_en'].'%');
            }

            if(!empty($data['lab'])){
                $model = $model->where('id_lab',$data['lab']);
            }

            $model= $model->paginate(50);
            return response()->json($model);

        }catch(\Exception $e){
            $data=array(
                'success'=>false,
                'message'=>'Update Error'
            );
            return response()->json($data);
        }
    }

    public function showParameterInContract(Request $request, $id)
    {
      try {
            $model = DB::table('transaction_parameter as a')
            ->leftjoin('mstr_laboratories_parameteruji as b', 'b.id', '=', 'a.id_parameteruji')
            ->leftjoin('mstr_laboratories_parametertype as c', 'c.id', '=', 'b.mstr_laboratories_parametertype_id')
            ->leftjoin('mstr_laboratories_lab as d', 'd.id', '=', 'a.id_lab')
            ->leftjoin('mstr_laboratories_lod as e', 'e.id', '=', 'a.id_lod')
            ->leftjoin('mstr_laboratories_metode as f', 'f.id', '=', 'a.id_metode')
            ->leftjoin('mstr_laboratories_unit as g', 'g.id', '=', 'a.id_unit')
            ->leftjoin('mstr_laboratories_standart as h', 'h.id', '=', 'a.id_standart')
            ->leftjoin('transaction_sample as i', 'i.id', '=', 'a.id_sample')
            ->leftjoin('mstr_transaction_kontrakuji as j', 'j.id_kontrakuji', '=', 'i.id_contract')
            ->leftjoin('mstr_transaction_sub_catalogue as k', 'k.id_sub_catalogue', '=', 'i.id_subcatalogue')
            //->leftjoin('condition_contracts as l', 'l.contract_id', '=', 'j.id_kontrakuji' )
            ->select('a.*',
            'b.id', 'b.name_id', 'b.name_en', 'b.mstr_laboratories_laboratory_id', 'b.mstr_laboratories_parametertype_id',
            'c.id', 'c.name as type_param',
            'd.id', 'd.kode_lab', 'd.nama_lab',
            'e.id', 'e.kode_lod', 'e.nama_lod',
            'f.id', 'f.kode_metode', 'f.metode',
            'g.id', 'g.kode_unit', 'g.nama_unit',
            'h.id', 'h.kode_standart', 'h.nama_standart',
            'i.id', 'i.sample_name', 'i.no_sample', 'i.tgl_estimasi_lab',
            'j.id_kontrakuji', 'j.contract_no',
            'k.sub_catalogue_code', 'k.sub_catalogue_name')
            ->where('j.id_kontrakuji', $id)
            ->orderBy(\DB::raw('CAST(SUBSTRING_INDEX(i.no_sample, ".", -1) AS UNSIGNED)'), 'asc')
            ->get();

            return response()->json($model);

        }catch(\Exception $e){
            $data=array(
                'success'=>false,
                'message'=>'Update Error'
            );
            return response()->json($data);
        }
    }

    public function approveSample(Request $request)
    {
        try {
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

        foreach($data as $data)
        {
            $sample = TransactionSample::where('id', $data['id'])->first();
            $check = ConditionContractNew::where('sample_id', $sample->id)
            ->where('contract_id', $sample->id_contract)
            ->where('status', 2)
            ->where('groups', 'KENDALI')
            ->count();
            if($check < 1){
                    $condition = new ConditionContractNew;
                    $condition->contract_id = $sample->id_contract;
                    $condition->sample_id = $sample->id;
                    $condition->user_id = $sample->user_id;
                    $condition->status = $sample->status;
                    $condition->user_id = $id_user;
                    $condition->inserted_at =  time::now();
                    $condition->groups =  'KENDALI';
                    $condition->status =  2;
                    $condition->position =  2;
                    $condition->save();
            }else{
                $condition =ConditionContractNew::where('sample_id', $sample->id)
                ->where('contract_id', $sample->id_contract)
                ->where('status', 2)
                ->where('groups', 'KENDALI')
                ->first();
                $condition->inserted_at =  time::now();
                $condition->save();
            }
        }
            $data=array(
            'success'=> True,
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

    /**
     * get parameter detail by id parameter
     * GET data
     */
    public function showParameter($id_parameter)
    {
        $model = Transaction_parameter::with([
            'parameteruji',
            'parameteruji.parametertype',
            'labUji',
            'lod',
            'metode',
            'unit',
            'standart',
            'paketinfo',
            'transactionsamples',
            'transactionsamples' => function ($query){
                return  $query->select('id', 'id_contract');
            }
            ])->where('id', $id_parameter)
            ->get();

        return response()->json($model);
    }

    public function updateParameter(request $request, $id_parameter)
    {
        try{
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            $parameter = Transaction_parameter::find($id_parameter);
            $parameter->id_lab = $data['id_lab'];
            $parameter->id_unit = $data['id_unit'];
            $parameter->save();
            $data=array(
                'success'=>true,
                'message'=>'Update Success'
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

    public function updateBulkParameter(request $request)
    {
        try{
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');
            $checklist = $request->input('checklist');

            foreach ($checklist['id_parameter'] as $c) {
                $parameter = Transaction_parameter::find($c['id']);
                foreach($data as $d) {
                    if($d['e'] == 'lab') {
                        $parameter->id_lab = $d['d'];
                    }
                    if($d['e'] == 'unit') {
                        $parameter->id_unit = $d['d'];
                    }                  
                }
                $parameter->save();
            }
            $data=array(
                'success'=>true,
                'message'=>'Update Success'
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

    public function updateBulkParameterSample(Request $request){
        try{
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');
            $checklist = $request->input('checklist');
            $idcontract = $request->input('id_contract');
    
            $sample = TransactionSample::where('id_contract', $checklist['id_contract'])->get();      
            $array = array();
            foreach($sample as $s){
                $parameter = Transaction_parameter::where('id_sample', $s->id)->get();               
                foreach ($parameter as $parameter) {        
                    foreach ($checklist['id_parameter'] as $param) {             
                        $test = Transaction_parameter::where('id', $param['id'])->first();               
                        if($test->id_parameteruji == $parameter->id_parameteruji){ 
                            $change = Transaction_parameter::where('id',  $parameter->id)->first(); 
                            foreach($data as $d){
                                if($d['e'] == 'lab'){                    
                                    $change->id_lab = $d['d'];
                                }
                                if($d['e'] == 'unit'){
                                    $change->id_unit = $d['d'];
                                }
                                $change->save();  
                            } 
                        }
                    }
                }
            }    
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

    public function pasteParameter(Request $request, $id_parameter)
    {
        try{
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');


            if($data['param'] == 1){
                $parameter = Transaction_parameter::find($id_parameter);
                $parameter->id_lab = $data['id_lab'];
                $parameter->save();
            }

            if($data['param'] == 2){
                $parameter = Transaction_parameter::find($id_parameter);
                $parameter->id_unit = $data['id_unit'];
                $parameter->save();
            }

            $data=array(
                'success'=>true,
                'message'=>'Update Success'
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

    public function pasteAllParameter(Request $request, $id_sample)
    {
        try{

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            $parameters = Transaction_parameter::where('id_sample', $id_sample)->get();
            if($data['param'] == 1){
                foreach ( $parameters as $parameter) {
                    $param = Transaction_parameter::where('id', $parameter->id)->first();
                    $param->id_lab = $data['id_lab'];
                    $param->save();
                }
            }

            if($data['param'] == 2){
                foreach ( $parameters as $parameter) {
                    $param = Transaction_parameter::where('id', $parameter->id)->first();
                    $param->id_unit = $data['id_unit'];
                    $param->save();
                }
            }

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

    public function pasteAllParameterInContract(Request $request, $id_parameter)
    {
        try{

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            $parameters = DB::table('transaction_parameter')
            ->join('transaction_sample', 'transaction_sample.id', '=', 'transaction_parameter.id_sample')
            ->where('transaction_parameter.id_parameteruji',  $id_parameter)
            ->where('transaction_sample.id_contract', $data['id_contract'])
            ->select('transaction_parameter.id','transaction_parameter.id_parameteruji', 'transaction_parameter.id_unit', 'transaction_parameter.id_lab')
            ->get();

            if($data['param'] == 1){
                foreach($parameters as $parameter){
                    $update =  Transaction_parameter::where('id', $parameter->id)->first();
                    $update->id_lab = $data['id_lab'];
                    $update->save();
                 }
            }


            if($data['param'] == 2){
                foreach($parameters as $parameter){
                    $update =  Transaction_parameter::where('id', $parameter->id)->first();
                    $update->id_unit = $data['id_unit'];
                    $update->save();
                 }
            }
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

    public function attachment($id_sample)
    {
        try {
            $sample = $this->showSample($id_sample);
            $parameters = Transaction_parameter::with([
                'parameteruji',
                'parameteruji.parametertype',
                'labUji',
                'lod',
                'metode',
                'unit',
                'standart'
                ])
                ->where('id_sample', $id_sample)
                ->get();

            $pdf = PDF::loadview('control/attachment', compact('sample', 'parameters'))->setPaper('a4', 'landscape');
            return $pdf->stream();
        }catch(\Exception $e){
            $data=array(
                'success'=>false,
                'message'=>'Update Error'
            );
            return response()->json($data);
        }
    }

    public function excelexport(Request $request)
    {
        try {
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;

            $date = $request->input('date');

            $m = ConditionContractNew::where('groups', 'CS')
                    ->where('position', 1)
                    ->where('status', 1)
                    // ->where('inserted_at', 'LIKE', '%'. $date .'%')
                    ->whereBetween('inserted_at', array($date[0].' 00:00:01', $date[1].' 23:59:59'))
                    ->groupBy('contract_id')
                    ->get();

            $array = array();

            foreach($m as $b){
                $bb = ConditionContractNew::where('id_condition_contract', $b->id_condition_contract)->first();
                array_push($array, $bb->contract_id);
            }

            $model = Kontrakuji::with([
                'customers_handle',
                'customers_handle.customers',
                'conditionContract',
                'conditionContract.user',
                'conditionContractControl',
                'conditionContractControl.user',
                'transactionsample',
                'akgTrans',
                'samplingTrans',
                'payment_condition'
            ])->whereIn('id_kontrakuji', $array)
            ->whereNotNull('id_kontrakuji')
            ->get();


            return response()->json($model);
        }catch(\Exception $e){
            $data=array(
                'success'=>false,
                'message'=>'Update Error'
            );
            return response()->json($data);
        }
    }

    public function addPhotoKendali(Request $request){
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');


            $check = \DB::table('transaction_sample as a')
            ->leftJoin('mstr_transaction_kontrakuji as b','b.id_kontrakuji','a.id_contract')
            ->where('a.id',$data['idsample'])->get();


            $foldername = $check[0]->contract_no.'/'.$check[0]->no_sample;
            if (! File::exists($foldername)) {
                File::makeDirectory($foldername);
            }

            $zl = Image::make($data['photo']);
            $zl->resize(null, 300, function ($constraint) {
                $constraint->aspectRatio();
            });

            $countingFoto = Photo::all();

            $pathname = ''.$check[0]->no_sample.'-'.($check[0]->id + 60).'-'.(count($countingFoto) + 1).'.jpeg';
            $checkdata = Photo::where('id',$data['id'])->get();
            if(count($checkdata) > 0){
                $savephoto = Photo::find($data['id']);
                $savephoto->id_sample = $check[0]->id;
                $savephoto->photo = $pathname;
                $savephoto->insert_user = $id_user;
                $savephoto->save();
            } else {
                $savephoto = new Photo;
                $savephoto->id_sample = $check[0]->id;
                $savephoto->photo = $pathname;
                $savephoto->insert_user = $id_user;
                $savephoto->save();
            }

            $zl->save(public_path($foldername.'/'.$pathname));

            return response()->json(array(
                "status" => true,
                "message" => "Success Add Photo",
                "data" => $savephoto
            ));

        }catch (\Exception $e){
            return response()->json($e->getMessage());
        }
    }

    public function backContract(request $request)
    {
        try{
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            $model = ConditionContractNew::where('contract_id', $data['id_contract'])->get();
            foreach($model as $m){
                if($m->position  <> 1){
                    if($m->position <> 2){
                        $check = ConditionContractNew::where('id_condition_contract', $m->id_condition_contract)->first();
                        $check->delete();
                    }
                }
            }

            $reason = New ReasonTrackBack;
            $reason->id_contract = $data['id_contract'];
            $reason->reason = $data['reason'];
            $reason->id_user = $id_user;
            $reason->save();

            $data=array(
                'success'=>true,
                'message'=>'Update Success'
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

    public function getTeamSample(request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        try{
            $model = Employee::where('id_sub_bagian', 15);

            if(!empty($data['search'])){
                $model=$model->where(\DB::raw('UPPER(employee_name)'),'like','%'.$data['search'].'%');
            }

            return response()->json($model->get());


        } catch(\Exception $e){
            $data=array(
                'success'=>false,
                'message'=>'Update Error'
            );
            return response()->json($data);
        }
    }



}
