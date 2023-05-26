<?php
namespace App\Http\Controllers\Complain;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Analysis\Transaction_parameter;
use App\Models\Analysis\TransactionSample;
use App\Models\Analysis\Kontrakuji;
use DB;
use Auth;
use Firebase\JWT\JWT;
use Carbon\Carbon as time;
use App\Models\Ecert\Complain;
use App\Models\Ecert\ConditionCert;
use App\Models\Master\Lod;
use App\Models\Master\Standart;
use App\Models\Master\Metode;
use App\Models\Master\Unit;
use App\Models\Master\Lab;
use App\Models\Complain\Nontechnical;
use App\Models\Complain\ComplainTechnical;
use App\Models\Complain\ComplainStatus;
use App\Models\Complain\ComplainTechnicalDetail;
use App\Models\Complain\ComplainTechnicalDetailChild;
use App\Models\Ecert\ParameterCert;
use App\Models\Ecert\EcertLhu;

class CsoController extends Controller
{
    public function index(Request $request)
    {   
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = Complain::with([
            'TransactionSample', 
            'ComplainTech',
            'TransactionSample.subcatalogue', 
            'TransactionSample.statuspengujian', 
            'TransactionCertificate',            
            'ComplainNonTech.division',
            'TransactionSample.kontrakuji.customers_handle.customers',
            'TransactionSample.kontrakuji.customers_handle.contact_person',
            'TransactionSample.kontrakuji.contract_category',
            'TransactionSample.statuspengujian']);
        

        if(!empty($data['marketing'])){
            $marketing = $data['marketing'];
            $m = Kontrakuji::where(\DB::raw('UPPER(contract_no)'),'like','%'.$marketing.'%')->get()->toArray();
            $z = array_map(function($p){
                return $p['id_kontrakuji'];
            },$m);

            $e = TransactionSample::whereIn('id_contract', $z)->get()->toArray();
            $ar = array_map(function($x){
                return $x['id'];
            },$e);

            $model = $model->whereIn('id_transaction_sample', $ar);          
        }

        if(!empty($data['customer_name'])){
            $id_customer = $data['customer_name'];
            $model = $model->whereHas('TransactionCertificate',function($query) use ($id_customer){
                    $query->where(\DB::raw('UPPER(customer_name)'),'like','%'.$id_customer.'%');
            });
        }

        if(!empty($data['lhu'])){
            $lhu = $data['lhu'];
            $model = $model->whereHas('TransactionCertificate',function($query) use ($lhu){
                    $query->where(\DB::raw('UPPER(lhu_number)'),'like','%'.$lhu.'%');
            });
        }     

        if(!empty($data['typeAdd'])){
            $model = $model->where('typeAdd',$data['typeAdd']);
        }

        if(!empty($data['status'])){
            $model = $model->where('type',$data['status']);
        }

        if(!empty($data['day'])){
            $model = $model->WhereDay('created_at',$data['day']);
        }

        
        if(!empty($data['month'])){
            $model = $model->whereMonth('created_at',$data['month']);
        }

        
        if(!empty($data['year'])){
            $model = $model->whereYear('created_at',$data['year']);
        }
        
        if($data['type'] == 'paginate'){
            $model= $model->orderBy('id', 'desc')->paginate(25);
        }else{            
            $model= $model->orderBy('id', 'desc')->get();
        }

        return response()->json($model);

    }


   public function show(Request $request,$id)
    {   
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        

        $model = Complain::with([
            'TransactionSample', 
            'ComplainTech',
            'TransactionSample.subcatalogue', 
            'TransactionSample.statuspengujian', 
            'TransactionCertificate',            
            'TransactionSample.kontrakuji.customers_handle.customers',
            'TransactionSample.kontrakuji.customers_handle.contact_person'])
                 ->whereHas('ComplainTect', function($q) use ($id){
                     return $q->where('id',$id);
                 })->first();

        

        return response()->json($model);
    }


    public function checkDoubleAddData(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = Complain::where('id_cert', $data['idLhu'])->count();
        return $model;
    }


