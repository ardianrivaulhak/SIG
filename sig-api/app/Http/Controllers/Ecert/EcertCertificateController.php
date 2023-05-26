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
use App\Models\Ecert\Complain;
use App\Models\Master\MemberTeam;
use App\Models\Hris\Employee;
use DB;
use Auth;
use Firebase\JWT\JWT;
use Carbon\Carbon as time;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Intervention\Image\ImageManagerStatic as Image;
use Illuminate\Support\Facades\Mail;

class EcertCertificateController extends Controller
{
    public function detailKontrak($id_kontrak)
    {

        $model = Kontrakuji::where('id_kontrakuji', $id_kontrak)->get();

        return $model;

    }

    public function certificate(Request $request)
    {

        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $test = DB::select("SELECT id_kontrakuji, contract_no FROM mstr_transaction_kontrakuji WHERE  id_customers_handle IN (SELECT idch  FROM mstr_customers_handle  
        where id_customer = ". $data['id_customer'].") AND contract_no LIKE '%". trim($data['marketing']) ."%' ");

        
        
        $array = array();

        foreach($test as $test){
            array_push($array, $test->id_kontrakuji);

        }
        $string=implode(",",$array);

        $wew = DB::connection('mysqlcertificate')->select('SELECT id_transaction_cert FROM (
            SELECT b.* FROM condition_sample_cert b
            WHERE b.id_contract IN ('.  $string  .')
            ORDER BY b.id DESC ) AS zz
            WHERE zz.status = 3 OR zz.status = 4');

          $result = array_map(function ($wew) {
            return $wew->id_transaction_cert;
        }, $wew);

        $model = Ecertlhu::with([
            'ConditionCert',
            'status_pengujian',
            'transample.kontrakuji',
            'complaint'
            ])
        ->whereIn('id',$result);

        if(!empty($data['lhu_number'])){
            $model=$model->where(\DB::raw('UPPER(lhu_number)'),'like','%'.$data['lhu_number'].'%');
        }


        // if(!empty($data['marketing'])){
        //     $marketing = $data['marketing'];
        //     $model = $model->whereHas('transample',function($query) use ($marketing){
        //         return $query->whereHas('kontrakuji',function($q) use ($marketing){
        //             return $q->where(\DB::raw('UPPER(contract_no)'),'like','%'.$marketing.'%');
        //         });
        //     });
        // }

        if(!empty($data['sample'])){
            $model=$model->where(\DB::raw('UPPER(sample_name)'),'like','%'.$data['sample'].'%');
        }

        if(!empty($data['start_date'])){
            $model=$model->where(\DB::raw('date(tgl_input)'),'like','%'.date('Y-m-d',strtotime($data['start_date'])).'%');
        }

        return $model->paginate(25);
    }

    public function certificateDetail(Request $request, $id)
    {

        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');


        if(!empty($data['status'])){
            $m = DB::connection('mysqlcertificate')
            ->select('SELECT * FROM (
                SELECT * FROM (
            SELECT * FROM (
                SELECT b.* FROM condition_sample_cert b
                GROUP BY b.id
                ORDER BY b.id DESC ) AS zz
            GROUP BY zz.id_transaction_cert ) AS aa
            WHERE aa.status = '.  $data['status'].' ) ppp
        WHERE ppp.id_contract ='.  $data['marketing']);
        }else{
            $m = DB::connection('mysqlcertificate')
            ->select('SELECT * FROM (
                SELECT * FROM (
            SELECT * FROM (
                SELECT b.* FROM condition_sample_cert b
                GROUP BY b.id
                ORDER BY b.id DESC ) AS zz
            GROUP BY zz.id_transaction_cert ) AS aa
            WHERE aa.status = 3 OR aa.status = 4 ) ppp
        WHERE ppp.id_contract =' . $data['marketing']);
        }

        $result = array_map(function ($m) {
            return $m->id_transaction_cert;
        }, $m);


        $model = Ecertlhu::with(['ConditionCert', 'status_pengujian', 'TransactionSample.kontrakuji'])
        ->whereIn('id',$result);


        if(!empty($data['lhu_number'])){
            $model=$model->where(\DB::raw('UPPER(lhu_number)'),'like','%'.$data['lhu_number'].'%');
        }



        if(!empty($data['sample'])){
            $model=$model->where(\DB::raw('UPPER(sample_name)'),'like','%'.$data['sample'].'%');
        }

        if(!empty($data['sample_number'])){
            $model=$model->where(\DB::raw('UPPER(no_sample)'),'like','%'.$data['sample_number'].'%');
        }

        if(!empty($data['start_date'])){
            $model=$model->where(\DB::raw('date(tgl_input)'),'like','%'.date('Y-m-d',strtotime($data['start_date'])).'%');
        }

        return $model->paginate(25);
    }


