<?php
namespace App\Http\Controllers\Analysis;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Analysis\Customer;
use App\Models\Analysis\BobotSample;
use App\Models\Analysis\Kontrakuji;
use App\Models\Analysis\ConditionContractNew;
use App\Models\Analysis\ConditionLabCome;
use App\Models\Analysis\TransactionSample;
use App\Models\Analysis\Customerhandle;
use App\Models\Analysis\Transaction_parameter;
use Firebase\JWT\JWT;
use App\Models\Analysis\Description;
use DB;
use Auth;
use Carbon\Carbon as time;

class PreparationController extends Controller
{

    public function preparationContract(Request $request)
    {
        try {
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            $m = DB::select('SELECT * FROM (
                SELECT * FROM (
                    SELECT * FROM (
                        SELECT c.* FROM condition_contracts c
                        WHERE c.sample_id <> 0
                        GROUP BY c.id_condition_contract
                        ORDER BY c.id_condition_contract DESC ) AS cs
                    GROUP BY cs.sample_id) AS css
                WHERE css.position = 3 ) ccss
            GROUP BY ccss.contract_id');

             $result = array_map(function ($m) {
                return $m->contract_id;
            }, $m);

            $model = Kontrakuji::with([
                'contract_category',
                'customers_handle',
                'customers_handle.customers',
                'customers_handle.contact_person',
                'conditionContractPreparation',
                'conditionContractPreparation.user',
                'count_samplelab',
                'count_preparation',
                'description_kendali',    
                'description_preparation',            
                'transactionsample:id,no_sample,id_contract,sample_name',
            ])->whereIn('id_kontrakuji',  $result)->orderBy('id_kontrakuji', 'desc');

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
           return response()->json($model->paginate(25));


        } catch(\Exception $e){
            return response()->json($e);
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

    public function getDescription(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $desc = Description::where('id_sample', $data['idSample'])
        ->where('status', 1)
        ->where('groups', 3)
        ->orderBy('created_at', 'desc')
        ->first();

        return response()->json($desc);

    }

    public function updateDataDescription(request $request)
    {
        try{

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            $desc = Description::where('id_contract', $data['idcontract'])
            ->where('id_sample', $data['idsample'])
            ->where('status', 1)
            ->where('groups', 3)
            ->count();


            if($desc != 0){
                $editdesc = Description::where('id_contract', $data['idcontract'])
                ->where('id_sample', $data['idsample'])
                ->where('status', 1)->orderBy('created_at', 'desc')
                ->first();

                $editdesc->desc = $data['desc_internal'];
                $editdesc->insert_user = $id_user;
                $editdesc->status = 1;
                $editdesc->groups = 3;
                $editdesc->save();

            }else{
                $adddesc = new Description;
                $adddesc->id_contract = $data['idcontract'];
                $adddesc->id_sample = $data['idsample'];
                $adddesc->desc = $data['desc_internal'];
                $adddesc->insert_user = $id_user;
                $adddesc->status = 1;
                $adddesc->groups = 3;
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

    public function updateDataDescriptionBulk(Request $request)
    {   
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');
        $idsample =  $request->input('idsample');

        foreach($idsample as $ids){
            $countdesc = Description::where('id_sample',  $ids['id'])
            ->where('status', 1)
            ->where('groups', 3)
            ->count();
            
            if($countdesc != 0){
                $editdesc = Description::where('id_sample',  $ids['id'])
                ->where('status', 1)
                ->first();
                
                $editdesc->desc = $data['desc_internal'];
                $editdesc->insert_user = $id_user;
                $editdesc->save();

            }else{
                $adddesc = new Description;
                $adddesc->id_contract = $data['idcontract'];
                $adddesc->id_sample =  $ids['id'];
                $adddesc->desc = $data['desc_internal'];
                $adddesc->insert_user = $id_user;
                $adddesc->status = 1;
                $adddesc->groups = 3;
                $adddesc->created_at = time::now();
                $adddesc->save();
            }
        }

        $data=array(
            'success'=>true,
            'message'=>'Update Success'
        );

        return response()->json($data);
    }

    public function SampleCheck(Request $request){
        try {
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            $array = array();

        $m = DB::select('SELECT * FROM (
            SELECT * FROM (
               SELECT c.* FROM condition_contracts c
               WHERE c.sample_id <> 0 
               GROUP BY c.id_condition_contract
               ORDER BY c.id_condition_contract DESC ) AS cs
            GROUP BY cs.sample_id) AS css
         WHERE css.position = 3 AND css.status = 1');

         $result = array_map(function ($m) {
            return $m->sample_id;
        }, $m);

        $model = TransactionSample::with([
            'kontrakuji',
            'kontrakuji.description',
            'kontrakuji.description.user',
            'kontrakuji.description.user.bagian',
            'kontrakuji.description.user.subagian',
            'bobotsample',
            'statuspengujian',
            'tujuanpengujian',
            'bobotsample.labname',
            'kontrakuji.contract_category',
            'kontrakuji.customers_handle',
            'kontrakuji.customers_handle.customers',
            'kontrakuji.customers_handle.contact_person',
            'sample_condition',
            'sample_condition_pre'
        ])
        ->whereIn('id', $result);


        if(!empty($data['marketing'])){
            $marketing = $data['marketing'];
            $model = $model->whereHas('kontrakuji',function($query) use ($marketing){
                     $query->where(\DB::raw('UPPER(contract_no)'),'like','%'.$marketing.'%');
            });
        }

        if(!empty($data['status'])){
            $model = $model->where('id_statuspengujian',$data['status']);
        }

        if(!empty($data['category'])){
            $category = $data['category'];
            $model = $model->whereHas('kontrakuji',function($query) use ($category){
                     $query->where('id_contract_category', $category);
            });
        }

        if(!empty($data['samplename'])){
            $model = $model->where( \DB::raw('UPPER(sample_name)'),'like','%'.$data['samplename'].'%');
        }

        if(!empty($data['samplenumber'])){
            $model = $model->where(\DB::raw('UPPER(no_sample)'),'like','%'.$data['samplenumber'].'%');
        }

        return response()->json($model->paginate(50));

        } catch(\Exception $e){
            return response()->json($e->getMessage());
        }
    }

    public function SampleCheckDetailsNew(Request $request){
        try {
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            $array = array();

            $m = DB::select('SELECT * FROM (
                SELECT * FROM (
                   SELECT c.* FROM condition_contracts c
                   WHERE c.sample_id <> 0 
                   GROUP BY c.id_condition_contract
                   ORDER BY c.id_condition_contract DESC ) AS cs
                GROUP BY cs.sample_id) AS css
             WHERE css.position = 3 AND css.status = 1');
    
             $result = array_map(function ($m) {
                return $m->sample_id;
            }, $m);
    
            $model = TransactionSample::with([
                'kontrakuji',
                'kontrakuji.description',
                'kontrakuji.description.user',
                'kontrakuji.description.user.bagian',
                'kontrakuji.description.user.subagian',
                'kontrakuji.description_kendali',
                'kontrakuji.description_preparation',
                'bobotsample',
                'statuspengujian',
                'tujuanpengujian',
                'bobotsample.labname',
                'kontrakuji.contract_category',
                'kontrakuji.customers_handle',
                'kontrakuji.customers_handle.customers',
                'kontrakuji.customers_handle.contact_person',
                'sample_condition',
                'sample_condition_pre'
            ])
            ->whereIn('id', $result);

            if(!empty($data['datafilter']['marketing'])){
                $marketing = $data['datafilter']['marketing'];
                $model = $model->whereHas('kontrakuji',function($query) use ($marketing){
                         $query->where(\DB::raw('UPPER(contract_no)'),'like','%'.$marketing.'%');
                });
            }
    
            if(!empty($data['datafilter']['status'])){
                $model = $model->where('id_statuspengujian',$data['datafilter']['status']);
            }
    
            if(!empty($data['datafilter']['category'])){
                $category = $data['datafilter']['category'];
                $model = $model->whereHas('kontrakuji',function($query) use ($category){
                         $query->where('id_contract_category', $category);
                });
            }
    
            if(!empty($data['datafilter']['samplename'])){
                $model = $model->where( \DB::raw('UPPER(sample_name)'),'like','%'.$data['datafilter']['samplename'].'%');
            }
    
            if(!empty($data['datafilter']['samplenumber'])){
                $model = $model->where(\DB::raw('UPPER(no_sample)'),'like','%'.$data['datafilter']['samplenumber'].'%');
            }
                return response()->json($model->paginate(1));

        } catch(\Exception $e){
            return response()->json($e->getMessage());
        }
    }

    public function SampleCheckDetails(Request $request, $id_sample){
        //try {
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;

            // $array = array();

            // $m = ConditionContractNew::selectRaw('contract_id, sample_id')
            // ->where(function ($query){
            //     $query->where('status', 1)
            //     ->where('groups','PREPARATION');
            // })
            // ->groupBy('sample_id')
            // ->get();

            // foreach ($m as $ksd) {
            //     $bb = ConditionContractNew::where('sample_id',$ksd->sample_id)->orderBy('position','ASC')->get();

            //      if($bb[count($bb) - 1]->status == 1){
            //          array_push($array,$bb[count($bb) - 1]->sample_id);
            //      }
            //  }

            $model = TransactionSample::with([
                'images',
                'kontrakuji',
                'kontrakuji.description',
                'kontrakuji.description.user',
                'kontrakuji.description.user.bagian',
                'kontrakuji.description.user.subagian',
                'bobotsample',
                'bobotsample.labname',
                'kontrakuji.contract_category',
                'statuspengujian:id,name',
                'tujuanpengujian',
                'kontrakuji.customers_handle',
                'kontrakuji.customers_handle.customers',
                'kontrakuji.customers_handle.contact_person',
                'contract_condition',
                'subcatalogue:id_catalogue,id_sub_catalogue,sub_catalogue_name'
            ])->where('id',$id_sample)->paginate(2);

            // if(!empty($request->input('marketing'))){
            //     $marketing = $request->input('marketing');
            //     $model = $model->whereHas('kontrakuji',function($query) use ($marketing){
            //              $query->where(\DB::raw('UPPER(contract_no)'),'like','%'.$marketing.'%');
            //     });
            // }

            // if(!empty($request->input('category'))){
            //     $category =$request->input('category');
            //     $model = $model->whereHas('kontrakuji.contract_category',function($query) use ($category){
            //              $query->where('id', $category);
            //     });
            // }


            // if(!empty($request->input('samplename'))){
            //     $model = $model->where(\DB::raw('UPPER(sample_name)'),'like','%'.$request->input('samplename').'%');
            // }

            // if(!empty($request->input('samplenumber'))){
            //     $model = $model->where(\DB::raw('UPPER(no_sample)'),'like','%'.$request->input('samplenumber').'%');
            // }

           // $model = $model->paginate(25);

            return response()->json($model);
        // } catch(\Exception $e){
        //     return response()->json($e->getMessage());
        // }
    }

    public function limitSampleCheck()
    {
        // $m = DB::select('SELECT css.sample_id FROM (
        //     SELECT * FROM (
        //        SELECT c.* FROM condition_contracts c
        //        WHERE c.sample_id <> 0 
        //        GROUP BY c.id_condition_contract
        //        ORDER BY c.id_condition_contract DESC ) AS cs
        //     GROUP BY cs.sample_id) AS css
        //  WHERE css.position = 3 AND css.status = 1');

        //  $result = array_map(function ($m) {
        //     return $m->sample_id;
        // }, $m);

        $model = TransactionSample::whereIn('id', [\DB::raw('SELECT css.sample_id FROM (
            SELECT * FROM (
               SELECT c.* FROM condition_contracts c
                WHERE c.sample_id <> 0 
                GROUP BY c.id_condition_contract
                ORDER BY c.id_condition_contract DESC ) AS cs
             GROUP BY cs.sample_id) AS css
         WHERE css.position = 3 AND css.status = 1')])->simplePaginate(1);

        return $model;
    }


    public function sampleChangeStatus(Request $request){
        try {
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            foreach($data['sample'] as $sample){

                $var = TransactionSample::find($sample['idsample']);

                if($data['status'] =='PREPARATION'){

                    $csp = ConditionContractNew::where('sample_id',$sample['idsample'])->where('groups','PREPARATION')->where('status',0)->first();
                    $v = ConditionContractNew::find($csp->id_condition_contract);
                    $v->status = 1;
                    $v->inserted_at = time::now();
                    $v->sample_id = $var->id;
                    $v->contract_id = $var->id_contract;
                    $v->parameter_id = 0;
                    $v->user_id = $id_user;
                    $v->save();

                } else if($data['status'] == 'SAMPLEUJI'){

                    $g = ConditionContractNew::where('sample_id',$sample['idsample'])
                    ->where('groups','PREPARATION')
                    ->where('status',1)
                    ->first();

                    $v = ConditionContractNew::find($g->id_condition_contract);
                    $v->status = 2;
                    $v->inserted_at = time::now();
                    $v->sample_id = $var->id;
                    $v->contract_id = $var->id_contract;
                    $v->parameter_id = 0;
                    $v->user_id = $id_user;
                    $v->position = 3;
                    $v->groups = 'PREPARATION';
                    $v->save();
                }
            }
            $message = array(
                'success' => true,
                'message' => 'Data Successfully Changed'
            );
            return response()->json($message);
        } catch (\Exception $e){
            return response()->json($e->getMessage());
        }return response()->json($e->getMessage());
        
    }


    public function SampleContract(Request $request)
    {
        //try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');           

            $array = array();            
            $m = DB::select('SELECT * FROM (
                SELECT * FROM (
                   SELECT c.* FROM condition_contracts c
                   WHERE c.sample_id <> 0 AND contract_id = '.$data['id_contract'].'
                   GROUP BY c.id_condition_contract
                   ORDER BY c.id_condition_contract DESC ) AS cs
                GROUP BY cs.sample_id) AS css
             WHERE css.position = 3 ');

             $result = array_map(function ($m) {
                return $m->sample_id;
            }, $m);
             

            $model = TransactionSample::with([
                'kontrakuji',
                'kontrakuji.description',
                'kontrakuji.description.user',
                'kontrakuji.description.user.bagian',
                'kontrakuji.description.user.subagian',
                'kontrakuji.description_preparation',
                'bobotsample',
                'statuspengujian',
                'tujuanpengujian',
                'bobotsample.labname',
                'kontrakuji.contract_category',
                'kontrakuji.customers_handle',
                'kontrakuji.customers_handle.customers',
                'kontrakuji.customers_handle.contact_person',
                'sample_condition',
                'sample_condition_pre'
            ])
            ->whereIn('id',$result);

            if(!empty($data['status'])){
                $model=$model->where('id_statuspengujian', $data['status']);
            }

            if(!empty($data['sample_name'])){
                $model = $model->where(\DB::raw('UPPER(sample_name)'),'like','%'.$data['sample_name'].'%');
            }

            if(!empty($data['sample_number'])){
                $model = $model->where(\DB::raw('UPPER(no_sample)'),'like','%'.$data['sample_number'].'%');
            }

            return response()->json($model->paginate(500));

        // } catch(\Exception $e){
        //     $data=array(
        //         'success'=>false,
        //         'message'=>'Saving Error'
        //     );
        //     return response()->json($data);
        // }
    }

    public function SampleDetail(Request $request){
        //try {
            $data = $request->input('data');
            $var = TransactionSample::with([
                'kontrakuji',
                'kontrakuji.description',
                'descriptionprep',
                'bobotsample',
                'bobotsample.labname',
                'kontrakuji.contract_category',
                'statuspengujian',
                'tujuanpengujian',
                'kontrakuji.customers_handle',
                'kontrakuji.customers_handle.customers',
                'kontrakuji.customers_handle.contact_person',
                'kontrakuji.user'
            ])->find($data['id_sample']);
            return response()->json($var);
        // } catch(\Exception $e){
        //     return response()->json($e);
        // }
    }

    public function parameterContract(Request $request)
    {
        try{
            $data = $request->input('data');

            $var = Transaction_parameter::with([
                'transaction_sample',
                'parameteruji',
                'lab',
                'parameteruji.lab'
            ])->where('id_sample',$data)
            ->paginate(25);

            return response()->json($var);

        } catch(\Exception $e){
            return response()->json($e->getMessage());
        }
    }

    public function saveBobotSample(Request $request)
    {
        try{
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');
            foreach($data['data'] as $k){
                $var = new BobotSample;
                $var->id_sample = $k['id_sample'];
                $var->id_lab = $k['id_lab'];
                $var->value = $k['value'];
                $var->insert_user = $id_user;
                $var->created_at = time::now();
                $var->save();
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

    public function editBobotSample(Request $request)
    {
        try{

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            for ($i=0; $i < count($data['data']); $i++) {
                $v = BobotSample::where('id_sample',$data['data'][$i]['id_sample'])->get();

                foreach($v as $k){
                    BobotSample::find($k['id'])->forceDelete();
                }

            }

            foreach ($data['data'] as $key) {
                $g = new BobotSample;
                $g->id_sample = $key['id_sample'];
                $g->id_lab = $key['id_lab'];
                $g->value = $key['value'];
                $g->update_user = $id_user;
                $g->updated_at = time::now();
                $g->save();
            }
            $data=array(
                'success'=>true,
                'message'=>'Saving Success'
            );

            return response()->json($data);

        } catch(\Exception $e){

            $data=array(
                'success'=>false,
                'message'=> $e->getMessage()
            );

            return response()->json($data);
        }
    }

    public function accepted_preparation(Request $request){
        try {
             $token = $request->bearerToken();
             $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
             $id_user = $users->sub;
             $data = $request->input('data');
             $array = array();
 
              $d = ConditionContractNew::select('contract_id')
                 ->where('contract_id',$data['id_contract'])
                 ->where('sample_id','<>',0)
                 ->where('status',2)
                 ->where('groups','PREPARATION')
                 ->groupBy('contract_id')
                 ->get();
 
             foreach ($d as $ksd) {
                 $bb = ConditionContractNew::where('contract_id',$ksd->contract_id)->get();
                 if($bb[count($bb) - 1]->groups == 'PREPARATION'){
                     array_push($array,$bb[count($bb) - 1]->contract_id);
                 }
 
             }
 
             $dc = TransactionSample::with(['transactionparameter'])->wherein('id_contract',$array)->get();
 
             foreach ($dc as $v) {
                 foreach($v['transactionparameter'] as $tp){
                     $xc = new ConditionContractNew;
                     $xc->status = 0;
                     $xc->contract_id = $v->id_contract;
                     $xc->sample_id = $v->id;
                     $xc->parameter_id = $tp->id;
                     $xc->inserted_at = time::now();
                     $xc->user_id = $id_user;
                     $xc->groups = 'LAB';
                     $xc->position = 4;
                     $xc->save();
                 }
             }
 
             $message = array(
                 'success' => true,
                 'message' => 'Data Successfully Changed'
             );
 
             return response()->json($dc);
 
        } catch (\Exception $e){
             return response()->json($e->getMessage());
        }
     }

    public function approveDataSample(Request $request)
    {
        try{
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            // return $data;

            foreach($data as $d){

                $checkdata = ConditionContractNew::where('sample_id', $d['id'])
                ->where('groups', 'PREPARATION')
                ->where('position', 3)
                ->where('status', 1)
                ->count();

                if($checkdata < 1){
                    $datacondition = ConditionContractNew::where('sample_id', $d['id'])->orderBy('inserted_at', 'DESC')->first();

                    $add = new ConditionContractNew ;
                    $add->contract_id = $datacondition->contract_id;
                    $add->sample_id = $datacondition->sample_id;
                    $add->parameter_id = $datacondition->parameter_id;
                    $add->user_id = $id_user;
                    $add->status = 1;
                    $add->inserted_at = time::now();
                    $add->groups = "PREPARATION";
                    $add->position = 3;
                    $add->save();

                    $dataconditioncontract = ConditionContractNew::where('contract_id', $datacondition->contract_id)
                    ->where('sample_id', '<>', 0)
                    ->where('parameter_id', 0)
                    ->where('status', 0)
                    ->where('groups', 'PREPARATION')
                    ->count();

                    $labcondition = ConditionContractNew::where('contract_id', $datacondition->contract_id)
                    ->where('sample_id', '<>', 0)
                    ->where('parameter_id', 0)
                    ->where('status', 1)
                    ->where('groups', 'PREPARATION')
                    ->count();


                    if($dataconditioncontract - $labcondition == 0) {
                        $adds = new ConditionContractNew ;
                        $adds->contract_id = $datacondition->contract_id;
                        $adds->sample_id = 0;
                        $adds->parameter_id = 0;
                        $adds->user_id = $id_user;
                        $adds->status = 1;
                        $adds->inserted_at = time::now();
                        $adds->groups = "PREPARATION";
                        $adds->position = 3;
                        $adds->save();
                    }
                }
            }




            $message = array(
                'success' => true,
                'message' => 'Data Successfully Approve'
            );

            return response()->json($message);
        } catch(\Exception $e){

            $data=array(
                'success'=>false,
                'message'=> $e->getMessage()
            );

            return response()->json($data);
        }
    }

    public function approveDataSampleToLab(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        foreach($data as $d){

            // membuat data kondisi
            $add = new ConditionContractNew ;
            $add->contract_id = $d['condition']['contract_id'];
            $add->sample_id = $d['condition']['sample_id'];
            $add->parameter_id = $d['condition']['parameter_id'];
            $add->user_id = $id_user;
            $add->status = 1;
            $add->inserted_at = time::now();
            $add->groups = "LAB";
            $add->position = 4;
            $add->save();

            $param = Transaction_parameter::where('id_sample', $d['condition']['sample_id'])->get();
            foreach($param as $p){
                $add = new ConditionContractNew ;
                $add->contract_id = $d['condition']['contract_id'];
                $add->sample_id = $d['condition']['sample_id'];
                $add->parameter_id = $p->id;
                $add->user_id = $id_user;
                $add->status = 0;
                $add->inserted_at = time::now();
                $add->groups = "LAB";
                $add->position = 4;
                $add->save();
            }

            // total data condition sample
            $kon = ConditionContractNew::where('contract_id', $d['condition']['contract_id'])
            ->where('parameter_id', '==', '0')
            ->where('groups', 'LAB')
            ->count();

            // total data sample
            $countSample = TransactionSample::where('id_contract', $d['condition']['contract_id'])
            ->count();

            if($countSample == $kon){
                $add = new ConditionContractNew ;
                $add->contract_id = $d['condition']['contract_id'];
                $add->sample_id = 0;
                $add->parameter_id = 0;
                $add->user_id = $id_user;
                $add->status = 0;
                $add->inserted_at = time::now();
                $add->groups = "LAB";
                $add->position = 4;
                $add->save();
            }
         }
    }



    // edited bachtiar

    public function getDataBobot(Request $request){

        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $bobot = BobotSample::with(['labname'])->where('id_sample', $data['sampleid'])->paginate(5);
        return $bobot;
    }


    public function addDataBobot(Request $request){
        try{
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            $var = new BobotSample;
            $var->id_sample = $data['id_sample'];
            $var->id_lab = $data['data']['id_lab'];
            $var->value = $data['data']['value'];
            $var->insert_user = $id_user;
            $var->created_at = time::now();
            $var->save();

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

    public function deletedDataBobot(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = BobotSample::where('id', $data)->first();
        $model->delete();

        $data=array(
            'success'=>false,
            'message'=>'Saving Error'
        );

        return response()->json($data);
    }

    public function memo_kendali(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $desc = Description::where('id_sample', $data)->where('status', 1)->first();
        return $desc;
    }

    public function approveSampleTest(Request $request)
    {
        try {
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            foreach($data as $d){
                $condition = ConditionContractNew::where('sample_id', $d['id'])->orderby('id_condition_contract', 'desc')->first();
                // sample
                $addSample = new ConditionContractNew ;
                $addSample->contract_id = $condition['contract_id'];
                $addSample->sample_id = $condition['sample_id'];
                $addSample->parameter_id = 0;
                $addSample->user_id = $id_user;
                $addSample->status = 0;
                $addSample->inserted_at = time::now();
                $addSample->groups = "LAB";
                $addSample->position = 4;
                $addSample->save();


                $count_condition = ConditionContractNew::where('contract_id', $condition['contract_id'])->where('status', 1)->where('sample_id', '!=', 0)->where('groups', 'PREPARATION')->count();
                $count_conditiont = ConditionContractNew::where('contract_id', $condition['contract_id'])->where('status', 0)->where('groups', 'LAB')->count();

                if($count_conditiont == $count_condition){
                     // sample
                    $condSample = new ConditionContractNew ;
                    $condSample->contract_id = $condition['contract_id'];
                    $condSample->sample_id = 0;
                    $condSample->parameter_id = 0;
                    $condSample->user_id = $id_user;
                    $condSample->status = 2;
                    $condSample->inserted_at = time::now();
                    $condSample->groups = "PREPARATION";
                    $condSample->position = 3;
                    $condSample->save();


                }

                $param = Transaction_parameter::where('id_sample', $d['id'])->get();

                foreach($param as $p){
                    $checkfirst = ConditionLabCome::where('id_transaction_parameter',$p->id)->get();
                    if(count($checkfirst) < 1){
                        $addParam = new ConditionLabCome;
                        $addParam->id_transaction_parameter = $p->id;
                        $addParam->user_id = $id_user;
                        $addParam->inserted_at = time::now();
                        $addParam->save();
                    }
                }
            }

            $message = array(
                'success' => true,
                'message' => 'Data Successfully Approve'
            );
            return response()->json($message);

        } catch(\Exception $e){

            $data=array(
                'success'=>false,
                'message'=> $e->getMessage()
            );

            return response()->json($data);
        }
    }

    public function approveOneSampleTest(Request $request)
    {
        //try {
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            return $data;

            $condition = ConditionContractNew::where('sample_id', $data)->orderby('id_condition_contract', 'desc')->first();

            // sample
            $addSample = new ConditionContractNew ;
            $addSample->contract_id = $condition['contract_id'];
            $addSample->sample_id = $condition['sample_id'];
            $addSample->parameter_id = 0;
            $addSample->user_id = $id_user;
            $addSample->status = 0;
            $addSample->inserted_at = time::now();
            $addSample->groups = "LAB";
            $addSample->position = 4;
            $addSample->save();



            $count_condition = ConditionContractNew::where('contract_id', $condition['contract_id'])->where('status', 1)->where('sample_id', '!=', 0)->where('groups', 'PREPARATION')->count();
            $count_conditiont = ConditionContractNew::where('contract_id', $condition['contract_id'])->where('status', 0)->where('groups', 'LAB')->count();

            if($count_conditiont == $count_condition){
                    // sample
                $condSample = new ConditionContractNew ;
                $condSample->contract_id = $condition['contract_id'];
                $condSample->sample_id = 0;
                $condSample->parameter_id = 0;
                $condSample->user_id = $id_user;
                $condSample->status = 2;
                $condSample->inserted_at = time::now();
                $condSample->groups = "PREPARATION";
                $condSample->position = 3;
                $condSample->save();


            }

            $param = Transaction_parameter::where('id_sample', $data)->get();

            foreach($param as $p){
                $checkfirst = ConditionLabCome::where('id_transaction_parameter',$p->id)->get();
                if(count($checkfirst) < 1){
                    $addParam = new ConditionLabCome;
                    $addParam->id_transaction_parameter = $p->id;
                    $addParam->user_id = $id_user;
                    $addParam->inserted_at = time::now();
                    $addParam->save();
                }
            }


        $message = array(
            'success' => true,
            'message' => 'Data Successfully Approve'
        );
        return response()->json($message);

        // } catch(\Exception $e){

        //     $data=array(
        //         'success'=>false,
        //         'message'=> $e->getMessage()
        //     );

        //     return response()->json($data);
        // }
    }

    public function historyPreparation(Request $request)
    {
        //try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            $array = array();

            $m = ConditionContractNew::selectRaw('*')
            ->where(function ($query){
                $query->where('status',0)
                ->where('parameter_id',0)
                ->where('groups','LAB');
            })
            ->orWhere(function ($query){
                $query->where('status',1)
                ->where('parameter_id',0)
                ->where('groups','LAB');
            })
            ->orWhere(function ($query){
                $query->where('status',2)
                ->where('parameter_id',0)
                ->where('groups','LAB');
            })
            ->get();

            foreach ($m as $ksd) {
                $bb = ConditionContractNew::where('sample_id',$ksd->sample_id)->orderBy('sample_id','DESC')->get();
                   if($bb[count($bb) - 1]->groups == 'LAB'){
                       array_push($array,$bb[count($bb) - 1]->sample_id);
                   }
            }

            $model = TransactionSample::with([
                'kontrakuji',
                'bobotsample',
                'statuspengujian',
                'tujuanpengujian',
                'bobotsample.labname',
                'kontrakuji.contract_category',
                'kontrakuji.customers_handle',
                'kontrakuji.customers_handle.customers',
                'kontrakuji.customers_handle.contact_person',
                'sample_condition',
                'sample_condition_histprep',
                'sample_condition_histprep.user',
                'subcatalogue',
                'desc_prep'
            ])
            ->whereIn('id', $array);

            if(!empty($data['marketing'])){
                $marketing = $data['marketing'];
                $model = $model->whereHas('kontrakuji',function($query) use ($marketing){
                         $query->where(\DB::raw('UPPER(contract_no)'),'like','%'.$marketing.'%');
                });
            }

            if(!empty($data['category'])){
                $category = $data['category'];
                $model = $model->whereHas('kontrakuji.contract_category',function($query) use ($category){
                         $query->where('id', $category);
                });
            }


              if(!empty($data['customer_name'])){
                $customer_name = $data['customer_name'];
                $model = $model->whereHas('kontrakuji.customer_hamdle.customers',function($query) use ($customer_name){
                         $query->where('id', $customer_name);
                });
            }
            if(!empty($data['samplenumber'])){
                $model = $model-where(\DB::raw('UPPER(no_sample)'),'like','%'.$data['samplenumber'].'%');
            }
            return response()->json($model->orderBy('id', 'desc')->paginate(25));

        // } catch(\Exception $e){
        //     $data=array(
        //         'success'=>false,
        //         'message'=>'Saving Error'
        //     );
        //     return response()->json($data);
        // }
    }

    public function historyDownload(Request $request){

        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;

        $date = $request->input('data');

        $model = DB::select('
        SELECT 
            kontrak.contract_no,
            samples.no_sample,
            samples.sample_name, 
            catalogue.sub_catalogue_name, 
            statuses.name, 
            samples.tgl_estimasi_lab , 
            employees.employee_name AS user_sample, 
            employee.employee_name AS user_prep,  
            descr.desc,
            desck.desc as dest
            FROM (
                select * from condition_contracts 
                where groups = "PREPARATION" 
                and status = 1 
                and sample_id != 0 
                and date(inserted_at) BETWEEN "'. $date['tglStart'].'" AND "'. $date['tglStart'].'"
                group by sample_id ) AS conditions
        LEFT JOIN mstr_transaction_kontrakuji kontrak ON kontrak.id_kontrakuji = conditions.contract_id
        LEFT JOIN transaction_sample samples ON samples.id = conditions.sample_id
        LEFT JOIN mstr_transaction_statuspengujian statuses ON statuses.id = kontrak.`status`
        LEFT JOIN mstr_transaction_sub_catalogue catalogue ON catalogue.id_sub_catalogue = samples.id_subcatalogue
        LEFT JOIN users userses ON userses.id = conditions.user_id
        LEFT JOIN hris_employee employee ON employee.user_id = userses.id
        LEFT JOIN (SELECT * FROM description_info WHERE  groups = 3) AS descr ON descr.id_sample = conditions.sample_id
        LEFT JOIN (SELECT * FROM description_info WHERE  STATUS = 1 and groups = 2) AS desck ON desck.id_contract = conditions.contract_id
        INNER JOIN (select * from condition_contracts 
            where POSITION = 3 
            and STATUS = 2 
            and sample_id = 0 
            and date(inserted_at)  BETWEEN "'. $date['tglStart'].'" AND "'. $date['tglStart'].'") AS cond ON cond.contract_id = conditions.contract_id
        LEFT JOIN users userc ON userc.id = cond.user_id
        LEFT JOIN hris_employee employees ON employees.user_id = userc.id
        ');

        return response()->json($model);
    }

    public function detailHistory(Request $reuest)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        return $data;
    }

    public function deleteHistory(Request $request)
    {
        try {
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            $model = ConditionContractNew::where(function ($query) use ($data){
                $query->where('contract_id', $data)
                ->where('groups', 'LAB');
            })
            ->orWhere(function ($query) use ($data){
                $query->where('contract_id', $data)
                ->where('groups', 'PREPARATION');
            })
            ->get();

            foreach($model as $m){
                $del = ConditionContractNew::where('id_condition_contract', $m->id_condition_contract)->first();
                $del->delete();
            }

            $cek = ConditionContractNew::where('contract_id', $data)->where('sample_id', 0)->where('groups', 'KENDALI')->first();
            $cek->status = 0;
            $cek->save();

            $data=array(
                'success'=>true,
                'message'=>'Back to Control Success'
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


}
