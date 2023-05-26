<?php
namespace App\Http\Controllers\Complain;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Analysis\Transaction_parameter;
use DB;
use Auth;
use Firebase\JWT\JWT;
use Carbon\Carbon as time;
use App\Models\Ecert\Complain;
use App\Models\Complain\ComplainCertSendDetail;
use App\Models\Complain\ComplainCertSendHeader;
use App\Models\Complain\ComplainTechnicalDetail;
use App\Models\Complain\ComplainTechnical;
use App\Models\Complain\ComplainSend;
use App\Models\Ecert\Ecertlhu;
use App\Models\Ecert\ParameterCert;
use App\Models\Ecert\ConditionCert;
use App\Models\Ecert\RevConditionCert;
use App\Models\Ecert\RevEcertlhu;
use App\Models\Ecert\RevParameterCert;
use App\Models\Ecert\AttachmentRevFile;
use App\Models\Analysis\Kontrakuji;

class CertificateComplainController extends Controller
{

    public function index(Request $request)
    {   
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');


        $model = ComplainSend::with([
            'technical.complain.TransactionCertificate.ConditionCert.team',
            'technical.complain.TransactionCertificate.customer',
            'technical.complain.TransactionSample.kontrakuji',
            'technicalDetail.certificateParameter',
            'lab',
            'lod',
            'metode',
            'unit'
        ]);

        if(!empty($data['lhu'])){
            $c = Ecertlhu::where(\DB::raw('UPPER(lhu_number)'),'like','%'.$data['lhu'].'%')->get()->toArray(); 
             
            $lhp = array_map(function($c){
                return $c['id'];
            },$c);  

            $comp = Complain::whereIn('id_cert', $lhp)->get()->toArray();

            $arr = array_map(function($comp){
                return $comp['id'];
            },$comp);

            $compt = ComplainTechnical::whereIn('id_complain', $arr)->get()->toArray();
            $comp_arr = array_map(function($compt){
                return $compt['id'];
            },$compt);

            $model = $model->whereIn('id_technical', $comp_arr);            
        }

        if(!empty($data['sample_name'])){
            $e = Ecertlhu::where(\DB::raw('UPPER(sample_name)'),'like','%'.$data['sample_name'].'%')->get()->toArray();
            $lhp = array_map(function($e){
                return $e['id'];
            },$e);  

            $comp = Complain::whereIn('id_cert', $lhp)->get()->toArray();
            $arr = array_map(function($comp){
                return $comp['id'];
            },$comp);
            
            $compt = ComplainTechnical::whereIn('id_complain', $arr)->get()->toArray();
            $comp_arr = array_map(function($compt){
                return $compt['id'];
            },$compt);

            $model = $model->whereIn('id_technical', $comp_arr);
        }
        
        if(!empty($data['id_customer'])){
            $e = Ecertlhu::where('customer_name',$data['id_customer'] )->first();
            $lhp = array_map(function($e){
                return $e['id'];
            },$e);  

            $comp = Complain::whereIn('id_cert', $lhp)->get()->toArray();
            $arr = array_map(function($comp){
                return $comp['id'];
            },$comp);
            
            $compt = ComplainTechnical::whereIn('id_complain', $arr)->get()->toArray();
            $comp_arr = array_map(function($compt){
                return $compt['id'];
            },$compt);

            $model = $model->whereIn('id_technical', $comp_arr);
        }

        if(!empty($data['sample_number'])){
            $r = Ecertlhu::where(\DB::raw('UPPER(no_sample)'),'like','%'.$data['sample_number'].'%')->get()->toArray();
            $lhp = array_map(function($r){
                return $r['id'];
            },$r);  

            $comp = Complain::whereIn('id_cert', $lhp)->get()->toArray();
            $arr = array_map(function($comp){
                return $comp['id'];
            },$comp);
            
            $compt = ComplainTechnical::whereIn('id_complain', $arr)->get()->toArray();
            $comp_arr = array_map(function($compt){
                return $compt['id'];
            },$compt);

            $model = $model->whereIn('id_technical', $comp_arr);
        }

        if(!empty($data['team'])){
            
            $team = $data['team'];
            $c = ComplainTechnical::select('id_contract')->groupBy('id_contract')->get()->toArray();
           
            $z = array_map(function($c){
                return $c['id_contract'];
            },$c);


            $e = ConditionCert::whereIn('id_contract', $z)->where('id_team', $team)->groupBy('id_contract')->get()->toArray();
          
            $ze = array_map(function($e){
                return $e['id_contract'];
            },$e);

            $me = ComplainTechnical::whereIn('id_contract', $ze)->get()->toArray();
            $res = array_map(function($me){
                return $me['id'];
            },$me);

            $model = $model->whereIn('id_technical', $res);

        }

        if(!is_null($data['status'])){
           $model = $model->where('status', $data['status']);
        }

        if(!empty($data['marketing'])){
            $kont = Kontrakuji::where(\DB::raw('UPPER(contract_no)'),'like','%'.$data['marketing'].'%')->get()->toArray();
            $filter = array_map(function($kont){
                return $kont['id_kontrakuji'];
            },$kont);

            $ct = ComplainTechnical::whereIn('id_contract', $filter)->get()->toArray();
            $result = array_map(function($ct){
                return $ct['id'];
            },$ct);

            $model = $model->whereIn('id_technical', $result);
        }


        $model = $model->groupBY('id_technical')
        ->orderBy('id', 'desc')
        ->paginate(25);

        return $model;
    }

