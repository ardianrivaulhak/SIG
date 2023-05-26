<?php
namespace App\Http\Controllers\Products\Dioxine;
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
use Carbon\Carbon;
use App\Models\Products\Dioxine\DioxineUdara;
use App\Models\Products\Dioxine\TransactionDioxineUdara;
use App\Models\Products\Products;

class DioxineUdaraController extends Controller
{
    public function dioxineudara(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = DioxineUdara::paginate(25);
        return response()->json($model);
    }

    public function contractDioxineUdara(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $m = DB::select('
        SELECT * FROM (
            SELECT * FROM  
            product_condition p 
            WHERE p.category = 20
            GROUP BY p.id_product_condition
            ORDER BY p.id_product_condition DESC) AS awal
        GROUP BY awal.id_product_contract
        ');

        $result = array_map(function ($m) {
            return $m->id_product_contract;
        }, $m);

        $model = Products::with([
            'customers',
            'contactpersons',
            'address',
            'employee',
            'conditions',
            'productprice'])
            ->whereIn('id_product_contract', $result)
            ->paginate(25);

        return response()->json($model);
    }
}