<?php 
namespace App\Http\Controllers\Analysis;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Analysis\ConditionContractNew;
// use App\Models\Analysis\Kontrakuji;
use Firebase\JWT\JWT;
use DB;
use Carbon\Carbon as time;
use Auth;
class DashboardController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
    */

    public function summary_contract(Request $request)
    {   
        $sekarang = time::now();
        $format = time::parse($sekarang)->format('m');
        $g = $request->input("year").'-'.$request->input("month").'-01';
        $z = $request->input("year").'-'.$request->input("month").'-31';
        $checkLabInternal = 'SELECT 
        cv.id_kontrakuji 
        FROM mstr_customers_handle as xx 
        INNER JOIN mstr_transaction_kontrakuji as cv on cv.id_customers_handle = xx.idch 
        WHERE xx.id_customer IN (6392, 26659, 26351)';
        
        $var = \DB::table(\DB::raw('(SELECT 
        SUM(a.price) AS price, a.id_contract 
        FROM transaction_sample as a 
        WHERE month(a.tgl_input) = '.$request->input("month").'
        AND year(a.tgl_input) = '.$request->input("year").'
        GROUP BY a.id_contract) as DATA1'))
        ->select(
            'd.id',
            'd.title',
            \DB::raw('( SUM(DATA1.price) - pay.discount_lepas ) + CAST(IFNULL(akgtotal.totalakg,0) AS UNSIGNED) + CAST(IFNULL(samplingtotal.totalsampling,0) AS UNSIGNED) AS summary'),
            \DB::raw('COUNT(DATA1.id_contract) AS total_contract')
        )
        ->join('payment_contract as pay','pay.id_contract','DATA1.id_contract')
        ->join('mstr_transaction_kontrakuji as c','c.id_kontrakuji','DATA1.id_contract')
        ->join('mstr_products_contactcategory as d','d.id','c.id_contract_category')
        ->leftJoin(\DB::raw('(select sum(aa.total) as totalakg, aa.id_transaction_kontrakuji from transaction_akg_contract as aa group by aa.id_transaction_kontrakuji) as akgtotal'),'akgtotal.id_transaction_kontrakuji','DATA1.id_contract')
        ->leftJoin(\DB::raw('(select sum(aa.total) as totalsampling, aa.id_transaction_contract from transaction_sampling_contract as aa group by aa.id_transaction_contract) as samplingtotal'),'samplingtotal.id_transaction_contract','DATA1.id_contract')
        ->where('c.contract_type','<>',4)
        ->whereIn('id_kontrakuji',[\DB::raw('SELECT contract_id FROM condition_contracts a WHERE a.status = 1 AND a.position = 1 GROUP BY contract_id')])
        ->whereNotIn('DATA1.id_contract',[\DB::raw($checkLabInternal)])
        ->groupBy('c.id_contract_category')->get()->toArray();

        
        $rtu = \DB::table('product_price as a')
        ->whereBetween('a.created_at',[strval($g),strval($z)])
        ->select(
            \DB::raw('14 as id'),
            \DB::raw('"Media RTU" as title'),
            \DB::raw('SUM(a.total) as summary'),
            \DB::raw('COUNT(a.id_product_price) as total_contract')
        )
        ->get()->toArray();

        
        $merg = array_merge($var, $rtu);
        
    
    
        return response()->json($merg);
    }

    public function customeramount(Request $request){

        $var = \DB::table('condition_contracts as a')
        ->selectRaw('
            d.id_customer,
            d.customer_name,
            COUNT(d.id_customer) AS jumlah
        ')
        ->leftJoin('mstr_transaction_kontrakuji as b','b.id_kontrakuji','a.contract_id')
        ->leftJoin('mstr_customers_handle as c','c.idch','b.id_customers_handle')
        ->leftJoin('mstr_customers_customer as d','d.id_customer','c.id_customer')
        ->where('a.status',1)
        ->where(\DB::raw('MONTH(a.inserted_at)'),$request->input('month'))
        ->where(\DB::raw('YEAR(a.inserted_at)'),$request->input('year'))
        ->where('a.groups','CS')
        ->where('a.position',1)
        ->where('a.sample_id',0)
        ->where('a.parameter_id',0)
        ->where('b.status',1)
        ->orderBy(\DB::raw('COUNT(d.id_customer)'),'desc')
        ->groupBy('d.id_customer')->take(10)->get();

        return response()->json($var);
    }

    public function saletype(Request $request){
        $var = \DB::table('condition_contracts as a')
        ->selectRaw('
            SUM(IF(b.contract_type = 1,1,0)) AS Bogor,
            SUM(IF(b.contract_type = 2,1,0)) AS Jakarta,
            SUM(IF(b.contract_type = 3,1,0)) AS Package,
            SUM(IF(b.contract_type = 4,1,0)) AS Surabaya,
            SUM(IF(b.contract_type = 5,1,0)) AS Semarang,
            SUM(IF(b.contract_type = 6,1,0)) AS Yogyakarta
             ')
        ->leftJoin('mstr_transaction_kontrakuji as b','b.id_kontrakuji','a.contract_id')
        ->where('a.status',1)
        ->where('a.position',1)
        ->where('a.sample_id',0)
        ->where('a.parameter_id',0)
        ->where(\DB::raw('MONTH(a.inserted_at)'),$request->input('month'))
        ->where(\DB::raw('YEAR(a.inserted_at)'),$request->input('year'))
        ->get();
        return response()->json($var);
    }

    public function customerbehaviour(Request $request)
    {
        $model = \DB::table('condition_contracts as a')
        ->leftJoin('mstr_transaction_kontrakuji as b','b.id_kontrakuji','a.contract_id')
        ->leftJoin('mstr_customers_handle as c','c.idch','b.id_customers_handle')
        ->leftJoin('mstr_products_contactcategory as d','d.id','b.id_contract_category')
        ->leftJoin('mstr_customers_customer as e','e.id_customer','c.id_customer')
        ->where('a.status',1)
        ->where('b.status',1)
        ->where('a.groups','CS')
        ->where('a.position',1)
        ->where('a.sample_id',0)
        ->where('a.parameter_id',0)
        ->groupBy('e.id_customer')
        ->selectRaw('
            e.id_customer,
            e.customer_name,
            SUM(IF(d.id = 1,1,0)) AS R, 
            SUM(IF(d.id = 2,1,0)) AS F,
            SUM(IF(d.id = 3,1,0)) AS P,
            SUM(IF(d.id = 4,1,0)) AS OTS,
            SUM(IF(d.id = 13,1,0)) AS K,
            SUM(IF(d.id = 14,1,0)) AS LM,
            SUM(IF(d.id = 15,1,0)) AS KL,
            SUM(IF(d.id = 16,1,0)) AS AP,
            SUM(IF(d.id = 17,1,0)) AS E,
            SUM(IF(d.id = 18,1,0)) AS L
        ')
        ->get();
        return response()->json($model);
    }

    public function store(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');
        
        $model = new CustomerTaxAddress();

        $model->address = $data['address'];
        $model->desc = $data['desc'];
        $model->customer_id = $data['customer_id'];
        $model->insert_user = $id_user;
        $result = $model->save();

        if($result){
            $data = array(
                'success'   => true,
                'message'   => 'Success add contact'
            );
        }else{
            $data = array(
                'success'   => false,
                'message'   => 'Failed add contact'
            );
        }
        
        return response()->json($data);
    }

    public function update(Request $request, $id)
    {

        // return $request->all();
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');
        $model = CustomerTaxAddress::find($id);

        $model->address = $data['address'];
        $model->desc = $data['desc'];
        $model->customer_id = $data['customer_id'];
        $model->update_user = $id_user;
        $result =  $model->save();

        
        if($result){
            $data = array(
                'success'   => true,
                'message'   => 'Success update contact'
            );
        }else{
            $data = array(
                'success'   => false,
                'message'   => 'Failed update contact'
            );
        }
        
        return response()->json($data);

    }

    public function destroy(Request $request, $id)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        
        $model = CustomerTaxAddress::find($id);
        $model->delete_user = $id_user;
        $model->save();
        
        $delete = $model->delete();

        if($delete){
            $data = array(
                'success'   => true,
                'message'   => 'Data deleted'
            );
        }else{
            $data=array(
                'success'   => false,
                'message'   => 'Data failed to deleted'
            );
        }
        
        return response()->json($data);
    }


    public function total_transaction_perlab(Request $request){
        try {

            $var = \DB::table('transaction_parameter as a')
            ->select(\DB::raw('COUNT(a.id) as jumlah_parameter'))
            ->leftJoin('transcation_sample as b','b.id','a.id_sample')
            ->leftJoin('condition_contracts as c','c.parameter_id','a.id')
            ->where('a.id_lab',$request->input('idlab'))
            ->where('c.contract_id','<>',0)
            ->where('c.sample_id','<>',0)
            ->where('c.status',1)
            ->where('c.position',4)
            ->get();

            return response()->json($var);
        } catch (\Exception $e){
            return response()->json($e->getMessage());
        }
    }

    public function total_parameter_perlab(Request $request){
        try {

            $var = \DB::table('transaction_parameter as a')
            ->select('a.id_parameteruji', 'c.parameter_code', 'c.name_id', 'c.name_en',\DB::raw('COUNT(a.id) AS total'), 'a.id_lab')
            ->leftJoin('transaction_sample as b','b.id','a.id_sample')
            ->leftJoin('mstr_laboratories_parameteruji as c','c.id','a.id_parameteruji')
            ->leftJoin('condition_contracts as d','d.parameter_id','a.id')
            ->where('a.id_lab',$request->input('idlab'))
            ->where('d.contract_id','<>',0)
            ->where('d.sample_id','<>',0)
            ->where('d.status',1)
            ->where('d.position',4)
            ->groupBy('a.id_parameteruji')->get();

            return response()->json($var);
        } catch (\Exception $e){
            return response()->json($e->getMessage());
        }
    }


    public function jumlah_sample(Request $request){
        try{

            $var = \DB::table('transaction_parameter as a')
            ->select('a.id_sample',\DB::raw('COUNT(a.id) AS total'), 'a.id_lab')
            ->leftJoin('transaction_sample as b','b.id','a.id_sample')
            ->leftJoin('mstr_laboratories_parameteruji as c','c.id','a.id_parameteruji')
            ->leftJoin('condition_contracts as d','d.parameter_id','a.id')
            ->where('d.contract_id','<>',0)
            ->where('d.sample_id','<>',0)
            ->where('d.status',1)
            ->where('d.position',4)
            ->where('a.id_lab',$request->input('idlab'))
            ->groupBy('a.id_sample');

            $test = \DB::table(\DB::raw("({$var->toSql()}) as DATA1"))
                ->mergeBindings($var)
                ->selectRaw('
                    COUNT(DATA1.id_sample) AS total, DATA1.id_lab
                ')
                ->whereNotNull('DATA1.id_lab')
                ->groupBy('DATA1.id_lab')->get();

            return response()->json($test);
        } catch (\Exception $e){
            return response()->json($e->getMessage());
        }
    }

    public function jumlah_parameter(Request $request){
        try {

            $var = \DB::table('transaction_parameter as a')
            ->leftJoin('transaction_sample as b','b.id','a.id_sample')
            ->leftJoin('mstr_transaction_statuspengujian as c','c.id','b.id_statuspengujian')
            ->leftJoin('condition_contracts as d','d.parameter_id','a.id')
            ->select(\DB::raw('COUNT(a.id) AS total'), 'a.id_lab','c.name','d.status')
            ->where('d.contract_id','<>',0)
            ->where('d.sample_id','<>',0)
            ->where('d.status',1)
            ->where('d.position',4)
            ->where('a.id_lab',$request->input('idlab'))
            ->groupBy('a.id_lab')
            ->groupBy('b.id_statuspengujian')->get();

            return response()->json($var);

        } catch (\Exception $e){
            return response()->json($e->getMessage());
        }
    }

    public function jumlah_parametertype(Request $request){
        try {

            $var = \DB::table('transaction_parameter as a')
            ->select(\DB::raw('COUNT(c.id) as totalparametertype'))
            ->leftJoin('mstr_laboratories_parameteruji as b','b.id','a.id_parameteruji')
            ->leftJoin('mstr_laboratories_parametertype as c','c.id','b.mstr_laboratories_parametertype_id')
            ->leftJoin('condition_contracts as d','d.parameter_id','a.id')
            ->where('a.id_lab',$request->input('idlab'))
            ->where('d.contract_id','<>',0)
            ->where('d.sample_id','<>',0)
            ->where('d.status',1)
            ->where('d.position',4)->get();

            return response()->json($var);

        } catch (\Exception $e){
            return response()->json($e->getMessage());
        }
    }


    public function jumlah_sample_per_category(Request $request){
        try{

                $var = \DB::table('transaction_parameter as a')
                ->selectRaw('
                a.id_sample, c.id_kontrakuji, d.id, d.title
                ')
                ->leftJoin('transaction_sample as b','b.id','a.id_sample')
                ->leftJoin('mstr_transaction_kontrakuji as c','c.id_kontrakuji','b.id_contract')
                ->leftJoin('mstr_products_contactcategory as d','d.id','c.id_contract_category')
                ->leftJoin('condition_contracts as e','e.parameter_id','a.id')
                ->where('e.contract_id','<>',0)
                ->where('e.sample_id','<>',0)
                ->where('e.status',1)
                ->where('e.position',4)
                ->where('a.id_lab',$request->input('idlab'))->groupBy('b.id');

                $test = \DB::table(\DB::raw("({$var->toSql()}) as DATA1"))
                ->mergeBindings($var)
                ->selectRaw('
                    COUNT(DATA1.id) AS total, DATA1.title, DATA1.id
                ')
                ->whereNotNull('DATA1.id')
                ->groupBy('DATA1.id')->get();

            return response()->json($test);
        } catch (\Exception $e){
            return response()->json($e->getMessage());
        }
    }


    public function getdatasample(Request $request){
        try {

            $var = \DB::table('condition_contracts as a')
            ->selectRaw('
                a.parameter_id,
                b.id_sample,
                a.inserted_at,
                DATE_FORMAT(a.inserted_at, "%Y-%m-%d"),
                c.tgl_estimasi_lab,
                c.id_statuspengujian
            ')
            ->leftJoin('transaction_parameter as b','b.id','a.parameter_id')
            ->leftJoin('transaction_sample as c','c.id','b.id_sample')
            ->where('a.contract_id','<>',0)
            ->where('a.sample_id','<>',0)
            ->where('a.parameter_id','<>',0)
            ->where('a.position',4)
            ->where('a.status',1)
            ->where('b.id_lab',$request->input('idlab'))->groupBy('a.parameter_id');
            
            $var2 = \DB::table(\DB::raw("({$var->toSql()}) as DATA1"))
            ->mergeBindings($var)
            ->selectRaw('
            DATA1.id_statuspengujian,
            dd.name,
            DATA1.id_sample,
            COUNT(DATA1.id_sample) AS totalsample,
            sum(timestampdiff(day, DATE_FORMAT(DATA1.tgl_estimasi_lab, "%Y-%m-%d"), DATE_FORMAT(DATA1.inserted_at, "%Y-%m-%d"))) AS lamauji
            ')
            ->leftJoin('mstr_transaction_statuspengujian as dd','dd.id','DATA1.id_statuspengujian')
            ->whereNotNull('DATA1.id_sample')
            ->groupBy('DATA1.id_sample');

            $var3 = \DB::table(\DB::raw("({$var2->toSql()}) as DATA2"))
            ->mergeBindings($var2)
            ->selectRaw('
            DATA2.name,
            DATA2.totalsample,
            DATA4.total_parameter,
            TRUNCATE(AVG(DATA2.lamauji),2) as lamauji
            ')
            ->leftJoin(\DB::raw('(SELECT COUNT(DATA3.id) AS total_parameter, DATA3.id_sample FROM transaction_parameter DATA3 GROUP BY DATA3.id_sample) as DATA4'),'DATA4.id_sample','DATA2.id_sample')
            ->groupBy('DATA2.id_statuspengujian')->get();


            return response()->json($var3);

        } catch (\Exception $e){
            return response()->json($e->getMessage());
        }
    }

    public function report_lab_jumlah_parameter_sample(Request $request){
        try {

            $from = $request->input('from');
            $to = $request->input('to');

            $var = \DB::table(
                \DB::raw('(
                    SELECT
                    DATE_FORMAT(b.tgl_input, "%b-%Y") AS bulan,
                    MID(b.no_sample,5,1) AS kode_sample,
                    COUNT(a.id) AS jumlah_parameter,
                    (SELECT title FROM mstr_products_contactcategory WHERE id = c.id_contract_category ) AS contracttype
                    FROM transaction_parameter a
                    INNER JOIN transaction_sample b ON b.id = a.id_sample
                    INNER JOIN mstr_transaction_kontrakuji c ON c.id_kontrakuji = b.id_contract
                    WHERE DATE_FORMAT(b.tgl_input, "%Y-%m-%d") BETWEEN "'.$from.'" AND "'.$to.'"
                    GROUP BY MID(b.no_sample,5,1)
                    ) as DATA1'))
                ->select(
                    'DATA1.bulan',
                    'DATA1.kode_sample',
                    'DATA1.jumlah_parameter',
                    \DB::raw('COUNT(f.id) AS jumlah_sample'),
                    'DATA1.contracttype'
                )
                ->join('transaction_sample as f','DATA1.kode_sample',\DB::raw('MID(f.no_sample,5,1)'))
                ->whereBetween(\DB::raw('DATE_FORMAT(f.tgl_input,"%Y-%m-%d")'),[$from,$to])
                ->groupBy(\DB::raw('MID(f.no_sample,5,1)'))
                ->get();

                return response()->json($var);
        } catch (\Exception $e){
            return response()->json($e->getMessage());
        }
    }

}