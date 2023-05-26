<?php

namespace App\Http\Controllers\Complain;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Analysis\Transaction_parameter;
use App\Models\Analysis\Kontrakuji;
use App\Models\Analysis\TransactionSample;
use App\Models\Complain\ComplainSend;
use App\Models\Ecert\Ecertlhu;
use DB;
use Auth;
use App\Models\Master\Unit;
use Firebase\JWT\JWT;
use Carbon\Carbon as time;
use App\Models\Ecert\Complain;
use App\Models\Complain\ComplainTechnical;
use App\Models\Complain\ComplainTechnicalDetail;
use App\Models\Complain\ComplainStatus;
use App\Models\Ecert\ParameterCert;
use App\Models\Master\Lab;
use App\Models\Master\ParameterUji;

class ComplainTechnicalController extends Controller
{
    public function index(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $r = ComplainTechnical::with([
            'complain.transactionsampleCompact.kontrakuji.customers_handle.customers',
            'complain.TransactionCertificate',
            'sendingCert.parameteruji',
            'complain_det.parameteruji',
            'complain_det.lod',
            'complain_det.lab',
            'complain_det.metode',
            'complain_det.standart',
            'complain_det.unit'
        ])
            ->select(
                'complain_technical.*'
            )
            ->whereNull('deleted_at');

        if (!empty($data['labcomplain'])) {
            $x = ComplainStatus::with([
                'complaindet'
            ])->where('position', 2)
                ->where('status', 0)
                ->whereHas('complaindet', function ($q) use ($data) {
                    return $q->where('id_lab', $data['idlab']);
                })
                ->get()->toArray();
        }

        if(!empty($data['estimasi_lab'])){
            $r = $r->where('estimate_date',$data['estimasi_lab']);
        }

        if(!empty($data['lab'])){
            $a = ComplainTechnicalDetail::where('id_lab',$data['lab'])->get()->toArray();

            $t = array_map(function($q){
                return $q['id_tech_det'];
            },$a);

            $r = $r->whereIn('id',$t);
        }

        if($data['statuscomplain'] !== 'all'){
            $a = ComplainTechnicalDetail::where('preparation_status',(intval($data['statuscomplain']) - 1))->get()->toArray();
            $t = array_map(function($q){
                return $q['id_tech_det'];
            },$a);

            $r = $r->whereIn('id',$t);
        }

        if(!empty($data['contract'])){
            $r = $r->where('id_contract',$data['contract']);
        }

        if($data['currentstatus'] !== 'all'){
            if($data['currentstatus'] == '0'){
                $g = ComplainStatus::where('status',0)
                ->where('position',2)
                ->get()
                ->toArray();

                $v = array_map(function($t){
                    return $t['id_technical_det'];
                },$g);

                $vv = ComplainTechnicalDetail::whereIn('id',$v)->get()->toArray();

                $cv = array_map(function($x){
                    return $x['id_tech_det'];
                },$vv);

                $r = $r->whereIn('id',$cv);
            } else if($data['currentstatus'] == '1'){
                $g = ComplainStatus::where('position',3)
                ->get()
                ->toArray();

                $v = array_map(function($t){
                    return $t['id_technical_det'];
                },$g);

                $vv = ComplainTechnicalDetail::whereIn('id',$v)->get()->toArray();

                $cv = array_map(function($x){
                    return $x['id_tech_det'];
                },$vv);
                $r = $r->whereIn('id',$cv);
            } else {
                $g = ComplainStatus::where('status',1)
                ->where('position',2)
                ->get()
                ->toArray();

                $v = array_map(function($t){
                    return $t['id_technical_det'];
                },$g);

                $vv = ComplainTechnicalDetail::whereIn('id',$v)->get()->toArray();

                $cv = array_map(function($x){
                    return $x['id_tech_det'];
                },$vv);

                $r = $r->whereIn('id',$cv);
            }
        }

        if(!empty($data['search'])){
            $r = $r->where('complain_no','like','%'.trim($data['search']).'%');
        }

        $r = $r->orderBy('created_at','desc')->paginate(25);


        return response()->json($r);
    }