    public function approve(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');
        
        $model = New ComplainTechnicalDetail;
        $model->id_technical_det = $data['complaint_cert_header']['id_technical_complain'];
        $model->status = 3; // DONE;
        $model->position = 5; //CERTIFICATE
        $model->user_id = $id_user;
        $model->inserted_at = time::now();
        $model->save();

        $message=array(
            'success'=>true,
            'message'=>'Saving Success'
        );
        return response()->json($message);

    }

    public function details(Request $request)
    {   
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = ComplainSend::with([
            'technical.complain.TransactionCertificate.ConditionCert.team',
            'technical.complain.TransactionSample.kontrakuji',
            'technical_detail_one.transactionparameter.parameteruji',
            'technical_detail_one.certificateParameter',
            'lab',
            'lod',
            'metode',
            'unit'
            ])
        ->where('id_technical', $data['id_tech'])
        ->get();

        return response()->json($model);
    }

    public function detailCertificate(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = ParameterCert::where('id_transaction_sample', $data['lhu'])
        ->whereIn('id', $data['parameter'])
        ->get();

        return response()->json($model);
    }

    public function updateDataDetail(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        // copy proccess
        $lhu = Ecertlhu::where('id', $data['lhu'])->first();

        $revlhu = New RevEcertlhu;
        $revlhu->id_transaction_sample = $lhu->id_transaction_sample;
        $revlhu->id_sample_cert = $lhu->id;
        $revlhu->format = $lhu->format;
        $revlhu->cl_number = $lhu->cl_number;
        $revlhu->lhu_number = $lhu->lhu_number;
        $revlhu->customer_name = $lhu->customer_name;
        $revlhu->customer_address = $lhu->customer_address;
        $revlhu->customer_telp = $lhu->customer_telp;
        $revlhu->contact_person = $lhu->contact_person;
        $revlhu->sample_name = $lhu->sample_name;
        $revlhu->no_sample = $lhu->no_sample;
        $revlhu->kode_sample = $lhu->kode_sample;
        $revlhu->batch_number = $lhu->batch_number;
        $revlhu->tgl_input = $lhu->tgl_input;
        $revlhu->tgl_mulai = $lhu->tgl_mulai;
        $revlhu->tgl_selesai = $lhu->tgl_selesai;
        $revlhu->tgl_estimasi_lab = $lhu->tgl_estimasi_lab;
        $revlhu->nama_pabrik = $lhu->nama_pabrik;
        $revlhu->alamat_pabrik = $lhu->alamat_pabrik;
        $revlhu->no_notifikasi = $lhu->no_notifikasi;
        $revlhu->no_pengajuan = $lhu->no_pengajuan;
        $revlhu->no_registrasi = $lhu->no_registrasi;
        $revlhu->no_principalcode = $lhu->no_principalcode;
        $revlhu->nama_dagang = $lhu->nama_dagang;
        $revlhu->lot_number = $lhu->lot_number;
        $revlhu->jenis_kemasan = $lhu->jenis_kemasan;
        $revlhu->tgl_produksi = $lhu->tgl_produksi;
        $revlhu->tgl_kadaluarsa = $lhu->tgl_kadaluarsa;
        $revlhu->price = $lhu->price;
        $revlhu->metode = $lhu->metode;
        $revlhu->location = $lhu->location;
        $revlhu->pic = $lhu->pic;
        $revlhu->kondisi_lingkungan = $lhu->kondisi_lingkungan;
        $revlhu->id_tujuanpengujian = $lhu->id_tujuanpengujian;
        $revlhu->id_statuspengujian = $lhu->id_statuspengujian;
        $revlhu->id_subcatalogue = $lhu->id_subcatalogue;
        $revlhu->print_info = $lhu->print_info;
        $revlhu->keterangan_lain = $lhu->keterangan_lain;
        $revlhu->tgl_sampling = $lhu->tgl_sampling;
        $revlhu->urutan = $lhu->urutan;
        $revlhu->cert_info = $lhu->cert_info;
        $revlhu->reason = $lhu->reason;
        $revlhu->save();    

        $condCert = ConditionCert::where('id_transaction_cert', $data['lhu'])->get();
        foreach($condCert as $cc){

            $revcondCert = New RevConditionCert;
            $revcondCert->id_transaction_cert = $revlhu->id;
            $revcondCert->id_contract = $cc->id_contract;
            $revcondCert->status = $cc->status;
            $revcondCert->user_id = $cc->user_id;
            $revcondCert->cert_status = 3;
            $revcondCert->id_team = $cc->id_team;
            $revcondCert->inserted_at = time::now();
            $revcondCert->save();

            // if($cc->status != 1){
            //         $del =  ConditionCert::where('id', $cc->id)->first();
            //         $del->delete();
            // }else{
            //         $chg = ConditionCert::where('id', $cc->id)->first();
            //         $chg->cert_status = 3;
            //         $chg->save();
            // }

        }      
             
        
        $before = DB::connection('mysqlcertificate')->table('transaction_parameter_cert')->where('id_transaction_sample', $data['lhu'])->get();
        foreach($before as $be)
        {
            $revcertParam = New RevParameterCert;
            $revcertParam->id_rev_lhu = $revlhu->id;
            $revcertParam->id_transaction_sample = $be->id_transaction_sample;
            $revcertParam->id_parameteruji = $be->id_parameteruji;
            $revcertParam->parameteruji_id = $be->parameteruji_id;
            $revcertParam->parameteruji_en = $be->parameteruji_en;
            $revcertParam->simplo = $be->simplo;
            $revcertParam->duplo = $be->duplo;
            $revcertParam->triplo = $be->triplo;
            $revcertParam->hasiluji = $be->hasiluji;
            $revcertParam->standart = $be->standart;
            $revcertParam->lod = $be->lod;
            $revcertParam->lab = $be->lab;
            $revcertParam->unit = $be->unit;
            $revcertParam->metode = $be->metode;
            $revcertParam->m = $be->m;
            $revcertParam->c = $be->c;
            $revcertParam->mm = $be->mm;
            $revcertParam->n = $be->n;
            $revcertParam->format_hasil = $be->format_hasil;
            $revcertParam->status = $be->status;
            $revcertParam->info_id = $be->info_id;
            $revcertParam->position = $be->position;
            $revcertParam->save();
        }


        $test = ComplainSend::with([
            'technical.complain.TransactionCertificate',
            'unit',
            'lod',
            'metode',
            'technical_detail_one',
            'technical_detail_one.certificateParameter'
        ])
        ->where('id_technical', $data['id_tech'])
        ->get();


        foreach ($test as $t) {
            if($t->selectcust == 1){
                $idpar =  $t['technical_detail_one']['id_parameter_lhu'];
                $par = ParameterCert::where('id', $idpar)->first();
                
                $par->hasiluji = $t['hasiluji'];
                $par->actual_result = $t['ar'];
                $par->lod = $t['id_lod'] == null ? $par->lod : $t['lod']['nama_lod'];
                $par->lab = $t['id_lab'] == null ? $par->lab : $t['lab']['nama_lab'] ;
                $par->unit = $t['id_unit'] == null ? $par->unit : $t['unit']['nama_unit'] ;
                $par->metode = $t['id_metode'] == null ?  $par->metode : $t['metode']['metode'] ;
                $par->desc = $t['memo'] == null ? $par->desc :  $t['memo'];
                $par->save();
            }
        }

        $certSend = ComplainSend::where('id_technical', $data['id_tech'])->get();

        foreach ($certSend as $cert) {
            $cert->status = 1;
            $cert->id_user = $id_user;
            $cert->save();
        }
       

        $message=array(
            'success'=>true,
            'message'=>'Saving Success'
        );
        return response()->json($message);

    }
    

}
