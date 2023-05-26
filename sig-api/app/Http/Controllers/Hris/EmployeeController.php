<?php

namespace App\Http\Controllers\Hris;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Hris\Employee;
use App\Models\Hris\Employee_education;
use App\Models\Hris\Competence;
use App\Models\Hris\Employee_administration;
use App\Models\Hris\EmployementDetail;
use App\User;
use App\Models\Hris\Levelstatus;
use App\Models\Hris\StatusActive;
use App\Models\Hris\Statuskaryawan;

use Illuminate\Support\Facades\Hash;
use DB;
use Illuminate\Support\Facades\File;
use Firebase\JWT\JWT;
use Carbon\Carbon as time;
use Intervention\Image\ImageManagerStatic as Image;


class EmployeeController extends Controller
{
    public function index(Request $request)
    {

        // $e = Employee::where('user_id',$request-input('company'))->first();

        // return $request->all();
        $var = $request->input('datasend');
        // return $request->input('datasend')['pages'];
        $model = Employee::with(
            [

                'city',
                'user',
                'position',
                'level',
                'desc',
                'bagian',
                'dept',
                'subagian',
                'sistercompany'

            ]
        )
            // ->where('status',1)
            ->where('user_id', '<>', 309)
            ->where('status', 1)
            ->orderBy('employee_name', 'ASC');


        if (!empty($var['search'])) {
            $model = $model->where(DB::raw('UPPER(employee_name)'), 'like', '%' . strtoupper($var['search']) . '%')
                ->orWhereHas('user', function ($q) use ($var) {
                    return $q->where(DB::raw('UPPER(email)'), 'like', '%' . strtoupper($var['search']) . '%');
                });
        }
        if (!empty($var['level'])) {
            $model = $model->where('id_level', $var['level']);
        }
        if (!empty($var['status'])) {
            $model = $model->where('user_id', '<>', 0);
        }
        if (!empty($var['division'])) {
            $model = $model->where('id_bagian', $var['division']);
        }

        if (!empty($request->input('company'))) {
            if ($request->input('company') > 1) {
                $model = $model->where('id_company', $request->input('company'));
            }
        }


        if (!empty($var['employeestatus'])) {
            $model = $model->where('id_employee_status', $var['employeestatus']);
        }
        $model = $model->paginate(50);

        return response()->json($model);
    }

    public function sales_employee(Request $request)
    {
        $var = $request->input('datasend');

        $data = Employee::whereIn('id_bagian', [6, 11]);

        if (!empty($var['search'])) {
            $data = $data->where('employee_name', 'like', '%' . $var['search'] . '%');
        }

        $data = $data->get();

        return response()->json($data);
    }

    public function detailemployee(Request $request)
    {
        try {

            $var = EmployementDetail::with([
                'position',
                'dept',
                'desc',
                'bagian',
                'sistercompany',
                'subagian'
            ])
                ->where('employee_id', $request->input('employee_id'))
                ->orderBy('id', 'DESC')->get();

            return response()->json($var);
        } catch (\Exception $e) {

            return response()->json($e->getMessage());
        }
    }

    public function statusKaryawan(Request $request)
    {
        $var = Statuskaryawan::with([
            'employee_status',
            'level',
            'division',
            'position',
            'subdivision',
            'dept'
        ])->where('id_employee', $request->input('employee_id'))->get();
        return response()->json($var);
    }

    public function administrationKaryawan(Request $request)
    {
        $var = Employee_administration::with([
            'bank',
        ])->where('employee_id', $request->input('employee_id'))->get();
        return response()->json($var);
    }

    public function educationKaryawan(Request $request)
    {
        $var = Employee_education::where('id_employee', $request->input('employee_id'))
            ->get();

        return response()->json($var);
    }

    public function leveldet(Request $request)
    {

        $var = Levelstatus::with(['level'])
            ->where('employee_id', $request->input('employee_id'))
            ->orderBy('id', 'DESC')
            ->get();
        return response()->json($var);
    }

    public function leveldetDetail(Request $request)
    {

        $var = Levelstatus::with(['level'])
            ->find($request->input('id'));

        return response()->json($var);
    }