    public function exportdataComplain(Request $request){
        // try {

            $val = [];

            $var = ComplainTechnicalDetail::with([
                'complain_tech'
            ])->where('status_parameter',0)
            ->whereHas('complain_tech',function($z) use($request){
                if($request->input('st') !== 'qc'){
                    return $z->whereBetween(\DB::raw('DATE_FORMAT(estimate_date, "%Y-%m-%d")'),[$request->input('from'),$request->input('to')])
                ->whereNull('deleted_at');
                } else {
                    return $z->whereBetween(\DB::raw('DATE_FORMAT(complain_date, "%Y-%m-%d")'),[$request->input('from'),$request->input('to')])
                    ->whereNull('deleted_at');
                }
            });

            if($request->input('st') !== 'qc'){
                $ck = ComplainStatus::where('position',2)
                ->where('status',0)
                ->whereNotIn('id_technical_det', [\DB::raw('SELECT id_technical_det FROM complain_technical_status WHERE position = 2 AND status = 1')])
                ->get()->toArray();

                $tr = array_map(function($z){
                    return $z['id_technical_det'];
                },$ck);

                $e = ComplainTechnical::where('status_ticket',1)->select('id');

                $var = $var->whereIn('id',$tr)->whereIn('id_tech_det',$e)->where('id_lab',$request->input('st'));
            }

            $var = $var->get()->toArray();


            foreach($var as $k => $z){
                // return $z;
                $kontrakinfo = Kontrakuji::with([
                    'customers_handle.customers'
                ])->find($z['complain_tech']['id_contract']);


                $certinfo = Complain::with([
                    'TransactionCertificate',
                    'transactionsampleCompact'
                ])->find($z['complain_tech']['id_complain']);

                
                $parameterinfo = ParameterCert::find($z['id_parameter_lhu']);
                $parameterName = ParameterUji::find($z['id_parameteruji']);
                $unit = Unit::find($z['id_unit']);
                
                $statusParameter = ComplainStatus::where('id_technical_det',$z['id'])
                ->where('status',1)
                ->where('position',2)
                ->first();

                $gtLab = Lab::find($z['id_lab']);
                
                    if($request->input('st') == 'qc'){
                        array_push($val,array(
                            "no" => $k + 1,
                            "prep_status" => $z['preparation_status'] == 0 ? 'Investigate' : ($z['preparation_status'] == 1 ? 'Uji Ulang' : 'Tidak Uji Ulang'),
                            "memo" => $z['memo'],
                            "complain_date" => time::parse($z['complain_tech']['complain_date'])->format('d/m/Y'),
                            "estimate_date" => time::parse($z['complain_tech']['estimate_date'])->format('d/m/Y'),
                            "contract_no" => $kontrakinfo ? $kontrakinfo['contract_no'] : '-',
                            "no_lhp" => !empty($certinfo['TransactionCertificate']['lhu_number']) ? $certinfo['TransactionCertificate']['lhu_number'] : '-',
                            "cust" => $kontrakinfo ? $kontrakinfo['customers_handle']['customers']['customer_name'] : '-',
                            "no_sample" => !empty($certinfo['transactionsampleCompact']['no_sample']) ? $certinfo['transactionsampleCompact']['no_sample'] : '-',
                            "no_complain" => $z['complain_tech']['complain_no'],
                            "matriks" => !empty($certinfo['transactionsampleCompact']['matriks']) ? $certinfo['transactionsampleCompact']['matriks'] : '-',
                            "nama_sample" => !empty($certinfo['transactionsampleCompact']['sample_name']) ? $certinfo['transactionsampleCompact']['sample_name'] : '-',
                            "alasan_complain" => $z['complain_desc'] == 1 ? 'Hasil Ketinggian' : ($z['complain_desc'] == 2 ? 'Hasil Kerendahan' : 'Tidak sesuai spec'),
                            "expectation" => $z['expectation'],
                            "parameter" => $parameterName['name_id'],
                            "lab" => $gtLab->nama_lab,
                            "hasil_awal" => $parameterinfo ? $parameterinfo['hasiluji'] : '-',
                            "hasil_ar" => $parameterinfo ? $parameterinfo['actual_result'] : '-',
                            "hasil_ulang" => $z['complain_result'],
                            "hasil_ulang_ar" => $z['complain_arresult'],
                            "satuan" => !empty($unit['nama_unit']) ? $unit['nama_unit']: '-',
                            "status_complain" => $z['status_complain'] == 0 ? 'Verified' : ($z['status_complain'] == 1 ? 'Not Verified' : ($z['status_complain'] == 2 ? 'Adjusted' : ($z['status_complain'] == 3 ? 'Changed' : 'Retest'))),
                            "selesai_ujiulang" => $statusParameter ? time::parse($statusParameter['inserted_at'])->format('d/m/Y H:i:s') : '-'
                        ));
                    } else {
                        array_push($val,array(
                            "id" => $z['id'],
                            "prep_status" => $z['preparation_status'] == 0 ? 'Investigate' : ($z['preparation_status'] == 1 ? 'Uji Ulang' : 'Tidak Uji Ulang'),
                            "memo" => $z['memo'],
                            "complain_date" => time::parse($z['complain_tech']['complain_date'])->format('d/m/Y'),
                            "estimate_date" => time::parse($z['complain_tech']['estimate_date'])->format('d/m/Y'),
                            "contract_no" => $kontrakinfo ? $kontrakinfo['contract_no'] : '-',
                            "cust" => $kontrakinfo ? $kontrakinfo['customers_handle']['customers']['customer_name'] : '-',
                            "no_lhp" => $certinfo['TransactionCertificate']['lhu_number'],
                            "no_sample" => $certinfo['transactionsampleCompact']['no_sample'],
                            "no_complain" => $z['complain_tech']['complain_no'],
                            "nama_sample" => $certinfo['transactionsampleCompact']['sample_name'],
                            "matriks" => $certinfo['transactionsampleCompact']['matriks'],
                            "parameter" => $parameterName['name_id'],
                            "expectation" => $z['expectation'],
                            "hasil_awal" => $parameterinfo ? $parameterinfo['hasiluji'] : '-',
                            "hasil_ar" => $parameterinfo ? $parameterinfo['actual_result'] : '-',
                            "id_metode" => $z['id_metode'],
                            "id_lod" => $z['id_lod'],
                            "id_unit" => $z['id_unit'],
                            "hasil_ulang_ar" => $z['complain_arresult'],
                            "hasil_ulang" => $z['complain_result'],
                            "satuan" => !empty($unit['nama_unit']) ? $unit['nama_unit']: '-',
                        ));
                    }
                
            }

            return response()->json($val);

            

        // } catch(\Exception $e){
        //     return response()->json($e->getMessage());
        // }
    }