     public function addData(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = New Complain;
        $model->id_cert                 = $data['idLhu'];
        $model->id_transaction_sample   = $data['idSample'];
        $model->subject                 = $data['subject'];
        $model->type                    = $data['type'];
        $model->typeadd                 = $data['typeAdd'];
        $model->message                 = $data['message'];
        $model->status                  = 0;
        $model->user_id                 = $id_user;
        $model->save();

        $message = array(
            'status' => true,
            'message' => 'success'
        );

        return response()->json($message);
    }

     public function getParameter(Request $request){


        $var = ParameterCert::with([
            'Ecertlhu'
        ])
        ->whereHas('Ecertlhu',function($q) use ($request){
            return $q->where('id',$request->input('idsample'));
        })->get();



        return response()->json($var);
    }

    public function addNonteknis(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = New Nontechnical;
        $model->id_complain =  $data['id_complain'];
        $model->id_user = $id_user;
        $model->id_division = $data['bagian'];
        $model->complain= $data['complain'];
        $model->message= $data['message'];
        $model->date_complain= date('Y-m-d',strtotime($data['date_complain']));
        $model->finish_date= date('Y-m-d',strtotime($data['finish_complain']));
        $model->status = 0;
        $model->save();

        $changeStat = Complain::where('id', $data['id_complain'])->first();
        $changeStat->status = 1;
        $changeStat->select = 2;
        $changeStat->save();

        $message = array(
            'status' => true,
            'message' => 'success'
        );

        return response()->json($message);
    }

    public function getLHU(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = ConditionCert::with('transaction_sample_cert')
        ->where('id_contract', $data)
        ->get();

        return $model;
    }


    public function getDataParameterChild(Request $request, $id){
        try {
            
            $var = ComplainTechnicalDetail::with([
            'status',
            'complain_tech',
            'parameteruji',
            'metode',
            'unit',
            'standart',
            'lab',
            'lod'
            ])
            ->where('id_tech_det',$id)
            ->get();
            return response()->json($var);
        } catch (\Exception $e){
            return response()->json($e->getMessage());
        }
    }

