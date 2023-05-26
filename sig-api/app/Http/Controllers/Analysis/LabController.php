<?php

namespace App\Http\Controllers\Analysis;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Analysis\Customer;
use App\Models\Analysis\BobotSample;
use App\Models\Analysis\Kontrakuji;
// use App\Models\Analysis\ConditionContract;
use App\Models\Analysis\Description;
use App\Models\Master\ContractCategory;
use App\Models\Analysis\ConditionLabProccess;
use App\Models\Analysis\ConditionLabDone;
use App\Models\Analysis\ConditionContractNew;
use App\Models\Complain\ComplainTechnical;
use App\Models\Complain\ComplainTechnicalDetail;
use App\Models\Complain\ComplainStatus;
use App\Models\Analysis\TransactionSample;
use App\Models\Analysis\Customerhandle;
use App\Models\Analysis\Transaction_parameter;
use App\Models\Master\ParameterUji;
use App\Models\Ecert\Complain;
use App\Models\Master\Photo;
use App\Models\Master\Lab;
use Firebase\JWT\JWT;
use DB;
use Auth;
// use Config;
use Carbon\Carbon as time;

class LabController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */

    public function index(Request $request)
    {
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            // return 'a';
            $var = Transaction_parameter::with([
                'parameterujiOne',
                'parameterujiOne.parametertype',
                'parameterujiOne.analystgroup',
                'lod',
                'lab',
                'standart',
                'metode',
                'unit',
                'condition_contracts',
                'conditionlabdone',
                'conditionlabdone.user',
                'transaction_sample',
                'transaction_sample.subcatalogue',
                'transaction_sample.statuspengujian',
                'transaction_sample.tujuanpengujian',
                'transaction_sample.kontrakuji',
                'transaction_sample.kontrakuji.contract_category',
                'transaction_sample.kontrakuji.customers_handle',
                'transaction_sample.kontrakuji.customers_handle.customers',
            ])->select(
                \DB::raw('0 as checked'),
                'transaction_parameter.id',
                'transaction_parameter.id_parameteruji',
                'transaction_parameter.simplo',
                'transaction_parameter.actual_result',
                'transaction_parameter.desc',
                'transaction_parameter.duplo',
                'transaction_parameter.triplo',
                'transaction_parameter.hasiluji',
                'transaction_parameter.id_standart',
                'transaction_parameter.id_standart',
                'transaction_parameter.actual_result',
                'transaction_parameter.id_lod',
                'transaction_parameter.desc',
                'transaction_parameter.id_lab',
                'transaction_parameter.id_unit',
                'transaction_parameter.id_metode',
                'transaction_parameter.format_hasil',
                'transaction_parameter.id_sample',
                'transaction_parameter.disc_parameter',
                'transaction_parameter.status',
                'transaction_parameter.position',
                'transaction_parameter.deleted_at'
            )
                ->whereIn('transaction_parameter.id_sample', [\DB::raw('SELECT sample_id FROM condition_contracts WHERE contract_id =' . intval($request->input('id_contract')) . ' AND status = 0 AND position = 4 GROUP BY sample_id')])
                // ->whereIn('transaction_parameter.id_sample',[\DB::raw('SELECT sample_id FROM condition_contracts WHERE position = 4 AND status = 0 GROUP BY sample_id')])
                ->orderBy('transaction_parameter.id', 'ASC')
                ->get();

            return response()->json($var);
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function sendSampletoCertificate(Request $request)
    {
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');
            // return is_array($data);
            foreach ($data as $z) {
                $var = ConditionContractNew::where('sample_id', $z['id_sample'])->where('position', 4)->get();
                if (!empty($z['kesimpulan'])) {
                    $checkSample = TransactionSample::find($z['id_sample']);
                    $checkSample->kesimpulan = $z['kesimpulan'];
                }

                foreach ($var as $k) {
                    if (!empty($z['kesimpulan'])) {
                        $checkSample = TransactionSample::find($z['id_sample']);
                        $checkSample->kesimpulan = $z['kesimpulan'];
                    }
                    $setSampel = ConditionContractNew::find($k->id_condition_contract);
                    $setSampel->user_id = $id_user;
                    $setSampel->inserted_at = time::now();
                    $setSampel->status = 1;
                    $setSampel->save();
                }
            }


            return response()->json(array(
                "success" => true,
                "message" => "Status Updated"
            ));
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function memolab(Request $request)
    {
        try {

            $var = \DB::table('description_info as a')
                ->select('a.desc', \DB::raw('IF(a.groups = 3,"Preparation","Kendali") as status'), 'c.employee_name')
                ->leftJoin('mstr_transaction_kontrakuji as b', 'b.id_kontrakuji', 'a.id_contract')
                ->leftJoin('hris_employee as c', 'c.user_id', 'a.insert_user')
                ->whereIn('a.groups', [2, 3])
                ->where('a.id_contract', $request->input('id_contract'))
                ->groupBy('a.groups')->get();
            return response()->json($var);
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function labinfo(Request $request)
    {
        try {

            $var = Transaction_parameter::with([
                'conditionlabcome',
                'conditionlabcome.user',
                'conditionlabproccess',
                'conditionlabproccess.user',
                'conditionlabdone',
                'conditionlabdone.user',

            ])->find($request->input('idparameter'));
            return response()->json($var);
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function getInfoParameter(Request $request)
    {
        try {
            $labcome = \DB::table('condition_lab_come as a')
                ->selectRaw('
                b.employee_name,
                a.*
            ')
                ->leftJoin('hris_employee as b', 'b.user_id', 'a.user_id')
                ->where('id_transaction_parameter', $request->input('id_transaction_parameter'))
                ->first();

            $labprocess = \DB::table('condition_lab_proccess as a')
                ->selectRaw('
                b.employee_name,
                a.*
            ')
                ->leftJoin('hris_employee as b', 'b.user_id', 'a.user_id')
                ->where('id_transaction_parameter', $request->input('id_transaction_parameter'))
                ->first();

            $labdone = \DB::table('condition_lab_done as a')
                ->selectRaw('
                b.employee_name,
                a.*
            ')
                ->leftJoin('hris_employee as b', 'b.user_id', 'a.user_id')
                ->where('id_transaction_parameter', $request->input('id_transaction_parameter'))
                ->first();

            return response()->json(array(
                'labcome' => $labcome,
                'labprocess' => $labprocess,
                'labdone' => $labdone,
            ));
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function getDataCount(Request $request)
    {
        if ($request->input('approve') == 0) {
            $var = \DB::table('transaction_parameter as a')
                ->selectRaw('
                a.id
            ')
                ->join('condition_lab_come as b', 'b.id_transaction_parameter', 'a.id')
                ->join(\DB::raw('(SELECT * FROM condition_contracts as bb 
                WHERE bb.position = 4 
                AND bb.status = 0 
                GROUP BY bb.sample_id 
            ) AS smp'), 'smp.sample_id', 'a.id_sample')
                ->distinct()
                ->whereNotIN('b.id_transaction_parameter', [\DB::raw('SELECT id_transaction_parameter FROM condition_lab_proccess GROUP BY id_transaction_parameter')]);
            if ($request->input('lab') == 15) {
                $var = $var->whereIn('a.id_lab', [\DB::raw('SELECT id FROM mstr_laboratories_lab WHERE UPPER(ket_lab) = "OUT"')]);
            } else {
                $var = $var->where('a.id_lab', $request->input('lab'));
            }

            return response()->json($var->count());
        } else if ($request->input('approve') == 1) {
            $var = \DB::table('transaction_parameter as a')
                ->selectRaw('
                a.id
            ')
                ->join('condition_lab_proccess as b', 'b.id_transaction_parameter', 'a.id')
                ->join(\DB::raw('(SELECT * FROM condition_contracts as bb 
                WHERE bb.position = 4 
                AND bb.status = 0 
                GROUP BY bb.sample_id 
            ) AS smp'), 'smp.sample_id', 'a.id_sample')
                ->distinct()
                ->whereNotIN('b.id_transaction_parameter', [\DB::raw('SELECT id_transaction_parameter FROM condition_lab_done GROUP BY id_transaction_parameter')]);
            if ($request->input('lab') == 15) {
                $var = $var->whereIn('a.id_lab', [\DB::raw('SELECT id FROM mstr_laboratories_lab WHERE UPPER(ket_lab) = "OUT"')]);
            } else {
                $var = $var->where('a.id_lab', $request->input('lab'));
            }

            return response()->json($var->count());
        } else if ($request->input('approve') == 2) {
            $var = \DB::table('transaction_parameter as a')
                ->selectRaw('
                a.id
            ')
                ->join('condition_lab_done as b', 'b.id_transaction_parameter', 'a.id')
                ->join(\DB::raw('(SELECT * FROM condition_contracts as bb 
                WHERE bb.position = 4 
                AND bb.status = 0 
                GROUP BY bb.sample_id 
            ) AS smp'), 'smp.sample_id', 'a.id_sample')
                ->distinct();
            if ($request->input('lab') == 15) {
                $var = $var->whereIn('a.id_lab', [\DB::raw('SELECT id FROM mstr_laboratories_lab WHERE UPPER(ket_lab) = "OUT"')]);
            } else {
                $var = $var->where('a.id_lab', $request->input('lab'));
            }

            return response()->json($var->count());
        } else if ($request->input('approve') == 4) {
            $var = ComplainStatus::with([
                'complaindet'
            ])
                ->whereHas('complaindet', function ($q) use ($request) {
                    if ($request->input('lab') == 15) {
                        $u = Lab::where(\DB::raw('UPPER(ket_lab)'), 'like', '%%OUT')->get();
                        return $q->whereIn('id_lab', $u);
                    } else {
                        return $q->where('id_lab', $request->input('lab'));
                    }
                })
                ->where('position', 2)
                ->where('status', 0)
                ->whereNotIn('id_technical_det', [\DB::raw('SELECT id_technical_det FROM complain_technical_status WHERE position = 2 AND status = 1')])
                ->orderBy('status', 'desc')
                ->groupBy('id_technical_det')
                ->get();

            return response()->json($var->count());
        }
    }

    public function indexfor2(Request $request)
    {
        // try {

        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $lab = '';
        $sublab = '';

        if ($data['idlab'] == 15) {
            $labcheck = \DB::table('mstr_laboratories_lab')
                ->where(\DB::raw('UPPER(ket_lab)'), 'like', '%OUT%')
                ->get()
                ->toArray();

            $s = array_map(function ($q) {
                return $q->id;
            }, $labcheck);

            $lab = 'WHERE b.id_lab IN (' . implode(",", $s) . ')';
            $sublab = 'WHERE jj.id_lab IN (' . implode(",", $s) . ')';
        } else {
            $sublab = 'WHERE jj.id_lab = ' . $data['idlab'] . '';
            $lab = 'WHERE b.id_lab = ' . $data['idlab'] . '';
        }


        if ($data['approve'] == 0) {
            $x = [];
            $var = $this->getlabcome($data, $lab, $sublab);
            $e = $var['data'];
            foreach ($e as $f) {
                $g = \DB::table('contract_message')->where('id_contract', $f->id_contract)->first();
                array_push($x, array(
                    "checked" => $f->checked,
                    'contract_no' => $f->contract_no,
                    'deleted_at' => $f->deleted_at,
                    'disc_parameter' => $f->disc_parameter,
                    'duplo' => $f->duplo,
                    'format_hasil' => $f->format_hasil,
                    'hasiluji' => $f->hasiluji,
                    "id" => $f->id,
                    "tujuanpengujian" => $f->tujuanpengujian,
                    "id_contract" => $f->id_contract,
                    "id_lab" => $f->id_lab,
                    "id_lod" => $f->id_lod,
                    "id_metode" => $f->id_metode,
                    "id_parameteruji" => $f->id_parameteruji,
                    "id_sample" => $f->id_sample,
                    "id_standart" => $f->id_standart,
                    "id_statuspengujian" => $f->id_statuspengujian,
                    "id_unit" => $f->id_unit,
                    "idfor" => $f->idfor,
                    "info" => $f->info,
                    "info_id" => $f->info_id,
                    "inserted_at" => time::parse($f->inserted_at)->format('d/m/Y H:i:s'),
                    "matriks" => $f->matriks,
                    "name_id" => $f->name_id,
                    "no_sample" => $f->no_sample,
                    "position" => $f->position,
                    "sample_name" => $f->sample_name,
                    "simplo" => $f->simplo,
                    "status" => $f->status,
                    "status_contract" => $g->status > 0 ? "Rev" : "New",
                    "status_pengujian" => $f->status_pengujian,
                    "team_name" => $f->team_name,
                    "tgl_estimasi_lab" => time::parse($f->tgl_estimasi_lab)->format('d/m/Y'),
                    "title" => $f->title,
                    "triplo" => $f->triplo
                ));
            }
            $var['data'] = $x;
            return response()->json($var);
        } else if ($data['approve'] == 1) {
            $x = [];
            $var = $this->getlabproccess($data, $lab, $sublab);
            $e = $var['data'];
            foreach ($e as $f) {
                // return $e;
                $g = \DB::table('contract_message')->where('id_contract', $f->id_contract)->first();
                array_push($x, array(
                    "checked" => $f->checked,
                    'contract_no' => $f->contract_no,
                    'deleted_at' => $f->deleted_at,
                    'disc_parameter' => $f->disc_parameter,
                    'duplo' => $f->duplo,
                    'format_hasil' => $f->format_hasil,
                    'hasiluji' => $f->hasiluji,
                    "id" => $f->id,
                    "id_contract" => $f->id_contract,
                    "tujuanpengujian" => $f->tujuanpengujian,
                    "id_lab" => $f->id_lab,
                    "id_lod" => $f->id_lod,
                    "id_metode" => $f->id_metode,
                    "id_parameteruji" => $f->id_parameteruji,
                    "id_sample" => $f->id_sample,
                    "id_standart" => $f->id_standart,
                    "id_statuspengujian" => $f->id_statuspengujian,
                    "id_unit" => $f->id_unit,
                    "idfor" => $f->idfor,
                    "info" => $f->info,
                    "info_id" => $f->info_id,
                    "inserted_at" => time::parse($f->inserted_at)->format('d/m/Y H:i:s'),
                    "matriks" => $f->matriks,
                    "name_id" => $f->name_id,
                    "no_sample" => $f->no_sample,
                    "position" => $f->position,
                    "sample_name" => $f->sample_name,
                    "simplo" => $f->simplo,
                    "status" => $f->status ? $f->status : '-',
                    "status_contract" => $g->status > 0 ? "Rev" : "New",
                    "status_pengujian" => $f->status_pengujian,
                    "team_name" => $f->team_name,
                    "tgl_estimasi_lab" => time::parse($f->tgl_estimasi_lab)->format('d/m/Y'),
                    "title" => $f->title,
                    "triplo" => $f->triplo
                ));
            }
            $var['data'] = $x;
            return response()->json($var);
        } else if ($data['approve'] == 2) {
            $x = [];
            $var = $this->getlabdone($data, $lab, $sublab);
            $e = $var['data'];
            foreach ($e as $f) {
                $g = \DB::table('contract_message')->where('id_contract', $f->id_contract)->first();
                array_push($x, array(
                    "checked" => $f->checked,
                    'contract_no' => $f->contract_no,
                    'deleted_at' => $f->deleted_at,
                    'disc_parameter' => $f->disc_parameter,
                    'duplo' => $f->duplo,
                    'format_hasil' => $f->format_hasil,
                    "tujuanpengujian" => $f->tujuanpengujian,
                    'hasiluji' => $f->hasiluji,
                    "id" => $f->id,
                    "id_contract" => $f->id_contract,
                    "id_lab" => $f->id_lab,
                    "id_lod" => $f->id_lod,
                    "id_metode" => $f->id_metode,
                    "id_parameteruji" => $f->id_parameteruji,
                    "id_sample" => $f->id_sample,
                    "id_standart" => $f->id_standart,
                    "id_statuspengujian" => $f->id_statuspengujian,
                    "id_unit" => $f->id_unit,
                    "idfor" => $f->idfor,
                    "info" => $f->info,
                    "info_id" => $f->info_id,
                    "inserted_at" => time::parse($f->inserted_at)->format('d/m/Y H:i:s'),
                    "matriks" => $f->matriks,
                    "name_id" => $f->name_id,
                    "no_sample" => $f->no_sample,
                    "position" => $f->position,
                    "sample_name" => $f->sample_name,
                    "simplo" => $f->simplo,
                    "status" => $f->status,
                    "status_contract" => $g->status > 0 ? "Rev" : "New",
                    "status_pengujian" => $f->status_pengujian,
                    "team_name" => $f->team_name,
                    "tgl_estimasi_lab" => time::parse($f->tgl_estimasi_lab)->format('d/m/Y'),
                    "title" => $f->title,
                    "triplo" => $f->triplo
                ));
            }
            $var['data'] = $x;
            return response()->json($var);
        } else {

            $x = [];
            // return $cv = Lab::where(\DB::raw('UPPER(ket_lab)'), 'like', '%OUT%')->get();
            $var = ComplainStatus::with([
                'complaindet.complain_tech.complain.TransactionSample.kontrakuji.customers_handle.customers',
                'complaindet.complain_tech.complain.TransactionSample.subcatalogue',
                'complaindet.complain_tech.complain.TransactionSample.statuspengujian',
                'complaindet.parameteruji',
                'complainstatusprep'
            ])

                ->whereHas('complaindet', function ($q) use ($data) {
                    if ($data['idlab'] == 15) {
                        $u = Lab::where(\DB::raw('UPPER(ket_lab)'), 'like', '%OUT%')->get()->toArray();
                        $y = array_map(function($q){
                            return $q['id'];
                        },$u);
                        return $q->whereIn('id_lab',$y);
                    } else {
                        return $q->where('id_lab', $data['idlab']);
                    }
                })

                ->where('position', 2)
                ->where('status', 0)
                ->whereNotIn('id_technical_det', [\DB::raw('SELECT id_technical_det FROM complain_technical_status WHERE position = 2 AND status = 1')])
                ->orderBy('status', 'desc')
                ->groupBy('id_technical_det');

            if (!empty($data['search'])) {
                $v = ComplainTechnical::where('complain_no','like','%'.trim($data['search'], " ").'%')
                ->select('id')
                ->first();

                $var = $var->whereHas('complaindet',function($f) use($v){
                    return $f->where('id_tech_det',$v->id);
                });
            }

            if (!empty($data['estimasi_lab'])) {
                $var = $var->whereHas('complaindet', function ($u) use ($data) {
                    return $u->whereHas('complain_tech', function ($c) use ($data) {
                        return $c->where(\DB::raw('DATE_FORMAT(estimate_date,"%Y-%m-%d")'), $data['estimasi_lab']);
                    });
                });
            }

            // if (!empty($data['id_statuspengujian'])) {

            //     // $r = TransactionSample::where('id_statuspengujian', $data['id_statuspengujian'])->select('id')->get();

            //     return $df = Complain::with([
            //         'TransactionSample'
            //     ])->whereHas('TransactionSample',function($s) use($data){
            //         return $s->where('id_statuspengujian',$data['id_statuspengujian']);
            //     })->get();

            //     $gg = array_map(function ($ii) {
            //         return $ii['id'];
            //     }, $df);

            //     $var = $var->whereHas('complaindet', function ($o) use ($gg) {
            //         return $o->whereHas('complain_tech', function ($f) use ($gg) {
            //             return $f->whereIn('id_complain', $gg);
            //         });
            //     });

            // }

            if (!empty($data['typeContract'])) {

                $g = TransactionSample::with([
                    'kontrakuji'
                ])->whereHas('kontrakuji', function ($c) use ($data) {
                    return $c->where('id_contract_category', $data['typeContract']);
                })->get()->toArray();

                $h = array_map(function ($y) {
                    return $y['id'];
                }, $g);


                $cm = Complain::whereIn('id_transaction_sample', $h)
                    ->select('id')
                    ->get()
                    ->toArray();

                $gg = array_map(function ($ii) {
                    return $ii['id'];
                }, $cm);

                $var = $var->whereHas('complaindet', function ($o) use ($gg) {
                    return $o->whereHas('complain_tech', function ($f) use ($gg) {
                        return $f->whereIn('id_complain', $gg);
                    });
                });
            }


            $var = $var->simplePaginate(50)->toArray();
            // return $var;
            $arf = array_filter($var['data'], function ($d) {
                return !empty($d['complaindet']['complain_tech']['complain']);
            });

            if (count(array_values($arf)) > 0) {
                foreach (array_values($arf) as $f) {
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
                        "inserted_at" => time::parse($f['complaindet']['complain_tech']['complain_date'])->format('d/m/Y'),
                        "matriks" =>  $f['complaindet']['complain_tech']['complain']['transaction_sample']['subcatalogue']['sub_catalogue_name'],
                        "name_id" => $f['complaindet']['parameteruji']['name_id'],
                        "no_sample" => $f['complaindet']['complain_tech']['complain']['transaction_sample']['no_sample'],
                        "sample_name" => $f['complaindet']['complain_tech']['complain']['transaction_sample']['sample_name'],
                        "memo" => $f['complaindet']['memo'],
                        "simplo" => null,
                        "status_pengujian" => $f['complaindet']['complain_tech']['complain']['transaction_sample']['statuspengujian']['name'],
                        "tgl_estimasi_lab" => time::parse($f['complaindet']['complain_tech']['estimate_date'])->format('d/m/Y'),
                        "triplo" => null,
                        "customers" => $f['complaindet']['complain_tech']['complain']['transaction_sample']['kontrakuji']['customers_handle']['customers']['customer_name']
                    ));
                }
            }

            $var['data'] = $x;
        }

        return response()->json($var);


        // } catch (\Exception $e){
        //     return response()->json($e->getMessage());
        // }
    }

    private function getlabcomplain($data, $lab, $sublab)
    { }


    private function getlabcome($data, $lab, $sublab)
    {

        $var = \DB::table('transaction_parameter as a')
            ->selectRaw('
                0 AS checked,
                a.*,
                smp.inserted_at,
                c.name_id,
                d.no_sample,
                d.sample_name,
                d.id_contract,
                k.team_name,
                d.id_statuspengujian,
                d.tgl_estimasi_lab,
                e.name AS status_pengujian,
                f.sub_catalogue_name AS matriks,
                h.title,
                g.id_contract_category,
                m.name as tujuanpengujian,
                g.contract_no,
                if(a.status = 1, CONCAT(i.kode_paketuji," - ",i.nama_paketuji), if(a.status = 4, CONCAT(l.package_code," - ",l.package_name),"NON PAKET")) AS info
            ')
            ->join(\DB::raw('(SELECT * FROM condition_contracts b 
                WHERE b.position = 4 
                AND b.status = 0 
                GROUP BY sample_id 
            ) AS smp'), 'smp.sample_id', 'a.id_sample')
            ->leftJoin('mstr_laboratories_parameteruji as c', 'c.id', 'a.id_parameteruji')
            ->leftJoin('transaction_sample as d', 'd.id', 'a.id_sample')
            ->leftJoin('mstr_transaction_statuspengujian as e', 'e.id', 'd.id_statuspengujian')
            ->leftJoin('mstr_transaction_tujuanpengujian as m', 'm.id', 'd.id_tujuanpengujian')
            ->leftJoin('mstr_transaction_sub_catalogue as f', 'f.id_sub_catalogue', 'd.id_subcatalogue')
            ->leftJoin('mstr_transaction_kontrakuji as g', 'g.id_kontrakuji', 'd.id_contract')
            ->leftJoin('mstr_products_contactcategory as h', 'h.id', 'g.id_contract_category')
            ->leftJoin('mstr_products_paketuji as i', 'i.id', 'a.info_id')
            ->leftJoin('mstr_sub_specific_package as j', 'j.id', 'a.info_id')
            ->leftJoin('mstr_analyst_group as k', 'k.id', 'c.id_analystgroup')
            ->leftJoin('mstr_specific_package as l', 'l.id', 'j.mstr_specific_package_id')
            ->whereNotIn('a.id', [\DB::raw('SELECT id_transaction_parameter FROM condition_lab_proccess')]);

        if ($data['idlab'] == 15) {
            $var = $var->whereIn('a.id_lab', [\DB::raw('SELECT id FROM mstr_laboratories_lab WHERE UPPER(ket_lab) LIKE "%OUT%"')]);
        } else {
            if ($data['idlab'] == 59 || $data['idlab'] == 72) {
                $var = $var->whereIn('a.id_lab', [59, 72]);
            } else {
                $var = $var->where('a.id_lab', $data['idlab']);
            }
        }

        if (!empty($data['rev'])) {
            if ($data['rev'] !== 'all') {
                $var = $var->whereIn('d.id_contract', [\DB::raw('SELECT id_contract FROM contract_message WHERE status = ' . intval($data['rev']))]);
            }
        }

        if (count($data['contract']) > 0) {
            $g = [];
            foreach ($data['contract'] as $k) {
                array_push($g, $k);
            }
            // return $g;
            $var = $var->whereIn('d.id_contract', $g);
        }

        if (count($data['sample']) > 0) {
            $g = [];
            foreach ($data['sample'] as $k) {
                array_push($g, $k);
            }
            $var = $var->whereIn('a.id_sample', $g);
        }

        if (!empty($data['id_parameteruji'])) {
            $var = $var->where('a.id_parameteruji', $data['id_parameteruji']);
        }

        if (!empty($data['typeContract'])) {
            $var = $var->where('g.id_contract_category', $data['typeContract']);
        }

        if (!is_null($data['search'])) {
            $u = \DB::table('mstr_transaction_kontrakuji as a')->where(\DB::raw('UPPER(a.contract_no)'), 'like', '%' . strtoupper($data['search']) . '%')->get()->toArray();
            if (count($u) > 0) {
                $t = array_map(function ($q) {
                    return $q->id_kontrakuji;
                }, $u);

                $var = $var->whereIn('d.id_contract', array_values($t));
            } else {
                $v = \DB::table('transaction_sample as a')->leftJoin('transaction_parameter as b', 'b.id_sample', 'a.id')->where('a.no_sample', 'like', '%' . strtoupper($data['search']) . '%')->get()->toArray();

                if (count($v) > 0) {
                    $c = array_map(function ($q) {
                        return $q->id_sample;
                    }, $v);

                    $var = $var->whereIn('a.id_sample', array_values($c));
                } else {
                    $var = $var->where(\DB::raw('UPPER(d.sample_name)'), 'like', '%' . strtoupper($data['search']) . '%');
                }
            }
        }

        if (!empty($data['id_statuspengujian'])) {
            $var = $var->where('d.id_statuspengujian', $data['id_statuspengujian']);
        }

        if (!empty($data['estimasi_lab'])) {
            // return $data['estimasi_lab'];
            $var = $var->where('d.tgl_estimasi_lab', $data['estimasi_lab']);
        }

        if (!empty($data['tgl_approval'])) {
            $var = $var->where(\DB::raw("DATE_FORMAT(inserted_at,'%Y-%m-%d')"), $data['tgl_approval']);
        }


        if (!empty($data['preparation_date'])) {
            $var = $var->whereHas('preparation_approve', function ($q) use ($data) {
                return $q->where('status', 2)
                    ->where('position', 3)
                    ->where(\DB::raw('DATE_FORMAT(smp.inserted_at,"%Y-%m-%d")'), $data['preparation_date']);
            });
        }

        if (!empty($data['excel'])) {
            $var = $var->get();
        } else {
            $var = $var->simplePaginate(50);
            return $var->toArray();
        }

        return response()->json($var);
    }


    public function difference(Request $request)
    {

        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $lab = '';
        $sublab = '';

        if ($data['idlab'] == 15) {
            $labcheck = \DB::table('mstr_laboratories_lab')
                ->where(\DB::raw('UPPER(ket_lab)'), 'like', '%OUT%')
                ->get()
                ->toArray();

            $s = array_map(function ($q) {
                return $q->id;
            }, $labcheck);

            $lab = 'WHERE b.id_lab IN (' . implode(",", $s) . ')';
            $sublab = 'WHERE jj.id_lab IN (' . implode(",", $s) . ')';
        } else {
            $sublab = 'WHERE jj.id_lab = ' . $data['idlab'] . '';
            $lab = 'WHERE b.id_lab = ' . $data['idlab'] . '';
        }

        $var = \DB::table('transaction_parameter as a')
            ->selectRaw('
                0 AS checked,
                a.id_sample,
                a.id_parameteruji,
                a.simplo,
                a.duplo,
                a.hasiluji,
                a.id,
                a.id_standart,
                a.id_metode,
                a.id_unit,
                a.id_lod,
                a.format_hasil,
                a.status,
                a.actual_result,
                a.desc,
                a.position,
                a.triplo,
                (select inserted_at from condition_contracts where sample_id = a.id_sample and status = 0 and position = 4 group by sample_id ) as inserted_at,
                (select name_id from mstr_laboratories_parameteruji where id = a.id_parameteruji ) as name_id,
                (select json_object("no_sample", no_sample, "sample_name", sample_name, "id_contract", id_contract, "id_statuspengujian", id_statuspengujian, "tgl_estimasi_lab", tgl_estimasi_lab) from transaction_sample where id = a.id_sample) as sampleinfo,
                (select name from mstr_transaction_statuspengujian where id in (select id_statuspengujian from transaction_sample where id = a.id_sample )) as status_pengujian,
                (select name from mstr_transaction_tujuanpengujian where id in (select id_tujuanpengujian from transaction_sample where id = a.id_sample )) as tujuanpengujian,
                (select sub_catalogue_name from mstr_transaction_sub_catalogue where id_sub_catalogue in ( select id_subcatalogue from transaction_sample where id = a.id_sample)) as matriks,
                (select contract_no from mstr_transaction_kontrakuji where id_kontrakuji in (select id_contract from transaction_sample where id = a.id_sample)) as contract_no,
                if(a.status = 1, CONCAT(i.kode_paketuji," - ",i.nama_paketuji), if(a.status = 4, CONCAT(l.package_code," - ",l.package_name),"NON PAKET")) AS info
            ')
            // ->join(\DB::raw('(SELECT sample_id FROM condition_contracts b 
            //     WHERE b.position = 4 
            //     AND b.status = 0 
            //     GROUP BY sample_id 
            // ) AS smp'),'smp.sample_id','a.id_sample')
            // ->join('mstr_laboratories_parameteruji as c','c.id','a.id_parameteruji')
            // ->join('transaction_sample as d','d.id','a.id_sample')
            // ->join('mstr_transaction_statuspengujian as e','e.id','d.id_statuspengujian')
            // ->join('mstr_transaction_tujuanpengujian as m','m.id','d.id_tujuanpengujian')
            // ->join('mstr_transaction_sub_catalogue as f','f.id_sub_catalogue','d.id_subcatalogue')
            // ->join('mstr_transaction_kontrakuji as g','g.id_kontrakuji','d.id_contract')
            // ->join('mstr_products_contactcategory as h','h.id','g.id_contract_category')
            ->leftJoin('mstr_products_paketuji as i', 'i.id', 'a.info_id')
            ->leftJoin('mstr_sub_specific_package as j', 'j.id', 'a.info_id')
            // ->with(index("transaction_param_idx"))
            // ->leftJoin('mstr_analyst_group as k','k.id','c.id_analystgroup')
            ->leftJoin('mstr_specific_package as l', 'l.id', 'j.mstr_specific_package_id')
            ->whereNotIn('a.id', [\DB::raw('SELECT id_transaction_parameter FROM condition_lab_proccess use index(idtr_param)')]);

        if ($data['idlab'] == 15) {
            $var = $var->whereIn('a.id_lab', [\DB::raw('SELECT id FROM mstr_laboratories_lab WHERE UPPER(ket_lab) LIKE "%OUT%"')]);
        } else {
            $var = $var->where('a.id_lab', $data['idlab']);
        }

        if (!empty($data['rev'])) {
            if ($data['rev'] !== 'all') {
                $var = $var->whereIn('d.id_contract', [\DB::raw('SELECT id_contract FROM contract_message WHERE status = ' . intval($data['rev']))]);
            }
        }

        if (count($data['contract']) > 0) {
            $g = [];
            foreach ($data['contract'] as $k) {
                array_push($g, $k);
            }
            // return $g;
            $var = $var->whereIn('d.id_contract', $g);
        }

        if (count($data['sample']) > 0) {
            $g = [];
            foreach ($data['sample'] as $k) {
                array_push($g, $k);
            }
            $var = $var->whereIn('a.id_sample', $g);
        }

        if (!empty($data['id_parameteruji'])) {
            $var = $var->where('a.id_parameteruji', $data['id_parameteruji']);
        }

        if (!empty($data['typeContract'])) {
            $var = $var->where('g.id_contract_category', $data['typeContract']);
        }

        if (!is_null($data['search'])) {
            $u = \DB::table('mstr_transaction_kontrakuji as a')->where(\DB::raw('UPPER(a.contract_no)'), 'like', '%' . strtoupper($data['search']) . '%')->get()->toArray();
            if (count($u) > 0) {
                $t = array_map(function ($q) {
                    return $q->id_kontrakuji;
                }, $u);

                $var = $var->whereIn('d.id_contract', array_values($t));
            } else {
                $v = \DB::table('transaction_sample as a')->leftJoin('transaction_parameter as b', 'b.id_sample', 'a.id')->where('a.no_sample', 'like', '%' . strtoupper($data['search']) . '%')->get()->toArray();

                if (count($v) > 0) {
                    $c = array_map(function ($q) {
                        return $q->id_sample;
                    }, $v);

                    $var = $var->whereIn('a.id_sample', array_values($c));
                } else {
                    $var = $var->where(\DB::raw('UPPER(d.sample_name)'), 'like', '%' . strtoupper($data['search']) . '%');
                }
            }
        }

        if (!empty($data['id_statuspengujian'])) {
            $var = $var->where('d.id_statuspengujian', $data['id_statuspengujian']);
        }

        if (!empty($data['estimasi_lab'])) {
            // return $data['estimasi_lab'];
            $var = $var->where('d.tgl_estimasi_lab', $data['estimasi_lab']);
        }

        if (!empty($data['tgl_approval'])) {
            $var = $var->where(\DB::raw("DATE_FORMAT(inserted_at,'%Y-%m-%d')"), $data['tgl_approval']);
        }


        if (!empty($data['preparation_date'])) {
            $var = $var->whereHas('preparation_approve', function ($q) use ($data) {
                return $q->where('status', 2)
                    ->where('position', 3)
                    ->where(\DB::raw('DATE_FORMAT(smp.inserted_at,"%Y-%m-%d")'), $data['preparation_date']);
            });
        }

        if (!empty($data['excel'])) {
            $var = $var->get();
        } else {
            $var = $var->simplePaginate(50);
            return $var->toArray();
        }

        return response()->json($var);
    }


    public function exportParameter(Request $request)
    {
        $v = \DB::select('
            SELECT
            j.contract_no,
            c.no_sample,
            c.sample_name,
            i.sub_catalogue_name,
            e.nama_lab,
            b.name_id,
            a.hasiluji,
            a.simplo,
            a.duplo,
            a.triplo,
            f.nama_unit,
            g.nama_standart,
            d.nama_lod,
            h.metode
            FROM transaction_parameter a
            LEFT JOIN mstr_laboratories_parameteruji b ON b.id = a.id_parameteruji
            LEFT JOIN transaction_sample c ON c.id = a.id_sample
            LEFT JOIN mstr_laboratories_lod d ON d.id = a.id_lod
            LEFT JOIN mstr_laboratories_lab e ON e.id = a.id_lab
            LEFT JOIN mstr_laboratories_unit f ON f.id = a.id_unit
            LEFT JOIN mstr_laboratories_standart g ON g.id = a.id_standart
            LEFT JOIN mstr_laboratories_metode h ON h.id = a.id_metode
            LEFT JOIN mstr_transaction_sub_catalogue i ON i.id_sub_catalogue = c.id_subcatalogue
            LEFT JOIN mstr_transaction_kontrakuji j ON j.id_kontrakuji = c.id_contract
            WHERE c.id_contract = ' . $request->input('id_contract') . '
            GROUP BY a.id
        ');
        return response()->json($v);
    }


    private function getlabdone($data, $lab, $sublab)
    {


        $var = \DB::table('transaction_parameter as a')
            ->selectRaw('
                0 AS checked,
                a.*,
                cc.inserted_at,
                c.name_id,
                d.no_sample,
                d.sample_name,
                d.id_contract,
                k.team_name,
                d.id_statuspengujian,
                d.tgl_estimasi_lab,
                e.name AS status_pengujian,
                f.sub_catalogue_name AS matriks,
                h.title,
                g.id_contract_category,
                m.name as tujuanpengujian,
                g.contract_no,
                if(a.status = 1, CONCAT(i.kode_paketuji," - ",i.nama_paketuji), if(a.status = 4, CONCAT(l.package_code," - ",l.package_name),"NON PAKET")) AS info
            ')
            ->join(\DB::raw('(SELECT * FROM condition_contracts b 
                WHERE b.position = 4 
                AND b.status = 0 
                GROUP BY sample_id 
            ) AS smp'), 'smp.sample_id', 'a.id_sample')
            ->join('condition_lab_done as cc', 'cc.id_transaction_parameter', 'a.id')
            ->leftJoin('mstr_laboratories_parameteruji as c', 'c.id', 'a.id_parameteruji')
            ->join('transaction_sample as d', 'd.id', 'a.id_sample')
            ->leftJoin('mstr_transaction_statuspengujian as e', 'e.id', 'd.id_statuspengujian')
            ->leftJoin('mstr_transaction_tujuanpengujian as m', 'm.id', 'd.id_tujuanpengujian')
            ->leftJoin('mstr_transaction_sub_catalogue as f', 'f.id_sub_catalogue', 'd.id_subcatalogue')
            ->leftJoin('mstr_transaction_kontrakuji as g', 'g.id_kontrakuji', 'd.id_contract')
            ->leftJoin('mstr_products_contactcategory as h', 'h.id', 'g.id_contract_category')
            ->leftJoin('mstr_products_paketuji as i', 'i.id', 'a.info_id')
            ->leftJoin('mstr_sub_specific_package as j', 'j.id', 'a.info_id')
            ->leftJoin('mstr_analyst_group as k', 'k.id', 'c.id_analystgroup')
            ->leftJoin('mstr_specific_package as l', 'l.id', 'j.mstr_specific_package_id');

        if ($data['idlab'] == 15) {
            $var = $var->whereIn('a.id_lab', [\DB::raw('SELECT id FROM mstr_laboratories_lab WHERE UPPER(ket_lab) LIKE "%OUT%"')]);
        } else {
            $var = $var->where('a.id_lab', $data['idlab']);
        }

        if (count($data['contract']) > 0) {
            $g = [];
            foreach ($data['contract'] as $k) {
                array_push($g, $k);
            }
            // return $g;
            $var = $var->whereIn('d.id_contract', $g);
        }
        if (!empty($data['rev'])) {
            if ($data['rev'] !== 'all') {
                $var = $var->whereIn('d.id_contract', [\DB::raw('SELECT id_contract FROM contract_message WHERE status = ' . intval($data['rev']))]);
            }
        }


        if (count($data['sample']) > 0) {
            $g = [];
            foreach ($data['sample'] as $k) {
                array_push($g, $k);
            }
            $var = $var->whereIn('a.id_sample', $g);
        }

        if (!empty($data['id_parameteruji'])) {
            $var = $var->where('a.id_parameteruji', $data['id_parameteruji']);
        }

        if (!empty($data['typeContract'])) {
            $var = $var->where('g.id_contract_category', $data['typeContract']);
        }

        if (!is_null($data['search'])) {
            $u = \DB::table('mstr_transaction_kontrakuji as a')->where(\DB::raw('UPPER(a.contract_no)'), 'like', '%' . strtoupper($data['search']) . '%')->get()->toArray();

            if (count($u) > 0) {
                $t = array_map(function ($q) {
                    return $q->id_kontrakuji;
                }, $u);

                $var = $var->whereIn('d.id_contract', array_values($t));
            } else {
                $v = \DB::table('transaction_sample')->where('no_sample', 'like', '%' . strtoupper($data['search']) . '%')->get()->toArray();
                if (count($v) > 0) {
                    $c = array_map(function ($q) {
                        return $q->id;
                    }, $v);

                    $var = $var->whereIn('a.id_sample', array_values($c));
                } else {
                    $var = $var->where(\DB::raw('UPPER(c.sample_name)'), 'like', '%' . strtoupper($data['search']) . '%');
                }
            }
        }

        if (!empty($data['id_statuspengujian'])) {
            $var = $var->where('d.id_statuspengujian', $data['id_statuspengujian']);
        }

        if (!empty($data['estimasi_lab'])) {
            // return $data['estimasi_lab'];
            $var = $var->where('d.tgl_estimasi_lab', $data['estimasi_lab']);
        }

        if (!empty($data['tgl_approval'])) {
            $var = $var->where(\DB::raw("DATE_FORMAT(cc.inserted_at,'%Y-%m-%d')"), $data['tgl_approval']);
        }


        if (!empty($data['preparation_date'])) {
            $var = $var->whereHas('preparation_approve', function ($q) use ($data) {
                return $q->where('status', 2)
                    ->where('position', 3)
                    ->where(\DB::raw('DATE_FORMAT(cc.inserted_at,"%Y-%m-%d")'), $data['preparation_date']);
            });
        }

        if (!empty($data['excel'])) {
            $var = $var->get();
        } else {
            $var = $var->simplePaginate(50);
            return $var->toArray();
        }

        return response()->json($var);
    }


    private function getlabproccess($data, $lab, $sublab)
    {

        $var = \DB::table('transaction_parameter as a')
            ->selectRaw('
                0 AS checked,
                a.*,
                cc.inserted_at,
                c.name_id,
                d.no_sample,
                d.sample_name,
                d.id_contract,
                k.team_name,
                d.id_statuspengujian,
                d.tgl_estimasi_lab,
                e.name AS status_pengujian,
                f.sub_catalogue_name AS matriks,
                h.title,
                g.id_contract_category,
                m.name as tujuanpengujian,
                g.contract_no,
                if(a.status = 1, CONCAT(i.kode_paketuji," - ",i.nama_paketuji), if(a.status = 4, CONCAT(l.package_code," - ",l.package_name),"NON PAKET")) AS info
            ')
            ->join(\DB::raw('(SELECT * FROM condition_contracts b 
                WHERE b.position = 4 
                AND b.status = 0 
                GROUP BY sample_id 
            ) AS smp'), 'smp.sample_id', 'a.id_sample')
            ->join('condition_lab_proccess as cc', 'cc.id_transaction_parameter', 'a.id')
            ->leftJoin('mstr_laboratories_parameteruji as c', 'c.id', 'a.id_parameteruji')
            ->join('transaction_sample as d', 'd.id', 'a.id_sample')
            ->leftJoin('mstr_transaction_statuspengujian as e', 'e.id', 'd.id_statuspengujian')
            ->leftJoin('mstr_transaction_tujuanpengujian as m', 'm.id', 'd.id_tujuanpengujian')
            ->leftJoin('mstr_transaction_sub_catalogue as f', 'f.id_sub_catalogue', 'd.id_subcatalogue')
            ->leftJoin('mstr_transaction_kontrakuji as g', 'g.id_kontrakuji', 'd.id_contract')
            ->leftJoin('mstr_products_contactcategory as h', 'h.id', 'g.id_contract_category')
            ->leftJoin('mstr_products_paketuji as i', 'i.id', 'a.info_id')
            ->leftJoin('mstr_sub_specific_package as j', 'j.id', 'a.info_id')
            ->leftJoin('mstr_analyst_group as k', 'k.id', 'c.id_analystgroup')
            ->leftJoin('mstr_specific_package as l', 'l.id', 'j.mstr_specific_package_id')
            ->whereNotIn('a.id', [\DB::raw('SELECT id_transaction_parameter FROM condition_lab_done')]);

        if ($data['idlab'] == 15) {
            $var = $var->whereIn('a.id_lab', [\DB::raw('SELECT id FROM mstr_laboratories_lab WHERE UPPER(ket_lab) LIKE "%OUT%"')]);
        } else {
            $var = $var->where('a.id_lab', $data['idlab']);
        }

        if (count($data['contract']) > 0) {
            $g = [];
            foreach ($data['contract'] as $k) {
                array_push($g, $k);
            }
            // return $g;
            $var = $var->whereIn('d.id_contract', $g);
        }
        if (!empty($data['rev'])) {
            if ($data['rev'] !== 'all') {
                $var = $var->whereIn('d.id_contract', [\DB::raw('SELECT id_contract FROM contract_message WHERE status = ' . intval($data['rev']))]);
            }
        }


        if (count($data['sample']) > 0) {
            $g = [];
            foreach ($data['sample'] as $k) {
                array_push($g, $k);
            }
            $var = $var->whereIn('a.id_sample', $g);
        }

        if (!empty($data['id_parameteruji'])) {
            $var = $var->where('a.id_parameteruji', $data['id_parameteruji']);
        }

        if (!empty($data['typeContract'])) {
            $var = $var->where('g.id_contract_category', $data['typeContract']);
        }

        if (!is_null($data['search'])) {
            $u = \DB::table('mstr_transaction_kontrakuji as a')->where(\DB::raw('UPPER(a.contract_no)'), 'like', '%' . strtoupper($data['search']) . '%')->get()->toArray();

            if (count($u) > 0) {
                $t = array_map(function ($q) {
                    return $q->id_kontrakuji;
                }, $u);

                $var = $var->whereIn('d.id_contract', array_values($t));
            } else {
                $v = \DB::table('transaction_sample')->where('no_sample', 'like', '%' . strtoupper($data['search']) . '%')->get()->toArray();
                if (count($v) > 0) {
                    $c = array_map(function ($q) {
                        return $q->id;
                    }, $v);

                    $var = $var->whereIn('a.id_sample', array_values($c));
                } else {
                    $var = $var->where(\DB::raw('UPPER(c.sample_name)'), 'like', '%' . strtoupper($data['search']) . '%');
                }
            }
        }

        if (!empty($data['id_statuspengujian'])) {
            $var = $var->where('d.id_statuspengujian', $data['id_statuspengujian']);
        }

        if (!empty($data['estimasi_lab'])) {
            // return $data['estimasi_lab'];
            $var = $var->where('d.tgl_estimasi_lab', $data['estimasi_lab']);
        }

        if (!empty($data['tgl_approval'])) {
            $var = $var->where(\DB::raw("DATE_FORMAT(cc.inserted_at,'%Y-%m-%d')"), $data['tgl_approval']);
        }


        if (!empty($data['preparation_date'])) {
            $var = $var->whereHas('preparation_approve', function ($q) use ($data) {
                return $q->where('status', 2)
                    ->where('position', 3)
                    ->where(\DB::raw('DATE_FORMAT(cc.inserted_at,"%Y-%m-%d")'), $data['preparation_date']);
            });
        }

        if (!empty($data['excel'])) {
            $var = $var->get();
        } else {
            $var = $var->simplePaginate(50);
            return $var->toArray();
        }

        return response()->json($var);
    }

    public function indexfor(Request $request)
    {
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            if ($data['parameterstatus'] < 1) {
                $var = $this->index_kendali($data, $id_user);
            }

            if (!is_null($data['approve']) && $data['parameterstatus'] > 0) {
                $var = Transaction_parameter::with([
                    'parameterujiOne',
                    'parameterujiOne.parametertype',
                    'parameterujiOne.analystgroup',
                    'lod',
                    'lab',
                    'standart',
                    'metode',
                    'unit',
                    'conditionlabcome',
                    'conditionlabcome.user',
                    'conditionlabdone',
                    'conditionlabdone.user',
                    'conditionlabproccess',
                    'conditionlabproccess.user',
                    'transaction_sample',
                    'transaction_sample.subcatalogue',
                    'transaction_sample.statuspengujian',
                    'transaction_sample.tujuanpengujian',
                    'transaction_sample.kontrakuji',
                    'transaction_sample.condition_contract_lab' => function ($q) {
                        return $q->where('status', 0);
                    },
                    'transaction_sample.kontrakuji.contract_category',
                    'transaction_sample.kontrakuji.customers_handle',
                    'transaction_sample.kontrakuji.customers_handle.customers',
                    'transaction_sample.images'
                ])->select(
                    \DB::raw('0 as checked'),
                    'transaction_parameter.id',
                    'transaction_parameter.id_parameteruji',
                    'transaction_parameter.simplo',
                    'transaction_parameter.duplo',
                    'transaction_parameter.triplo',
                    'transaction_parameter.hasiluji',
                    'transaction_parameter.id_standart',
                    'transaction_parameter.id_lod',
                    'transaction_parameter.id_lab',
                    'transaction_parameter.id_unit',
                    'transaction_parameter.id_metode',
                    'transaction_parameter.format_hasil',
                    'transaction_parameter.id_sample',
                    'transaction_parameter.disc_parameter',
                    'transaction_parameter.status',
                    'transaction_parameter.position',
                    'transaction_parameter.deleted_at',
                    \DB::raw('IF(transaction_parameter.status = 1,mstr_products_paketuji.price,IF(transaction_parameter.status = 4,mstr_sub_specific_package.price,parameter_price.price)) as price'),
                    \DB::raw('IF(transaction_parameter.status = 1,CONCAT(mstr_products_paketuji.kode_paketuji," - ",mstr_products_paketuji.nama_paketuji),IF(transaction_parameter.status = 4,CONCAT(mstr_specific_package.package_code," - ",mstr_specific_package.package_name),"NON PAKET")) as info'),
                    'transaction_parameter.deleted_at',
                    \DB::raw('IF(transaction_parameter.status = 4,mstr_standard_perka.n,"-") as n'),
                    \DB::raw('IF(transaction_parameter.status = 4,mstr_standard_perka.m,"-") as m'),
                    \DB::raw('IF(transaction_parameter.status = 4,mstr_standard_perka.c,"-") as c'),
                    \DB::raw('IF(transaction_parameter.status = 4,mstr_standard_perka.mm,"-") as mm')
                )
                    ->leftJoin('mstr_products_paketuji', 'mstr_products_paketuji.id', 'transaction_parameter.info_id')
                    ->leftJoin('mstr_sub_specific_package', 'mstr_sub_specific_package.id', 'transaction_parameter.info_id')
                    ->leftJoin('mstr_standard_perka', 'mstr_standard_perka.id_sub_specific_catalogue', 'mstr_sub_specific_package.id')
                    ->leftJoin('mstr_specific_package', 'mstr_specific_package.id', 'mstr_sub_specific_package.mstr_specific_package_id')
                    ->leftJoin('parameter_price', 'parameter_price.id', 'transaction_parameter.info_id')
                    ->orderBy('transaction_parameter.id', 'ASC')
                    ->has('transaction_sample')
                    ->whereHas('transaction_sample', function ($q) {
                        return $q->whereHas('condition_contract_lab', function ($c) {
                            return $c->where('status', 0);
                        });
                    });

                if ($data['idlab'] == 15) {
                    $labcheck = \DB::table('mstr_laboratories_lab')->where(\DB::raw('UPPER(ket_lab)'), 'like', '%OUT%')->get()->toArray();

                    $s = array_map(function ($q) {
                        return $q->id;
                    }, $labcheck);

                    $var = $var->whereIn('transaction_parameter.id_lab', $s);
                } else {
                    $var = $var->where('transaction_parameter.id_lab', $data['idlab']);
                }

                if (count($data['contract']) > 0) {
                    $g = [];
                    foreach ($data['contract'] as $k) {
                        array_push($g, $k);
                    }
                    // return $g;
                    $var = $var->whereHas('transaction_sample', function ($q) use ($g) {
                        return $q->whereIn('id_contract', $g);
                    });
                }

                if (count($data['sample']) > 0) {
                    $g = [];
                    foreach ($data['sample'] as $k) {
                        array_push($g, $k);
                    }
                    $var = $var->whereHas('transaction_sample', function ($q) use ($g) {
                        return $q->whereIn('id', $g);
                    });
                }

                if (!empty($data['id_parameteruji'])) {
                    $var = $var->where('transaction_parameter.id_parameteruji', $data['id_parameteruji']);
                }

                if (!empty($data['typeContract'])) {
                    $var = $var->whereHas('transaction_sample', function ($q) use ($data) {
                        return $q->whereHas('kontrakuji', function ($w) use ($data) {
                            return $w->where('id_contract_category', $data['typeContract']);
                        });
                    });
                }

                if (!is_null($data['search'])) {
                    $u = \DB::table('mstr_transaction_kontrakuji as a')->where(\DB::raw('UPPER(a.contract_no)'), 'like', '%' . strtoupper($data['search']) . '%')->get()->toArray();

                    if (count($u) > 0) {
                        $t = array_map(function ($q) {
                            return $q->id_kontrakuji;
                        }, $u);

                        $var = $var->whereHas('transaction_sample', function ($z) use ($t) {
                            return $z->whereIn('id_contract', array_values($t));
                        });
                    } else {
                        $v = \DB::table('transaction_sample')->where('no_sample', 'like', '%' . strtoupper($data['search']) . '%')->get()->toArray();
                        if (count($v) > 0) {
                            $c = array_map(function ($q) {
                                return $q->id;
                            }, $v);

                            $var = $var->whereIn('transaction_parameter.id_sample', array_values($c));
                        } else {
                            $var = $var->whereHas('transaction_sample', function ($bb) use ($data) {
                                return $bb->where(\DB::raw('UPPER(sample_name)'), 'like', '%' . strtoupper($data['search']) . '%');
                            });
                        }
                    }

                    //     $var = $var->whereHas('transaction_sample',function($q) use ($data){
                    //         return $q->whereHas('kontrakuji',function($w) use ($data){
                    //             return $w->where('id_contract_category',$data['typeContract']);
                    //         });
                    // });
                }

                if (!empty($data['id_statuspengujian'])) {
                    $var = $var->whereHas('transaction_sample', function ($q) use ($data) {
                        return $q->where('id_statuspengujian', $data['id_statuspengujian']);
                    });
                }

                if (!empty($data['estimasi_lab'])) {
                    // return $data['estimasi_lab'];
                    $var = $var->whereHas('transaction_sample', function ($q) use ($data) {
                        return $q->where('tgl_estimasi_lab', $data['estimasi_lab']);
                    });
                }

                if (!empty($data['tgl_approval'])) {
                    $var = $var->whereHas('conditionlabcome', function ($q) use ($data) {
                        return $q->where(\DB::raw("DATE_FORMAT(inserted_at,'%Y-%m-%d')"), $data['tgl_approval']);
                    });
                }


                if (!empty($data['preparation_date'])) {
                    $var = $var->whereHas('preparation_approve', function ($q) use ($data) {
                        return $q->where('status', 2)
                            ->where('position', 3)
                            ->where(\DB::raw('DATE_FORMAT(inserted_at,"%Y-%m-%d")'), $data['preparation_date']);
                    });
                }

                if ($data['approve'] == 0) {
                    $var = $var->has('conditionLabCome')->doesnthave('conditionLabProccess')->doesnthave('conditionLabDone');
                } else if ($data['approve'] == 1) {
                    $var = $var->has('conditionLabProccess')->doesnthave('conditionLabDone');
                } else if ($data['approve'] == 2) {
                    $var = $var->has('conditionLabDone');
                }

                if (!empty($data['excel'])) {
                    $var = $var->get();
                } else {
                    $var = $var->paginate(25);
                }
            };
            return response()->json($var);
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function indexforget(Request $request)
    {
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            // $data = $request->input('data');

            if ($request->input('parameterstatus') < 1) {
                $var = $this->index_kendali($data, $id_user);
            }

            if (!is_null($request->input('approve')) && $request->input('parameterstatus') > 0) {
                $var = Transaction_parameter::with([
                    'parameterujiOne',
                    'parameterujiOne.parametertype',
                    'parameterujiOne.analystgroup',
                    'lod',
                    'lab',
                    'standart',
                    'metode',
                    'unit',
                    'conditionlabcome',
                    'conditionlabcome.user',
                    'conditionlabdone',
                    'conditionlabdone.user',
                    'conditionlabproccess',
                    'conditionlabproccess.user',
                    'transaction_sample' => function ($q) {
                        return $q->select(
                            'id',
                            'no_sample',
                            'sample_name',
                            'tgl_input',
                            'tgl_selesai',
                            'tgl_estimasi_lab',
                            'id_tujuanpengujian',
                            'id_statuspengujian',
                            'id_subcatalogue',
                            'id_contract'
                        );
                    },
                    'transaction_sample.subcatalogue',
                    'transaction_sample.statuspengujian',
                    'transaction_sample.tujuanpengujian',
                    'transaction_sample.kontrakuji' => function ($q) {
                        return $q->select(
                            'id_kontrakuji',
                            'contract_no',
                            'id_customers_handle',
                            'id_contract_category'

                        );
                    },
                    'transaction_sample.kontrakuji.contract_category',
                    'transaction_sample.kontrakuji.customers_handle',
                    'transaction_sample.kontrakuji.customers_handle.customers',
                    'transaction_sample.images'
                ])->select(
                    \DB::raw('0 as checked'),
                    'transaction_parameter.id',
                    'transaction_parameter.id_parameteruji',
                    'transaction_parameter.simplo',
                    'transaction_parameter.duplo',
                    'transaction_parameter.triplo',
                    'transaction_parameter.hasiluji',
                    'transaction_parameter.id_standart',
                    'transaction_parameter.id_lod',
                    'transaction_parameter.id_lab',
                    'transaction_parameter.id_unit',
                    'transaction_parameter.id_metode',
                    'transaction_parameter.format_hasil',
                    'transaction_parameter.id_sample',
                    'transaction_parameter.disc_parameter',
                    'transaction_parameter.status',
                    'transaction_parameter.position',
                    'transaction_parameter.deleted_at',
                    \DB::raw('IF(transaction_parameter.status = 1,mstr_products_paketuji.price,IF(transaction_parameter.status = 4,mstr_sub_specific_package.price,parameter_price.price)) as price'),
                    \DB::raw('IF(transaction_parameter.status = 1,CONCAT(mstr_products_paketuji.kode_paketuji," - ",mstr_products_paketuji.nama_paketuji),IF(transaction_parameter.status = 4,CONCAT(mstr_specific_package.package_code," - ",mstr_specific_package.package_name),"NON PAKET")) as info'),
                    'transaction_parameter.deleted_at',
                    \DB::raw('IF(transaction_parameter.status = 4,mstr_standard_perka.n,"-") as n'),
                    \DB::raw('IF(transaction_parameter.status = 4,mstr_standard_perka.m,"-") as m'),
                    \DB::raw('IF(transaction_parameter.status = 4,mstr_standard_perka.c,"-") as c'),
                    \DB::raw('IF(transaction_parameter.status = 4,mstr_standard_perka.mm,"-") as mm')
                )
                    ->leftJoin('mstr_products_paketuji', 'mstr_products_paketuji.id', 'transaction_parameter.info_id')
                    ->leftJoin('mstr_sub_specific_package', 'mstr_sub_specific_package.id', 'transaction_parameter.info_id')
                    ->leftJoin('mstr_standard_perka', 'mstr_standard_perka.id_sub_specific_catalogue', 'mstr_sub_specific_package.id')
                    ->leftJoin('mstr_specific_package', 'mstr_specific_package.id', 'mstr_sub_specific_package.mstr_specific_package_id')
                    ->leftJoin('parameter_price', 'parameter_price.id', 'transaction_parameter.info_id')
                    ->orderBy('transaction_parameter.id', 'ASC')
                    ->where('transaction_parameter.id_lab', $request->input('idlab'));

                if ($request->input('contract') > 0) {
                    $checno = \DB::table('mstr_transaction_kontrakuji')->where('id_kontrakuji', $request->input('contract'))->select('id_kontrakuji')->get();

                    if (count($checkno) > 0) {
                        $azz = array_map(function ($q) {
                            return $q->id_contract;
                        }, $checno);

                        $var = $var->whereHas('transaction_sample', function ($q) use ($g) {
                            return $q->whereIn('id_contract', array_values($azz));
                        });
                    } else {
                        $var = $var->where('transaction_sample.no_sample', 'like', '%' . strtoupper($request->input('contract')) . '%');
                    }
                }

                // if(count($re['sample']) > 0){
                //     $g = [];
                //     foreach($data['sample'] as $k){
                //         array_push($g, $k);
                //     }
                //             $var =$var->whereHas('transaction_sample',function($q) use ($g){
                //                 return $q->whereIn('id',$g);
                //     });
                // }

                // if(count($data['parameteruji']) > 0){
                //     $g = [];
                //     foreach($data['parameteruji'] as $k){
                //         array_push($g, $k);
                //     }
                //         $var = $var->whereIn('transaction_parameter.id_parameteruji',$g);
                // }

                if ($request->input('typeContract') > 0) {
                    $var = $var->whereHas('transaction_sample', function ($q) use ($data) {
                        return $q->whereHas('kontrakuji', function ($w) use ($data) {
                            return $w->where('id_contract_category', $request->input('typeContract'));
                        });
                    });
                }

                if ($request->input('id_statuspengujian') > 0) {
                    $var = $var->whereHas('transaction_sample', function ($q) use ($data) {
                        return $q->where('id_statuspengujian', $request->input('id_statuspengujian'));
                    });
                }

                if ($request->input('estimasi_lab') > 0) {
                    // return $data['estimasi_lab'];
                    $var = $var->whereHas('transaction_sample', function ($q) use ($data) {
                        return $q->where('tgl_estimasi_lab', $request->input('estimasi_lab'));
                    });
                }

                //     if(!empty($data['tgl_approval'])){
                //         $var =$var->whereHas('conditionlabcome',function($q) use ($data){
                //             return $q->where(\DB::raw("DATE_FORMAT(inserted_at,'%Y-%m-%d')"),$data['tgl_approval']);
                //         });
                // }


                // if(!empty($data['preparation_date'])){
                //         $var = $var->whereHas('preparation_approve',function($q) use ($data){
                //             return $q->where('status',2)
                //             ->where('position',3)
                //             ->where(\DB::raw('DATE_FORMAT(inserted_at,"%Y-%m-%d")'),$data['preparation_date']);
                //     });
                // }

                if ($request->input('approve') == 0) {
                    $var = $var->has('conditionLabCome')->doesnthave('conditionLabProccess')->doesnthave('conditionLabDone');
                } else if ($request->input('approve') == 1) {
                    $var = $var->has('conditionLabProccess')->doesnthave('conditionLabDone');
                } else if ($request->input('approve') == 2) {
                    $var = $var->has('conditionLabDone');
                }

                if ($request->input('excel') > 0) {
                    $var = $var->get();
                } else {
                    $var = $var->paginate(50);
                }
            };
            return response()->json($var);
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    // public function ioioi(Request $request){
    //     // $database1 = confi::get('database.connections.mysqlcertificate.database');
    //     // $database2 = Config::get('database.connections.mysql.database');
    //     // $var = DB::connection('mysqlcertificate')->table('transaction_sample_cert as a')
    //     // ->get()
    //     // ->each(function($q){
    //     //     return 
    //     // });
    //     $dt = DB::connection('mysqlcertificate');
    //     $var = DB::table($dt.'.transaction_sample_cert')->get()
    //     return response()->json($var);
    // }

    public function excelSpk(Request $request)
    {
        $v = [];
        $var = \DB::table('transaction_parameter as a')
            ->selectRaw('
                smp.inserted_at,
                c.name_id,
                d.id_contract,
                a.id_sample,
                a.position,
                d.no_sample,
                d.sample_name,
                d.tgl_estimasi_lab,
                e.name AS status_pengujian,
                f.sub_catalogue_name AS matriks,
                zz.nama_unit,
                z.metode,
                g.contract_no,
                zzz.name as tujuanpengujian
            ')
            ->join(\DB::raw('(SELECT * FROM condition_contracts b 
                WHERE b.position = 4 
                AND b.status = 0 
                GROUP BY sample_id 
            ) AS smp'), 'smp.sample_id', 'a.id_sample')
            ->leftJoin('mstr_laboratories_parameteruji as c', 'c.id', 'a.id_parameteruji')
            ->leftJoin('transaction_sample as d', 'd.id', 'a.id_sample')
            ->leftJoin('mstr_transaction_statuspengujian as e', 'e.id', 'd.id_statuspengujian')
            ->leftJoin('mstr_transaction_sub_catalogue as f', 'f.id_sub_catalogue', 'd.id_subcatalogue')
            ->leftJoin('mstr_transaction_kontrakuji as g', 'g.id_kontrakuji', 'd.id_contract')
            ->leftJoin('mstr_products_contactcategory as h', 'h.id', 'g.id_contract_category')
            ->leftJoin('mstr_products_paketuji as i', 'i.id', 'a.info_id')
            ->leftJoin('mstr_laboratories_metode as z', 'z.id', 'a.id_metode')
            ->leftJoin('mstr_laboratories_unit as zz', 'zz.id', 'a.id_unit')
            ->leftJoin('mstr_sub_specific_package as j', 'j.id', 'a.info_id')
            ->leftJoin('mstr_transaction_tujuanpengujian as zzz', 'zzz.id', 'd.id_tujuanpengujian')
            ->leftJoin('mstr_analyst_group as k', 'k.id', 'c.id_analystgroup')
            ->leftJoin('mstr_specific_package as l', 'l.id', 'j.mstr_specific_package_id')
            ->whereNotIn('a.id', [\DB::raw('SELECT id_transaction_parameter FROM condition_lab_proccess')]);

        if ($request->input("idlab") == 15) {
            $var = $var->whereIn('a.id_lab', [\DB::raw('SELECT id FROM mstr_laboratories_lab WHERE UPPER(ket_lab) LIKE "%OUT%"')]);
        } else {
            $var = $var->where('a.id_lab', $request->input("idlab"));
        }

        $var = $var->whereBetween(\DB::raw('DATE_FORMAT(smp.inserted_at,"%Y-%m-%d")'), [$request->input("from"), $request->input("to")])->get()->toArray();

        foreach ($var as $k) {
            $kendali_desc = \DB::table('description_info')
                ->where('status', 1)
                ->where('id_contract', $k->id_contract)
                ->where('groups', 2)
                ->first();

            $prep_desc = \DB::table('description_info')
                ->where('status', 1)
                ->where('id_sample', $k->id_sample)
                ->where('groups', 3)
                ->where('id_sample', '<>', 0)
                ->first();

            array_push($v, array(
                "contract_no" => $k->contract_no,
                "kendali_desc" => $kendali_desc ? $kendali_desc->desc : '-',
                "prep_desc" => $prep_desc ? $prep_desc->desc : '-',
                "sub_catalogue_name" => $k->matriks,
                "no_sample" => $k->no_sample,
                "sample_name" => $k->sample_name,
                "name_id" => $k->position ? $k->name_id . ' - ' . $k->position : $k->name_id,
                "tujuanpengujian" => $k->tujuanpengujian,
                "nama_unit" => $k->nama_unit,
                "metode" => $k->metode,
                "tgl_approval" => time::parse($k->inserted_at)->format('d/m/Y H:i:s'),
                "status_uji" => $k->status_pengujian,
                "tgl_estimasi_lab" => time::parse($k->tgl_estimasi_lab)->format('d/m/Y'),
            ));
        }

        return response()->json($v);
    }



    public function export_format_hasil(Request $request)
    {
        try {

            $m = [];
            $var = \DB::table('transaction_parameter as a')
                ->selectRaw('
                d.contract_no,
                c.no_sample,
                c.sample_name,
                UPPER(f.name) as statuspengujian,
                a.id,
                za.sub_catalogue_name,
                IF(a.position is NULL, e.name_id, CONCAT(e.name_id," - ",a.position)) as name_id,
                a.id_standart,
                a.id_metode,
                a.id_lab,
                a.id_unit,
                a.id_lod,
                c.id_contract,
                a.id_sample,
                a.simplo,
                a.duplo,
                z.name as tujuanpengujian,
                a.triplo,
                a.hasiluji,
                c.tgl_estimasi_lab,
                IF(a.status = 1,CONCAT(j.kode_paketuji," - ",j.nama_paketuji),IF(a.status = 4,CONCAT(l.package_code," - ",l.package_name),"NON PAKET")) as info
            ')
                ->join('condition_lab_proccess as b', 'b.id_transaction_parameter', 'a.id')
                ->leftJoin('transaction_sample as c', 'c.id', 'a.id_sample')
                ->leftJoin('mstr_transaction_sub_catalogue as za', 'za.id_sub_catalogue', 'c.id_subcatalogue')
                ->leftJoin('mstr_transaction_kontrakuji as d', 'd.id_kontrakuji', 'c.id_contract')
                ->leftJoin('mstr_laboratories_parameteruji as e', 'e.id', 'a.id_parameteruji')
                ->leftJoin('mstr_transaction_statuspengujian as f', 'f.id', 'c.id_statuspengujian')
                ->leftJoin('mstr_products_paketuji as j', 'j.id', 'a.info_id')
                ->leftJoin('mstr_transaction_tujuanpengujian as z', 'z.id', 'c.id_tujuanpengujian')
                ->leftJoin('mstr_sub_specific_package as k', 'k.id', 'a.info_id')
                ->leftJoin('mstr_specific_package as l', 'l.id', 'k.mstr_specific_package_id')
                ->whereBetween('c.tgl_estimasi_lab', [$request->input("from"), $request->input("to")])
                ->whereNotIn('a.id', [\DB::raw('(SELECT id_transaction_parameter FROM condition_lab_done GROUP BY id_transaction_parameter)')]);
            if ($request->input('idlab') == 15) {
                $labcheck = \DB::table('mstr_laboratories_lab')->where(\DB::raw('UPPER(ket_lab)'), 'like', '%OUT%')->get()->toArray();

                $s = array_map(function ($q) {
                    return $q->id;
                }, $labcheck);

                $var = $var->whereIn('a.id_lab', $s);
            } else {
                $var = $var->where('a.id_lab', $request->input('idlab'));
            }

            $var = $var->get()->toArray();

            foreach ($var as $k) {
                $kendalidesc = \DB::table('description_info as a')->where('a.status', 1)->where('a.groups', 2)->where('a.id_contract', $k->id_contract)->first();
                $prepdesc = \DB::table('description_info as a')->where('a.status', 1)->where('a.groups', 3)->where('a.id_sample', $k->id_sample)->first();
                // return $var;
                array_push($m, array(
                    "contract_no" => $k->contract_no,
                    "no_sample" => $k->no_sample,
                    "sample_name" => $k->sample_name,
                    "statuspengujian" => $k->statuspengujian,
                    "kendali_memo" => $kendalidesc ? $kendalidesc->desc : "-",
                    "prep_memo" => $prepdesc ? $prepdesc->desc : "-",
                    "id" => $k->id,
                    "sub_catalogue_name" => $k->sub_catalogue_name,
                    "name_id" => $k->name_id,
                    "id_standart" => $k->id_standart,
                    "id_metode" => $k->id_metode,
                    "id_lab" => $k->id_lab,
                    "id_unit" => $k->id_unit,
                    "id_lod" => $k->id_lod,
                    "simplo" => $k->simplo,
                    "duplo" => $k->duplo,
                    "tujuanpengujian" => $k->tujuanpengujian,
                    "triplo" => $k->triplo,
                    "hasiluji" => $k->hasiluji,
                    "tgl_estimasi_lab" => time::parse($k->tgl_estimasi_lab)->format('d/m/Y'),
                    "info" => $k->info
                ));
            }

            return response()->json($m);
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function exportformathasilbycontract(Request $request)
    {
        try {

            $m = [];
            $var = \DB::table('transaction_parameter as a')
                ->selectRaw('
                d.contract_no,
                c.no_sample,
                c.sample_name,
                UPPER(f.name) as statuspengujian,
                a.id,
                za.sub_catalogue_name,
                IF(a.position is NULL, e.name_id, CONCAT(e.name_id," - ",a.position)) as name_id,
                a.id_standart,
                a.id_metode,
                a.id_lab,
                a.id_unit,
                a.id_lod,
                c.id_contract,
                a.id_sample,
                a.simplo,
                a.duplo,
                a.triplo,
                a.hasiluji,
                z.name as tujuanpengujian,
                c.tgl_estimasi_lab,
                IF(a.status = 1,CONCAT(j.kode_paketuji," - ",j.nama_paketuji),IF(a.status = 4,CONCAT(l.package_code," - ",l.package_name),"NON PAKET")) as info
            ')
                ->join('condition_lab_proccess as b', 'b.id_transaction_parameter', 'a.id')
                ->leftJoin('transaction_sample as c', 'c.id', 'a.id_sample')
                ->leftJoin('mstr_transaction_sub_catalogue as za', 'za.id_sub_catalogue', 'c.id_subcatalogue')
                ->leftJoin('mstr_transaction_kontrakuji as d', 'd.id_kontrakuji', 'c.id_contract')
                ->leftJoin('mstr_laboratories_parameteruji as e', 'e.id', 'a.id_parameteruji')
                ->leftJoin('mstr_transaction_statuspengujian as f', 'f.id', 'c.id_statuspengujian')
                ->leftJoin('mstr_products_paketuji as j', 'j.id', 'a.info_id')
                ->leftJoin('mstr_transaction_tujuanpengujian as z', 'z.id', 'c.id_tujuanpengujian')
                ->leftJoin('mstr_sub_specific_package as k', 'k.id', 'a.info_id')
                ->leftJoin('mstr_specific_package as l', 'l.id', 'k.mstr_specific_package_id')
                ->where('c.id_contract', $request->input("idcontract"))
                ->whereNotIn('a.id', [\DB::raw('(SELECT id_transaction_parameter FROM condition_lab_done GROUP BY id_transaction_parameter)')]);

            if ($request->input('idlab') == 15) {
                $labcheck = \DB::table('mstr_laboratories_lab')->where(\DB::raw('UPPER(ket_lab)'), 'like', '%OUT%')->get()->toArray();

                $s = array_map(function ($q) {
                    return $q->id;
                }, $labcheck);

                $var = $var->whereIn('a.id_lab', $s);
            } else {
                $var = $var->where('a.id_lab', $request->input('idlab'));
            }

            $var = $var->get()->toArray();

            foreach ($var as $k) {
                $kendalidesc = \DB::table('description_info as a')->where('a.status', 1)->where('a.groups', 2)->where('a.id_contract', $k->id_contract)->first();
                $prepdesc = \DB::table('description_info as a')->where('a.status', 1)->where('a.groups', 3)->where('a.id_sample', $k->id_sample)->first();
                // return $var;
                array_push($m, array(
                    "contract_no" => $k->contract_no,
                    "no_sample" => $k->no_sample,
                    "sample_name" => $k->sample_name,
                    "statuspengujian" => $k->statuspengujian,
                    "kendali_memo" => $kendalidesc ? $kendalidesc->desc : "-",
                    "prep_memo" => $prepdesc ? $prepdesc->desc : "-",
                    "id" => $k->id,
                    "sub_catalogue_name" => $k->sub_catalogue_name,
                    "name_id" => $k->name_id,
                    "id_standart" => $k->id_standart,
                    "id_metode" => $k->id_metode,
                    "id_lab" => $k->id_lab,
                    "id_unit" => $k->id_unit,
                    "id_lod" => $k->id_lod,
                    "simplo" => $k->simplo,
                    "tujuanpengujian" => $k->tujuanpengujian,
                    "duplo" => $k->duplo,
                    "triplo" => $k->triplo,
                    "hasiluji" => $k->hasiluji,
                    "tgl_estimasi_lab" => time::parse($k->tgl_estimasi_lab)->format('d/m/Y'),
                    "info" => $k->info
                ));
            }

            return response()->json($m);
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }


    private function index_kendali($data, $id_user)
    {
        try {

            $checklab = ConditionContractNew::select('id_condition_contract')
                ->where('position', 4)->get();

            $checkkendali = ConditionContractNew::select('contract_id')
                ->where('status', 1)
                ->where('position', '<', 3)
                ->where('position', '>', 1)
                ->whereIn('id_condition_contract', $checklab)
                ->groupBy('contract_id')
                ->get();


            $var = ConditionContractNew::with([
                'transactionparameter',
                'transactionparameter.parameterujiOne',
                'transactionparameter.parameterujiOne.parametertype',
                'transactionparameter.lod',
                'transactionparameter.lab',
                'transactionparameter.standart',
                'transactionparameter.metode',
                'transactionparameter.unit',
                'transactionparameter.parameter_condition_lab',
                'transactionparameter.parameter_condition_lab.user',
                'transactionparameter.preparation_approve',
                'transactionparameter.preparation_approve.user',
                'transactionparameter.transaction_sample',
                'transactionparameter.transaction_sample.subcatalogue',
                'transactionparameter.transaction_sample.statuspengujian',
                'transactionparameter.transaction_sample.tujuanpengujian',
                'transactionparameter.transaction_sample.kontrakuji',
                'transactionparameter.transaction_sample.kontrakuji.contract_category',
                'transactionparameter.transaction_sample.kontrakuji.customers_handle',
                'transactionparameter.transaction_sample.kontrakuji.customers_handle.customers',
                'transactionparameter.transaction_sample.images'
            ])
                ->whereIn('id_condition_contract', $checkkendali)
                ->whereHas('transactionparameter', function ($q) use ($data) {
                    return $q->where('id_lab', $data['idlab']);
                });

            if (count($data['contract']) > 0) {
                $var = $var->whereHas('transactionparameter', function ($x) use ($data) {
                    return $x->whereHas('transaction_sample', function ($q) use ($data) {
                        return $q->whereIn('id_contract', $data['contract']);
                    });
                });
            }

            if (count($data['sample']) > 0) {
                $var = $var->whereHas('transactionparameter', function ($x) use ($data) {
                    return $x->whereHas('transaction_sample', function ($q) use ($data) {
                        return $q->whereIn('id', $data['sample']);
                    });
                });
            }

            if (count($data['parameteruji']) > 0) {
                $var = $var->whereHas('transactionparameter', function ($x) use ($data) {
                    return $x->whereIn('transaction_parameter.id_parameteruji', $data['parameteruji']);
                });
            }

            if (!empty($data['typeContract'])) {
                $var = $var->whereHas('transactionparameter', function ($x) use ($data) {
                    return $x->whereHas('transaction_sample', function ($q) use ($data) {
                        return $q->whereHas('kontrakuji', function ($w) use ($data) {
                            return $w->where('id_contract_category', $data['typeContract']);
                        });
                    });
                });
            }

            if (!empty($data['id_statuspengujian'])) {
                $var = $var->whereHas('transactionparameter', function ($x) use ($data) {
                    return $x->whereHas('transaction_sample', function ($q) use ($data) {
                        return $q->where('id_statuspengujian', $data['id_statuspengujian']);
                    });
                });
            }

            if (!empty($data['estimasi_lab'])) {
                $var = $var->whereHas('transactionparameter', function ($x) use ($data) {
                    return $x->whereHas('transaction_sample', function ($q) use ($data) {
                        return $q->where('tgl_estimasi_lab', $data['estimasi_lab']);
                    });
                });
            }

            if (!empty($data['preparation_date'])) {
                $var = $var->whereHas('transactionparameter', function ($x) use ($data) {
                    return $x->whereHas('preparation_approve', function ($q) use ($data) {
                        return $q->where('status', 2)
                            ->where('position', 3)
                            ->where(\DB::raw('DATE_FORMAT(inserted_at,"%Y-%m-%d")'), $data['preparation_date']);
                    });
                });
            }

            if (!empty($data['excel'])) {
                $var = $var->get();
            } else {
                $var = $var->paginate(50);
            }
            return response()->json($var);
        } catch (\Exception $e) {
            return response()->json(array(
                "status" => false,
                "message" => 'backend error'
            ));
        }
    }

    public function saveKesimpulan(Request $request)
    {
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            foreach ($data as $v) {
                $c = TransactionSample::find($v['id_sample']);
                $c->kesimpulan = $v['sample_conclude'];
                $c->save();
            }

            return response()->json(array(
                "success" => true,
                "message" => "Saving Success"
            ));
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function description(Request $request)
    {
        try {

            $var = \DB::table('description_info as a')
                ->select('a.id_sample', 'a.desc', 'c.employee_name', 'd.division_name', 'e.name as subdivision', 'a.created_at', 'c.photo', 'a.status')
                ->leftJoin('transaction_sample as b', 'b.id', 'a.id_sample')
                ->leftJoin('hris_employee as c', 'c.user_id', 'a.insert_user')
                ->leftJoin('hris_division as d', 'd.id_div', 'c.id_bagian')
                ->leftJoin('hris_sub_division as e', 'e.id_subagian', 'c.id_sub_bagian')
                ->where('a.id_sample', $request->input('idsample'));

            if ($request->has('memo')) {
                $var = $var->where('a.status', 1);
            } else {
                $var = $var->whereNull('a.status');
            }

            return response()->json($var->get());
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function selecting(Request $request)
    {
        try {
            $array = [];
            $data = $request->input('data');
            if ($data['status'] == 1) {
                $m = ConditionContractNew::selectRaw('contract_id')
                    ->where('position', '4')
                    ->groupBy('contract_id')->get();

                foreach ($m as $ksd) {
                    $bb = ConditionContractNew::where('contract_id', $ksd->contract_id)->orderBy('contract_id', 'ASC')->get();
                    if ($bb[count($bb) - 1]->position == 4) {
                        array_push($array, $bb[count($bb) - 1]->contract_id);
                    }
                }
            } else {
                $m = ConditionContractNew::selectRaw('contract_id')
                    ->where('position', 3)
                    ->groupBy('contract_id')->where('status', 1)->get();

                $u = [];

                foreach ($m as $ksd) {
                    $bb = ConditionContractNew::where('contract_id', $ksd->contract_id)->orderBy('contract_id', 'ASC')->get();
                    if ($bb[count($bb) - 1]->position == 3) {
                        array_push($u, $bb[count($bb) - 1]->contract_id);
                    }
                }

                $z = [];

                $t = ConditionContractNew::selectRaw('contract_id')
                    ->where('position', 4)
                    ->groupBy('contract_id')->get();

                foreach ($t as $ksd) {
                    $bb = ConditionContractNew::where('contract_id', $ksd->contract_id)->orderBy('contract_id', 'ASC')->get();
                    if ($bb[count($bb) - 1]->position == 4) {
                        array_push($z, $bb[count($bb) - 1]->contract_id);
                    }
                }
                $arraycheck = array_values(array_filter($u, function ($m) use ($z) {
                    return $m != $z;
                }));
                $array = $arraycheck;
            }
            //  return $array;

            $var = \DB::table('transaction_parameter as a')
                ->leftJoin('condition_contracts as b', 'b.parameter_id', 'a.id')
                ->leftJoin('transaction_sample as c', 'c.id', 'a.id_sample')
                ->leftJoin('mstr_transaction_kontrakuji as d', 'd.id_kontrakuji', 'c.id_contract')
                ->leftJoin('mstr_laboratories_parameteruji as e', 'e.id', 'a.id_parameteruji')
                ->leftJoin('mstr_laboratories_parametertype as f', 'f.id', 'e.mstr_laboratories_parametertype_id')
                ->leftJoin('mstr_transaction_statuspengujian as h', 'h.id', 'c.id_statuspengujian')
                ->leftJoin('mstr_products_contactcategory as g', 'g.id', 'd.id_contract_category')
                ->leftJoin(DB::raw('(select * from condition_contracts as a where a.position = 3 group by a.contract_id) as data1'), 'data1.contract_id', 'c.id_contract')

                ->where('a.id', '<>', 0);
            if ($data['idlab'] > 0) {
                $var = $var->where('a.id_lab', $data['idlab']);
            }

            if ($data['approve'] == 0 && $data['status'] == 1) {
                $var = $var->where('b.status', 0);
            } else if ($data['approve'] == 1 && $data['status'] == 0) {
                $var = $var->whereNull('b.status');
            } else if ($data['approve'] == 1 && $data['status'] == 1) {
                $var = $var->where('b.status', 1);
            } else if ($data['approve'] == 2 && $data['status'] == 1) {
                $var = $var->where('b.status', 2);
            }

            if (!is_null($data['type'])) {
                if ($data['type'] == 'contract') {
                    $this->getcontractno($data, $var, $array);
                } else if ($data['type'] == 'sample') {
                    $this->getsample($data, $var, $array);
                } else if ($data['type'] == 'parameter') {
                    $this->getparametertest($data, $var, $array);
                } else if ($data['type'] == 'parametertype') {
                    $this->getparametertype($data, $var, $array);
                } else if ($data['type'] == 'estimasilab') {
                    $this->getestimasilab($data, $var, $array);
                } else if ($data['type'] == 'preparation_date') {
                    $this->getpreparation_date($data, $var, $array);
                } else if ($data['type'] == 'contract-category') {
                    $this->getcontractcategory($data, $var, $array);
                } else if ($data['type'] == 'hasil-uji') {
                    // $this->gethasiluji($data,$var,$array);
                } else if ($data['type'] == 'status-pengujian') {
                    $this->getstatuspengujian($data, $var, $array);
                } else if ($data['type'] == 'lab') {
                    $this->getdatalab($data, $var, $array);
                }
            }
            $var = $var->whereIn('c.id_contract', $array)->paginate(25);
            return response()->json($var);
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function samplephoto(Request $request)
    {
        try {
            $var = Photo::with([
                'transaction_sample',
                'transaction_sample.kontrakuji',
                'transaction_sample.images',
                'transaction_sample.description',
                'transaction_sample.description.user'

            ])->where('id_sample', $request->input('idsample'));

            // if(count($check) > 0){

            //     $var = $var->where('id_sample',$getcontract->transactionsample->id);
            // } else {
            //     $var = $var->where('id_sample',$request->input('idsample'));
            // }

            $var = $var->get();
            return response()->json($var);
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function contract_lab(Request $request)
    {
        try {
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;

            $data = \DB::table(\DB::raw('(SELECT 
            a.id_condition_contract,
            c.id_kontrakuji,
            a.sample_id,
            c.contract_no,
            e.id_customer,
            e.customer_name,
            f.name,
            c.id_contract_category,
            g.title
            FROM condition_contracts a 
            INNER JOIN mstr_transaction_kontrakuji c ON c.id_kontrakuji = a.contract_id
            INNER JOIN mstr_customers_handle d ON d.idch = c.id_customers_handle
            INNER JOIN mstr_customers_customer e ON e.id_customer = d.id_customer
            INNER JOIN mstr_customers_contactperson f ON f.id_cp = d.id_cp
            INNER JOIN mstr_products_contactcategory g ON g.id = c.id_contract_category
            WHERE a.position = 4
            AND a.parameter_id = 0 AND a.status = 0) as DATA1'))
                ->selectRaw('
                DATA1.*, 
                aa.tgl_selesai, 
                IFNULL(normaldata.jumlah,0) AS normal,
                IFNULL(urgentdata.jumlah,0) AS urgent,
                IFNULL(veryurgentdata.jumlah,0) AS very_urgent,
                IFNULL(custom2hari.jumlah,0) AS custom2hari,
                IFNULL(custom1hari.jumlah,0) AS custom1hari
            ')
                ->join('transaction_sample as aa', 'aa.id', 'DATA1.sample_id')
                ->leftJoin(\DB::raw('(SELECT COUNT(id) AS jumlah, id_contract FROM transaction_sample WHERE transaction_sample.id_statuspengujian = 1 GROUP BY transaction_sample.id_contract) AS normaldata'), 'normaldata.id_contract', 'aa.id_contract')
                ->leftJoin(\DB::raw('(SELECT COUNT(id) AS jumlah, id_contract FROM transaction_sample WHERE transaction_sample.id_statuspengujian = 2 GROUP BY transaction_sample.id_contract) AS urgentdata'), 'urgentdata.id_contract', 'aa.id_contract')
                ->leftJoin(\DB::raw('(SELECT COUNT(id) AS jumlah, id_contract FROM transaction_sample WHERE transaction_sample.id_statuspengujian = 3 GROUP BY transaction_sample.id_contract) AS veryurgentdata'), 'veryurgentdata.id_contract', 'aa.id_contract')
                ->leftJoin(\DB::raw('(SELECT COUNT(id) AS jumlah, id_contract FROM transaction_sample WHERE transaction_sample.id_statuspengujian = 4 GROUP BY transaction_sample.id_contract) AS custom2hari'), 'custom2hari.id_contract', 'aa.id_contract')
                ->leftJoin(\DB::raw('(SELECT COUNT(id) AS jumlah, id_contract FROM transaction_sample WHERE transaction_sample.id_statuspengujian = 5 GROUP BY transaction_sample.id_contract) AS custom1hari'), 'custom1hari.id_contract', 'aa.id_contract')
                ->whereNotNull('DATA1.id_kontrakuji')
                ->groupBy('DATA1.id_kontrakuji')
                ->orderBy('aa.tgl_selesai', 'DESC');

            if ($request->input('search') !== '0') {
                $data = $data->where(\DB::raw('UPPER(DATA1.contract_no)'), 'like', '%' . strtoupper($request->input('search')) . '%');
            }

            if ($request->input('customers') !== '0') {
                $data = $data->Where('DATA1.id_customer', $request->input('customers'));
            }

            if ($request->input('category') !== '0') {
                $data = $data->where('DATA1.id_contract_category', intval($request->input('category')));
            }

            if ($request->input('date') !== '0') {
                $data = $data->where('aa.tgl_selesai', $request->input('date'));
            }

            return response()->json($data->paginate(25));
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function contekanlab(Request $request)
    {
        try {


            $f = \DB::table('transaction_parameter as a')
                ->selectRaw('
                c.contract_no,
                (SELECT customer_name FROM mstr_customers_customer WHERE id_customer = d.id_customer) customer_name,
                b.no_sample,
                (SELECT name_id FROM mstr_laboratories_parameteruji WHERE id = a.id_parameteruji) name_id,
                (SELECT nama_lab FROM mstr_laboratories_lab WHERE id = a.id_lab ) nama_lab,
                (SELECT NAME FROM mstr_transaction_statuspengujian WHERE id = b.id_statuspengujian ) status_pengujian,
                DATE_FORMAT(b.tgl_estimasi_lab, "%Y-%m-%d") tgl_selesai,
                IFNULL((SELECT inserted_at FROM condition_lab_done WHERE id_transaction_parameter = a.id),"-") cond
            ')
                ->join('transaction_sample as b', 'b.id', 'a.id_sample')
                ->join('mstr_transaction_kontrakuji as c', 'c.id_kontrakuji', 'b.id_contract')
                ->join('mstr_customers_handle as d', 'd.idch', 'c.id_customers_handle')
                ->whereBetween(\DB::raw('DATE_FORMAT(b.tgl_estimasi_lab, "%Y-%m-%d")'), [$request->input("from"), $request->input("to")])
                ->whereNotIn('b.id', [\DB::raw('select sample_id from condition_contracts where position = 4 and status = 1 group by sample_id')])
                ->get();

            return response()->json($f);
        } catch (\Exception $e) {

            return response()->json($e->getMessage());
        }
    }

    public function getSampleAccepted(Request $request)
    {
        $var = \DB::select('
            SELECT 
            c.contract_no,
            g.customer_name,
            b.no_sample,
            c.created_at,
            b.tgl_estimasi_lab,
            b.tgl_selesai,
            a.inserted_at as tgl_approve,
            d.employee_name,
            e.name,
            if(a.`status` = 1, "Done","Pending") AS status
            FROM condition_contracts a
            LEFT JOIN transaction_sample b ON b.id = a.sample_id
            LEFT JOIN mstr_transaction_kontrakuji c ON c.id_kontrakuji = b.id_contract
            LEFT JOIN hris_employee d ON d.user_id = a.user_id
            INNER JOIN mstr_customers_handle f on f.idch = c.id_customers_handle
            INNER JOIN mstr_customers_customer g on g.id_customer = f.id_customer																																																																																																																																																																																																																																																																																																																																																					
            LEFT JOIN mstr_transaction_statuspengujian e ON e.id = b.id_statuspengujian
            WHERE a.position = 4 AND c.id_kontrakuji IS NOT null  
            AND DATE_FORMAT(c.created_at,"%Y-%m-%d") BETWEEN "' . $request->input("from") . '" AND "' . $request->input("to") . '"
            ORDER BY c.created_at        
        ');

        return response()->json($var);
    }

    public function getParamaterAccepted(Request $request)
    {
        $y = $request->input('approve');

        if ($y == 0) { }
    }

    public function manager_approve(Request $request)
    {
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            foreach ($data as $d) {
                $checkData = ConditionLabDone::where('id_transaction_parameter', $d['id_transaction_parameter'])->get();
                if (count($checkData) < 2) {
                    $bc = new ConditionLabDone;
                    $bc->id_transaction_parameter = $d['id_transaction_parameter'];
                    $bc->user_id = $id_user;
                    $bc->inserted_at = time::now();
                    $bc->save();
                }


                $checktotalparameter = \DB::select('SELECT
                    COUNT(a.id) AS jumlah,
                    a.id_sample
                    FROM 
                    transaction_parameter a WHERE a.id_sample = ' . $d['id_sample'] . '');

                $checkstatusparameter = \DB::select('SELECT
                    COUNT(a.id) AS jumlah,
                    a.id_sample
                    FROM 
                    transaction_parameter a
                    LEFT JOIN (SELECT COUNT(b.id) AS jumlah, b.id FROM condition_lab_done a
                    LEFT JOIN transaction_parameter b ON b.id = a.id_transaction_parameter
                    GROUP BY b.id_sample ) AS DATA1 ON DATA1.id = a.id
                    WHERE a.id_sample = ' . $d['id_sample'] . ' AND DATA1.jumlah IS NOT NULL');

                if ($checktotalparameter[0]->jumlah === $checkstatusparameter[0]->jumlah) {
                    $checkConditionContract = ConditionContractNew::where('sample_id', $d['id_sample'])->where('position', 4)->where('parameter_id', 0)->first();
                    //
                    $set = ConditionContractNew::find($checkConditionContract->id_condition_contract);
                    $set->status = 2;
                    $set->inserted_at = time::now();
                    $set->user_id = $id_user;
                    $set->save();
                }
            }


            $data = array(
                'success' => true,
                'message' => 'status has changed'
            );

            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function exportFunction(Request $request)
    {
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');
            $array = array();


            $m = ConditionContractNew::selectRaw('parameter_id')
                ->where('groups', 'LAB')
                ->where('status', 0)
                ->whereNotNull('sample_id')
                ->groupBy('parameter_id')->get();

            foreach ($m as $ksd) {
                $bb = ConditionContractNew::where('parameter_id', $ksd->parameter_id)->orderBy('parameter_id', 'ASC')->get();
                if ($bb[count($bb) - 1]->groups == 'LAB') {
                    array_push($array, $bb[count($bb) - 1]->parameter_id);
                }
            }

            $var = \DB::table('transaction_parameter as a')
                ->selectRaw('
            c.contract_no,
            a.id_sample,
            b.no_sample,
            b.sample_name,
            a.id as id_trans_parameter,
            d.name_id,
            a.id_standart,
            a.id_lab,
            a.id_unit,
            a.id_lod,
            a.id_metode,
            a.simplo,
            a.duplo,
            a.triplo,
            a.hasiluji')
                ->leftJoin('transaction_sample as b', 'b.id', 'a.id_sample')
                ->leftJoin('mstr_transaction_kontrakuji as c', 'c.id_kontrakuji', 'b.id_contract')
                ->leftJoin('mstr_laboratories_parameteruji as d', 'd.id', 'a.id_parameteruji')
                ->whereIn('a.id', $array)
                ->orderBy('a.id', 'ASC')->get();
            return response()->json($var);
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function get_contract_parameter(Request $request)
    {
        try {
            $var = \DB::table('condition_lab_proccess as a')
                ->select('d.id_kontrakuji', 'd.contract_no')
                ->leftJoin('transaction_parameter as b', 'b.id', 'a.id_transaction_parameter')
                ->leftJoin('transaction_sample as c', 'c.id', 'b.id_sample')
                ->leftJoin('mstr_transaction_kontrakuji as d', 'd.id_kontrakuji', 'c.id_contract')
                ->groupBy('d.id_kontrakuji');

            if ($request->input('idlab') == 15) {
                $labcheck = \DB::table('mstr_laboratories_lab')->where(\DB::raw('UPPER(ket_lab)'), 'like', '%OUT%')->get()->toArray();

                $s = array_map(function ($q) {
                    return $q->id;
                }, $labcheck);

                $var = $var->whereIn('b.id_lab', $s);
            } else {
                $var = $var->where('b.id_lab', $request->input('idlab'));
            }


            if (!empty($request->input('search'))) {
                $var = $var->where(\DB::raw('UPPER(d.contract_no)'), 'like', '%' . trim(strtoupper($request->input('search'))) . '%');
            }

            $var = $var->get();

            return response()->json(array(
                "data" => $var
            ));
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function importFunction(Request $request)
    {
        try {
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');
            $idcontract = array();
            // return $data;
            // return $request->input('status');
            foreach ($data as $format) {

                $v = Transaction_parameter::find($format['id_trans_parameter']);

                if (isset($format['id_standart'])) {
                    $v->id_standart = isset($format['id_standart']) ? $format['id_standart'] : null;
                }

                if (isset($format['id_metode'])) {
                    $v->id_metode = isset($format['id_metode']) ? $format['id_metode'] : null;
                }

                if (isset($format['id_satuan'])) {
                    $v->id_unit = $format['id_satuan'];
                }

                if (isset($format['id_unit'])) {
                    $v->id_unit = $format['id_unit'];
                }

                if (isset($format['id_lod'])) {
                    $v->id_lod = isset($format['id_lod']) ? $format['id_lod'] : null;
                }

                if (isset($format['actual_result'])) {
                    $v->actual_result = isset($format['actual_result']) ? $format['actual_result'] : null;
                }

                if (isset($format['desc'])) {
                    $v->desc = isset($format['desc']) ? $format['desc'] : null;
                }

                $v->simplo = isset($format['simplo']) ? $format['simplo'] : null;
                $v->duplo = isset($format['duplo']) ? $format['duplo'] : null;
                $v->triplo = isset($format['triplo']) ? $format['triplo'] : null;
                $v->hasiluji = isset($format['hasiluji']) ? $format['hasiluji'] : null;
                $v->save();

                if ($request->input('status') == 'true') {
                    $setconditionLabDone = ConditionLabDone::where('id_transaction_parameter', $v->id)->first();

                    if ($setconditionLabDone) {
                        $del = ConditionLabDone::find($setconditionLabDone->id);
                        if ($del) {
                            $del->forceDelete();
                        }
                    }
                    $g = new ConditionLabDone;
                    $g->id_transaction_parameter = $v->id;
                    $g->inserted_at = time::now();
                    $g->user_id = $id_user;
                    $g->save();
                }
            }

            $message = array(
                'success' => true,
                'message' => 'Data Tersimpan'
            );


            return response()->json($message);
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function save(Request $request)
    {
        try {
            // $request->all();
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');
            $set = !empty($data['data']) ? $data['data'] : $data;
            $array = array();
            $datenow = time::now()->isoFormat('YYYY-MM-DD');
            foreach ($set as $k) {
                // return $k;
                $d = Transaction_parameter::find($k['id_transaction_parameter']);
                $d->id_sample = $k['id_sample'];
                if (isset($k['simplo'])) {
                    $d->simplo = $k['simplo'] == '' ? null : $k['simplo'];
                }
                if (isset($k['duplo'])) {
                    $d->duplo = $k['duplo'] == '' ? null : $k['duplo'];
                }
                if (isset($k['triplo'])) {
                    $d->triplo = $k['triplo'] == '' ? null : $k['triplo'];
                }
                if (isset($k['hasiluji'])) {
                    $d->hasiluji = $k['hasiluji'] == '' ? null : $k['hasiluji'];
                }
                if (isset($k['actual_result'])) {

                    $d->actual_result = $k['actual_result'] == '' ? null : $k['actual_result'];
                }

                if (isset($k['desc'])) {
                    $d->desc = $k['desc'] == '' ? null : $k['desc'];
                }
                $d->id_standart = $k['id_standart'];
                $d->id_lod = $k['id_lod'];
                // $d->id_lab = $k['id_lab'];
                $d->id_unit = $k['id_unit'];
                $d->id_metode = $k['id_metode'];
                $d->save();

                $checkdata = \DB::table('transaction_parameter as a')
                    ->leftJoin('transaction_sample as b', 'b.id', 'a.id_sample')
                    ->leftJoin('mstr_laboratories_parameteruji as c', 'c.id', 'a.id_parameteruji')
                    ->where('a.id', $k['id_transaction_parameter'])
                    ->where('b.tgl_estimasi_lab', '<', $datenow)
                    ->first();

                array_push($array, $checkdata);
            }

            // return $array;

            $data = array(
                'success' => true,
                'message' => 'Update Success',
                'value' => $array
            );

            return response()->json($data);
        } catch (\Exception $e) {
            $data = array(
                'success' => true,
                'message' => $e->getMessage()
            );

            return response()->json($e->getMessage());
        }
    }

    public function sampleAccept(Request $request)
    {
        try {
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;

            $data = $request->input('data');
            foreach ($data as $value) {
                $x = ConditionContractNew::where('parameter_id', $value['id_transaction_parameter'])->get();
                foreach ($x as $xx) {
                    $xxx = ConditionContractNew::find($xx->id_condition_contract);
                    $xxx->status = $value['status'];
                    $xxx->user_id = $id_user;
                    $xxx->inserted_at = time::now();
                    $xxx->save();
                }
            }

            $message = array(
                "success" => true,
                "message" => "data has been approved"
            );
            return response()->json($message);
        } catch (\Exception $e) {
            $data = array(
                'success' => true,
                'message' => 'Update Fail'
            );

            return response()->json($e->getMessage());
        }
    }


    public function savexcuse(Request $request)
    {
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');


            foreach ($data as $v) {
                $var = new Description;
                $var->id_parameter = $v['id'];
                $var->desc = $v['excuse'];
                $var->insert_user = $id_user;
                $var->created_at = time::now();
                $var->groups = 4;
                $var->status = 1;
                $var->save();
            }


            return response()->json(array(
                'status' => true,
                'message' => 'Saving Success'
            ));
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function approve_get_sample(Request $request)
    {
        try {
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;

            $data = $request->input('data');

            foreach ($data as $d) {
                $checkdata = ConditionLabProccess::where('id_transaction_parameter', $d['id_transaction_parameter'])->first();
                if (!$checkdata) {
                    $add = $checkdata ? ConditionLabProccess::find($checkdata->id) : new ConditionLabProccess;
                    $add->id_transaction_parameter = $d['id_transaction_parameter'];
                    $add->user_id = $id_user;
                    $add->inserted_at = time::now();
                    $add->save();
                }
            }

            $message = array(
                "success" => true,
                "message" => "data has been approved"
            );
            return response()->json($message);
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function approve_lab_process(Request $request)
    {
        try {
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;

            $data = $request->input('data');

            foreach ($data as $d) {
                $checkdata = ConditionLabDone::where('id_transaction_parameter', $d['id_transaction_parameter'])->first();
                if (!$checkdata) {
                    $add = $checkdata ? ConditionLabDone::find($checkdata->id) : new ConditionLabDone;
                    $add->id_transaction_parameter = $d['id_transaction_parameter'];
                    $add->user_id = $id_user;
                    $add->inserted_at = time::now();
                    $add->save();
                }
            }

            $message = array(
                "success" => true,
                "message" => "data has been approved"
            );
            return response()->json($message);
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function unapprove_lab_done(Request $request)
    {
        try {
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;

            $data = $request->input('data');

            foreach ($data as $d) {
                $ch = ConditionLabDone::where('id_transaction_parameter', $d['id_transaction_parameter'])->first();
                $delete = ConditionLabDone::find($ch->id)->Delete();
            }

            $message = array(
                "success" => true,
                "message" => "data has been unapproved"
            );
            return response()->json($message);
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function changeStatusLab(Request $request)
    {
        try {
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;

            $data = $request->input('data');

            foreach ($data as $d) {
                $check = ConditionLabProccess::where('id_transaction_parameter', $d['id_transaction_parameter'])->get();
                $checkapprove = ConditionLabDone::where('id_transaction_parameter', $d['id_transaction_parameter'])->get();
                if (count($check) < 1) {
                    $add = new ConditionLabProccess;
                    $add->id_transaction_parameter = $d['id_transaction_parameter'];
                    $add->user_id = $id_user;
                    $add->inserted_at = time::now();
                    $add->save();
                } else if (count($check) > 0 && count($checkapprove) < 1) {
                    $add = new ConditionLabDone;
                    $add->id_transaction_parameter = $d['id_transaction_parameter'];
                    $add->user_id = $id_user;
                    $add->inserted_at = time::now();
                    $add->save();
                } else if (count($checkapprove) > 0) {
                    $delete = ConditionLabDone::find($checkapprove[0]->id)->Delete();
                }
            }

            $message = array(
                "success" => true,
                "message" => "data has been approved"
            );
            return response()->json($message);
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function gethasiluji(Request $request)
    {
        $data = $request->input('data');
        $var = \DB::table('condition_contracts as a')
            ->select(\DB::raw('IFNULL(d.hasiluji,"Not Filled") as hasiluji'), 'd.id')
            ->leftJoin('transaction_parameter as d', 'd.id', 'a.parameter_id')
            ->where('a.position', 4)
            ->where('a.parameter_id', '<>', 0)
            ->where('a.sample_id', '<>', 0)
            ->where('d.id_lab', $data['idlab'])
            ->groupBy('d.hasiluji');

        if (!empty($data['search'])) {
            $var = $var->where(\DB::raw('UPPER(d.hasiluji)'), 'like', '%' . strtoupper($data['hasiluji']) . '%');
        }

        $var = $var->paginate(50);
    }

    private function getcontractcategory($data, $var, $array)
    {
        $var = $var->selectRaw('
        d.id_contract_category,
        g.title')
            ->whereNotNull('d.id_contract_category')->groupBy('d.id_contract_category');
        if (!is_null($data['search'])) {
            $var = $var->where('g.title', 'like', strtoupper($data['search']));
        }
    }

    private function getpreparation_date($data, $var, $array)
    {
        $var = $var->selectRaw('
            DATE_FORMAT(data1.inserted_at, "%Y-%m-%d") as preparation_date')
            ->whereNotNull('data1.inserted_at')->groupBy('data1.inserted_at');
        if (count($data['contract']) > 0) {
            $setDataContract = [];
            foreach ($data['contract'] as $va) {
                array_push($setDataContract, $va['id_contract']);
            }
            $var = $var->whereIn('c.id_contract', $setDataContract);
        }
        if (!is_null($data['search'])) {

            $var = $var->where('data1.inserted_at', 'like', strtoupper($data['search']));
        }
    }

    private function getestimasilab($data, $var, $array)
    {
        $var = $var->selectRaw('
        DATE_FORMAT(c.tgl_estimasi_lab,"%d/%m/%Y") as estimasi_lab')
            ->whereNotNull('c.tgl_estimasi_lab')->groupBy('c.tgl_estimasi_lab');
        if (count($data['contract']) > 0) {
            $setDataContract = [];
            foreach ($data['contract'] as $va) {
                array_push($setDataContract, $va['id_contract']);
            }
            $var = $var->whereIn('c.id_contract', $setDataContract);
        }
        if (!is_null($data['search'])) {
            $var = $var->where('c.tgl_estimasi_lab', 'like', cd . ($data['search']));
        }
    }

    private function getparametertype($data, $var, $array)
    {
        $var = $var->selectRaw('
        f.id as id_parametertype,
        f.name as parametertype_name')
            ->whereNotNull('e.mstr_laboratories_parametertype_id')->groupBy('e.mstr_laboratories_parametertype_id');
        if (count($data['contract']) > 0) {
            $setDataContract = [];
            foreach ($data['contract'] as $va) {
                array_push($setDataContract, $va['id_contract']);
            }
            $var = $var->whereIn('c.id_contract', $setDataContract);
        }
        if (!is_null($data['search'])) {
            $var = $var->where(\DB::raw('upper(f.name)'), 'like', strtoupper($data['search']));
        }
    }

    public function getcontractno(Request $request)
    {

        $data = $request->input('data');
        $var = Kontrakuji::select('id_kontrakuji', 'contract_no');

        if (!empty($data['search'])) {
            $var = $var->where(\DB::raw('UPPER(b.contract_no)'), 'like', '%' . strtoupper($data['contract']) . '%');
        }

        if (!empty($data['contractcategory'])) {
            $var = $var->where('id_contract_category', $data['contractcategory']);
        }

        $var = $var->paginate(50);

        return response()->json($var);
    }

    public function getsample(Request $request)
    {
        $data = $request->input('data');

        $var = TransactionSample::select('no_sample', 'id');

        if (!empty($data['search'])) {
            $var = $var->where(\DB::raw('UPPER(no_sample)'), 'like', '%' . strtoupper($data['search']) . '%');
        }

        if (count($data['contract']) > 0) {
            $var = $var->whereIn('id_contract', $data['contract']);
        }

        return response()->json($var->paginate(50));
    }


    public function getparameteruji(Request $request)
    {
        $data = $request->input('data');
        $var = \DB::table('transaction_parameter as a')
            ->select('b.id', 'b.name_id')
            ->leftJoin('mstr_laboratories_parameteruji as b', 'b.id', 'a.id_parameteruji')
            ->groupBy('a.id_parameteruji');

        if (!empty($data['search'])) {
            $var = $var->where(\DB::raw('UPPER(b.name_id)'), 'like', '%' . strtoupper($data['search']) . '%');
        }

        return response()->json($var->paginate(50));
    }



    private function getparametertest($data, $var, $array)
    {
        $var = $var->selectRaw('
        e.id as id_parameteruji,
        e.name_id, 
        e.name_en')
            ->whereNotNull('e.id')->groupBy('e.id');
        if (count($data['contract']) > 0) {
            $setDataContract = [];
            foreach ($data['contract'] as $va) {
                array_push($setDataContract, $va['id_contract']);
            }
            $var = $var->whereIn('c.id_contract', $setDataContract);
        }
        if (count($data['sample']) > 0) {
            $setDataSample = [];
            foreach ($data['sample'] as $va) {
                array_push($setDataSample, $va['id_sample']);
            }
            $var = $var->whereIn('a.id_sample', $setDataSample);
        }
        if (!is_null($data['search'])) {
            $var = $var->where(\DB::raw('upper(e.name_id)'), 'like', strtoupper($data['search']))->whereNotNull('e.id')
                ->orWhere(\DB::raw('upper(e.name_id)'), 'like', strtoupper($data['search']))->whereNotNull('e.id');
        }
    }
}