    public function importdataComplain(Request $request){
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');
            $st = $request->input('st');

            foreach($data as $d){
                $r = ComplainTechnicalDetail::find($d['id']);
                $r->id_metode = $d['id_metode'];
                $r->id_lod = $d['id_lod'];
                $r->id_unit = $d['id_unit'];
                $r->complain_result = $d['hasil_ulang'];
                $r->complain_arresult = !empty($d['hasil_ulang_ar']) ? $d['hasil_ulang_ar'] : null;
                $r->save();


                if($st){
                    $ch = ComplainStatus::where('position',2)
                    ->where('status',1)
                    ->where('id_technical_det',$d['id'])
                    ->first();
                    if($ch){
                        $del = ComplainStatus::find($ch->id);
                        if($del){
                            $del->forceDelete();
                        }
                    }
                    $hj = new ComplainStatus;
                    $hj->status = 1;
                    $hj->id_technical_det = $d['id'];
                    $hj->inserted_at = time::now();
                    $hj->position = 2;
                    $hj->user_id = $id_user;
                    $hj->save();
                }
            }

            return response()->json(array(
                "success" => true,
                "message" => "Saving Success"
            ));


        } catch (\Exception $e){
            return response()->json(array(
                "success" => false,
                "message" => $e->getMessage()
            ));
        }
    }


    public function datapprove(Request $request)
    {
        $x = [];

        $var = ComplainStatus::with([
            'complaindet.complain_tech.complain.TransactionSample.kontrakuji.customers_handle.customers',
            'complaindet.complain_tech.complain.TransactionSample.subcatalogue',
            'complaindet.complain_tech.complain.TransactionSample.statuspengujian',
            'complaindet.parameteruji',
            'complainstatusprep'
        ])
            ->where('position', 2)
            ->where('status', 0)
            ->whereNotIn('id_technical_det', [\DB::raw('SELECT id_technical_det FROM complain_technical_status WHERE position = 2 AND status = 1')])
            ->orderBy('status', 'desc')
            ->groupBy('id_technical_det')
            ->where('id_technical_det', $request->input('idtechdet'))->get()->toArray();

        foreach ($var as $key => $f) {
            array_push($x, array(
                "checked" => 0,
                'contract_no' => $f['complaindet']['complain_tech']['complain']['transaction_sample']['kontrakuji']['contract_no'],
                'duplo' => null,
                'prepstatusgo' => count($f['complainstatusprep']) > 0 ? $f['complainstatusprep'][0]['status'] : 0,
                'format_hasil' => null,
                'complain_result' => $f['complaindet']['complain_result'],
                'complain_arresult' => $f['complaindet']['complain_arresult'],
                'hasiluji' => $f['complaindet']['hasiluji'],
                'ar' => $f['complaindet']['ar'],
                "id" => $f['complaindet']['id'],
                'expectation' => $f['complaindet']['expectation'],
                'complain_no' => $f['complaindet']['complain_tech']['complain_no'],
                "tujuanpengujian" => null,
                "id_technical" => $f['complaindet']['complain_tech']['id'],
                "id_contract" => $f['complaindet']['complain_tech']['complain']['transaction_sample']['kontrakuji']['id_kontrakuji'],
                "prep_status" => $f['complaindet']['preparation_status'],
                "id_lab" => $f['complaindet']['id_lab'],
                "id_lod" => $f['complaindet']['id_lod'],
                "id_metode" => $f['complaindet']['id_metode'],
                "id_parameteruji" => $f['complaindet']['id_parameteruji'],
                "id_sample" => $f['complaindet']['complain_tech']['complain']['id_transaction_sample'],
                "id_standart" => $f['complaindet']['id_standart'],
                "id_statuspengujian" => $f['complaindet']['complain_tech']['complain']['transaction_sample']['id_statuspengujian'],
                "id_unit" => $f['complaindet']['id_unit'],
                "idfor" => null,
                "info" => null,
                "info_id" => null,
                "inserted_at" => time::parse($f['inserted_at'])->format('d/m/Y H:i:s'),
                "matriks" =>  $f['complaindet']['complain_tech']['complain']['transaction_sample']['subcatalogue']['sub_catalogue_name'],
                "name_id" => $f['complaindet']['parameteruji']['name_id'],
                "no_sample" => $f['complaindet']['complain_tech']['complain']['transaction_sample']['no_sample'],
                "sample_name" => $f['complaindet']['complain_tech']['complain']['transaction_sample']['sample_name'],
                "simplo" => null,
                "status_pengujian" => $f['complaindet']['complain_tech']['complain']['transaction_sample']['statuspengujian']['name'],
                "tgl_estimasi_lab" => time::parse($f['complaindet']['complain_tech']['estimate_date'])->format('d/m/Y'),
                "triplo" => null,
                "customers" => $f['complaindet']['complain_tech']['complain']['transaction_sample']['kontrakuji']['customers_handle']['customers']['customer_name']
            ));
        }
        $var = $x;
        return response()->json($var);
    }


    public function detailComplainParameter(Request $request, $id)
    {
        try {

            $var = ComplainTechnicalDetail::with([
                'complain_tech',
                'transactionparameter.lod',
                'transactionparameter.parameterujiOne',
                'transactionparameter.unit',
                'transactionparameter.metode',
                'transactionparameter.lab',
                'transactionparameter.transactionsamples.kontrakuji',

            ])->where('id_tech_det', $id)->get();

            return response()->json($var);
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function getParamByComplain(Request $request)
    {
        try {


            $var = ComplainTechnical::with([
                'complain',
            ])->find($request->input('id'));


            $h = Ecertlhu::with([
                'parameters'
            ])->find($var->complain->id_cert)->toArray();



            $ha = array_map(function ($q) {

                $id_lod = \DB::table('mstr_laboratories_lod')->where('nama_lod', $q['lod'])->first();
                $id_metode = \DB::table('mstr_laboratories_metode')->where('metode', $q['metode'])->first();
                $id_standart = \DB::table('mstr_laboratories_standart')->where('nama_standart', $q['standart'])->first();
                $id_lab = \DB::table('mstr_laboratories_lab')->where('nama_lab', $q['lab'])->first();
                $id_unit = \DB::table('mstr_laboratories_unit')->where('nama_unit', $q['unit'])->first();

                // $c->id_lod = !is_null($k['lod']) ? $id_lod->id : null ;
                // $c->id_metode = !is_null($k['metode']) ? ($id_metode ? $id_metode->id : null) : null;
                // $c->id_lab = !is_null($k['lab']) ? ($id_lab ? $id_lab->id : null) : null;
                // $c->id_unit = !is_null($k['unit']) ? ($id_unit ? $id_unit->id : null) : null;
                // $c->id_standart = !is_null($k['standart']) ? ($id_standart ? $id_standart->id : null) : null;
                // $c->hasiluji = !is_null($k['hasiluji']) ? $k['hasiluji'] : null;
                // $c->ar = !is_null($k['actual_result']) ? $k['actual_result'] : null;
                // $c->status_parameter = 0;

                return array(
                    "hasiluji" => $q['hasiluji'],
                    "lab" => $q['lab'],
                    "id_lab" => !is_null($q['lab']) ? ($id_lab ? $id_lab->id : null) : null,
                    "lod" => $q['lod'],
                    "unit" => $q['unit'],
                    "id_unit" => !is_null($q['unit']) ? ($id_unit ? $id_unit->id : null) : null,
                    "id_lod" => !is_null($q['lod']) ? ($id_lod ? $id_lod->id : null) : null,
                    "metode" => $q['metode'],
                    "id_metode" => !is_null($q['metode']) ? ($id_metode ? $id_metode->id : null) : null,
                    "standart" => $q['standart'],
                    "id_standart" => !is_null($q['standart']) ? ($id_standart ? $id_standart->id : null) : null,
                    "ar" => $q['actual_result'],
                    "name_id" => $q['parameteruji_id'],
                    "id_parameteruji" => $q['id_parameteruji'],
                    "id_parameter_lhu" => $q['id']
                );
            }, $h['parameters']);

            // $y = Transaction_parameter::with([
            //     'lod',
            //     'parameterujiOne',
            //     'unit',
            //     'metode',
            //     'lab',
            // ])->where('id_sample',$var->complain->id_transaction_sample)->get();

            return response()->json($ha);
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function sendsaveparam(Request $request)
    {
        try {
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            foreach ($data as $d) {

                $det = !empty($d['idtechdet']) ? ComplainTechnicalDetail::find($d['idtechdet']) : (!empty($d['id']) ? ComplainTechnicalDetail::find($d['id']) : new ComplainTechnicalDetail);
                $det->complain_result = $d['complain_result'];
                $det->complain_arresult = $d['complain_arresult'];
                $det->expectation = !empty($d['expectation']) ? $d['expectation'] : null;
                $det->id_metode = $d['id_metode'];
                if(!empty($d['id_tech_det'])){
                    $det->id_tech_det = $d['id_tech_det'];
                }
                $det->id_parameteruji = !empty($d['id_parameteruji']) ? $d['id_parameteruji'] : $d['id_parameter'];
                $det->id_lod = !empty($d['id_lod']) ? $d['id_lod'] : null;
                $det->id_standart = !empty($d['id_standart']) ? $d['id_standart'] : null;
                $det->id_unit = $d['id_unit'];
                if(!empty($d['id_parameter_lhu'])){
                    $det->id_parameter_lhu = $d['id_parameter_lhu'];
                }
                if(!empty($d['status_parameter'])){
                    $det->status_parameter = $d['status_parameter'];
                }
                if(!empty($d['hasiluji'])){
                    $det->hasiluji = $d['hasiluji'];
                }
                if (!empty($d['status_complain'])) {
                    $det->status_complain = intval($d['status_complain']);
                }
                $det->id_lab = $d['id_lab'];
                $det->memo = !empty($d['memo']) ? $d['memo'] : null;
                $det->save();
            }

            return response()->json(array(
                "status" => true,
                "message" => "Saving Success"
            ));
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function getDataExcelComplain(Request $request)
    {
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            return $var = ComplainStatus::with([
                'complaindet.complain_tech.complain.TransactionSample.kontrakuji.customers_handle.customers',
                'complaindet.complain_tech.complain.TransactionSample.subcatalogue',
                'complaindet.complain_tech.complain.TransactionSample.statuspengujian',
                'complaindet.parameteruji',
                'complainstatusprep'
            ])
                ->whereHas('complaindet', function ($u) use ($data) {
                    return $u->whereHas('complain_tech', function ($z) use ($data) {
                        return $z->whereBetween(\DB::raw('DATE_FORMAT(estimate_date,"%Y-%m-%d")'), [$data['from'], $data['to']]);
                    });
                })
                ->where('position', 2)
                ->where('status', 0)
                ->whereNotIn('id_technical_det', [\DB::raw('SELECT id_technical_det FROM complain_technical_status WHERE position = 2 AND status = 1')])
                ->get();
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function changestdate(Request $request)
    {
        try {

            $var = ComplainTechnical::find($request->input('idtech'));
            $var->estimate_date = time::parse($request->input('estdate'))->format('Y-m-d');
            $var->save();

            return response()->json(array(
                "status" => true,
                "message" => "Saving Success"
            ));
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function complainaprovelab(Request $request)
    {
        try {
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            foreach ($data as $zz) {

                $g = ComplainTechnicalDetail::find($zz['id_transaction_parameter']);
                $g->id_unit = $zz['id_unit'];
                $g->id_lod = $zz['id_lod'];
                $g->id_standart = $zz['id_standart'];
                $g->memo = $zz['memo'];
                $g->complain_result = $zz['complain_result'];
                $g->complain_arresult = $zz['complain_arresult'];
                $g->save();

                $f = new ComplainStatus;
                $f->id_technical_det = $zz['id_transaction_parameter'];
                $f->status = 1;
                $f->position = 2;
                $f->inserted_at = time::now();
                $f->user_id = $id_user;
                $f->save();
            }



            return response()->json(array(
                "success" => true,
                "message" => "Saving Success"
            ));
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function setMemoComplainTechDet(Request $request)
    {
        try {

            $data = $request->input('data');
            $var = ComplainTechnicalDetail::find($data['idtechdet']);
            $var->memo = $data['memoexp'];
            $var->save();

            return response()->json(array(
                "status" => true,
                "message" => "Saving Success"
            ));
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function sendingCert(Request $request)
    {
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            $tdet = array_map(function ($s) {
                return $s['id_techdet'];
            }, $data);

            $chDet = ComplainSend::whereIn('id_techdet', $tdet)->get();

            if (count($chDet) > 0) {
                foreach ($tdet as $td) {
                    $bv = ComplainSend::where('id_techdet', $td)->first();
                    if ($bv) {
                        $gg = ComplainSend::find($bv->id);
                        if ($gg) {
                            $gg->forceDelete();
                        }
                    }
                }
            }

            foreach ($data as $v) {
                $idlab = !empty($v['lab']) ? \DB::table('mstr_laboratories_lab')->where(\DB::raw('UPPER(nama_lab)'), 'like', '%' . strtoupper($v['lab']) . '%')->first() : $v['id_lab'];
                $c = new ComplainSend;
                $c->id_technical = $v['id_tech'];
                $c->id_techdet = $v['id_techdet'];
                $c->id_parameteruji = $v['id_parameteruji'];
                $c->hasiluji = $v['hasiluji'];
                $c->id_lod = $v['id_lod'];
                $c->id_unit = $v['id_satuan'];
                $c->id_lab = !empty($v['lab']) ? $idlab->id : $idlab;
                $c->id_metode = $v['id_metode'];
                $c->memo = $v['memo'];
                $c->status = 0;
                $c->selectcust = intval($v['statushasil']);
                $c->inserted_at = time::now();
                $c->save();
            }

            return response()->json(array(
                "status" => true,
                "message" => "Succesfully Done !"
            ));
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function getParameter(Request $request)
    {
        $model = Transaction_parameter::with([
            'parameterujiOne',
            'lab',
            'standart',
            'unit',
            'lod'
        ])
            ->selectRaw('
            transaction_parameter.*,
            IF(transaction_parameter.status = 2,"NON PAKET",IF(transaction_parameter.status = 4,mstr_specific_package.package_name,mstr_products_paketuji.nama_paketuji)) as info_name
        ')
            ->distinct()
            ->leftJoin('parameter_price', function ($z) {
                $z->on('transaction_parameter.info_id', 'parameter_price.id')
                    ->where('transaction_parameter.status', '=', 2);
            })
            ->leftJoin('mstr_products_paketuji', function ($z) {
                $z->on('transaction_parameter.info_id', 'mstr_products_paketuji.id')
                    ->where('transaction_parameter.status', '=', 1);
            })
            ->leftJoin('mstr_sub_specific_package', function ($z) {
                $z->on('transaction_parameter.info_id', 'mstr_sub_specific_package.id')
                    ->join('mstr_specific_package', 'mstr_specific_package.id', 'mstr_sub_specific_package.mstr_specific_package_id')
                    ->where('transaction_parameter.status', '=', 4);
            })
            ->where('id_sample', $request->input('idsample'))->get();


        return response()->json($model);
    }

    public function store(Request $request)
    {
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            $year = time::now()->format('Y');
            $month = time::now()->format('m');

            $x = new ComplainTechnical;
            $x->id_cert = $data['id_cert'];
            $x->id_sample = $data['id_transaction_sample'];
            $x->idch = $data['idch'];
            $x->complain_date = time::now()->format('Y-m-d');
            $x->estimate_date = time::now()->format('Y-m-d');
            $x->save();
            // $x->complain_desc = intval($data['complain']);

            foreach ($data['parameterarray'] as $k) {
                $h = ComplainTechnicalDetail::select(\DB::raw('MAX(CAST(SUBSTRING_INDEX(complain_no,".",-1) AS SIGNED)) AS terakhir'))->first();

                $nomor = $h->terakhir + 1;

                $complain_no = substr($year, 2) . '' . $month . '.' . substr($k['nama_lab'], 0, 1) . '.' . $nomor;

                $c = new ComplainTechnicalDetail;
                $c->id_technical_complain = $x->id;
                $c->id_transaction_parameter = $k['id'];
                $c->complain_no = $complain_no;
                $c->complain_desc = intval($k['complain']);
                $c->save();
            }

            return response()->json(array(
                "success" => true,
                "message" => "Saving Success"
            ));
        } catch (\Exception $e) {
            return response()->json(array(
                "success" => false,
                "message" => "Saving Error"
            ));
        }
    }


    public function approve_parameter(Request $request)
    {
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            return $data;

            return response()->json(array(
                "success" => true,
                "message" => "Saving Success"
            ));
        } catch (\Exception $e) {
            return response()->json(array(
                "success" => false,
                "message" => "Saving Error"
            ));
        }
    }
}
