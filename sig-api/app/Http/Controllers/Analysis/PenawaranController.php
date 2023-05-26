<?php 
namespace App\Http\Controllers\Analysis;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Analysis\ConditionContractNew;
use App\Models\Analysis\TransactionPenawaran;
use App\Models\Analysis\TransactionPenawaranSample;
use App\Models\Analysis\TransactionPenawaranParameter;
use App\Models\Analysis\TransactionPenawaranPayment;
use App\Models\Analysis\TransactionPenawaranFormat;
use App\Models\Analysis\TransactionPenawaranStatus;
use App\Models\Analysis\TransactionPenawaranAttachment;
use App\Models\Hris\Employee;
use App\Models\Analysis\AkgTransaction;
use App\Models\Analysis\TransactionSamplingPenawaran;
use Illuminate\Support\Facades\Mail;
use App\Models\Master\SubSpecificPackage;
use Firebase\JWT\JWT;
use App\Models\Master\ContractCategory;
use App\User;
use Illuminate\Support\Facades\File;
use DB;
use Carbon\Carbon as time;
use Auth;
class PenawaranController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
    */

    public function index2(Request $request){
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            $t = Employee::where('user_id',$id_user)->first();
            
            $var = TransactionPenawaran::with([
                'customers_handle.customers',
                'payment',
                'user_created',
                'sales_name',
                'tphs.payment',
                'tphs.status.user_created',
                'contract'
            ])->orderBy(\DB::raw(
                'CAST(SUBSTRING_INDEX(no_penawaran,".",-1) AS SIGNED)'
            ),'desc')
            ->whereNull('status')->where('current_status','<>',3);


            if($data['contract_category'] !== 0){
                $var = $var->where('id_contract_category',$data['contract_category']);
            }

            if($data['customers'] !== 0){
                $var = $var->whereHas('customers_handle',function($q) use($data){
                    return $q->whereHas('customers', function($r) use($data){
                        return $r->where('id_customer',$data['customers']);
                    });
                });
            }

            if($data['sales'] !== 0){
                $var = $var->whereHas('sales_name', function($q) use($data){
                    return $q->where('employee_id',$data['sales']);
                });
            }

            if(!is_null($data['search'])){
                $var = $var->where('no_penawaran','like','%'.$data['search'].'%');
            }

            if($data['status'] !== 0){
                $var = $var->where('current_status',$data['status']);
            }
            
            if($t->id_sub_bagian == 37 || $t->id_sub_bagian == 38 || $t->id_sub_bagian == 40){
                $var = $var->simplePaginate(25);
                return response()->json($var);
                
            } else{
               if($t->id_level > 18){
                $var = $var->where('clienthandling',$t->employee_id)->simplePaginate(25);
                return response()->json($var);
               } else {
                $var = $var->simplePaginate(25);
                return response()->json($var);
               }
            }


        } catch (\Exception $e){
            return response()->json($e->getMessage());
        }
    }

    public function index(Request $request){
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            $t = Employee::where('user_id',$id_user)->first();
            
            $var = TransactionPenawaran::with([
                'customers_handle.customers',
                'payment',
                'user_created',
                'sales_name',
                'tphs.payment',
                'tphs.status.user_created',
                'contract'
            ])->orderBy('id','desc')
            // ->whereHas('tphs')
            ->where('current_status','<>',3);


            if($data['contract_category'] !== 0){
                $var = $var->where('id_contract_category',$data['contract_category']);
            }

            if($data['used'] !== 0){
                if($data['used'] == 1){
                    $var = $var->whereIn('transaction_penawaran.id',[\DB::raw('(SELECT id_penawaran FROM mstr_transaction_kontrakuji WHERE id_penawaran IS NOT NULL GROUP BY id_penawaran)')]);
                } else {
                    $var = $var->whereNotIn('transaction_penawaran.id',[\DB::raw('(SELECT id_penawaran FROM mstr_transaction_kontrakuji WHERE id_penawaran IS NOT NULL GROUP BY id_penawaran)')]);
                }
            }

            if($data['customers'] !== 0){
                $var = $var->whereHas('customers_handle',function($q) use($data){
                    return $q->whereHas('customers', function($r) use($data){
                        return $r->where('id_customer',$data['customers']);
                    });
                });
            }

            if($data['sales'] !== 0){
                $var = $var->whereHas('sales_name', function($q) use($data){
                    return $q->where('employee_id',$data['sales']);
                });
            }

            if(!is_null($data['search'])){
                $var = $var->where('no_penawaran','like','%'.$data['search'].'%');
            }

            if($data['status'] !== 0){
                $var = $var->where('current_status',$data['status']);
            }
            
            if($t->id_sub_bagian == 37 || $t->id_sub_bagian == 38 || $t->id_sub_bagian == 40){
                $var = $var->simplePaginate(25);
                return response()->json($var);
                
            } else{
               if($t->id_level > 18){
                $var = $var->where('clienthandling',$t->employee_id)->simplePaginate(25);
                return response()->json($var);
               } else {
                $var = $var->simplePaginate(25);
                return response()->json($var);
               }
            }


        } catch (\Exception $e){
            return response()->json($e->getMessage());
        }
    }

    public function index_contract(Request $request){
        try {
            
            $var = TransactionPenawaran::with([
                'customers_handle.customers',
                'customers_handle.contact_person',
                'payment',
                'format',
                'user_created',
                'sales_name.position',
                'transactionPenawaranSample.status_pengujian',
                'transactionPenawaranSample.transactionPenawaranParameter',
                'transactionPenawaranSample.transactionPenawaranParameter.lod',
                'transactionPenawaranSample.transactionPenawaranParameter.metode',
                'transactionPenawaranSample.transactionPenawaranParameter.lab',
                'transactionPenawaranSample.transactionPenawaranParameter.unit',
                'transactionPenawaranSample.transactionPenawaranParameter.parameteruji.parameterinfo',
            ])
            ->where('current_status','<>',3);


            if(!empty($request->input('search'))){
                $var = $var->where(\DB::raw('lower(no_penawaran)'),'like','%'.$request->input('search').'%');
            }
            
            if(!empty($request->input('sales'))){
                $g = Employee::find($request->input('sales'));

                if($g->id_sub_bagian == 37 || $g->id_sub_bagian == 38 || $g->id_sub_bagian == 40){
                    $var = $var;
                } else {
                    $var = $var->where('clienthandling',$request->input('sales'));
                }
            }
            
            $var =$var->paginate(25);

            return response()->json($var);

        } catch (\Exception $e){
            return response()->json($e->getMessage());
        }
    }

    public function getAttachment(Request $request)
    {
        try {

            $var = TransactionPenawaranAttachment::where('id_tp', $request->input('id_tp'))->get();
            return response()->json($var);

        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function sendAttachment(Request $request, $id)
    {
        
        try {


            

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;


            $response = null;

            $getPenawaran = TransactionPenawaran::find($id);
            $attachmentPenawaran = TransactionPenawaranAttachment::where('id_tp', $id)->get();

            $year = time::parse($getPenawaran->created_at)->format('Y');
            $month = time::parse($getPenawaran->created_at)->format('F');

            $data = (object) ['file' => ""];

            if ($request->hasFile('file')) {
                $original_filename = $request->file('file')->getClientOriginalName();
                $original_filename_arr = explode('.', $original_filename);
                $file_ext = end($original_filename_arr);
                $destination_path = './penawaran/'.$year.'/'.$month.'/' . $getPenawaran->no_penawaran . '/attachment/';
                $filename = 'attachment_penawaran_' . (count($attachmentPenawaran) + 1) . '-' . $getPenawaran->no_penawaran . '.' . $file_ext;
    
                if ($request->file('file')->move($destination_path, $filename)) {
                    $data->file = './penawaran/'.$year.'/'.$month. '/' . $getPenawaran->no_penawaran . '/attachment/' . $filename;
    
                    $setAttachment = new TransactionPenawaranAttachment;
                    $setAttachment->id_tp = $id;
                    $setAttachment->attachment = $filename;
                    $setAttachment->id_user = $id_user;
                    $setAttachment->save();
    
                    return response()->json(array(
                        "status" => true,
                        "message" => "Success Uploading Data"
                    ));

                } else {
                    return $this->responseRequestError('Cannot upload file');
                }
            }
        } catch (\Exception $e){
            return response()->json($e->getMessage());
        }
    }

    public function penawaranApprove(Request $request){
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;

            $var = TransactionPenawaran::find($request->input('id'));
            $var->current_status = $request->input('status');
            $var->approved_by = $id_user;
            $var->save();


            $v = new TransactionPenawaranStatus;
            $v->id_tp = $request->input('id');
            $v->user_id = $id_user;
            $v->inserted_at = time::now();
            $v->status = $request->input('status');
            $v->save();


            return response()->json(array(
                "status" => true,
                "message" => "Saving Success"
            ));



        } catch(\Exception $e){
            return response()->json($e->getMessage());
        }
    }

    public function penawaranDetail(Request $request, $id){
        try {

            $var = TransactionPenawaran::with([
                'customers_handle.customers.countries',
                'customers_handle.customers.customer_mou.detail',
                'customers_handle.contact_person',
                'payment',
                'format',
                'user_created',
                'akgTrans',
                'samplingTrans.samplingmaster',
                'sales_name.position',
                'transactionPenawaranSample.status_pengujian',
                'transactionPenawaranSample.transactionPenawaranParameter',
                'transactionPenawaranSample.transactionPenawaranParameter.lod',
                'transactionPenawaranSample.transactionPenawaranParameter.metode',
                'transactionPenawaranSample.transactionPenawaranParameter.lab',
                'transactionPenawaranSample.transactionPenawaranParameter.unit',
                'transactionPenawaranSample.transactionPenawaranParameter.parameteruji.parametertype',
            ])->find($id);


            return response()->json($var);


        } catch (\Exception $e){
            
            return response()->json($e->getMessage());

        }
    }

    public function penawaran_customer(Request $request){
        try {
            $v = TransactionPenawaran::with([
                'customers_handle.customers',
                'customers_handle.contact_person',
                'payment',
                'format',
                'user_created',
                'sales_name.position',
                'transactionPenawaranSample.status_pengujian',
                'transactionPenawaranSample.transactionPenawaranParameter',
                'transactionPenawaranSample.transactionPenawaranParameter.lod',
                'transactionPenawaranSample.transactionPenawaranParameter.metode',
                'transactionPenawaranSample.transactionPenawaranParameter.lab',
                'transactionPenawaranSample.transactionPenawaranParameter.unit',
                'transactionPenawaranSample.transactionPenawaranParameter.parameteruji.parameterinfo',
            ])
            ->where('current_status',1)
            ->whereHas('customers_handle',function($q) use($request){
                return $q->where('id_customer',$request->input('id_customer'));
            })
            ->get();

            return response()->json($v);

        } catch(\Exception $e){
            return response()->json($e->getMessage());
        }
    }


    public function penawaranAdd(Request $request){
        try {
            
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data')['data'];
            $format = $request->input('data')['format'];
            $st = empty($request->input('data')['st']) ? 'add' : $request->input('data')['st'];
            $nowY = time::now()->format('Y');
            $nowM = time::now()->format('m');


            $checklastpen = \DB::table('transaction_penawaran as a')
            ->select(
                \DB::raw('MAX(CAST(SUBSTRING_INDEX(a.no_penawaran,".",-1) AS SIGNED)) AS terakhir')
            )
            ->where(\DB::raw('CHAR_LENGTH(SUBSTRING_INDEX(a.no_penawaran,".",-1))'),'>',5)
            ->where(\DB::raw('YEAR(a.created_at)'),$nowY)
            ->first();


            $b = $checklastpen->terakhir + 1;
            $z = ContractCategory::find($data['contract_category']);
            $c = 'SIG.MARK.PN.' . $this->integerToRoman($nowM) . '.' . $nowY . '.' . $this->leftPad($b, 6) . '';
            $nopenforedit = '';
            if($st !== 'add'){
                $checkdata = TransactionPenawaran::select(\DB::raw('if(CHAR_LENGTH(SUBSTRING_INDEX(no_penawaran,".",-1)) < 6,substring(no_penawaran,1, (CHAR_LENGTH(no_penawaran) -( CHAR_LENGTH(SUBSTRING_INDEX(no_penawaran,".",-1)) + 1))),no_penawaran) as no_penawaran'))->find($st);
                $checknumber = TransactionPenawaran::select(\DB::raw('COUNT(id) as total'))
                ->where(\DB::raw('if(CHAR_LENGTH(SUBSTRING_INDEX(no_penawaran,".",-1)) < 6,substring(no_penawaran,1, (CHAR_LENGTH(no_penawaran) -( CHAR_LENGTH(SUBSTRING_INDEX(no_penawaran,".",-1)) + 1))),no_penawaran)'),$checkdata->no_penawaran)->first();
                $nopenforedit = $checkdata->no_penawaran.'.'.($checknumber->total);
            }

            $addnew = new TransactionPenawaran;
            $addnew->no_penawaran = $st == 'add' ? $c : $nopenforedit;
            $addnew->id_contract_category = $data['contract_category'];
            $addnew->created_at = time::now()->format('Y-m-d');
            $addnew->lampiran = $data['lampiran'];
            $addnew->idch = $data['customerhandle'];
            $addnew->internal_notes = $data['desc_internal'];
            $addnew->created_by = $id_user;
            $addnew->clienthandling = $data['clienthandling'];
            $addnew->current_status = 0;
            $addnew->approved_by = $id_user;
            $addnew->save();
            // if($st !== 'add'){

            //     // $y = TransactionPenawaran::where('status',$checkdata->id)->get();
            //     // foreach($y as $fg){
            //     //     $editdata = TransactionPenawaran::find($fg['id']);
            //     //     $editdata->status = $addnew->id;
            //     //     $editdata->save();
            //     // }

            //     // $t = TransactionSamplingPenawaran::where('id_tp',$st)->get();
            //     // if(count($t) > 0){
            //     //     foreach($t as $zx){
            //     //         $del = TransactionSamplingPenawaran::find($zx['id'])->forceDelete();
            //     //     }
            //     // }   
            // }

            $anPS = new TransactionPenawaranPayment;
            $anPS->id_tp = $addnew->id;
            $anPS->totalpembayaran = !empty($data['totalpembayaran']) ? $data['totalpembayaran'] : 0;
            $anPS->discountconv    = $data['discount'];
            $anPS->hargadiscount   = $data['hasilDiscount'];
            $anPS->ppn = !empty($data['ppn']) ? $data['ppn'] : ((($data['totalpembayaran'] - $data['hasilDiscount']) + $data['biayasample']) * 0.11);
            $anPS->dp = $data['uangmuka'];
            $anPS->save();

            
            if(count($data['dataakg']) > 0){
                foreach($data['dataakg'] as $dakg){
                    $h = new AkgTransaction;
                    $h->id_transaction_kontrakuji = $addnew->id;
                    $h->id_mstr_transaction_akg = 2;
                    $h->jumlah = $dakg['jumlah'];
                    $h->total = $dakg['total'];
                    $h->save();
                }
            }

            if(count($data['datasampling']) > 0){
                foreach($data['datasampling'] as $dasmpling){
                    $sx = \DB::table('mstr_transaction_sampling')->where('sampling_name',$dasmpling['sampling_name'])->first();
                    $gh = new TransactionSamplingPenawaran;
                    $gh->id_tp = $addnew->id;
                    $gh->id_mstr_transaction_sampling = !empty($dasmpling['id_sampling']) ? $dasmpling['id_sampling'] : $sx->id;
                    $gh->jumlah = $dasmpling['jumlah'];
                    $gh->total = $dasmpling['total'];
                    $gh->save();
                }
            }

            foreach($data['sample'] as $ds){
                $pns = new TransactionPenawaranSample;
                $pns->id_penawaran = $addnew->id;
                $pns->sample_name = $ds['samplename'];
                $pns->id_tujuanpengujian = $ds['parameter']['tujuanpengujian'];
                $pns->discount = $ds['parameter']['discountsample'];
                $pns->id_statuspengujian = $ds['parameter']['statuspengujian'];
                $pns->price = !empty($ds['parameter']['price']) ? $ds['parameter']['price'] : 0;
                $pns->save();

                

                if(count($ds['parameter']['nonpaketparameter']) > 0){
                    foreach($ds['parameter']['nonpaketparameter'] as $np){
                        $detpara = new TransactionPenawaranParameter;
                        $detpara->id_tr_sample_penawaran = $pns->id;
                        if($np['formathasil'] == 1){
                            $detpara->format_hasil = "Simplo";
                        } else if ($np['formathasil'] == 2){
                            $detpara->format_hasil = "Duplo";
                        } else {
                            $detpara->format_hasil = "Triplo";
                        }
                        $detpara->id_parameteruji = !empty($np['id_parameter_uji']) ? $np['id_parameter_uji'] :  $np['id_parameteruji'];
                        $detpara->info_id = !empty($np['id_price']) ? $np['id_price'] : $np['info_id'];
                        $detpara->id_lab = $np['id_lab'];
                        $detpara->status = 2;
                        $detpara->save();
                    }
                }

                if(count($ds['parameter']['paketparameter']) > 0){
                    foreach($ds['parameter']['paketparameter'] as $pp){
                        if(!empty($pp['paketparameter'])){
                            foreach($pp['paketparameter'] as $ppkt){
                                $detpampaket = new TransactionPenawaranParameter;
                                $detpampaket->id_tr_sample_penawaran = $pns->id;
                                $detpampaket->id_parameteruji = !empty($ppkt['id_parameter_uji']) ? $ppkt['id_parameter_uji'] : $ppkt['id_parameteruji'];
                                $detpampaket->info_id = !empty($ppkt['info_id']) ? $ppkt['info_id'] : $ppkt['id_paketuji'];
                                $detpampaket->id_metode = $ppkt['id_metode'];
                                $detpampaket->id_lod = $ppkt['id_lod'];
                                $detpampaket->id_lab = $ppkt['id_lab'];
                                $detpampaket->id_standart = $ppkt['id_standart'];
                                $detpampaket->id_satuan = !empty($ppkt['id_satuan']) ? $ppkt["id_satuan"] : $ppkt['id_unit'];
                                $detpampaket->status = 1;
                                $detpampaket->save();
                            }
                        } else {
                                $detpampaket = new TransactionPenawaranParameter;
                                $detpampaket->id_tr_sample_penawaran = $pns->id;
                                $detpampaket->id_parameteruji = !empty($pp['id_parameter_uji']) ? $pp['id_parameter_uji'] : $pp['id_parameteruji'];
                                $detpampaket->info_id = !empty($pp['info_id']) ? $pp['info_id'] : $pp['id_paketuji'];
                                $detpampaket->id_metode = $pp['id_metode'];
                                $detpampaket->id_lod = $pp['id_lod'];
                                $detpampaket->id_lab = $pp['id_lab'];
                                $detpampaket->id_standart = $pp['id_standart'];
                                $detpampaket->id_satuan = !empty($pp['id_satuan']) ? $pp["id_satuan"] : $pp['id_unit'];
                                $detpampaket->status = 1;
                                $detpampaket->save();
                        }
                        
                    }
                }

                if(count($ds['parameter']['paketPKM']) > 0){
                    foreach($ds['parameter']['paketPKM'] as $pktpkm){
                        foreach($pktpkm['subpackage'] as $sbp){
                            foreach($sbp['detail_specific'] as $key => $detsbp){
                                $detpampaket = new TransactionPenawaranParameter;
                                $detpampaket->id_tr_sample_penawaran = $pns->id;
                                $detpampaket->id_parameteruji = !empty($detsbp['parameteruji_id']) ? $detsbp['parameteruji_id'] : $detsbp['id_parameteruji'];
                                $detpampaket->info_id = !empty($detsbp['id_mstr_sub_specific_package']) ? $detsbp['id_mstr_sub_specific_package'] : $detsbp['info_id'];
                                $detpampaket->id_metode = $detsbp['id_metode'];
                                $detpampaket->id_lod = $detsbp['id_lod'];
                                $detpampaket->id_lab = $detsbp['id_lab'];
                                $detpampaket->id_standart = $detsbp['id_standart'];
                                $detpampaket->id_satuan = !empty($detsbp['id_unit']) ? $detsbp['id_unit'] : $detsbp['id_satuan']; 
                                $detpampaket->status = 3;
                                $detpampaket->position = $key + 1;
                                $detpampaket->save();
                            }
                        }
                    }
                }
            }


            $stPenawaran = new TransactionPenawaranStatus;
            $stPenawaran->user_id = $id_user;
            $stPenawaran->id_tp = $addnew->id;
            $stPenawaran->inserted_at = time::now();
            $stPenawaran->status = 0;
            $stPenawaran->save();

            $formatPenawaran = new TransactionPenawaranFormat;
            $formatPenawaran->id_tp = $addnew->id;
            $formatPenawaran->metode = $format['metode'] ? 1 : 0;
            $formatPenawaran->lod = $format['lod'] ? 1 : 0;
            $formatPenawaran->loq = $format['loq'] ? 1 : 0;
            $formatPenawaran->satuan = $format['satuan'] ? 1 : 0;
            $formatPenawaran->dp = $format['dp'] ? 1 : 0;
            $formatPenawaran->pph = $format['pph'] ? 1 : 0;
            $formatPenawaran->ppn = $format['ppn'] ? 1 : 0;
            $formatPenawaran->save();


            $chekcust = \DB::table('mstr_customers_handle as a')->where('a.idch',$addnew->idch)->first();
            $chekmou = \DB::table('cust_mou_header as b')->where('b.id_customer',$chekcust->id_customer)->get();


            if($data['discount'] < 1 || $data['hasilDiscount'] < 1){
                $addnewSet = TransactionPenawaran::find($addnew->id);
                $addnewSet->current_status = 1;
                $addnewSet->save();
            }
        
            if(count($chekmou) < 1){
                if($data['totalpembayaran'] < 10000000){
                    if($data['discount'] > 0){
                        $a = [85, 104];
                        $this->sendingEmail($addnew, $data, $id_user, $a);

                    } else {
                        $addnewSet = TransactionPenawaran::find($addnew->id);
                        $addnewSet->current_status = 1;
                        $addnewSet->save();
                    }
                } else if($data['totalpembayaran'] >= 10000000 && $data['totalpembayaran'] <= 30000000){
                    if($data['discount'] > 5){

                        $a = [85, 104];
                        $this->sendingEmail($addnew, $data, $id_user, $a);

                    } else {
                        $addnewSet = TransactionPenawaran::find($addnew->id);
                        $addnewSet->current_status = 1;
                        $addnewSet->save();
                    }
                } else if ($data['totalpembayaran'] > 30000000) {
                    if($data['discount'] > 10){
                        $a = [89, 222306];
                        $this->sendingEmail($addnew, $data, $id_user, $a);
                    } else {
                        $addnewSet = TransactionPenawaran::find($addnew->id);
                        $addnewSet->current_status = 1;
                        $addnewSet->save();
                    }
                }
            }



            return response()->json(array(
                'status' => true,
                'message' => 'saving success',
                'nopenawaran' => $addnew->no_penawaran
            ));

        } catch (\Exception $e){
            return response()->json($e->getMessage());
        }
    }

   private function sendingEmail($par, $val, $id_user, $emailto){
        $ems = Employee::with(['user'])->where('user_id',$id_user)->first();
        
        $to = User::whereIn('id',$emailto)->get();

                $buatemail = array(
                    "penawaran_no" => $par->no_penawaran,
                    "id_penawaran" => $par->id,
                    "discount" => $val['discount'],
                    'harga_discount' => $val['hasilDiscount'],
                    "totalharga" => $val['totalpembayaran'],
                    "employee" => $ems,
                    "statusmessage" => 'Menambah Penawaran',
                    'st' => 'penawaran',
                    'url' => 'https://siglab.co.id/#/analystpro/view-penawaran'
                );
    
                Mail::send('Kontrak/approving', $buatemail, function ($message) use ($par, $val, $id_user, $emailto, $to) {
                    foreach($to as $o){
                        $em = Employee::with(['user'])->where('user_id',$id_user)->first();
                        $message->to($o['email'])->subject('Penawaran Review, ' . $par->no_penawaran);
                        $message->bcc('herdinop.sig@saraswanti.com', 'Checker');
                        $message->from($em['user']['email'], 'SIG Laboratories');
                    }
                });
    
    }

    public function exportExcel(Request $request){
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            $t = Employee::where('user_id',$id_user)->first();

            $var = \DB::table('transaction_penawaran as a')
            ->join('mstr_customers_handle as b','b.idch','a.idch')
            ->leftJoin('mstr_transaction_kontrakuji as c','c.id_penawaran','a.id')
            ->select(
                'a.created_at',
                'a.no_penawaran',
                \DB::raw('( SELECT customer_name FROM mstr_customers_customer WHERE id_customer = b.id_customer ) as cust'),
                \DB::raw('( SELECT name FROM mstr_customers_contactperson WHERE id_cp = b.id_cp ) as cp'),
                \DB::raw('( SELECT (totalpembayaran - IFNULL(hargadiscount,0)) FROM transaction_penawaran_payment WHERE id_tp = a.id ) AS nominal'),
                \DB::raw('( SELECT employee_name FROM hris_employee WHERE employee_id = a.clienthandling ) AS sales'),
                \DB::raw('( SELECT employee_name FROM hris_employee WHERE user_id = a.created_by ) AS created'),
                \DB::raw('IF(c.id_kontrakuji = NULL,"-",c.contract_no) as status')
            )
            ->where('a.current_status','<>',3)
            ->whereBetween(\DB::raw('DATE_FORMAT(a.created_at,"%Y-%m-%d")'),[$request->input('month')."-01",$request->input('month')."-31"]);

            if($t->id_sub_bagian == 37 || $t->id_sub_bagian == 38 || $t->id_sub_bagian == 40){
                $var = $var->get();
                return response()->json($var);
                
            } else{
               if($t->id_level > 18){
                $var = $var->where('clienthandling',$t->employee_id)->get();
                return response()->json($var);
               } else {
                $var = $var->get();
                return response()->json($var);
               }
            }
        } catch (\Exception $e){
            return response()->json($e->getMessage());
        }
    }

        public function setPenawaran(Request $request)
        {
            $var = TransactionPenawaranSample::with([
                'transactionpenawaran.customers_handle.contact_person',
                'transactionpenawaran.customers_handle.customers',
                'transactionpenawaran.payment',
                'transactionPenawaranParameter.parameteruji.parametertype',
                'transactionPenawaranParameter.metode',
                'transactionPenawaranParameter.lod',
                'transactionPenawaranParameter.lab',
                'transactionPenawaranParameter.unit',
                'transactionPenawaranParameter.standart',
            ])->where('id_penawaran', $request->input('id'))->get();
    
            return response()->json($var);
    }

    public function setPenawaran2(Request $request,$id)
    {

        $harganeh = \DB::table('harga_aneh')->get()->toArray();

        

        $var = TransactionPenawaran::with([
            'customers_handle.contact_person',
            'customers_handle.customers',
            'payment',
            'samplingTrans.samplingmaster',
            'transactionPenawaranSample.transactionPenawaranParameter.parameteruji.parametertype',
            'transactionPenawaranSample.transactionPenawaranParameter.metode',
            'transactionPenawaranSample.transactionPenawaranParameter.lod',
            'transactionPenawaranSample.transactionPenawaranParameter.lab',
            'transactionPenawaranSample.transactionPenawaranParameter.unit',
            'transactionPenawaranSample.transactionPenawaranParameter.standart',
        ])->where('id', $id)->get()->toArray();

        $mouDiskon = \DB::table('cust_mou_detail as a')
        ->join('cust_mou_header as b','b.id_cust_mou_header','a.id_cust_mou_header')
        ->select('discount')
        ->where('a.condition',2)
        ->where('b.id_customer',[\DB::raw('(select id_customer from mstr_customers_handle where id_customer = '.$var[0]['idch'].' group by id_customer)')])
        ->get()->toArray();

        $mouStatusPengujian = \DB::table('cust_mou_detail as a')
        ->join('cust_mou_header as b','b.id_cust_mou_header','a.id_cust_mou_header')
        ->select(
            'id_status_pengujian',
            'values'
        )
        ->where('a.condition',1)
        ->whereIn('b.id_customer',[\DB::raw('(select id_customer from mstr_customers_handle where id_customer = '.$var[0]['idch'].' group by id_customer)')])
        ->get()
        ->toArray();

        $normalstpengujian = array();
        $anehstpengujian = array();
        for($i = 0; $i < 5; $i++){
            array_push($normalstpengujian,array(
                "id_status_pengujian" => $i + 1,
                "values" => $i + 1
            ));
        }

        for($i = 0; $i < 3; $i++){
            if($i == 0){
                array_push($anehstpengujian,array(
                    "id_status_pengujian" => $i + 1,
                    "values" => $i + 1
                ));
            } else if($i == 1){
                array_push($anehstpengujian,array(
                    "id_status_pengujian" => $i + 1,
                    "values" => 1.5
                ));
            } else if($i == 2){
                array_push($anehstpengujian,array(
                    "id_status_pengujian" => $i + 1,
                    "values" => 2
                ));
            }
        }

        // return $normalstpengujian;

        $v = array_map(function($b){
            return array(
                "contract_category" => $b['id_contract_category'],
                "no_penawaran" => $b['no_penawaran'],
                "customerhandle" => $b['idch'],
                "clienthandling" => $b['clienthandling'],
                "internal_notes" => $b['internal_notes'],
                "desc_internal" => $b['internal_notes'],
                "jumlahsample" => count($b['transaction_penawaran_sample']),
                "customer_handle" => $b['customers_handle'],
                "payment" => $b['payment'],
                "sampling_trans" => $b['sampling_trans'],
                "sample" => array()
            );
        },$var);

        foreach($var[0]['transaction_penawaran_sample'] as $sample){

            $pengkaliparam =  count($mouStatusPengujian) > 0 ? 
            array_values(array_filter($mouStatusPengujian,function($s)use($sample){
                return $s->id_status_pengujian == $sample['id_statuspengujian'];
            }))[0]->values : 
            array_values(array_filter($normalstpengujian,function($s)use($sample){
                return $s['id_status_pengujian'] == $sample['id_statuspengujian'];
            }))[0]['values'];

            $pengkaliparamaneh = array_values(array_filter($anehstpengujian,function($d) use($sample){
                return $d['id_status_pengujian'] == $sample['id_statuspengujian'];
            }))[0]['values'];

            $sampleform = array(
                "samplename" => $sample['sample_name'],
                "hargakenadiskon" => null,
                "price" => $sample['price'],
                "parameter" => array(
                    "valuesstatuspengujian" => null,
                    "discountsample" => $sample['discount'],
                    "statuspengujian" => $sample['id_statuspengujian'],
                    "tujuanpengujian" => $sample['id_tujuanpengujian'],
                    "nonpaketparameter" => array(),
                    "paketparameter" => array(),
                    "paketPKM" => array()
                )
            );


            $nonpaket = array_filter($sample['transaction_penawaran_parameter'],function($x){
                return $x['status'] == 2;
            });
            $nonpaketp = array();
            if(count($nonpaket) > 0){
                array_push($nonpaketp,array_values(array_map(function($q)use($pengkaliparam){
                    static $i = 0;
                    $g = \DB::table('mstr_laboratories_parameteruji as a')
                    ->select(
                        \DB::raw('(SELECT name FROM mstr_laboratories_parametertype WHERE id = a.mstr_laboratories_parametertype_id) as parametertype')
                    )
                    ->where('a.id',$q['id_parameteruji'])
                    ->first();

                    $fa = array(
                        "checked" => false,
                        "id_parameter_uji"  => $q['id_parameteruji'],
                        "parameteruji_code" => $q['parameteruji']['parameter_code'],
                        "parameteruji_name" => $q['parameteruji']['name_id'],
                        "parametertype" => $g->parametertype,
                        "formathasil" => $q['formathasil'],
                        "price_normal" => $q['price'],
                        "price" => $q['price'] * $pengkaliparam,
                        "lab" => $q['lab']['nama_lab'],
                        "id_price" => $q['info_id'],
                        "id_lab" => $q['id_lab'],
                        "id_for" => $i + 1
                    );
                    $i++;
                    return $fa;
                    
                },$nonpaket)));
            }

            $paketparameter = array_filter($sample['transaction_penawaran_parameter'],function($x){
                return $x['status'] == 1;
            });
            if(count($paketparameter) > 0){
                $r = array_values($this->unique($paketparameter,'info_id'));

                $paketparamp = array();
    
                foreach($r as $r => $cv){
                    
                    $getinfo = \DB::table('mstr_products_paketuji')
                    ->where('id',$cv['info_id'])
                    ->first();
    
                    array_push($paketparamp,array(
                        "checked" => false,
                        "discount" => $getinfo->status,
                        "id_for" => $r + 1,
                        "id_paketuji" => $getinfo->id,
                        "kode_paketuji" => $getinfo->kode_paketuji,
                        "nama_paketuji" => $getinfo->nama_paketuji,
                        "price_normal" => $getinfo->price,
                        "price" => in_array($getinfo->id,array_values(array_map(function($t){ return $t->id_paketuji;},$harganeh))) ? ($getinfo->price * $pengkaliparamaneh) : ($getinfo->price * $pengkaliparam),
                        "paketparameter" => array_values(array_filter($paketparameter, function($d) use($cv){
                            return $d['info_id'] == $cv['info_id'];
                        }))
                    ));
                }
            }

            $paketpkm = array_filter($sample['transaction_penawaran_parameter'],function($x){
                return $x['status'] == 3;
            });
            if(count($paketpkm) > 0){
                $pkmget = array_values($this->unique($paketpkm,'info'));
                $pkmp = array();
                foreach($pkmget as $k => $gtpkm){

                    $pkmpd = array();

                    $getinfopkm = SubSpecificPackage::with([
                        'pkmpackage',
                        'detailSpecific',
                        'perka',
                        'detailSpecific.parameteruji',
                        'detailSpecific.lab',
                        'detailSpecific.metode',
                        'detailSpecific.unit',
                        'detailSpecific.standart',
                    ])->where('id',$gtpkm['info_id'])->first();

                    foreach(array_values($this->unique($paketpkm,'info_id')) as $h){
                        $gfg = array(
                            "id" => $h['info_id'],
                            "mstr_specific_package_id" => $getinfopkm->pkmpackage->id,
                            "subpackage_name" => $h['parameteruji']['name_id'],
                            "jumlah" => $getinfopkm->jumlah,
                            "price_normal" => $h['price'],
                            "price" => $h['price'] * $pengkaliparam,
                            "detail_specific" => array_values(array_filter($paketpkm,function($f) use($h){
                                return $f['info_id'] === $h['info_id'];
                            }))
                        );
                    
                    array_push($pkmpd, $gfg);
                    }
                    array_push($pkmp, array(
                        "checked" => false,
                        "discount" => $getinfopkm->pkmpackage->disc,
                        "id_for" => $k + 1,
                        "id_paketpkm" => $getinfopkm->pkmpackage->id,
                        "nama_paketpkm" => $getinfopkm->pkmpackage->package_name,
                        "price" => array_reduce(array_values(array_map(function($ia){
                            return $ia['price'];
                        },$pkmpd)),function($z,$u){
                            return $z += $u;
                        }),
                        "subpackage" => $pkmpd
                    ));
                }
                
             

            }


            $nonpaketprice = count($nonpaket)>0? (count($nonpaketp[0]) > 0 ? array_reduce(array_values(array_map(function($f){
                return $f['price'];
            },$nonpaketp[0])),function($z,$u){
                return $z += $u;
            }) : 0) : 0;
            // return $paketparamp;
            $paketprice = count($paketparameter) > 0 ? (count(array_values(array_filter($paketparamp,function($g){
                return $g['discount'] == 1;
            }))) > 0 ? array_reduce(array_values(array_map(function($x){
                return $x['price'];
            },array_values(array_filter($paketparamp,function($g){
                return $g['discount'] == 1;
            })))),function($y,$r){
                return $y += $r;
            }) : 0) : 0;

            $paketpkmprice = count($paketpkm) > 0 ? (count(array_values(array_filter($pkmp,function($t){
                return $t['discount'] == 1;
            }))) > 0 ? array_reduce(array_values(array_map(function($td){
                return $td['price'];
            },array_values(array_filter($pkmp,function($t){
                return $t['discount'] == 1;
            })))),function($a,$b){
                return $a+=$b;
            }) : 0) : 0;

            $sampleform['hargakenadiskon'] = $nonpaketprice + $paketprice + $paketpkmprice;

        //    return $nonpaketp[0];
        if(count($nonpaket)>0){
            $sampleform['parameter']['nonpaketparameter'] = $nonpaketp[0];
        }

        if(count($paketparameter) > 0){
            $sampleform['parameter']['paketparameter'] = $paketparamp;
        }

        if(count($paketpkm) > 0 ){
            $sampleform['parameter']['paketPKM'] = $pkmp;
        }

            array_push($v[0]['sample'],$sampleform);

        }
        return response()->json($v);
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


    private function unique($array, $key) {
        $temp_array = array();
        $i = 0;
        $key_array = array();
    
        foreach($array as $val) {
            if (!in_array($val[$key], $key_array)) {
                $key_array[$i] = $val[$key];
                $temp_array[$i] = $val;
            }
            $i++;
        }
        return $temp_array;
    }


}