<?php
namespace App\Http\Controllers\Ecert;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Master\Group;
use App\Models\Master\Format;
use App\Models\Master\ParameterUji;
use App\Models\Analysis\ConditionContract;
use App\Models\Analysis\TransactionSample;
use App\Models\Analysis\Transaction_parameter;
use App\Models\Analysis\Kontrakuji;
use App\Models\Analysis\Description;
use App\Models\Analysis\ConditionContractNew;
use App\Models\Analysis\ContactPerson;
use App\Models\Analysis\Customer;
use App\Models\Ecert\Ecertlhu;
use App\Models\Ecert\Akgfile;
use App\Models\Ecert\ConditionCert;
use App\Models\Ecert\CustomerCert;
use App\Models\Ecert\ParameterCert;
use App\Models\Analysis\Customerhandle;
use App\Models\Analysis\CustomerAddress;
use App\Models\Ecert\RevConditionCert;
use App\Models\Ecert\RevEcertlhu;
use App\Models\Ecert\RevParameterCert;
use App\Models\Ecert\AttachmentRevFile;
use App\Models\Ecert\ManualData;
use App\Models\Master\MemberTeam;
use App\Models\Hris\Employee;
use App\Models\Analysis\InvoiceHeader;
use DB;
use Auth;
use Firebase\JWT\JWT;
use Carbon\Carbon as time;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Intervention\Image\ImageManagerStatic as Image;
use Illuminate\Support\Facades\Mail;

class EcertDashboardController extends Controller
{
    public function dashboard(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        return $data;

        // count in prep
       $inPrep = DB::select('SELECT COUNT(*) as  inPrep FROM (
            select * FROM (              
                    select * from (                  
                        select b.* from condition_contracts b
                        group by b.id_condition_contract
                        order by b.id_condition_contract desc ) as aa
                group by aa.sample_id ) as zz
            where zz.position = 2 OR zz.position = 3) AS ww
        LEFT JOIN mstr_transaction_kontrakuji mtk ON mtk.id_kontrakuji = ww.contract_id 
        LEFT JOIN mstr_customers_handle mch ON mch.idch = mtk.id_customers_handle
        WHERE mch.id_customer ='. $data['id_customer']);

        // count in lab
        $inLab = DB::select('SELECT COUNT(*) as  inLab FROM (
            select * FROM (              
                    select * from (                  
                        select b.* from condition_contracts b
                        group by b.id_condition_contract
                        order by b.id_condition_contract desc ) as aa
                group by aa.sample_id ) as zz
            where zz.position = 4) AS ww
        LEFT JOIN mstr_transaction_kontrakuji mtk ON mtk.id_kontrakuji = ww.contract_id 
        LEFT JOIN mstr_customers_handle mch ON mch.idch = mtk.id_customers_handle
        WHERE mch.id_customer ='. $data['id_customer']);

        // count in cert
        $checkCert = DB::select('SELECT * FROM (
            select * FROM (              
                    select * from (                  
                        select b.* from condition_contracts b
                        group by b.id_condition_contract
                        order by b.id_condition_contract desc ) as aa
                group by aa.sample_id ) as zz
            where zz.position = 5) AS ww
        LEFT JOIN mstr_transaction_kontrakuji mtk ON mtk.id_kontrakuji = ww.contract_id 
        LEFT JOIN mstr_customers_handle mch ON mch.idch = mtk.id_customers_handle
        WHERE mch.id_customer =' . $data['id_customer']);

        $ids = array_map(function ($checkCert) {
            return $checkCert->sample_id;
        }, $checkCert);

        $datas = implode(", ",  $ids);

        $inCert = DB::connection('mysqlcertificate')->select('SELECT COUNT(*) AS inCert FROM (           
            SELECT * FROM (
               SELECT * FROM (
                  SELECT * FROM (
                     SELECT b.* FROM condition_sample_cert b
                     GROUP BY b.id
                     ORDER BY b.id DESC ) AS zz
                  GROUP BY zz.id_transaction_cert) AS aa
               WHERE aa.status = 1 OR aa.status = 2) cc
            GROUP BY cc.id_transaction_cert
            ORDER BY cc.id_transaction_cert DESC ) AS pp
        LEFT JOIN transaction_sample_cert tsc ON tsc.id = pp.id_transaction_cert  
        WHERE tsc.id_transaction_sample IN ('. $datas .')');

        $array = array(
            "a" => $inPrep,
            "b" => $inLab,
            "c" => $inCert,
        );

        return response()->json($array);
    }

    public function runningData(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');


        // $m = DB::select('SELECT * FROM mstr_transaction_kontrakuji a
        // LEFT JOIN mstr_customers_handle b ON b.idch = a.id_customers_handle
        // WHERE b.id_customer = ' . $data['id_customer']);

        // $result = array_map(function ($m) {
        //     return $m->id_kontrakuji;
        // }, $m);

        // $datas = implode(", ",  $result);

        // $model = DB::select('SELECT * FROM (
        //     SELECT * FROM (
        //         SELECT * FROM (
        //             SELECT b.* FROM condition_contracts b
        //             GROUP BY b.id_condition_contract
        //             ORDER BY b.id_condition_contract DESC ) AS aa
        //         GROUP BY aa.sample_id ) AS zz
        //     WHERE zz.position = 3 or zz.position = 4 ) AS ww
        // WHERE ww.contract_id IN ('. $datas.')');

          $model = DB::select('
          SELECT zz.sample_id FROM (
            SELECT * FROM (
               SELECT b.* FROM condition_contracts b
               GROUP BY b.id_condition_contract
               ORDER BY b.id_condition_contract DESC ) AS aa
            GROUP BY aa.sample_id ) AS zz
         INNER JOIN  mstr_transaction_kontrakuji mtk ON mtk.id_kontrakuji = zz.contract_id
         INNER JOIN mstr_customers_handle mch ON mch.idch = mtk.id_customers_handle
         WHERE zz.position = 3 or zz.position = 4 
         AND mch.id_customer = ' . $data['id_customer'] .'
         ');


        $ids = array_map(function ($model) {
            return $model->sample_id;
        }, $model);

        $zzz = TransactionSample::with([
            'images',
            'kontrakuji',
            'statuspengujian:id,name',
            'subcatalogue:id_catalogue,id_sub_catalogue,sub_catalogue_name',
            'contract_condition'
        ])->whereIn('id',$ids);

        if(!empty($data['sample_name'])){
            $zzz = $zzz->where(\DB::raw('UPPER(sample_name)'),'like','%'.$data['sample_name'].'%');        
        }

        if(!empty($data['marketing'])){
            $marketing = $data['marketing'];
            $zzz = $zzz->whereHas('kontrakuji',function($query) use ($marketing){
                    $query->where(\DB::raw('UPPER(contract_no)'),'like','%'.$marketing.'%');
            });
        }

        if(!empty($data['sample_number'])){
            $zzz = $zzz->where(\DB::raw('UPPER(no_sample)'),'like','%'.$data['sample_number'].'%');
        }

        if(!empty($data['start_date'])){
            $zzz = $zzz->where(\DB::raw('UPPER(tgl_input)'),'like','%'.date('Y-m-d',strtotime($data['start_date'])) .'%');
        }

        if(!empty($data['month'])){
            $zzz = $zzz->whereMonth(\DB::raw('UPPER(tgl_input)'),$data['month']);
        }

        return $zzz->paginate(25);
    }
}
