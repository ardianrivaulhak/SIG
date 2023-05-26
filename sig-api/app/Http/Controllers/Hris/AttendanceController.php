<?php

namespace App\Http\Controllers\Hris;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Hris\Attendance;
use App\Models\Hris\Dayoff;
use App\Models\Hris\RulesAttendance;
use App\Models\Hris\Employee;
use Firebase\JWT\JWT;
use Illuminate\Support\Facades\Mail;

use Carbon\Carbon as time;

class AttendanceController extends Controller

{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function index(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $employee_id = Employee::where('user_id', $id_user)->first();
        $model = Attendance::with([
            'status_attendance',
            'status_attendance_plg',
            'rules_attendance',
            'employee',
            'employee.level',
            'employee.bagian',
        ])->where('id_employee', $employee_id->employee_id)->orderBy('tgl', 'desc')->take(8)->get();

        return response()->json($model);
    }

    public function rules_attendance(Request $request)
    {
        try {

            $var = RulesAttendance::select(
                'id',
                'name',
                \DB::raw('DATE_FORMAT(jam_masuk, "%H:%i") as jam_masuk'),
                \DB::raw('DATE_FORMAT(jam_keluar,"%H:%i") as jam_keluar')
            )->where('id', '<>', 1)->orderBy('urutan', 'asc')->get();

            return response()->json($var);
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function getAllAttendance(Request $request)
    {
        try {
            $model = Employee::with([
                'attendance' => function ($q) use ($request) {
                    if (!empty($request->input('from'))) {
                        return $q->whereIn(\DB::raw('DATE_FORMAT(tgl,"%Y-%m-%d")'), [$request->input('from'), $request->input('to')]);
                    } else {
                        return $q->where(\DB::raw('DATE_FORMAT(tgl,"%Y-%m-%d")'), $request->input('date'));
                    }
                },
                'attendance.status_attendance',
                'attendance.status_attendance_plg',
                'attendance.rules_attendance',
                'level',
                'bagian',
                'user'
            ])
                ->where('status', 1)
                ->orderBy('employee_name', 'asc');

            // if (!empty($request->input('from'))) {
            //     $g = Attendance::whereIn('tgl', [$request->input('from'), $request->input('to')])
            //     ->select('tgl')
            //     ->get()
            //     ->toArray();

            //     $model = $model->whereIn()
            // }

            $model = $model->get();
            return response()->json($model);
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function updateAttendance(Request $request)
    {

        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');
        // return $data;

        $addata = !empty($data['idattendance']) ? Attendance::find($data['idattendance']) : new Attendance;
        $addata->id_employee = $data['id_employee'];
        $addata->tgl = $data['start'];
        $addata->id_rules = 1;
        $addata->absen_masuk = $data['idattendance'] ? $addata->absen_masuk : $data['start'];
        $addata->absen_pulang = $data['idattendance'] ? $addata->absen_pulang : $data['start'];
        $addata->id_status = !empty(intval($data['status'])) ? intval($data['status']) : null;
        $addata->id_status_plg = !empty($data['status_plg']) ? intval($data['status_plg']) : null;
        $addata->desc = $data['desc'] ? $data['desc'] : NULL;
        $addata->save();

        return response()->json($data = array(
            'success' => true,
            'message' => 'Data Updated'
        ));
    }

    public function change_status_employee(Request $request)
    {
        try {
            // return $request->input('status');
            $var = Employee::find($request->input('employee_id'));
            $var->status = $request->input('status') == 1 ? 1 : 0;
            $var->save();
            return response()->json(array(
                "success" => true,
                "message" => "Changing Status Complete"
            ));
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function chart_attendance(Request $request)
    {
        try {

            $v = \DB::connection('mysqlhris')->table('hris_attendance as a')
                ->select(
                    \DB::raw('DATE_FORMAT(a.tgl, "%d/%m/%Y") as date'),
                    \DB::raw('(SELECT status_name FROM status_attendance WHERE id = a.id_status) as status'),
                    \DB::raw('COUNT(a.id_status) as total')
                )
                ->where('a.id_status', '<>', 0)
                ->where(\DB::raw('DATE_FORMAT(a.tgl,"%Y-%m-%d")'), '<>', '0000-00-00')
                ->where(\DB::raw('month(a.tgl)'), $request->input('month'))
                ->where(\DB::raw('year(a.tgl)'), $request->input('year'))
                ->where('a.id_status', 2)
                ->groupBy('a.tgl')
                ->orderBy('a.tgl', 'asc')
                ->get()->toArray();

            $fg = array(
                "name" => "Late (L)",
                "series" => []
            );

            foreach ($v as $c) {
                array_push($fg['series'], array(
                    "value" => $c->total,
                    "name" => $c->date
                ));
            }

            return response()->json($fg);
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function get_rekap_absen(Request $request)
    {
        try {

            // return $from;
            $from = '';
            $to = '';
            if (!empty($request->input('from'))) {
                $from = $request->input('from');
                $to = $request->input('to');
            } else {
                $from = $request->input('year') . '-' . $request->input('month') . '-01';
                $to = $request->input('year') . '-' . $request->input('month') . '-31';
            }

            $v = Attendance::with([
                'employee'
            ])
                ->selectRaw('
                hris_attendance.id_employee,
                hris_attendance.tgl,
                CAST(DATE_FORMAT(hris_attendance.tgl,"%d") as UNSIGNED) as id_date,
                hris_attendance.id_status,
                hris_attendance.id_status_plg,
                c.status_code as status_masuk,
                d.status_code as status_pulang,
                IF(d.status_code is null, c.status_code, CONCAT(c.status_code,",",d.status_code)) as status           
                ')
                ->leftJoin('rules_hour_attendance as b', 'b.id', 'hris_attendance.id_rules')
                ->leftJoin('status_attendance as c', 'c.id', 'hris_attendance.id_status')
                ->leftJoin('status_attendance as d', 'd.id', 'hris_attendance.id_status_plg')
                ->whereBetween('hris_attendance.tgl', [$from, $to])->get();

            return response()->json($v);
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function show(Request $request, $id)
    {
        $model = Attendance::with([
            'employee',
            'employee.level',
            'employee.bagian'
        ])->find($id);

        return response()->json($model);
    }

    public function add(Request $request)
    {

        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;

        $data = $request->input('data');
        $employee = Employee::where('user_id', $id_user)->first();
        $dateformattelat = RulesAttendance::find($data['idrulesattendance']);
        $tambahmenit = explode(":", $dateformattelat->jam_masuk)[1] + $dateformattelat->tolerance_time;
        $tambahtolerance = explode(":", $dateformattelat->jam_masuk)[0] . ":" . $tambahmenit . ":59";
        $datatelat = time::parse($tambahtolerance)->timestamp;


        $g = Attendance::where('id_employee', $employee->employee_id)->orderBy('tgl', 'desc')->first();

        if ($g) {
            $r = time::now()->timestamp;
            $set = time::parse($g->tgl)->timestamp;
            $u  = $r - $set;
            $v  = time::parse($u)->format('d');
            $bb = intval($v);

            if ($bb > 2) {
                for ($i = 1; $i < $bb; $i++) {
                    $hhh = time::parse($set)->addDay($i)->timestamp;
                    $formattanggalloop = time::parse($hhh)->format('Y-m-d');
                    $day = strtoupper(time::parse($hhh)->format('D'));

                    $ch = Attendance::where('tgl', $formattanggalloop)
                        ->where('id_employee', $employee->employee_id)
                        ->first();

                    if (!$ch) {
                        if ($day == 'SUN' || $day == 'SAT') {
                            $setDate = new Attendance;
                            $setDate->id_employee = $employee->employee_id;
                            $setDate->tgl = $formattanggalloop;
                            $setDate->id_rules = $data['idrulesattendance'];
                            $setDate->id_status = 8;
                            $setDate->id_status_plg = 8;
                            $setDate->desc = 'Day Off';
                            $setDate->save();
                        } else {

                            $u = Dayoff::where('date', $formattanggalloop)->where('status', 'L')->first();

                            $setDate = new Attendance;
                            $setDate->id_employee = $employee->employee_id;
                            $setDate->tgl = $formattanggalloop;
                            $setDate->id_rules = $data['idrulesattendance'];
                            if ($u) {
                                $setDate->id_status_plg = 8;
                                $setDate->id_status = 8;
                                $setDate->desc = 'Day off';
                            } else {
                                $z = Dayoff::where('date', $formattanggalloop)->where('status', 'C')->first();
                                if ($z) {
                                    $setDate->id_status = 13;
                                    $setDate->id_status_plg = 13;
                                    $setDate->desc = 'Cuti';
                                } else {
                                    $setDate->id_status = 10;
                                    $setDate->id_status_plg = 9;
                                    $setDate->desc = 'Alpha';
                                }
                            }

                            $setDate->save();
                        }
                    }
                }
                $tanggalsekarang = time::now()->format('Y-m-d');

                $checkedatabaseyesterday = Attendance::where('id_employee', $employee->employee_id)
                    ->where('tgl', $g->tgl)
                    ->first();

                if (is_null($checkedatabaseyesterday->absen_pulang) && $checkedatabaseyesterday->id_status !== 8) {
                    $seDate = Attendance::find($checkedatabaseyesterday->id);
                    $seDate->id_status_plg = 9;
                    $seDate->save();
                }
                $checkdatabasenow = Attendance::where('id_employee', $employee->employee_id)
                    ->where('tgl', $tanggalsekarang)
                    ->first();

                if ($checkdatabasenow) {
                    return response()->json($data = array(
                        'success' => false,
                        'message' => 'Data Duplicate',
                        'data' => $checkdatabasenow
                    ));
                } else {
                    $dateformattime = time::now()->format('H:i:s');
                    $timestamp = time::parse($dateformattime)->timestamp;
                    $addata = new Attendance;
                    $addata->id_employee = $employee->employee_id;
                    $addata->id_rules = $data['idrulesattendance'];
                    $addata->tgl = time::now()->format('Y-m-d');
                    $addata->absen_masuk = time::now()->format('Y-m-d H:i:s');
                    // (time::createFromTimestamp($datatelat)->format('Y-m-d H:i:s'));

                    if (($datatelat - $timestamp) < 0) {
                        $addata->id_status = 2;
                    } else {
                        $addata->id_status = 12;
                    }
                    $addata->save();

                    return response()->json($data = array(
                        'success' => true,
                        'message' => 'Data Saved',
                        'data' => $addata
                    ));
                }
            } else {
                $tanggalsekarang = time::parse($data['absen_masuk'])->format('Y-m-d');

                $checkedatabaseyesterday = Attendance::where('id_employee', $employee->employee_id)
                    ->orderBy('tgl', 'desc')
                    ->first();

                if (is_null($checkedatabaseyesterday->absen_pulang) && $checkedatabaseyesterday->id_status !== 8) {
                    $seDate = Attendance::find($checkedatabaseyesterday->id);
                    $seDate->id_status_plg = 9;
                    $seDate->save();
                }
                $checkdatabasenow = Attendance::where('id_employee', $employee->employee_id)
                    ->where('tgl', $tanggalsekarang)
                    ->first();

                if ($checkdatabasenow) {
                    return response()->json($data = array(
                        'success' => false,
                        'message' => 'Data Duplicate',
                        'data' => $checkdatabasenow
                    ));
                } else {
                    $dateformattime = time::now()->format('H:i:s');
                    $timestamp = time::parse($dateformattime)->timestamp;
                    $addata = new Attendance;
                    $addata->id_rules = $data['idrulesattendance'];
                    $addata->id_employee = $employee->employee_id;
                    $addata->tgl = time::now()->format('Y-m-d');
                    $addata->absen_masuk = time::now()->format('Y-m-d H:i:s');
                    // return (time::parse($datatelat)->format('Y-m-d H:i:s'));
                    if (($datatelat - $timestamp) < 0) {
                        $addata->id_status = 2;
                    } else {
                        $addata->id_status = 12;
                    }
                    $addata->save();

                    return response()->json($data = array(
                        'success' => true,
                        'message' => 'Data Saved',
                        'data' => $addata
                    ));
                }
            }
        } else {
            $dateformattime = time::now()->format('H:i:s');
            $timestamp = time::parse($dateformattime)->timestamp;
            $addata = new Attendance;
            $addata->id_rules = $data['idrulesattendance'];
            $addata->id_employee = $employee->employee_id;
            $addata->tgl = time::now()->format('Y-m-d');
            $addata->absen_masuk = time::now()->format('Y-m-d H:i:s');
            if (($datatelat - $timestamp) < 0) {
                $addata->id_status = 2;
            } else {
                $addata->id_status = 12;
            }
            $addata->save();

            return response()->json($data = array(
                'success' => true,
                'message' => 'Data Saved',
                'data' => $addata
            ));
        }
    }

    public function dayoff(Request $request)
    {
        try {

            $var = Dayoff::orderBy('date', 'asc')->get();

            return response()->json($var);
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function add_dayoff(Request $request)
    {
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;

            $data = $request->input('data');

            $var = !empty($data['id']) ? Dayoff::find($data['id']) : new Dayoff;
            $var->desc = $data['desc'];
            $var->status = $data['status'];
            $var->type = $data['type'];
            $var->date = $data['date'];
            $var->save();

            return response()->json(array(
                "status" => true,
                "message" => 'Add Success'
            ));
        } catch (\Exception $e) {
            return response()->json(array(
                "status" => false,
                "message" => 'Error at backend'
            ));
        }
    }

    public function delete_dayoff(Request $request, $id)
    {
        try {

            $v = Dayoff::find($id)->delete();

            return response()->json(array(
                "status" => true,
                "message" => 'Delete Success'
            ));
        } catch (\Exception $e) {
            return response()->json(array(
                "status" => false,
                "message" => 'Error at backend'
            ));
        }
    }

    public function checklistchangestatus(Request $request)
    {

        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;

        $data = $request->input('data');


        foreach ($data['data'] as $at) {
            $r = Attendance::find($at['id']);
            $r->id_rules = 2;
            $r->id_status = $at['status'];
            $r->id_status_plg = $at['status_plg'];
            $r->desc = $at['desc'];
            $r->save();
        }


        return response()->json(array(
            "status" => true,
            "message" => "Saving Success"
        ));
    }

    public function attendance_from_to(Request $request)
    {
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;

            $data = $request->input('data');


            $from = time::parse($data['from']);
            $to = time::parse($data['to']);

            $t = $to->diff($from)->format("%a");

            for ($i = 0; $i <= $t; $i++) {

                $year = $from->format('Y');
                $month = $from->format('m');
                $tglbaru = time::parse($from)->addDays($i)->format('Y-m-d');
                // $tglbaruNotStatic = time::parse($from)->addDays($i)->format('m-d');
                $dayBaru = strtoupper(time::parse($tglbaru)->format('D'));

                $att = Attendance::where('tgl', $tglbaru)->where('id_employee', $data['employee_id'])->first();

                $v = $att ? Attendance::find($att->id) : new Attendance;
                $v->tgl = $tglbaru;
                $v->id_employee = $data['employee_id'];
                $v->id_rules = $att ? $v->id_rules : 1;
                $v->absen_masuk = $tglbaru . ' 08:00:00';
                $v->absen_pulang = $tglbaru . ' 17:00:00';
                if ($dayBaru == 'SUN' || $dayBaru == 'SAT') {
                    $v->id_status = 8;
                    $v->id_status_plg = 8;
                    $v->desc = 'Day off';
                } else {
                    $u = Dayoff::where('date', $tglbaru)->whereIn('status', ['L', 'C'])->first();
                    if ($u) {
                        $v->id_status_plg = 8;
                        $v->id_status = 8;
                        $v->desc = 'Day off';
                    } else {
                        $v->id_status_plg = $data['status'] == 5 ? 9 : $data['status'];
                        $v->id_status = $data['status'] == 5 ? 10 : $data['status'];
                    }
                }

                $v->desc = !empty($data['desc']) ? $data['desc'] : null;
                $v->save();

                $checkdata = time::parse($tglbaru)->addDays(-1)->format('Y-m-d');
                $checkabsenkemarin = Attendance::where('tgl', $checkdata)->where('id_employee', $data['employee_id'])->first();
                if (is_null($checkabsenkemarin->absen_pulang)) {
                    $ta = Attendance::find($checkabsenkemarin->id);
                    $ta->id_status_plg = 9;
                    $ta->save();
                }
            }

            return response()->json(array(
                "success" => true,
                "message" => "Data Saved"
            ));
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function attendance_by_employee(Request $request)
    {
        try {

            $model = Attendance::with([
                'status_attendance',
                'status_attendance_plg',
                'rules_attendance',
                'employee',
                'employee.level',
                'attachment',
                'employee.bagian',
            ])->where('id_employee', $request->input('id_employee'))->orderBy('tgl', 'desc')->get();
            return response()->json($model);
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function setSaveDate($absen, $employee, $datatelat)
    {
        // return 'acascax';
        // $kurangsatutanggal = time::parse($absen)->addDay(-1)->format('Y-m-d');
        $tanggalsekarang = time::parse($absen)->format('Y-m-d');

        $checkedatabaseyesterday = Attendance::where('id_employee', $employee)
            ->orderBy('tgl', 'desc')
            ->first();

        if (is_null($checkedatabaseyesterday->absen_pulang) && $checkedatabaseyesterday->id_status !== 8) {
            // return 'bbbb';
            $seDate = Attendance::find($checkedatabaseyesterday->id);
            $seDate->id_status_plg = 9;
            $seDate->save();
        }
        // return 'ccc';
        $checkdatabasenow = Attendance::where('id_employee', $employee)
            ->where('tgl', $tanggalsekarang)
            ->first();

        if ($checkdatabasenow) {
            return response()->json($data = array(
                'success' => false,
                'message' => 'Data Duplicate',
                'data' => $checkdatabasenow
            ));
        } else {
            $dateformattime = time::parse($absen)->format('H:i:s');
            $timestamp = time::parse($dateformattime)->timestamp;
            $addata = new Attendance;
            $addata->id_rules = $data['idrulesattendance'];
            $addata->id_employee = $employee;
            $addata->tgl = time::parse($absen)->format('Y-m-d');
            $addata->absen_masuk = time::parse($absen)->format('Y-m-d H:i:s');
            if (($datatelat - $timestamp) < 0) {
                $addata->id_status = 2;
            } else {
                $addata->id_status = 12;
            }
            $addata->save();

            return response()->json($data = array(
                'success' => true,
                'message' => 'Data Saved',
                'data' => $addata
            ));
        }
    }

    public function get_time(Request $request)
    {
        try {
            $var = time::now();

            return response()->json($var);
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function tambahpulang(Request $request)
    {

        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');
        $employee = Employee::where('user_id', $id_user)->first();

        $dateformattelat = RulesAttendance::where('id', $data['idrulesattendance'])->first();

        $now = strtoupper(time::now()->format('D'));
        $tambah30 = date('Y-m-d H:i:s', strtotime('+30 minutes', strtotime($dateformattelat->jam_keluar)));

        $jampulang = time::parse($dateformattelat->jam_keluar);

        $datatelat = time::parse($jampulang)->timestamp;

        $g = Attendance::where('id_employee', $employee->employee_id)->orderBy('tgl', 'desc')->first();

        if ($g) {
            $r = time::now()->timestamp;
            $set = time::parse($g->tgl)->timestamp;
            $u  = $r - $set;
            $v  = time::parse($u)->format('d');
            $bb = intval($v);

            if ($bb > 2) {
                for ($i = 1; $i < $bb; $i++) {
                    $hhh = time::parse($set)->addDay($i)->timestamp;
                    $formattanggalloop = time::parse($hhh)->format('Y-m-d');
                    $day = strtoupper(time::parse($hhh)->format('D'));

                    $ch = Attendance::where('tgl', $formattanggalloop)
                        ->where('id_employee', $employee->employee_id)
                        ->first();

                    if (!$ch) {
                        if ($day == 'SUN' || $day == 'SAT') {
                            $setDate = new Attendance;
                            $setDate->id_employee = $employee->employee_id;
                            $setDate->tgl = $formattanggalloop;
                            $setDate->id_rules = $data['idrulesattendance'];
                            $setDate->id_status = 8;
                            $setDate->id_status_plg = 8;
                            $setDate->desc = 'Day Off';
                            $setDate->save();
                        } else {
                            $u = Dayoff::where('date', $formattanggalloop)->where('status', 'L')->first();

                            $setDate = new Attendance;
                            $setDate->id_employee = $employee->employee_id;
                            $setDate->tgl = $formattanggalloop;
                            $setDate->id_rules = $data['idrulesattendance'];
                            if ($u) {
                                $setDate->id_status_plg = 8;
                                $setDate->id_status = 8;
                                $setDate->desc = 'Day off';
                            } else {
                                $setDate->id_status = 10;
                                $setDate->id_status_plg = 9;
                                $setDate->desc = 'Alpha';
                            }

                            $setDate->save();
                        }
                    }
                }
                $tanggalsekarang = time::now()->format('Y-m-d');

                $checkedatabaseyesterday = Attendance::where('id_employee', $employee->employee_id)
                    ->where('tgl', $g->tgl)
                    ->first();

                if (is_null($checkedatabaseyesterday->absen_pulang) && $checkedatabaseyesterday->id_status !== 8) {
                    $seDate = Attendance::find($checkedatabaseyesterday->id);
                    $seDate->id_status_plg = 9;
                    $seDate->save();
                }
                $checkdatabasenow = Attendance::where('id_employee', $employee->employee_id)
                    ->where('tgl', $tanggalsekarang)
                    ->first();

                if ($checkdatabasenow) {
                    return response()->json($data = array(
                        'success' => false,
                        'message' => 'Data Duplicate',
                        'data' => $checkdatabasenow
                    ));
                } else {
                    $dateformattime = time::now()->format('H:i:s');
                    $timestamp = time::parse($dateformattime)->timestamp;
                    $addata = new Attendance;
                    $addata->id_employee = $employee->employee_id;
                    $addata->id_rules = $data['idrulesattendance'];
                    $addata->tgl = time::now()->format('Y-m-d');
                    $addata->absen_pulang = time::now()->format('Y-m-d H:i:s');
                    if (($timestamp - $datatelat) < 0) {
                        $addata->id_status_plg = 3;
                    } else {
                        $addata->id_status_plg = 12;
                    }
                    $addata->save();

                    // return 'b';
                    $checkabsenmasuk = Attendance::find($addata->id);
                    if (is_null($checkabsenmasuk->absen_masuk)) {
                        $checkabsenmasuk->id_status = 10;
                        $checkabsenmasuk->save();
                    }

                    return response()->json($data = array(
                        'success' => true,
                        'message' => 'Data Saved',
                        'data' => $addata
                    ));
                }
            } else {
                $tanggalsekarang = time::now()->format('Y-m-d');

                $checkedatabaseyesterday = Attendance::where('id_employee', $employee->employee_id)
                    ->orderBy('tgl', 'desc')
                    ->first();

                if (is_null($checkedatabaseyesterday->absen_pulang) && $checkedatabaseyesterday->id_status !== 8) {
                    $seDate = Attendance::find($checkedatabaseyesterday->id);
                    $seDate->id_status_plg = 9;
                    $seDate->save();
                }
                $checkdatabasenow = Attendance::where('id_employee', $employee->employee_id)
                    ->where('tgl', $tanggalsekarang)
                    ->first();

                if ($checkdatabasenow) {
                    return response()->json($data = array(
                        'success' => false,
                        'message' => 'Data Duplicate',
                        'data' => $checkdatabasenow
                    ));
                } else {
                    $dateformattime = time::now()->format('H:i:s');
                    $timestamp = time::parse($dateformattime)->timestamp;
                    $addata = new Attendance;
                    $addata->id_rules = $data['idrulesattendance'];
                    $addata->id_employee = $employee->employee_id;
                    $addata->tgl = time::now()->format('Y-m-d');
                    $addata->absen_pulang = time::now()->format('Y-m-d H:i:s');
                    if (($timestamp - $datatelat) < 0) {
                        $addata->id_status_plg = 3;
                    } else {
                        $addata->id_status_plg = 12;
                    }
                    $addata->save();
                    // return 'a';
                    $checkabsenmasuk = Attendance::find($addata->id);
                    if (is_null($checkabsenmasuk->absen_masuk)) {
                        $checkabsenmasuk->id_status = 10;
                        $checkabsenmasuk->save();
                    }

                    return response()->json($data = array(
                        'success' => true,
                        'message' => 'Data Saved',
                        'data' => $addata
                    ));
                }
            }
        } else {
            $dateformattime = time::now()->format('H:i:s');
            $timestamp = time::parse($dateformattime)->timestamp;
            $addata = new Attendance;
            $addata->id_rules = $data['idrulesattendance'];
            $addata->id_employee = $employee->employee_id;
            $addata->tgl = time::now()->format('Y-m-d');
            $addata->absen_pulang = time::now()->format('Y-m-d H:i:s');
            if (($timestamp - $datatelat) < 0) {
                $addata->id_status_plg = 3;
            } else {
                $addata->id_status_plg = 12;
            }
            $addata->save();
            // return 'c';
            $checkabsenmasuk = Attendance::find($addata->id);
            if (is_null($checkabsenmasuk->absen_masuk)) {
                $checkabsenmasuk->id_status = 10;
                $checkabsenmasuk->save();
            }

            return response()->json($data = array(
                'success' => true,
                'message' => 'Data Saved',
                'data' => $addata
            ));
        }
    }

    public function update(Request $request, $id)
    {

        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $employee_id = Employee::where('user_id', $id_user)->first();
        $checkdata = Attendance::find($id);
        $dateformattelat = RulesAttendance::where('id', $checkdata->id_rules)->first();
        $now = strtoupper(time::now()->format('D'));
        $tambah30 = date('Y-m-d H:i:s', strtotime('+30 minutes', strtotime($dateformattelat->jam_keluar)));

        $jampulang = time::parse($dateformattelat->jam_keluar);
        $datatelat = time::parse($jampulang)->timestamp;

        if ($checkdata) {
            if (!is_null($checkdata->absen_pulang)) {
                return response()->json($data = array(
                    'success' => false,
                    'message' => 'Data Duplicate',
                    'data' => $checkdata
                ));
            } else {

                $t = RulesAttendance::find($checkdata->id_rules);
                $dateformattime = time::now()->format('H:i:s');
                $timestamp = time::parse($dateformattime)->timestamp;

                $addata = Attendance::find($id);
                $addata->id_employee = $employee_id->employee_id;
                $addata->absen_pulang = time::now();
                if (($timestamp - $datatelat) < 0) {
                    $addata->id_status_plg = 3;
                } else {
                    $addata->id_status_plg = 12;
                }
                $addata->save();

                return response()->json($data = array(
                    'success' => true,
                    'message' => 'Data Updated'
                ));
            }
        } else {



            $dateformattime = time::now()->format('H:i:s');
            $timestamp = time::parse($dateformattime)->timestamp;

            $addata = new Attendance;
            $addata->id_employee = $employee_id->employee_id;
            $addata->id_status = 10;
            $addata->id_rules = $checkdata->id_rules;
            $addata->absen_pulang = time::now()->format('Y-m-d H:i:s');
            if (($timestamp - $datatelat) < 0) {
                $addata->id_status_plg = 3;
            } else {
                $addata->id_status_plg = 12;
            }
            $addata->save();
        }
    }

    public function monthlyreport(Request $request)
    {
        try {
            $var = \DB::table('hris_attendance as a')
                ->leftJoin('hris_employee as b', 'b.employee_id', 'a.id_employee')
                ->selectRaw("
            b.employee_name,
            SUM(if(DAY(a.tgl)=1,1,0)) AS satu,
            SUM(if(DAY(a.tgl)=2,1,0)) AS dua,
            SUM(if(DAY(a.tgl)=3,1,0)) AS tiga,
            SUM(if(DAY(a.tgl)=4,1,0)) AS empat,
            SUM(if(DAY(a.tgl)=5,1,0)) AS lima,
            SUM(if(DAY(a.tgl)=6,1,0)) AS enam,
            SUM(if(DAY(a.tgl)=7,1,0)) AS tujuh,
            SUM(if(DAY(a.tgl)=8,1,0)) AS delapan,
            SUM(if(DAY(a.tgl)=9,1,0)) AS sembilan,
            SUM(if(DAY(a.tgl)=10,1,0)) AS sepuluh,
            SUM(if(DAY(a.tgl)=11,1,0)) AS sebelas,
            SUM(if(DAY(a.tgl)=12,1,0)) AS duabelas,
            SUM(if(DAY(a.tgl)=13,1,0)) AS tigabelas,
            SUM(if(DAY(a.tgl)=14,1,0)) AS empatbelas,
            SUM(if(DAY(a.tgl)=15,1,0)) AS limabelas,
            SUM(if(DAY(a.tgl)=16,1,0)) AS enambelas,
            SUM(if(DAY(a.tgl)=17,1,0)) AS tujuhbelas,
            SUM(if(DAY(a.tgl)=18,1,0)) AS delapanbelas,
            SUM(if(DAY(a.tgl)=19,1,0)) AS sembilanbelas,
            SUM(if(DAY(a.tgl)=20,1,0)) AS duapuluh,
            SUM(if(DAY(a.tgl)=21,1,0)) AS duapuluhsatu,
            SUM(if(DAY(a.tgl)=22,1,0)) AS duapuluhdua,
            SUM(if(DAY(a.tgl)=23,1,0)) AS duapuluhtiga,
            SUM(if(DAY(a.tgl)=24,1,0)) AS duapuluhempat,
            SUM(if(DAY(a.tgl)=25,1,0)) AS duapuluhlima,
            SUM(if(DAY(a.tgl)=26,1,0)) AS duapuluhenam,
            SUM(if(DAY(a.tgl)=27,1,0)) AS duapuluhtujuh,
            SUM(if(DAY(a.tgl)=28,1,0)) AS duapuluhdelapan,
            SUM(if(DAY(a.tgl)=29,1,0)) AS duapuluhsembilan,
            SUM(if(DAY(a.tgl)=30,1,0)) AS tigapuluh,
            SUM(if(DAY(a.tgl)=31,1,0)) AS tigapuluhsatu
            ")
                ->whereBetween(\DB::raw("DATE_FORMAT(a.tgl, '%Y-%m-%d')"), ['2021-09-01', '2021-09-31'])
                ->where('a.id_employee', 295)
                ->groupBy('a.id_employee')->orderBy('b.employee_name', 'ASC')->get()->toArray();

            // let a = [];

            // foreach($var as $v){
            //     if($v->)
            // }

            return response()->json($var);
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function personalreport(Request $request)
    {
        try {
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $check = Employee::where('user_id', $id_user)->first();

            $var = \DB::connection('mysqlhris')->table('hris_attendance as a')
                ->select(
                    'a.id_employee',
                    'a.absen_masuk',
                    'a.absen_pulang',
                    'a.id_status',
                    'e.status_code',
                    'e.status_name',
                    'a.tgl',
                    'd.jam_masuk',
                    'd.worktime',
                    'd.tolerance_time',
                    'd.jam_keluar',
                    'f.status_code as status_code_plg',
                    'f.status_name as status_name_plg'
                )
                ->leftJoin('rules_hour_attendance as d', 'd.id', 'a.id_rules')
                ->leftJoin('status_attendance as e', 'e.id', 'a.id_status')
                ->leftJoin('status_attendance as f', 'f.id', 'a.id_status_plg')
                ->where(\DB::raw('MONTH(a.tgl)'), $request->input('month'))
                ->where(\DB::raw('YEAR(a.tgl)'), $request->input('year'))
                ->where('a.id_employee', $check->employee_id)
                ->get();

            return response()->json($var);
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function destroy($id)
    {
        $model = Attendance::find($id);
        $del = $model->delete();
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



    public function toptenlate(Request $request)
    {
        try {
            $var = Attendance::with([
                'employee.bagian'
            ])
                ->where('id_status', $request->input('statusattendance'))
                ->select(
                    'id_employee',
                    \DB::raw('COUNT(id_employee) as total'),
                    'id_status'
                )
                ->orderBy(\DB::raw('COUNT(id_employee)'), 'DESC')
                ->groupBy('id_employee');

            if ($request->input('from') !== 'all' && $request->input('to') !== 'all') {
                $var = $var->whereBetween(\DB::raw('DATE_FORMAT(tgl, "%Y-%m-%d")'), [$request->input('from'), $request->input('to')]);
            }

            $var = $var->get()->take(10);
            return response()->json($var);
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function late(Request $request)
    {
        try {
            $var = Attendance::with([
                'employee.bagian'
            ])
                ->where('id_status', 2)
                ->select(
                    'id_employee',
                    \DB::raw('COUNT(id_employee) as total_late')
                )
                ->orderBy(\DB::raw('COUNT(id_employee)'), 'DESC')
                ->groupBy('id_employee');


            if ($request->input('from') !== 'all' && $request->input('to') !== 'all') {
                $var = $var->whereBetween(\DB::raw('DATE_FORMAT(tgl, "%Y-%m-%d")'), [$request->input('from'), $request->input('to')]);
            }

            $var = $var->get();
            return response()->json($var);
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    public function totallate(Request $request)
    {
        try {

            $from = $request->input('from');
            $to = $request->input('to');

            $var = Attendance::whereBetween(\DB::raw('DATE_FORMAT(tgl, "%Y-%m-%d")'), [$from, $to])
                ->groupBy('id_status')
                ->select(
                    \DB::raw('(SELECT status_name from status_attendance WHERE id = hris_attendance.id_status ) AS status'),
                    \DB::raw('COUNT(id_status) AS total')
                )
                ->whereIn('id_status', [12, 2])
                ->get();

            return response()->json($var);
        } catch (\Exception $e) {
            return response(array(
                "status" => false,
                "message" => "cant get data from database, check your connection or call it"
            ));
        }
    }

    public function emailsend(Request $request)
    {
        try {
            $data = $request->input('data');


            $t = array(
                "html" => $data['html'],
                "employee" => "hihi"
            );

            Mail::send('attendanceformatemail', $t, function ($message) use ($t) {
                $message->bcc('herdinop.sig@saraswanti.com', 'Checker');
                $message->to('herdinop.sig@saraswanti.com')->subject('Dashboard Attendance');
                $message->from('herdinop.sig@saraswanti.com', 'Dummy Testing');
            });

            return 'p';
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }
    // public function chart_attendance(Request $request){
    //     try {

    //         $v = \DB::connection('mysqlhris')->table('hris_attendance as a')
    //         ->select(
    //             \DB::raw('DATE_FORMAT(a.tgl, "%d/%m/%Y") as date'),
    //             \DB::raw('(SELECT status_name FROM status_attendance WHERE id = a.id_status) as status'),
    //             \DB::raw('COUNT(a.id_status) as total')
    //         )
    //         ->where('a.id_status','<>',0)
    //         ->where(\DB::raw('DATE_FORMAT(a.tgl,"%Y-%m-%d")'),'<>','0000-00-00')
    //         ->where(\DB::raw('month(a.tgl)'),$request->input('month'))
    //         ->where(\DB::raw('year(a.tgl)'),$request->input('year'))
    //         ->where('a.id_status',2)
    //         ->groupBy('a.tgl')
    //         ->orderBy('a.tgl','asc')
    //         ->get()->toArray();

    //         $fg = array(
    //             "name" => "Late (L)",
    //             "series" => []
    //         );

    //         foreach($v as $c){
    //             array_push($fg['series'],array(
    //                 "value" => $c->total,
    //                 "name" => $c->date
    //             ));
    //         }

    //         return response()->json($fg);

    //     } catch (\Exception $e){
    //         return response()->json($e->getMessage());
    //     }
    // }
}