    public function canceldatacomplain(Request $request){
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            $x = new ComplainStatus;
            $x->id_technical_det = $data['id'];
            $x->status = 2;
            $x->position = 2;
            $x->user_id = $id_user;
            $x->inserted_at = time::now();
            $x->save();

            return response()->json(array(
                "success" => true,
                "message" => "Mantap"
            ));
            
        } catch (\Exception $e){
            return response()->json($e->getMesage());
        }
    }

   public function savingdataparameter(Request $request){
        try {   

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            foreach($data as $k){
                $y = ComplainTechnicalDetail::find($k['idtechdet']);
                $y->hasil_awal = $k['hasiluji_awal'];
                $y->complain_result = $k['complain_result'];
                $y->actual_complain_result = $k['complain_arresult'];
                $y->memo = $k['memo'];
                $y->status_prep = intval($k['status_prep']);
                $y->result_date = time::now();
                $y->current_status = $k['status'] == 'rm' ? 2 : 1;
                $y->save();

                $h = Transaction_parameter::find($y->id_transaction_parameter);
                $h->id_lod = $k['id_lod'];
                $h->id_metode = $k['metode'];
                $h->id_unit = $k['id_unit'];
                $h->save();

                if($k['status'] == 'rm'){
                    $x = new ComplainStatus;
                    $x->id_technical_det = $y->id;
                    $x->status = 2;
                    $x->position = 3;
                    $x->user_id = $id_user;
                    $x->inserted_at = time::now();
                    $x->save();
                }
            }

            return response()->json(array(
                "success" => true,
                "message" => "Success"
            ));

        }catch(\Exception $e){
            return response()->json($e->getMessage());
        }
    }

    public function get_info(Request $request){
        try {
            $var = ComplainStatus::with([
                'employee'
            ])->where('id_technical_det',$request->input('iddet'))->get();

            return response()->json($var);
            
        } catch (\Exception $e){
            return response()->json($e->getMessage());
        }
    }

    public function store(Request $request){
        //try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');
         
            
            $year = time::now()->format('Y');
            $month = time::now()->format('m');
            $h = ComplainTechnical::select(\DB::raw('MAX(CAST(SUBSTRING_INDEX(complain_no,".",-1) AS SIGNED)) AS terakhir'))->where(\DB::raw('MONTH(complain_date)'),$month)->where(\DB::raw('year(complain_date)'),$year)->first();

            $nomor = $h->terakhir + 1;
            $complain_no = substr($year,2).''.$month.'.CL.'.$this->leftPad($nomor, 6);
            
           if($data['status_select'] == 'cs'){
            $x = new ComplainTechnical;
            $x->id_complain = $data['id_complain'];
            $x->complain_no = $complain_no;
            $x->id_contract = $data['id_contract'];
            $x->complain_date = time::parse($data['date_complain'])->format('Y-m-d');
            $x->estimate_date = time::parse($data['finish_complain'])->format('Y-m-d');
            $x->status_ticket = 0;
            $x->save();

            foreach($data['parameterarray'] as $k){

                
                // return $k;
                $stndr = !empty($k['standart']) ? $k['standart'] : '-';
                $lods = !empty($k['lod']) ? $k['lod'] : '-';
                $mtd = !empty($k['metode']) ? $k['metode'] : '-';
                $unt = !empty($k['unit']) ? $k['unit'] : '-';
                $lb = !empty($k['nama_lab']) ? $k['nama_lab'] : '-';
                
                $id_lod = Lod::where('nama_lod','like','%'.$lods.'%')->first();
                $id_metode = Metode::where('metode',$mtd)->first();
                $id_standart = Standart::where('nama_standart',$stndr)->first();
                $id_lab = Lab::where('nama_lab',$lb)->first();
                $id_unit = Unit::where('nama_unit',$unt)->first();

                
        
                $c = new ComplainTechnicalDetail;
                $c->id_parameter_lhu = $k['id'];
                $c->id_tech_det = $x['id'];
                $c->id_parameteruji = $k['id_parameteruji'];
                $c->complain_desc = intval($k['complain']);
                $c->expectation = !empty($k['expetation']) ? $k['expetation'] : null;
                $c->preparation_status = 0;

                $c->id_lod = !is_null($k['lod']) ? $id_lod->id : null ;
                $c->id_metode = !is_null($k['metode']) ? ($id_metode ? $id_metode->id : null) : null;
                $c->id_lab = !is_null($k['nama_lab']) ? ($id_lab ? $id_lab->id : null) : null;
                $c->id_unit = !is_null($k['unit']) ? ($id_unit ? $id_unit->id : null) : null;
                $c->id_standart = !is_null($k['standart']) ? ($id_standart ? $id_standart->id : null) : null;
                $c->hasiluji = !is_null($k['hasiluji']) ? $k['hasiluji'] : null;
                $c->ar = !is_null($k['actual_result']) ? $k['actual_result'] : null;
                $c->status_parameter = 0;
                $c->status_complain = 0;
                $c->save();
            }
           }



           $d = new ComplainStatus;
           $d->id_technical = $x->id;
           $d->status = 0;
           $d->position = 1;
           $d->user_id = $id_user;
           $d->inserted_at = time::now();
           $d->save();

           $changeStat = Complain::where('id', $data['id_complain'])->first();
           $changeStat->status = 1;
           $changeStat->select = 1;
           $changeStat->save();


           $r = Kontrakuji::find($data['contract_no']);
           $r->st_complain = 1;
           $r->save();

            return response()->json(array(
                "success" => true,
                "message" => "Saving Success"
            ));

        // } catch (\Exception $e){
        //     return response()->json(array(
        //         "success" => false,
        //         "message" => "Saving Error"
        //     ));
        // }
    }

    public function sendExpectation(Request $request){
        try {
            
            $data = $request->input('data');

            foreach($data as $d){

                $var = ComplainTechnicalDetail::find($d['id']);
                $var->expectation = $d['expectation'];
                $var->save();
    
                $c = ComplainTechnical::find($var->id_technical_complain);
                $c->estimate_date = strpos($d['estimate_date'],'T') ? explode("T",$d['estimate_date'])[0] : $d['estimate_date'];
                $c->save();
            }
         
            
            return response()->json(array(
                "status" => true,
                "message" => "Success"
            ));

        } catch (\Exception $e){
            return response()->json($e->getMessage());
        }
    }

    public function setDataPrep(Request $request){
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            
            $var = ComplainTechnicalDetail::find($request->input('idtechdet'));
            $var->preparation_status = $request->input('value');
            $var->save();

            $chst = ComplainStatus::where('id_technical_det',$request->input('idtechdet'))->where('position',3)->where('status',1)->first();

            if($chst){
                $del = ComplainStatus::find($chst->id);
                if($del){
                    $del->forceDelete();
                }
            }

            if($request->input('value') > 1){
                $chstnew = ComplainStatus::where('id_technical_det',$request->input('idtechdet'))
                ->where('position',3)
                ->get();

                if(count($chstnew) > 0){
                    foreach($chstnew as $ch){

                        $ff = ComplainStatus::find($ch->id);

                        if($ff){
                            $del = $ff->forceDelete();
                        }
                    }
                }
            } else {
                $chstnew = new ComplainStatus;
                $chstnew->id_technical_det = $request->input('idtechdet');
                $chstnew->status = $request->input('value') - 1;
                $chstnew->position = 3;
                $chstnew->user_id = $id_user;
                $chstnew->inserted_at = time::now();
                $chstnew->save();
            }
          


            return response()->json(array(
                "status" => true,
                "message" => 'Success'
            ));
        } catch (\Exception $e){
            return response()->json($e->getMessage());
        }
    }

    public function getAllResult(Request $request){
        try {
            $var = ComplainTechnicalDetail::with([
                'complaindetagain.transactionparameter.unit',
                'complaindetagain.transactionparameter.standart',
                'complaindetagain.transactionparameter.metode',
                'complaindetagain.transactionparameter.lod',
                'complaindetagain.transactionparameter.parameteruji',
                'transactionparameter.unit',
                'transactionparameter.standart',
                'transactionparameter.metode',
                'transactionparameter.lod',
                'transactionparameter.parameteruji',
            ])->find($request->input('idcompltech'));

            return response()->json($var);
            
        } catch(\Exception $e){
            return response()->json($e->getMessage());
        }
    }

    public function setstatustechnicaldetail(Request $request){
        try {
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');
            $st = $request->input('data')['st'];

           foreach($data['data'] as $d){
            if($st > 0){
                $h = ComplainStatus::where('id_technical_det',$d['id'])
                ->where('status',($st-1))
                ->where('position',2)
                ->first();

                if($h){
                    $del = ComplainStatus::find($h->id);
                    if($del){
                        $del->forceDelete();
                    }
                }

                $f = new ComplainStatus;
                $f->id_technical_det = $d['id'];
                $f->id_technical = $d['id_tech_det'];
                $f->status = $st - 1;
                $f->position = 2;
                $f->user_id = $id_user;
                $f->inserted_at = time::now();
                $f->save();

                $detset = ComplainTechnicalDetail::where('id_tech_det',$d['id_tech_det'])->get();

                $cst = ComplainStatus::where('id_technical',$d['id_tech_det'])
                ->where('status',($st - 1))
                ->where('position',2)
                ->groupBy('id_technical_det')
                ->get();

                if(count($detset) == count($cst)){
                    $h = ComplainTechnical::find($d['id_tech_det']);
                    $h->status_ticket = $st;
                    $h->save();
                }
            } else {
                $h = ComplainStatus::where('id_technical_det',$d['id'])
                ->where('position',2)
                ->first();

                if($h){
                    $del = ComplainStatus::find($h->id);
                    if($del){
                        $del->forceDelete();
                    }
                }

                $h = ComplainTechnical::find($d['id_tech_det']);
                $h->status_ticket = 0;
                $h->save();
            }
           }
       
            
            return response()->json(array(
                "status" => true,
                "message" => "Saving Success"
            ));

        } catch(\Exception $e){
            return response()->json($e->getMessage());
        }
    }
    
    public function setStatusComplain(Request $request){
        try {

            
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $id = $request->input('id_complain');
            $st = $request->input('status');
            $pst = $request->input('position');
            
            $k = ComplainStatus::where('position',1)
            ->where('status',1)
            ->where('id_technical',$id)
            ->first();

            if($k){
                $del = ComplainStatus::find($k->id);
                if($del){
                    $del->forceDelete();
                }
            }
            
            $n = new ComplainStatus;
            $n->id_technical = $id;
            $n->status = $st;
            $n->position = 1;
            $n->user_id = $id_user;
            $n->inserted_at = time::now();
            $n->save();

            if($st == 1){
                $x = ComplainTechnical::find($id);
                $x->status_ticket = 1;
                $x->save();

                $g = ComplainTechnicalDetail::where('id_tech_det',$id)
                ->where('status_parameter',0)
                ->get();

                foreach($g as $z){
                    $ch = ComplainStatus::where('position',2)
                    ->where('status',0)
                    ->where('id_technical_det',$z['id'])
                    ->first();

                    if($ch){
                        $del = ComplainStatus::find($ch->id);

                    if($del){
                        $del->forceDelete();
                    }
                }

                $ga = new ComplainStatus;
                $ga->id_technical = $id;
                $ga->id_technical_det = $z['id'];
                $ga->status = 0;
                $ga->position = 2;
                $ga->user_id = $id_user;
                $ga->inserted_at = time::now();
                $ga->save();
            }
            } else if($st == 2){
                $x = ComplainTechnical::find($id);
                $x->status_ticket = $st;
                $x->save();

                $g = ComplainTechnicalDetail::where('id_tech_det',$id)->where('status_parameter',0)->get();

                

                foreach($g as $z){
                    $ch = ComplainStatus::where('position',2)->where('id_technical_det',$z['id'])->first();

                    if($ch){
                        $del = ComplainStatus::find($ch['id']);
                        if($del){
                            $del->forceDelete();
                        }                    
                    }

                    $nstlab = new ComplainStatus;
                    $nstlab->id_technical = $id;
                    $nstlab->id_technical_det = $z['id'];
                    $nstlab->status = 1;
                    $nstlab->position = 2;
                    $nstlab->user_id = $id_user;
                    $nstlab->inserted_at = time::now();
                    $nstlab->save();
                }

                

            } else if($st == 0){
                $x = ComplainTechnical::find($id);
                $x->status_ticket = $st;
                $x->save();

                $f = ComplainTechnicalDetail::where('id_tech_det',$id)->get();

                foreach($f as $z){
                    $g = ComplainStatus::where('id_technical_det',$z->id)->first();
                    if($g){
                        $dl = ComplainStatus::find($g->id);
                        if($dl){
                            $dl->forceDelete();
                        }
                    }
                }

                $g = ComplainStatus::where('position','<>',1)->get();

                foreach($g as $z){
                    $ch = ComplainStatus::find($z['id'])->where('id_technical',$id);

                    if($ch){
                        $ch->forceDelete();
                    
                    }
                }
            } else {
                $x = ComplainTechnical::find($id);
                $x->status_ticket = $st;
                $x->save();

                $f = ComplainTechnicalDetail::where('id_tech_det',$id)->get();

                foreach($f as $v){
                    $g = ComplainStatus::where('position','!=',1)->where('id_technical_det',$v['id'])->first();
                    if($g){
                        $dl = ComplainStatus::find($g->id);
                        if($dl){
                            $dl->forceDelete();
                        }
                    }
                }
                

                foreach($g as $z){
                    $ch = ComplainStatus::find($z['id']);

                    if($ch){
                        $ch->forceDelete();
                    
                    }
                }
            }

            return response()->json(array(
                'status'  => true,
                "message" => "Saving Success"
            ));

        } catch (\Exception $e){

            return response()->json($e->getMessage());

        }
    }

    public function recapDownload(Request $request){
        try {

            $var = ComplainTechnicalDetail::with([
                'complainhead'
            ])->whereHas('complainhead',function($q) use ($request){
                return $q->whereBetween('complain_date',[$request->input('from'), $request->input('to')]);
            })->get()->toArray();

            $io = [];

            foreach($var as $v){
                $u = \DB::table('transaction_sample as a')
                ->join('mstr_transaction_kontrakuji as b','b.id_kontrakuji','a.id_contract')
                ->leftJoin('mstr_transaction_sub_catalogue as c','c.id_sub_catalogue','a.id_subcatalogue')
                ->leftJoin('mstr_customers_handle as d','d.idch','b.id_customers_handle')
                ->leftJoin('mstr_customers_customer as e','e.id_customer','d.id_customer')
                ->where('a.id',$v['complainhead']['id_sample'])->first();
                
                $p = \DB::table('transaction_parameter as f')
                ->leftJoin('mstr_laboratories_parameteruji as g','g.id','f.id_parameteruji')->where('f.id',$v['id_transaction_parameter'])
                ->leftJoin('mstr_laboratories_lab as h','h.id','f.id_lab')
                ->select('g.name_id','h.nama_lab')->first();

                $o = '';
                if (!isset($v['status_done'])){
                    if($v['status_done'] == 0){
                        $o = 'Verified';
                    } else if($v['status_done'] == 1){
                        $o = 'Not Verified';
                    } else {
                        $o = 'Penyesuaian';
                    }
                } else {
                    $o = 'Not done yet';
                }

                $h = '';

                if($v['complain_desc'] == 1){
                    $h = 'Hasil Ketinggian';
                } else if($v['complain_desc'] == 2){
                    $h = 'Kerendahan';
                } else {
                    $h = 'Tidak sesuai spek';
                }

                array_push($io, array(
                    "bulan" => time::parse($v['complainhead']['complain_date'])->format('M'),
                    "tgl_complain" => time::parse($v['complainhead']['complain_date'])->format('d/m/Y'),
                    "tgl_estimasi" => time::parse($v['complainhead']['estimate_date'])->format('d/m/Y'),
                    "contract_no" => $u->contract_no,
                    "cust" => $u->customer_name,
                    "sample_no" => $u->no_sample,
                    "parameter" => $p->name_id,
                    "complain" => $h,
                    "matriks" => $u->sub_catalogue_name,
                    "lab" => $p->nama_lab,
                    "status_complain" => $o
                    
                ));

            }



            return response()->json($io);

        }catch(\Exception $e){
            return response()->json($e->getMessage);
        }
    }

    public function getParameterLab(Request $request){
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $zxc = ComplainTechnicalDetail::select('id_transaction_parameter')->get()->toArray();
        $zzzzz = \DB::table('transaction_parameter')->select('id','id_parameteruji')->where('id_lab',$data['idlab'])->whereIn('id',$zxc)->get()->toArray();
        $asd =  array_map(function($x) {
            return $x->id;
        }, $zzzzz);

        $var = ComplainTechnicalDetail::with([
            'transactionparameter' => function($q) use ($data){
                return $q->where('id_lab',$data['idlab']);
            },
            'status.employee',
            'complainhead',
            'transactionparameter.parameterujiOne',
            'transactionparameter.lab',
            'transactionparameter.standart',
            'transactionparameter.unit',
            'transactionparameter.lod',
            'transactionparameter.transaction_sample.subcatalogue',
            'transactionparameter.transaction_sample.kontrakuji',
        ])
        ->whereIn('id_transaction_parameter',$asd)
        ->where('current_status',1);

        if(!empty($data['id_parameteruji'])){

            $cv = \DB::connection('mysql')->table('transaction_parameter')
            ->select('id')
            ->where('id_lab',$data['idlab'])
            ->where('id_parameteruji',$data['id_parameteruji'])
            ->whereIn('id',$zxc)
            ->get()
            ->toArray();

            $filteredcv = array_map(function($q){
                return $q->id;
            },$cv);


            $var = $var->whereIn('id_transaction_parameter', $filteredcv);
        }
        

        if($data['status_prep'] !== 'all'){
            $var = $var->where('status_prep',$data['status_prep']);
        }

        if(!empty($data['search'])){
            
            $cva = \DB::connection('mysql')
            ->table('transaction_parameter as a')
            ->select('a.id')
            ->join('transaction_sample as b','b.id','a.id_sample')
            ->join('mstr_transaction_kontrakuji as c','c.id_kontrakuji','b.id_contract')
            ->where('a.id_lab',$data['idlab'])
            ->where('c.contract_no','like','%'.strtoupper($data['search']).'%')
            ->whereIn('a.id',$zxc)
            ->get()
            ->toArray();

            if(count($cva)){
                $filteredcva = array_map(function($q){
                    return $q->id;
                },$cva);
    
    
                $var = $var->whereIn('id_transaction_parameter', $filteredcva);
            } else {
                $var = $var->where('complain_no','like','%'.$data['search'].'%');
            }

        }

        if(!empty($data['estimasi_lab'])){
            $dateparse = time::parse($data['estimasi_lab'])->format('Y-m-d');

            $var = $var->whereHas('complainhead',function($cx) use($dateparse){
                return $cx->where(\DB::raw('DATE_FORMAT(complain_date,"%Y-%m-%d")'),$dateparse);
            });
        }

        if(!empty($data['contractcategory'])){
            $cvb = \DB::connection('mysql')
            ->table('transaction_parameter as a')
            ->select('a.id')
            ->join('transaction_sample as b','b.id','a.id_sample')
            ->join('mstr_transaction_kontrakuji as c','c.id_kontrakuji','b.id_contract')
            ->where('a.id_lab',$data['idlab'])
            ->where('c.id_contract_category',$data['contractcategory'])
            ->whereIn('a.id',$zxc)
            ->get()
            ->toArray();

            $filteredcvb = array_map(function($q){
                return $q->id;
            },$cvb);

            $var = $var->whereIn('id_transaction_parameter', $filteredcvb);
        }

        $var = $var->paginate(50);



        return response($var);
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

    public function deleteComplaint(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = Complain::where('id', $data)->first();
        $model->delete();

        return response()->json(array(
            "status" => true,
            "message" => "Delete Success"
        ));

    }

    public function showComplain(Request $request, $id_tech)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');


        $model = ComplainTechnical::with([
            'complain',
            'kontrakUji.customers_handle.customers',
            'kontrakUji.customers_handle.contact_person',
            'complain.TransactionCertificate',
            'statusTechnical'
            ])->where('id', $data['id_complain'])->first();

        return response()->json($model);
    }

    public function showComplainDetail(Request $request, $id_tech)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = ComplainTechnicalDetail::with([
            'complain_tech',
            'certificateParameter',
            'lab'
        ])->where('id_tech_det', $id_tech)
        ->get();

        return response()->json($model);
    }

    public function cancelStatus(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');


        $complain = Complain::where('id', $data['id_complain'])->first();
        $complain->status = 3;
        $complain->save();

        $comp = New ComplainStatus;
        $comp->id_technical = $data['status_technical'][0]['id_technical'];
        $comp->inserted_at = time::now();
        $comp->position = 1;
        $comp->status = 3;
        $comp->user_id = $id_user;
        $comp->save();

        return response()->json(array(
            "status" => true,
            "message" => "Cancel Data Success"
        ));

        
    }

    public function backStatus(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $complain = Complain::where('id', $data['id_complain'])->first();
        $complain->status = 1;
        $complain->save();

        $comp = ComplainStatus::where('id_technical', $data['status_technical'][0]['id_technical'])->where('status', 3)->first();
        $comp->delete();


        return response()->json(array(
            "status" => true,
            "message" => "Cancel Data Success"
        ));
    }

    public function addParameterinCso(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $checkComplain = ComplainTechnical::where('id_complain', $data['id_complain'])->first();
        $cekParamCert = ParameterCert::where('id', $data['parameter'])->first();
        $checkCert = Ecertlhu::where('id', $cekParamCert->id_transaction_sample)->first();
        $checkParam = Transaction_parameter::where('id_sample', $checkCert->id_transaction_sample)->first();

        $model = New ComplainTechnicalDetail;
        $model->id_tech_det = $checkComplain->id;
        $model->id_parameter_lhu = $data['parameter'];
        $model->id_parameteruji = $checkParam->id;
        $model->expectation = $data['expectation'];
        $model->complain_desc = $data['complain'];
        $model->status_cust = '';
        $model->preparation_status = 0;
        $model->complain_result = '';
        $model->complain_arresult = '';
        $model->id_metode = $checkParam->id_metode;
        $model->id_unit = $checkParam->id_unit;
        $model->id_standart = $checkParam->id_standart;
        $model->id_lab = $checkParam->id_lab;
        $model->id_lod = $checkParam->id_lod;
        $model->hasiluji = $cekParamCert->hasiluji;
        $model->ar = $cekParamCert->actual_result;
        $model->memo = $cekParamCert->desc;
        $model->status_parameter = 0;
        $model->status_complain = 0;
        $model->save();

        return response()->json(array(
            "status" => true,
            "message" => "Updated Data Success"
        ));
    }

    public function deleteParameterTechComplain(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = ComplainTechnicalDetail::where('id', $data)->first();
        $model->delete();

        return response()->json(array(
            "status" => true,
            "message" => "Deleted Data Success"
        ));
    }

    public function downloadData(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = Complain::with([
            'TransactionSample', 
            'TransactionSample.subcatalogue', 
            'TransactionSample.statuspengujian', 
            'TransactionCertificate',  
            'TransactionSample.kontrakuji.customers_handle.customers',
            'TransactionSample.kontrakuji.customers_handle.contact_person',
            'TransactionSample.kontrakuji.contract_category',
            'TransactionSample.statuspengujian']);
        

        if(!empty($data['marketing'])){
            $marketing = $data['marketing'];
            $m = Kontrakuji::where(\DB::raw('UPPER(contract_no)'),'like','%'.$marketing.'%')->get()->toArray();
            $z = array_map(function($p){
                return $p['id_kontrakuji'];
            },$m);

            $e = TransactionSample::whereIn('id_contract', $z)->get()->toArray();
            $ar = array_map(function($x){
                return $x['id'];
            },$e);

            $model = $model->whereIn('id_transaction_sample', $ar);          
        }

        if(!empty($data['customer_name'])){
            $id_customer = $data['customer_name'];
            $model = $model->whereHas('TransactionCertificate',function($query) use ($id_customer){
                    $query->where(\DB::raw('UPPER(customer_name)'),'like','%'.$id_customer.'%');
            });
        }

        if(!empty($data['lhu'])){
            $lhu = $data['lhu'];
            $model = $model->whereHas('TransactionCertificate',function($query) use ($lhu){
                    $query->where(\DB::raw('UPPER(lhu_number)'),'like','%'.$lhu.'%');
            });
        }     

        if(!empty($data['typeAdd'])){
            $model = $model->where('typeAdd',$data['typeAdd']);
        }

        if(!empty($data['status'])){
            $model = $model->where('type',$data['status']);
        }

        if(!empty($data['day'])){
            $model = $model->WhereDay('created_at',$data['day']);
        }

        
        if(!empty($data['month'])){
            $model = $model->whereMonth('created_at',$data['month']);
        }

        
        if(!empty($data['year'])){
            $model = $model->whereYear('created_at',$data['year']);
        }
        
        $model= $model->orderBy('id', 'desc')->get()->toArray();
       
        $complain = array_map(function ($model) {
            return $model['id'];
        }, $model);

        $tech = ComplainTechnical::whereIn('id_complain', $complain)->get()->toArray();
        $techId = array_map(function ($tech) {
            return $tech['id'];
        }, $tech);

        $param = ComplainTechnicalDetail::with([
            'complain_tech.kontrakUji.customers_handle.customers',
            'complain_tech.kontrakUji.customers_handle.contact_person',
            'complain_tech.complain.TransactionCertificate',
            'parameteruji',
            'unit',
            'complain_tech.complain.user'
            ])->whereIn('id_tech_det', $techId)->get();

        return $param;

    }

    

}