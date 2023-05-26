<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Master\SpesificPackage;
use App\Models\Master\SubSpecificPackage;
use App\Models\Master\DetailSpecificPackage;
use App\Models\Master\Perka;
use Firebase\JWT\JWT;
use Carbon\Carbon as time;

class SpecificPackageController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function index(Request $request)
    {
        try {

            // return 'as';
            $var = \DB::table('mstr_sub_specific_package as a')
                ->selectRaw('
                a.mstr_specific_package_id,
                b.package_code,
                b.package_name,
                b.package_name_en,
                b.description,
                b.disc,
                b.status,
                CAST(c.totalharga AS SIGNED) as totalharga
            ')
                ->leftJoin('mstr_specific_package as b', 'b.id', 'a.mstr_specific_package_id')
                ->leftJoin(\DB::raw('(SELECT SUM(aa.price) as totalharga, aa.mstr_specific_package_id FROM mstr_sub_specific_package as aa group by aa.mstr_specific_package_id) AS c'), 'c.mstr_specific_package_id', 'a.mstr_specific_package_id');
            if (!empty($request->input('search'))) {
                $var = $var->where(\DB::raw('UPPER(b.package_name)'), 'like', '%' . strtoupper($request->input('search')) . '%');
            }
            if (!empty($request->input('active'))) {
                if ($request->input('active')) {
                    $var = $var->where('b.status', 1);
                } else {
                    $var = $var->where('b.status', $request->input('active'));
                }
            }
            $var = $var->whereNull('b.deleted_at')->groupBy('a.mstr_specific_package_id')->paginate(25);

            return response()->json($var);
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
            return response()->json(array(
                "status"  => false,
                "message" => "Error at backend Sorry .. !"
            ));
        }
    }

    public function indexContract(Request $request)
    {
        try {

            // return ;
            $var = \DB::table('mstr_sub_specific_package as a')
                ->selectRaw('
                a.mstr_specific_package_id,
                b.package_code,
                b.package_name,
                b.description,
                b.disc,
                b.status,
                CAST(c.totalharga AS SIGNED) as totalharga
            ')
                ->leftJoin('mstr_specific_package as b', 'b.id', 'a.mstr_specific_package_id')
                ->leftJoin(\DB::raw('(SELECT SUM(aa.price) as totalharga, aa.mstr_specific_package_id FROM mstr_sub_specific_package as aa group by aa.mstr_specific_package_id) AS c'), 'c.mstr_specific_package_id', 'a.mstr_specific_package_id')
                ->where('b.status', 1);
            if (!empty($request->input('search'))) {
                $var = $var->where(\DB::raw('UPPER(b.package_name)'), 'like', '%' . strtoupper($request->input('search')) . '%');
            }

            $var = $var->whereNull('b.deleted_at')->groupBy('a.mstr_specific_package_id')->paginate(25);

            return response()->json($var);
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
            return response()->json(array(
                "status"  => false,
                "message" => "Error at backend Sorry .. !"
            ));
        }
    }

    public function accept(Request $request)
    {
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;

            $var = SpesificPackage::find($request->input('id_specific_package'));
            $var->status = $request->input('status');
            $var->updated_at = time::now();
            $var->update_user = $id_user;
            $var->save();

            return response()->json(array(
                "status" => true,
                "message" => "Accept Success"
            ));
        } catch (\Exception $e) {
            return response()->json(array(
                "status" => false,
                "message" => "Error at Backend Sorry !!"
            ));
        }

        return response()->json($var);
    }

    public function show(Request $request, $id)
    {

        // `SELECT * FROM mstr_detail_specific_package a 
        // LEFT JOIN mstr_sub_specific_package c ON c.id = a.id_mstr_sub_specific_package
        // LEFT JOIN mstr_specific_package b ON b.id = c.mstr_specific_package_id
        // LEFT JOIN mstr_standard_perka d ON d.id_sub_specific_catalogue = c.id`;
        // $var = \DB::table('mstr_detail_specific_package as a')
        // ->leftJoin('mstr_sub_specific_package as b','b.id','a.id_mstr_sub_specific_package')
        // ->leftJoin('mstr_specific_package as c','c.id','b.mstr_specific_package_id')
        // ->leftJoin('mstr_standard_perka as d','d.id_sub_specific_catalogue','c.id')->where('c.id',$id)->first();
        $model = SpesificPackage::with([
            'subspecific',
            'subspecific.detailSpecific',
            'subspecific.perka',
            'subspecific.detailSpecific.parameteruji',
            'subspecific.detailSpecific.lab',
            'subspecific.detailSpecific.metode',
            'subspecific.detailSpecific.unit',
            'subspecific.detailSpecific.standart',
        ])->find($id);

        return response()->json($model);
    }

    public function find_based_subid(Request $request)
    {
        $data = $request->input('id');
        $var = SubSpecificPackage::with([
            'pkmpackage',
            'detailSpecific',
            'perka',
            'detailSpecific.parameteruji',
            'detailSpecific.lab',
            'detailSpecific.metode',
            'detailSpecific.unit',
            'detailSpecific.standart',
        ])->whereIn('id', $data['data'])->get();

        return response()->json($var);
    }

    // public function find_based_subid(Request $request){
    //     $data = $request->input('id');
    //     $model = SpesificPackage::with([
    //         'subspecific',
    //         'subspecific.detailSpecific',
    //         'subspecific.perka',
    //         'subspecific.detailSpecific.parameteruji',
    //         'subspecific.detailSpecific.lab',
    //         'subspecific.detailSpecific.metode',
    //         'subspecific.detailSpecific.unit',
    //         'subspecific.detailSpecific.standart',
    //     ])->whereHas('subspecific',function($q) use ($data){
    //         return $q->whereIn('id',$data);
    //     })->get();
    //     // $var = SubSpecificPackage::with([
    //     //     'pkmpackage',
    //     //     'detailSpecific',
    //     //     'perka',
    //     //     'detailSpecific.parameteruji',
    //     //     'detailSpecific.lab',
    //     //     'detailSpecific.metode',
    //     //     'detailSpecific.unit',
    //     //     'detailSpecific.standart',
    //     // ])->whereIn('id',$data)->get();

    //     return response()->json($model);
    // }

    public function update(Request $request, $id)
    {
        try {
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');
            $message = [];

            $codepacket = SpesificPackage::find($id);
            $codepaket = $codepacket->package_code;

            $subspecificfind = SubSpecificPackage::where('mstr_specific_package_id', $id)->get();
            foreach ($subspecificfind as $s) {
                $findDetail = DetailSpecificPackage::where('id_mstr_sub_specific_package', $s->id)->get();
                $findPerka = Perka::where('id_sub_specific_catalogue', $s->id)->get();
                if (count($findPerka) > 0) {
                    foreach ($findPerka as $p) {
                        $deletingperka = Perka::find($p->id)->Delete();
                    }
                }
                foreach ($findDetail as $d) {
                    $deleted = DetailSpecificPackage::find($d->id)->Delete();
                }
            }

            $paketnama = SpesificPackage::find($id);
            $paketnama->package_code = $codepaket;
            $paketnama->package_name = $data['nama_paket'];
            $paketnama->package_name_en = !empty($data['nama_paket_en']) ? $data['nama_paket_en'] : null;
            $paketnama->description = $data['description'];
            $paketnama->disc = !empty($data['discount']) ? intval($data['discount']) : 0;
            $paketnama->status = 0;
            $paketnama->insert_user = $id_user;
            $paketnama->created_at = time::now();
            $paketnama->save();

            foreach ($data['parameter'] as $subpaket) {

                $subpackage = !empty($subpaket['id']) ? SubSpecificPackage::find($subpaket['id']) : new SubSpecificPackage;
                $subpackage->mstr_specific_package_id = $paketnama->id;
                $subpackage->subpackage_name = $subpaket['parameteruji_name'];
                $subpackage->jumlah = $subpaket['n'];
                $subpackage->price = $subpaket['harga'];
                $subpackage->save();



                if (!is_null($subpaket['m']) || !is_null($subpaket['mm']) || !is_null($subpaket['c'])) {
                    $perka = new Perka;
                    $perka->id_sub_specific_catalogue = $subpackage->id;
                    $perka->n = $subpaket['n'];
                    $perka->c = $subpaket['c'];
                    $perka->m = $subpaket['m'];
                    $perka->mm = $subpaket['mm'];
                    $perka->save();
                }

                for ($dd = 0; $dd < $subpaket['n']; $dd++) {
                    $detailpaket = new DetailSpecificPackage;
                    $detailpaket->id_mstr_sub_specific_package = $subpackage->id;
                    $detailpaket->parameteruji_id = $subpaket['id_parameter_uji'];
                    $detailpaket->position = $dd + 1;
                    $detailpaket->id_metode = $subpaket['id_metode'];
                    $detailpaket->id_unit = $subpaket['id_unit'];
                    $detailpaket->id_lab = $subpaket['id_lab'];
                    $detailpaket->id_standart = $subpaket['id_standart'];
                    $detailpaket->save();
                }
            }

            array_push($message, array(
                "status" => true,
                "message" => "Success Saving Package"
            ));
            return response()->json($message);
        } catch (\Exception $e) {
            $data = array(
                'success' => false,
                'message' => 'Update Error'
            );
            return response()->json($e);
        }
    }
    public function destroy($id)
    {

        try {
            $var = \DB::table('transaction_parameter as a')
                ->leftJoin('mstr_sub_specific_package as b', 'b.id', 'a.info_id')
                ->leftJoin('mstr_specific_package as c', 'c.id', 'b.mstr_specific_package_id')
                ->where('a.status', 4)
                ->where('c.id', $id)
                ->get();

            if (count($var) > 0) {
                $data = array(
                    'success' => false,
                    'message' => 'Can`t Delete Data is used'
                );
                return response()->json($data);
            } else {
                $model = SpesificPackage::find($id)->delete();
                $data = array(
                    'success' => false,
                    'message' => 'Data Deleted'
                );
                return response()->json($data);
            }
        } catch (\Exception $e) {
            $data = array(
                'success' => false,
                'message' => 'Data failed to deleted'
            );
            return response()->json($data);
        }
    }

    public function store(Request $request)
    {
        try {
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');
            $message = [];

            $checkjumlah = SpesificPackage::all();
            $checknama = SpesificPackage::where(\DB::raw('UPPER(package_name)'), 'like', '%' . strtoupper($data['nama_paket']) . '%')
                ->get();

            if (count($checknama) < 1) {
                $paketnama = new SpesificPackage;
                $paketnama->package_code = 'PKTP-' . (count($checkjumlah) + 1);
                $paketnama->package_name = $data['nama_paket'];
                $paketnama->package_name_en = !empty($data['nama_paket_en']) ? $data['nama_paket_en'] : null;
                $paketnama->description = $data['description'];
                $paketnama->disc = $data['discount'];
                $paketnama->status = 0;
                $paketnama->insert_user = $id_user;
                $paketnama->created_at = time::now();
                $paketnama->save();
                foreach ($data['parameter'] as $subpaket) {
                    $subpackage = new SubSpecificPackage;
                    $subpackage->mstr_specific_package_id = $paketnama->id;
                    $subpackage->subpackage_name = $subpaket['parameteruji_name'];
                    $subpackage->jumlah = $subpaket['n'];
                    $subpackage->price = $subpaket['harga'];
                    $subpackage->save();

                    if (!is_null($subpaket['m']) || !is_null($subpaket['mm']) || !is_null($subpaket['c'])) {
                        // return $subpaket['m'];
                        $perka = new Perka;
                        $perka->id_sub_specific_catalogue = $subpackage->id;
                        $perka->n = $subpaket['n'];
                        $perka->c = $subpaket['c'];
                        $perka->m = $subpaket['m'];
                        $perka->mm = $subpaket['mm'];
                        $perka->save();
                        // return $perka;
                    }

                    for ($dd = 0; $dd < $subpaket['n']; $dd++) {
                        $detailpaket = new DetailSpecificPackage;
                        $detailpaket->id_mstr_sub_specific_package = $subpackage->id;
                        $detailpaket->parameteruji_id = $subpaket['id_parameter_uji'];
                        $detailpaket->position = $dd + 1;
                        $detailpaket->id_metode = $subpaket['id_metode'];
                        $detailpaket->id_unit = $subpaket['id_unit'];
                        $detailpaket->id_lab = $subpaket['id_lab'];
                        $detailpaket->id_standart = $subpaket['id_standart'];
                        $detailpaket->save();
                    }
                }

                array_push($message, array(
                    "status" => true,
                    "message" => "Success Saving Package"
                ));
            } else if (count($checknama) > 0) {
                array_push($message, array(
                    "status" => false,
                    "message" => "Package Name already Exist"
                ));
            }

            return response()->json($message);
        } catch (\Exception $e) {
            $data = array(
                'success' => false,
                'message' => 'Saving Error'
            );
            return response()->json($e->getMessage());
            // return $e->getMessage();
        }
    }
}