    public function statusDet(Request $request)
    {

        $var = Statuskaryawan::with(['employee_status'])
            ->where('id_employee', $request->input('employee_id'))
            ->orderBy('id', 'DESC')
            ->get();

        return response()->json($var);
    }

    public function statusDetDetail(Request $request)
    {

        $var = Statuskaryawan::with(['employee_status'])
            ->find($request->input('id'));

        return response()->json($var);
    }

    public function detailemployeehistory(Request $request)
    {

        $var = Statuskaryawan::with([
            'employee_status',
            'level',
            'division',
            'position',
            'subdivision',
            'dept'
        ])->find($request->input('id'));

        return response()->json($var);
    }

    public function detailAdministrationHistory(Request $request)
    {

        $var = Employee_administration::with([
            'bank'
        ])->find($request->input('id'));

        return response()->json($var);
    }

    public function detaileducationhistory(Request $request)
    {

        $var = Employee_education::find($request->input('id'));

        return response()->json($var);
    }

    public function positionDet(Request $request)
    {

        $var = EmployementDetail::with([
            'subagian',
            'dept',
            'bagian',
            'level',
            'position'
        ])->where('id_employee', $request->input('employee_id'))
            ->get();

        return response()->json($var);
    }

    public function addLevel(Request $request)
    {

        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $var = $data['st'] === 'new' ? new Levelstatus : Levelstatus::find($data['st']);
        $var->employee_id = $data['employee_id'];
        $var->id_level = $data['level'];
        $var->from = $data['from'];
        $var->to = $data['to'];
        $var->desc = $data['desc'];
        $var->save();

        return response()->json(array(
            "message" => "Success",
            "status" => true
        ));
    }

    public function addStatus(Request $request)
    {

        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        // return $va = Statuskaryawan::all();

        $va = $data['st'] === 'add' ? new Statuskaryawan : Statuskaryawan::find($data['st']);
        $va->id_employee = $data['employee_id'];
        $va->status_karyawan = intval($data['statusp']);
        $va->from = $data['from'];
        $va->to = $data['to'];
        $va->id_dept = $data['dept'];
        $va->id_div = $data['division'];
        $va->id_subdiv = $data['subdiv'];
        $va->id_level = $data['level'];
        $va->id_position = $data['position'];
        $va->desc = $data['desc'];
        $va->save();

        // return 'b';

        if ($va->status_karyawan !== 4 && is_null($va->to)) {
            $g = Employee::find($va->id_employee);
            $g->id_bagian = $va->id_div;
            $g->id_departement = $va->id_dept;
            $g->id_sub_bagian = $va->id_subdiv;
            $g->id_level = $va->id_level;
            $g->id_position = $va->id_position;
            $g->updated_at = time::now();
            $g->update_user = $id_user;
            $g->save();
        };

        if ($va->status_karyawan == 4 && is_null($va->to)) {
            $g = Employee::find($va->id_employee);
            $g->status = 0;
            $g->updated_at = time::now();
            $g->update_user = $id_user;
            $g->save();
        };


        return response()->json(array(
            "message" => "Success",
            "status" => true
        ));
    }

