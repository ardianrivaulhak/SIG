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

class EcertSampleController extends Controller
{

    public function detailKontrak($id_kontrak)
    {

        $model = Kontrakuji::where('id_kontrakuji', $id_kontrak)->get();
        return $model;

    }

    public function sample(Request $request, $id_kontrak){

        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;

        $data = $request->input('data');


        $model = TransactionSample::with([
            'kontrakuji',
            'kontrakuji.customers_handle',
            'subcatalogue',
            'statuspengujian'
        ]);

        if(!empty($data['sample_number'])){
            $model=$model->where(\DB::raw('UPPER(no_sample)'),'like','%'.strtoupper($data['sample_number']).'%');
        }

        if(!empty($data['status'])){
            $model=$model->where('id_statuspengujian',$data['status']);
        }

        if(!empty($data['sample'])){
            $model=$model->where(\DB::raw('UPPER(sample_name)'),'like','%'.strtoupper($data['sample']).'%');
        }

        if(!empty($data['start_date'])){
            $model=$model->where(\DB::raw('UPPER(tgl_input)'),'like','%'.date('Y-m-d',strtotime($data['start_date'])).'%');
        }

        $model = $model->where('id_contract', $id_kontrak)->paginate(50);

        return response()->json($model);

    }
}
