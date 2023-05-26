<?php
namespace App\Http\Controllers\Document;
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
use App\Models\Master\TransactionTeam;
use App\Models\Hris\Employee;
use DB;
use Auth;
use Firebase\JWT\JWT;
use Carbon\Carbon as time;
// use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Intervention\Image\ImageManagerStatic as Image;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;
use SimpleSoftwareIO\QrCode\Facade as QrCode;

class ManualCertController extends Controller
{
    private function url()
    {
        $ur = 'https://siglab.my.id/';
        return $ur;
    }

    public function manual($idlhu)
    {        
        \Barryvdh\DomPDF\Facade\Pdf::setOptions(['isPhpEnabled' => true]);
        $model = Ecertlhu::with(
            'TransactionSample',
            'TransactionSample.kontrakuji',
            'parameters',
            'ConditionCert',
            'format',
            'customer',
            'contact_person',
            'address',
            'employee_sampling',
            'manual'
        )
        ->where('id', $idlhu)->first();
        $qrcode = base64_encode(\SimpleSoftwareIO\QrCode\Facades\QrCode::format('svg')->size(200)->errorCorrection('H')->generate($this->url() . 'manual/n/' . $idlhu));

        $data = [
           'sertifikat' => json_decode($model, true),
           'qr' =>  $qrcode
        ];

        $pdf = Pdf::loadView('document.manual', $data);
        return $pdf->stream('invoice.pdf');
    }

    public function manualmd($idlhu)
    {        
        \Barryvdh\DomPDF\Facade\Pdf::setOptions(['isPhpEnabled' => true]);
        $model = Ecertlhu::with(
            'TransactionSample',
            'TransactionSample.kontrakuji',
            'parameters',
            'ConditionCert',
            'format',
            'customer',
            'contact_person',
            'address',
            'employee_sampling',
            'manual'
        )
        ->where('id', $idlhu)->first();
        $qrcode = base64_encode(\SimpleSoftwareIO\QrCode\Facades\QrCode::format('svg')->size(200)->errorCorrection('H')->generate($this->url() . 'manual/o/' . $idlhu));

        $data = [
           'sertifikat' => json_decode($model, true),
           'qr' =>  $qrcode
        ];

        $pdf = Pdf::loadView('document.manualmd', $data);
        return $pdf->stream('invoice.pdf');
    }
}