    public function getExportData(Request $request)
    {
        $from = $request->input('from');
        $to = $request->input('to');
        $type = $request->input('type');

        $ds = \DB::connection('mysqlhris')->table('hris_status_active')
            ->select('employee_id')
            ->whereBetween('from', [$from, $to])
            ->get();

        if ($type == 'stkaryawan' || $type == 'prbadikaryawan') {
            $d = Employee::with([
                'dept',
                'bagian',
                'subagian',
                'position',
                'level',
                'city'
            ])->where('status', 1)->get();
            // ->whereIn('employee_id',$ds)->get();
            return response()->json($d);
        } else if ($type == 'administrasikaryawan') {

            $ra = Employee::where('status', 1)->get()->toArray();
            $data = [];
            foreach ($ra as $v) {
                $t = Employee_administration::with([
                    'bank',
                    'employee'
                ])
                    ->selectRaw('
                        hris_administration.employee_id,
                        (SELECT a.value FROM hris_administration as a WHERE a.employee_id = hris_administration.employee_id AND a.type = 0 ) ktp,
                        (SELECT a.value FROM hris_administration as a WHERE a.employee_id = hris_administration.employee_id AND a.type = 1 ) npwp,
                        (SELECT a.value FROM hris_administration as a WHERE a.employee_id = hris_administration.employee_id AND a.type = 4 AND id_bank = 3 ) mandiri,
                        (SELECT a.value FROM hris_administration as a WHERE a.employee_id = hris_administration.employee_id AND a.type = 4 AND id_bank = 136 ) cimb,
                        (SELECT a.value FROM hris_administration as a WHERE a.employee_id = hris_administration.employee_id AND a.type = 2 ) jamsostek,
                        (SELECT a.value FROM hris_administration as a WHERE a.employee_id = hris_administration.employee_id AND a.type = 3 ) bpjs
                ')
                    ->where('hris_administration.employee_id', $v->employee_id)
                    ->groupBy('hris_administration.employee_id')
                    ->first();

                    array_push($data,array(
                        "nik" => $v->nik,
                        "employee_name" => $v->employee_name,
                        "ktp" => $t->ktp,
                        "npwp" => $t->npwp,
                        "mandiri" => $t->mandiri,
                        "cimb" => $t->cimb,
                        "jamsostek" => $t->jamsostek,
                        "bpjs" => $t->bpjs
                    ));
            }



            return response()->json($t);
        } else {

            $d = Employee::with([
                'dept',
                'bagian',
                'subagian',
                'position',
                'level',
                'city'
            ])->where('status', 1)->get();


            $data = [];
            foreach ($d as $v) {
                // return $v;
                $t = Employee_administration::with([
                    'bank',
                    'employee'
                ])
                    ->selectRaw('
                        hris_administration.employee_id,
                        (SELECT a.value FROM hris_administration as a WHERE a.employee_id = hris_administration.employee_id AND a.type = 0 ) ktp,
                        (SELECT a.value FROM hris_administration as a WHERE a.employee_id = hris_administration.employee_id AND a.type = 1 ) npwp,
                        (SELECT a.value FROM hris_administration as a WHERE a.employee_id = hris_administration.employee_id AND a.type = 4 AND id_bank = 3 ) mandiri,
                        (SELECT a.value FROM hris_administration as a WHERE a.employee_id = hris_administration.employee_id AND a.type = 4 AND id_bank = 136 ) cimb,
                        (SELECT a.value FROM hris_administration as a WHERE a.employee_id = hris_administration.employee_id AND a.type = 2 ) jamsostek,
                        (SELECT a.value FROM hris_administration as a WHERE a.employee_id = hris_administration.employee_id AND a.type = 3 ) bpjs
                ')
                    ->where('hris_administration.employee_id', $v->employee_id)
                    ->groupBy('hris_administration.employee_id')
                    ->first();

                    array_push($data,array(
                        "nik" => $v->nik,
                        "employee_name" => $v->employee_name,
                        "ktp" => $t ? $t->ktp : '-',
                        "npwp" => $t ? $t->npwp : '-',
                        "mandiri" => $t ? $t->mandiri : '-',
                        "cimb" => $t ? $t->cimb : '-',
                        "jamsostek" => $t ? $t->jamsostek : '-',
                        "bpjs" => $t ? $t->bpjs : '-'
                    ));
            }

            return response()->json(array(
                array(
                    "data" => array(
                        "data1" => $d,
                        "data2" => $data
                    )
                )
            ));
        }
    }

    public function addEducationHistory(Request $request)
    {

        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $va = $data['st'] === 'add' ? new Employee_education : Employee_education::find($data['st']);
        $va->id_employee = $data['employee_id'];
        $va->education_id = intval($data['education']);
        $va->instansi = $data['instansi'];
        $va->jurusan = $data['major'];
        $va->tgl_masuk = $data['from'];
        $va->tgl_keluar = $data['to'];
        $va->desc = $data['desc'];
        $va->save();


        return response()->json(array(
            "message" => "Success",
            "status" => true
        ));
    }

    public function addAdministrationHistory(Request $request)
    {

        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $va = $data['st'] === 'add' ? new Employee_administration : Employee_administration::find($data['st']);
        $va->employee_id = $data['employee_id'];
        $va->type = $data['type'];
        $va->id_bank = $data['id_bank'];
        $va->value = $data['value'];
        $va->desc = $data['desc'];
        $va->save();


        return response()->json(array(
            "message" => "Success",
            "status" => true
        ));
    }

    public function delete_level_history(Request $request, $id)
    {


        $var = Levelstatus::find($id)->forceDelete();

        return response()->json(array(
            "message" => "Success",
            "status" => true
        ));
    }

    public function delete_status_history(Request $request, $id)
    {


        $va = Statuskaryawan::find($id)->forceDelete();

        return response()->json(array(
            "message" => "Success",
            "status" => true
        ));
    }

    public function saving_det_employement(Request $request)
    {
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            $var = $data['id_empl_det'] === 'new' ? new EmployementDetail : EmployementDetail::find($data['id_empl_det']);
            $var->id_div = $data['division'];
            $var->id_pos = $data['position'];
            $var->id_subdiv = $data['subdiv'];
            $var->id_dept = $data['dept'];
            $var->from = $data['from'];
            $var->to = $data['to'] == 'Invalid date' ? NULL : $data['to'];
            $var->employee_id = $data['employee_id'];
            $var->desc = $data['desc'];
            $var->save();

            return response()->json(array(
                "status" => true,
                "message" => "Success Adding Data"
            ));
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function show_det_employement(Request $request, $id)
    {
        try {
            $var = EmployementDetail::with([
                'level',
                'position',
                'dept',
                'bagian',
                'subagian'
            ])
                ->find($id);

            return response()->json($var);
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }


    public function delete_det_employement(Request $request, $id)
    {
        try {
            $var = Statuskaryawan::find($id)->Delete();

            return response()->json(array(
                "status" => true,
                "message" => "Data Deleted !"
            ));
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }


    public function delete_education_history(Request $request, $id)
    {
        try {
            $var = Employee_education::find($id)->Delete();

            return response()->json(array(
                "status" => true,
                "message" => "Data Deleted !"
            ));
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function delete_administration_history(Request $request, $id)
    {
        try {
            $var = Employee_administration::find($id)->Delete();

            return response()->json(array(
                "status" => true,
                "message" => "Data Deleted !"
            ));
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }



    public function show(Request $request, $id)
    {
        $model = Employee::with(
            [
                'user',
                'city',
                'sistercompany',
                'desc',
                'position'
            ]
        )->find($id);

        return response()->json($model);
    }


    public function store(Request $request)
    {
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input("data");

            $tglsekarang = time::now()->format('Y-m');

            $check = \DB::table('hris_employee as a')->select(\DB::raw('count(a.employee_id) as total'))
                ->whereBetween(\DB::raw('DATE_FORMAT(a.tgl_masuk,"%Y-%m-%d")'), [$tglsekarang . '-01', $tglsekarang . '-31'])
                ->first();

            $nextdigit = $check->total + 1;

            $firstdigit = intval($data['status_karyawan']) == 0 ? "HON" : "SIG";
            $digityears = substr(time::parse($data['tgl_lahir'])->format('Y'), 2);
            $digitmonth = strval(time::parse($data['tgl_masuk'])->format('m'));
            $digityearm = substr(time::parse($data['tgl_masuk'])->format('Y'), 2);



            $h = !empty($data['employee_id']) ? Employee::find($data['employee_id']) : new Employee;
            $h->nik                 = !empty($data['employee_id']) ? $h->nik : $firstdigit . '-' . $digityears . '' . $digitmonth . '' . $digityearm . '' . $this->leftPad($nextdigit, 4);
            $h->employee_name       = $data['employee_name'];
            $h->phone               = $data['phone'];
            $h->gender              = $data['gender'];
            $h->tempat_lahir        = intVal($data['tempatlahir']);
            $h->tgl_lahir           = time::parse($data['tgl_lahir'])->format('Y-m-d');
            $h->martial_status      = $data['martial_status'];
            $h->id_company          = $data['company_name'];
            $h->religion            = $data['religion'];
            $h->id_employee_status  = $data['status_karyawan'];

            if (!empty($data['photo'])) {
                if(!str_contains($data['photo'],'http')){
                    $foldername = 'assets/img/user';

                    if (!File::exists($foldername)) {
                        File::makeDirectory($foldername);
                    }
    
                    $zattachment = Image::make($data['photo']);
                    $zattachment->resize(null, 300, function ($constraint) {
                        $constraint->aspectRatio();
                    });
    
                    $pathname = strpos($data["employee_name"], " ") ? str_replace(" ", "", strtolower($data["employee_name"])).'.jpeg' : strtolower($data["employee_name"]) . '.jpeg';
                    $zattachment->save(public_path($foldername . '/' . $pathname));
    
                    $h->photo = $pathname;
                }
              
            }

            $h->alamat       = $data['alamat'];
            // $h->pendidikan   = intval($data['pendidikan']);
            // $h->jurusan      = $data['jurusan'];
            $h->status_pajak = intval($data['status_pajak']);
            $h->tgl_masuk    = time::parse($data['tgl_masuk'])->format('Y-m-d');
            $h->telp         = !empty($data['telp']) ? $data['telp'] : null;
            $h->phone2       = $data['phone2'];
            // $h->city         = $data['kota'];
            $h->status       = 1;

            if (!empty($data['email'])) {

                $usercheck = User::where('email', trim($data['email']))->first();

                if (empty($usercheck)) {
                    $test = new User;
                    $test->email = $data['email'];
                    $test->password = Hash::make('saraswanti');
                    $test->save();
                    $h->user_id = $test->id;
                } else {
                    $h->user_id = $usercheck->id;
                }
            }
            $h->save();

            return response()->json(array(
                "status" => true,
                "message" => "Saving Success",
                "data" => $h,
                "email" => User::where('id', $h->user_id)->select('email')->first()
            ));
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function update(Request $request, $id)
    {
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');


            $h = Employee::find($id);
            $h->nik = $data['nik'];
            $h->employee_name = $data['employee_name'];
            $h->id_level = intval($data['level']);
            $h->id_bagian = intval($data['division']);
            $h->alamat = $data['alamat'];
            $h->id_employee_status = intval($data['employee_status']);
            $h->id_departement = !empty($data['dept']) ? intval($data['dept']) : null;
            $h->gender = $data['gender'];
            $h->martial_status = $data['martial_status'];
            $h->phone = $data['phone'];
            $h->religion = $data['religion'];
            $h->id_sub_bagian = intval($data['subdiv']);
            $h->tempat_lahir = !empty($data['tempatlahir']) ? intval($data['tempatlahir']) : null;
            $h->tgl_lahir = explode("T", $data['tgl_lahir'])[0];
            $h->status = 1;
            if (!empty($data['photo'])) {
                if (strpos($data['photo'], "://") == false) {
                    // return 'as';


                    $foldername = 'assets/img/user';

                    if (!File::exists($foldername)) {
                        File::makeDirectory($foldername);
                    }

                    $pathname = strpos($data["employee_name"], " ") ? str_replace(" ", "", strtolower($data["employee_name"])) . '.jpeg' : strtolower($data["employee_name"]) . '.jpeg';

                    if (File::exists(public_path($foldername . '/' . $pathname))) {
                        File::delete(public_path($foldername . '/' . $pathname));
                        $zattachment = Image::make($data['photo']);
                        $zattachment->resize(null, 300, function ($constraint) {
                            $constraint->aspectRatio();
                        })->save(public_path($foldername . '/' . $pathname));

                        $h->photo = $pathname;
                    } else {
                        $zattachment = Image::make($data['photo']);
                        $zattachment->resize(null, 300, function ($constraint) {
                            $constraint->aspectRatio();
                        })->save(public_path($foldername . '/' . $pathname));

                        $h->photo = $pathname;
                    }
                }
            }
            if (!empty($data['email'])) {
                $check = \DB::table('hris_employee as a')
                    ->leftJoin('users as b', 'b.id', 'a.user_id')
                    ->where('a.employee_id', $id)
                    ->first();

                if ($check->email == $data['email']) {
                    $set = User::find($check->id);
                    $set->email = $data['email'];
                    $set->save();
                } else {
                    $test = new User;
                    $test->email = $data['email'];
                    $test->password = Hash::make('saraswanti');
                    $test->save();
                    $h->user_id = $test->id;
                }
            }
            $h->save();

            return response()->json(array(
                "success" => true,
                "message" => "update success"
            ));
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function destroy($id)
    {
        $model = Employee::find($id);
        $user = User::find($model->user_id);

        $del = $model->delete();
        $deluser = $user->delete();

        if ($del) {
            $data = array(
                'success' => true,
                'message' => 'Data deleted'
            );
        } else {
            $data = array(
                'success' => false,
                'message' => 'Data failed to deleted'
            );
        }
        return response()->json($data);
    }

    public function experience(Request $request, $id_employee)
    {
        $var = \DB::table('hris_experience as a')
            ->selectRaw('a.id_exp, a.id_employee, a.tahun_masuk, a.tahun_keluar, c.level_name, d.position_name')
            ->leftJoin('hris_employee as b', 'b.employee_id', 'a.id_employee')
            ->leftJoin('hris_level as c', 'c.id_level', 'a.id_level')
            ->leftJoin('hris_position as d', 'd.id_position', 'a.id_position')
            ->where('a.id_employee', $id_employee)->get();

        return response()->json($var);
    }


    public function setActiveEmployee(Request $request)
    {
        // try {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');


        $v = Employee::find($data['employee_id']);
        $v->status = $data['st'];
        $v->save();



        $g = StatusActive::where('employee_id', $data['employee_id'])->where('status', $data['st'])->first();

        $b = $g ? StatusActive::find($g->id) : new StatusActive;
        $b->employee_id = $data['employee_id'];
        $b->from = $data['from'];
        $b->status = $data['st'];
        $b->desc = $data['desc'];
        $b->created_at = time::now();
        $b->insert_user = $id_user;
        $b->save();

        return response()->json(array(
            "status" => true,
            "message" => 'Saving success !'
        ));
        // } catch (\Exception $e) {
        //     return response()->json(array(
        //         "status" => false,
        //         "message" => "Saving Error"
        //     ));
        // }
    }

    public function updateActiveEmployee(Request $request, $id)
    {
        // try {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');


        $v = Employee::find($data['employee_id']);
        $v->status = $data['st'];
        $v->save();



        $g = StatusActive::where('employee_id', $data['employee_id'])->where('status', $data['st'])->first();

        $b = $g ? StatusActive::find($g->id) : new StatusActive;
        $b->employee_id = $data['employee_id'];
        $b->from = $data['from'];
        $b->status = $data['st'];
        $b->desc = $data['desc'];
        $b->created_at = time::now();
        $b->insert_user = $id_user;
        $b->save();

        return response()->json(array(
            "status" => true,
            "message" => 'Saving success !'
        ));
        // } catch (\Exception $e) {
        //     return response()->json(array(
        //         "status" => false,
        //         "message" => "Saving Error"
        //     ));
        // }
    }

    public function statusactive(Request $request)
    {
        $var = StatusActive::where('employee_id', $request->input('employee_id'))
            ->get();

        return response()->json($var);
    }




    public function education(Request $request, $id)
    {
        $var = Employee_education::where('id_employee', $id)->get();
        return response()->json($var);
    }

    public function competence(Request $request, $id)
    {
        $var = Competence::with([
            'pengujian',
            'parameter',
            'info_penguji'
        ])->where('id_employee', $id)->get();
        return response()->json($var);
    }

    private function leftPad($number, $targetLength)
    {
        $output = strlen((string) $number);
        $selisih = intval($targetLength) - intval($output);
        $nol = '';
        for ($i = 0; $i < $selisih; $i++) {
            $nol .= '0';
        }
        $nol .= strval($number);
        return $nol;
    }
}
