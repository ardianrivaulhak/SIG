<?php
namespace App\Http\Controllers\Complain;
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
use App\Models\Master\TransactionTeam;
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
use App\Models\Ecert\Complain;
use App\Models\Complain\Nontechnical;

class NontechnicalController extends Controller
{
    public function index(Request $request)
    {   
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = Nontechnical::with([
            'division',
            'complain_data',
            'complain_data.TransactionSample',
            'complain_data.TransactionSample.kontrakuji',
            'complain_data.TransactionSample.kontrakuji.customers_handle.customers',
            'complain_data.TransactionCertificate',
            'penerima_complain',
            'user_fu'
            ])->paginate(25);

        return $model;
    }

    public function selectComplaint(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = Nontechnical::where('id', $data['id'])->first();
        $model->status = $data['status'];
        $model->perbaikan = $data['repair'];
        $model->user_fu = $id_user;
        $model->save();

        if($data['status'] == 1){
            $chechStat = Complain::where('id', $data['id_complaint'])->first();
            $chechStat->status = 2;
            $chechStat->save();
        }else{
            $chechStat = Complain::where('id', $data['id_complaint'])->first();
            $chechStat->status = 1;
            $chechStat->save();
        }
        

        $data=array(
            'success'=>true,
            'message'=>'Upload Success'
        );
        return response()->json($data);

    }

  
}