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
use App\Models\Complain\Nontechnical;
use App\Models\Complain\ComplainTechnical;
use App\Models\Complain\ComplainStatus;
use App\Models\Complain\ComplainTechnicalDetail;
use App\Models\Ecert\ConditionCert;
use App\Models\Analysis\TransactionSample;
use App\Models\Analysis\Kontrakuji;

class PreparationComplaintController extends Controller
{
    public function index(Request $request)
    {   
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $m = DB::connection('mysqlcomplain')->select('
        SELECT * FROM (
            SELECT * FROM (
                    SELECT * FROM complain_technical_status
                    GROUP BY complain_technical_status.id
                    ORDER BY complain_technical_status.id DESC) AS cts
            GROUP BY cts.id_technical_det ) AS det
        WHERE det.position = 3 AND det.status = 0 OR det.position = 3 AND det.status = 2');

        $arr = array_map(function ($m) {
            return $m->id_technical_det;
        }, $m);


        $model = ComplainTechnicalDetail::with([
            'lab',
            'complain_tech',
            'status',
            'parameteruji',
            'complain_tech.complain_cs',
            'complain_tech.complain_cs.TransactionSample',
            'complain_tech.complain_cs.TransactionSample.kontrakuji',
            'complain_tech.complain_cs.TransactionSample.subcatalogue',
            ])
        ->whereIn('id', $arr)
        ->where('preparation_status', 1);

      
        if(!empty($data['parameter'])){
            $parameter = \DB::table('mstr_laboratories_parameteruji')
            ->where(\DB::raw('UPPER(name_id)'),'like','%'.$data['parameter'].'%')
            ->select('id')
            ->get()
            ->toArray();

            $prm = array_map(function($v){
                return $v->id;
            },$parameter);

            $model = $model->whereIn('id_parameteruji',$prm);
        }

        if(!empty($data['complain_number'])){
            $no_complain = $data['complain_number'];
            $model = $model->whereHas('complain_tech',function($query) use ($no_complain){
                return $query->where(\DB::raw('UPPER(complain_no)'),'like','%'.$no_complain.'%');
            });
        }

        if(!empty($data['marketing'])){
            $kont = Kontrakuji::where('contract_no', $data['marketing'])->get()->toArray();
            $k = array_map(function($kont){
                return $kont['id_kontrakuji'];
            },$kont);

            $samp = TransactionSample::whereIn('id_contract', $kont)->get()->toArray();
           
            $prm = array_map(function($samp){
                return $samp['id'];
            },$samp);

            $comp = Complain::whereIn('id_transaction_sample', $prm)->get()->toArray();

            $c = array_map(function($comp){
                return $comp['id'];
            },$comp);

            
            $model = $model->whereHas('complain_tech',function($query) use ($c){
                return $query->whereIn('id_complain',$c);
            });
        }

        if(!empty($data['sample_number'])){            
            $check = TransactionSample::where(\DB::raw('UPPER(no_sample)'),'like','%'.$data['sample_number'].'%')->get()->toArray();

            $prm = array_map(function($check){
                return $check['id'];
            },$check);

            $comp = Complain::whereIn('id_transaction_sample', $prm)->get()->toArray();

            $c = array_map(function($comp){
                return $comp['id'];
            },$comp);

            
            $model = $model->whereHas('complain_tech',function($query) use ($c){
                return $query->whereIn('id_complain',$c);
            });
        }

        if(!empty($data['sample_name'])){            
            $check = TransactionSample::where(\DB::raw('UPPER(sample_name)'),'like','%'.$data['sample_name'].'%')->get()->toArray();

            $prm = array_map(function($check){
                return $check['id'];
            },$check);

            $comp = Complain::whereIn('id_transaction_sample', $prm)->get()->toArray();

            $c = array_map(function($comp){
                return $comp['id'];
            },$comp);
            
            $model = $model->whereHas('complain_tech',function($query) use ($c){
                return $query->whereIn('id_complain',$c);
            });


        }

        if(!empty($data['status'])){
            $model=$model->where(\DB::raw('UPPER(complain_no)'),'like','%'.$data['complain_number'].'%');
        }

        $model = $model->paginate(25);
        
        return response()->json($model);
        
    }

    public function approveSample(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = ComplainTechnicalDetail::where('id', $data['id'])->first();
        $model->status_prep = 2;
        $model->save();

        
        $data=array(
            'success'=>true,
            'message'=>'Sample Sending'
        );

        return response()->json($data);
    }

    public function statusPrep(Request $request)
    {

        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = New ComplainStatus;
        $model->id_technical_det = $data['id'];
        $model->status = $data['value'];
        $model->position = 3;
        $model->user_id = $id_user;
        $model->inserted_at = time::now();
        $model->save();

        
        $data=array(
            'success'=>true,
            'message'=>'Sample Updated'
        );

        return response()->json($data);
    }

    public function exportDataHistory(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');
        
        $m = DB::connection('mysqlcomplain')->select('
        SELECT * FROM (	
			SELECT * FROM (
                SELECT * FROM (
                        SELECT * FROM complain_technical_status
                        GROUP BY complain_technical_status.id
                        ORDER BY complain_technical_status.id DESC) AS cts
                GROUP BY cts.id_technical_det ) AS det
            WHERE det.position = 3 AND det.status = 0 OR det.position = 3 AND det.status = 2 ) AS tbl
        WHERE DATE(tbl.inserted_at) BETWEEN"'. date('Y-m-d', strtotime($data['tglStart'])).'" AND "'.date('Y-m-d', strtotime($data['tglEnd'])).'"' );

        $arr = array_map(function ($m) {
            return $m->id_technical_det;
        }, $m);


        $model = ComplainTechnicalDetail::with([
            'lab',
            'complain_tech',
            'status',
            'parameteruji',
            'complain_tech.complain_cs',
            'complain_tech.complain_cs.TransactionSample',
            'complain_tech.complain_cs.TransactionSample.kontrakuji',
            'certificateParameter',
            'complain_tech.complain_cs.TransactionSample.subcatalogue',
            ])
        ->whereIn('id', $arr)
        ->where('preparation_status', 1)->get();
        
        return response()->json($model);
    }
}