    public function complain(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');


        $model = new Complain;
        $model->id_cert = $data['id_cert'];
        $model->id_transaction_sample =  $data['id_transaction_sample'];
        $model->subject =  $data['subject'];
        $model->type =  $data['type'];
        $model->typeadd =  $data['typeAdd'];
        $model->message =  $data['message'];
        $model->created_at = time::now();
        $model->status = 0;
        $model->select =  1;
        $model->save();

        $senddata = array(
            'data' => $data,
            'date' => time::now()
        );
        

        Mail::send('certificate/complain', $senddata, function($message) use($data) {
            $message->to($data['email_customer'])->subject('You have submitted a complaint');
            $message->cc('bachtiar.sig@saraswanti.com')->subject('You have submitted a complaint');
            $message->from('no-reply@sig-connect.com','No Reply SIG Connect');
        });

        Mail::send('certificate/complain', $senddata, function($message) use($data) {
            $message->to('cso.sig@saraswanti.com')->subject('You received a new complaint');
            $message->cc('bachtiar.sig@saraswanti.com')->subject('You received a new complaint');
            $message->from('no-reply@sig-connect.com','No Reply SIG Connect');
        });

        $data = array(
            'success'=>true,
            'message'=>'Data Success Submit'
        );

        return response()->json($data);
    }

    public function release(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');


        $model = new ConditionCert;
        $model->id_transaction_cert = $data['id_transaction_cert'];
        $model->id_contract = $data['id_contract'];
        $model->status = $data['status'];
        $model->user_id = $data['user_id'];
        $model->id_team = $data['id_team'];
        $model->cert_status = $data['cert_status'];
        $model->inserted_at = time::now();

        $kont = ConditionCert::where('id_transaction_cert', $data['id_transaction_cert'])->orderBy('inserted_at', 'desc')->first();

        $contract = DB::table('mstr_transaction_kontrakuji as a')
        ->leftjoin('mstr_customers_handle as b', 'b.idch', '=', 'a.id_customers_handle')
        ->leftjoin('mstr_customers_customer as c', 'c.id_customer', '=', 'b.id_customer')
        ->leftjoin('mstr_customers_contactperson as d', 'd.id_cp', '=', 'b.id_cp')
        ->where('a.id_kontrakuji', $data['id_contract'])
        ->select(
            'a.id_kontrakuji',
            'a.contract_no',
            'a.id_customers_handle',
            'b.idch',
            'b.email',
            'c.id_customer',
            'c.customer_name',
            'd.id_cp',
            'd.name',
            'a.hold')
        ->first();

        $cert = Ecertlhu::where('id', $data['id_transaction_cert'])->get();
        $senddata = array(
            'contract' => $contract,
            'cert' =>  $cert
        );

        Mail::send('certificate/release', $senddata, function($message) use($contract) {
            $message->to($contract->email, $contract->name)->subject('Status Certificate, '. $contract->contract_no . ' Self Release');
            $message->cc('admin.sig@saraswanti.com', 'Admin Sertifikat');
            $message->bcc('bachtiar.sig@saraswanti.com', 'Bachtiar Oktavian');
            $message->from('certificate@sig-connect.com','sig-connect');
        });

        $model->save();
        $data = array(
            'success'=>true,
            'message'=>'Data Success Relase'
        );
        return response()->json($data);

    }

    public function lhuComplain(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = ConditionCert::with([
            'transaction_sample_cert.TransactionSample.kontrakuji'
            ])->where('id_contract', $data['contractid'])
        ->groupBy('id_transaction_cert')
        ->get();
        return $model;
    }

    public function addComplainEmail(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $idsample = Ecertlhu::where('id', $data['id_lhu'])->first();
        $model = new Complain;
        $model->email = $data['email'];
        $model->id_cert = $data['id_lhu'];
        $model->id_transaction_sample =  $idsample->id_transaction_sample;
        $model->subject =  $data['subject'];
        $model->type =  $data['type'];
        $model->typeadd =  2;
        $model->message =  $data['message'];
        $model->created_at = time::now();
        $model->save();

       $senddata = array(
        'data' => $data,
        'date' => time::now()
    );

        Mail::send('certificate/complain', $senddata, function($message) use($data) {
            $message->to($data['email'])->subject('You have submitted a complaint');
            $message->cc('bachtiar.sig@saraswanti.com')->subject('You have submitted a complaint');
            $message->from('no-reply@sig-connect.com','No Reply SIG Connect');
        });

        Mail::send('certificate/complain', $senddata, function($message) use($data) {
            $message->to('cso.sig@saraswanti.com')->subject('You received a new complaint');
            $message->cc('bachtiar.sig@saraswanti.com')->subject('You received a new complaint');
            $message->from('no-reply@sig-connect.com','No Reply SIG Connect');
        });

        $data = array(
            'success'=>true,
            'message'=>'Data Success Relase'
        );
        return response()->json($data);
    }
}
