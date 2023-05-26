<?php
namespace App\Http\Controllers\Master;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Master\PaketParameter;
use App\Models\Master\Hargaaneh;
use App\Models\Master\Paketuji;
use Firebase\JWT\JWT;
use Carbon\Carbon as time;

class PaketParameterController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function index(Request $request)
    {
        $var = \DB::table('mstr_products_paketparameter as a')
        ->join('mstr_products_paketuji as b','b.id','a.id_paketuji')
        ->groupBy('a.id_paketuji')
        ->orderBy('a.id')
        ->whereNull('b.deleted_at');
        
        if(!empty($request->input('search'))){
            $var = $var->where(\DB::raw('UPPER(b.nama_paketuji)'),'like','%'.$request->input('search').'%');
        }

        $var = $var->paginate(25);
        
        return response()->json($var);
    }

    public function indexContract(Request $request){
        $var = \DB::table('mstr_products_paketparameter as a')
        ->join('mstr_products_paketuji as b','b.id','a.id_paketuji')
        ->where('b.status',1)
        ->groupBy('a.id_paketuji')
        ->whereNull('b.deleted_at');
        
        if(!empty($request->input('search'))){
            $var = $var->where(\DB::raw('UPPER(b.nama_paketuji)'),'like','%'.$request->input('search').'%');
        }

        $var = $var->paginate(25);
        
        return response()->json($var);
    }

    public function setSpecialPrice(Request $request){
        $var = new Hargaaneh;
        $var->id_paketuji = $request->input('idpaketuji');
        $var->save();



        return response()->json(array(
            'success'=>true,
            'message'=>'saving data'
        ));

    }

    public function show(Request $request,$id)
    {
        try{
            $var = Paketuji::with([
                'paketparameter',
                'paketparameter.lod',
                'paketparameter.unit',
                'paketparameter.standart',
                'paketparameter.metode',
                'paketparameter.parameteruji',
                'paketparameter.lab'
            ])->find($id);
           
            return response()->json($var);

        } catch(\Exception $e){
            return response()->json($e->getMessage());
        }

        return response()->json($model);
    }

    public function update(Request $request,$id){
        // try{
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $totalpaket = Paketuji::all()->toArray();
            $s = count($totalpaket) + 1;
            $data = $request->input('data');
            $paketparameter = PaketParameter::where('id_paketuji',$id)->get();
            if(count($paketparameter) > 0){
                foreach ($paketparameter as $value) {
                    $delete = PaketParameter::find($value->id)->forceDelete();
                }
            }
            $bb = Paketuji::find($id);            
            if($bb){
                $cc = Paketuji::find($id);    
                $cc->nama_paketuji = $data['nama_paket'];
                $cc->nama_paketuji_en = !empty($data['nama_paket_en']) ? $data['nama_paket_en'] : null;
                $cc->kode_paketuji = 'PKT'.$s;
                $cc->price = $data['price'];
                $cc->discount = intval($data['discount']);
                // $cc->description = $data['description'];
                $cc->status = 0;
                $cc->insert_user = $id_user;
                $cc->created_at = time::now();
                $cc->save();
    
                foreach($data['parameter'] as $pktparam){
                    $d = new PaketParameter;
                    $d->id_paketuji = $cc->id;
                    $d->id_parameter_uji = $pktparam['id_parameter_uji'];
                    $d->id_unit = !is_null($pktparam['id_unit']) ? $pktparam['id_unit'] : null;
                    $d->id_standart = !is_null($pktparam['id_standart']) ? $pktparam['id_standart'] : null;
                    $d->id_metode = !is_null($pktparam['id_metode']) ? $pktparam['id_metode'] : null;
                    $d->id_lod = !is_null($pktparam['id_lod']) ? $pktparam['id_lod'] : null;
                    $d->id_lab = $pktparam['id_lab'];
                    $d->save();
                } 
            } else {
                $cc = new Paketuji;
                $cc->nama_paketuji = $data['nama_paket'];
                $cc->price = $data['price'];
                $cc->discount = $data['discount'];
                $cc->status = 0;
                $cc->kode_paketuji = 'PKT'.$s;

                $cc->insert_user = $id_user;
                $cc->created_at = time::now();
                $cc->save();
    
                foreach($data['parameter'] as $pktparam){
                    $d = new PaketParameter;
                    $d->id_paketuji = $cc->id;
                    $d->id_parameter_uji = $pktparam['id_parameter_uji'];
                    $d->id_unit = !is_null($pktparam['id_unit']) ? $pktparam['id_unit'] : null;
                    $d->id_standart = !is_null($pktparam['id_standart']) ? $pktparam['id_standart'] : null;
                    $d->id_metode = !is_null($pktparam['id_metode']) ? $pktparam['id_metode'] : null;
                    $d->id_lod = !is_null($pktparam['id_lod']) ? $pktparam['id_lod'] : null;
                    $d->id_lab = $pktparam['id_lab'];
                    $d->save();
                } 
            }
             
            $data=array(
                'success'=>true,
                'message'=>'Update Success'
            );
            return response()->json($data);

        // } catch(\Exception $e){
        //     $data=array(
        //         'success'=>false,
        //         'message'=> $e->getMessage()
        //     );
        //     return response()->json($data);
        // }
        
    }
    public function destroy(Request $request, $id)
    {
        try{

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;

            $var = \DB::table('transaction_parameter as a')
            ->leftJoin('mstr_products_paketuji as b','b.id','a.info_id')
            ->where('a.status',1)
            ->where('b.id',$id)
            ->get();
    
           if(count($var) > 0){
                return response()->json(array(
                    "success" => false,
                    "message" => "Cant Delete Data is used"
                ));
           } else {
                $paketujidelete = Paketuji::find($id);
                $paketujidelete->Delete();

                $paketparameterDelete = PaketParameter::where('id_paketuji',$id)->get();

                foreach($paketparameterDelete as $ppdelete){
                    $paketdelete = PaketParameter::find($ppdelete->id)->Delete();
                }

                $data=array(
                    'success'=>true,
                    'message'=>'Data deleted'
                );

                return response()->json($data);
           }

        } catch(\Exception $e){

            $data=array(
                'success'=>false,
                'message'=>'Data failed to delete'
            );
            
            return response()->json($data);
    }
        
    }

    public function acceptpackage(Request $request){
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;

            $paketujiAccept = Paketuji::find($request->input('id_paketuji'));
            $paketujiAccept->status = $request->input('status');
            $paketujiAccept->updated_at = time::now();
            $paketujiAccept->update_user = $id_user;
            $paketujiAccept->save();

            $data = array(
                "status" => true,
                "message" => "data has been updated"
            );

            return response()->json($data);

        } catch (\Exception $e){
            return response()->json($e->getMessage());
        }
    }

    public function store(Request $request){
        try{
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');
            $message = [];
            
            $checkjumlah = Paketuji::all();
            $checknama = Paketuji::where(\DB::raw('UPPER(nama_paketuji)'),'like','%'.strtoupper($data['nama_paket']).'%')
            ->get();

            if(count($checknama) < 1){
                $v = new Paketuji;
                $v->kode_paketuji = 'PKT-'.(count($checkjumlah) + 1);
                $v->nama_paketuji = $data['nama_paket'];
                $v->nama_paketuji_en = !empty($data['nama_paket_en']) ? $data['nama_paket_en'] : null;
                $v->price = $data['price'];
                $v->description = $data['description'];
                $v->discount = $data['discount'];
                $v->status = 1;
                $v->insert_user = $id_user;
                $v->created_at = time::now();
                $v->save();
    
                foreach($data['parameter'] as $pktparam){
                    $d = new PaketParameter;
                    $d->id_paketuji = $v->id;
                    $d->id_parameter_uji = $pktparam['id_parameter_uji'];
                    $d->id_unit = $pktparam['id_unit'];
                    $d->id_standart = $pktparam['id_standart'];
                    $d->id_metode = $pktparam['id_metode'];
                    $d->id_lod = !is_null($pktparam['id_lod']) ? $pktparam['id_lod'] : null;
                    $d->id_lab = $pktparam['id_lab'];
                    $d->save();
                }
    
    
                $xz=array(
                    'success'=>true,
                    'message'=>'Saving Success'
                );
                array_push($message,$xz);

            } else if(count($checknama) > 0){

                array_push($message,array(
                    "status" => false,
                    "message" => "Package Name Already Exist"
                ));
            }

            return response()->json($message);

        } catch(\Exception $e){
            $data=array(
                'success'=>false,
                'message'=>"Saving Error Please Contact IT"
            );
            return response()->json($data);
            // return $e->getMessage();
        }
        
    }
}
