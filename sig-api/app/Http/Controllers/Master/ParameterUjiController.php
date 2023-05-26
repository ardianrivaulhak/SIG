<?php
namespace App\Http\Controllers\Master;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Master\ParameterUji;
use App\Models\Master\ParameterPrice;
use App\Models\Master\ParameterujiInfo;
use App\Models\Master\Lab;
use Firebase\JWT\JWT;
use Carbon\Carbon as time;

class ParameterUjiController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function index(Request $request)
    {
        $data = $request->input('data');

        // return $data['search'];
        $model=ParameterUji::with([
            'lab',
            'parametertype',
            'parameterinfo',
            'parameterprice' => function ($q) {
                return $q->where('status',1);
            }
        ])->where('name_id','not like','%**%')
        ->groupBy(\DB::raw('UPPER(name_id)'))
        ->orderBy('id','asc');

        if(!empty($data['search'])){
            if(strlen($data['search']) > 2){
                $model=$model->where(\DB::raw('UPPER(name_id)'),'like','%'.strtoupper($data['search']).'%');
            } else {
                $model=$model->where(\DB::raw('UPPER(name_id)'),strtoupper($data['search']));
            }
        }

        if(!empty($data['idlab'])){
            $model = $model->where('mstr_laboratories_laboratory_id',$data['idlab']); 
        }

        if(!empty($data['sort_id']) && !empty($data['sort_status'])){
            if($data['sort_id'] == 'name_id'){
                $model = $model->orderBy('name_id',strtoupper($data['sort_status']));
            } else if ($data['sort_id'] == 'lab'){
                $model = $model->orderBy('mstr_laboratories_laboratory_id', strtoupper($data['sort_status'])); 
            }
        }
            
        if(!empty($data['status'])){
            if($data['status'] == 'all'){
                $model = $model->get();
            } else {
                $model = $model->paginate(25);
            }
        } else {
            $model=$model->paginate(25);
        }
        
        return response()->json($model);
    }

    public function parameteraddinfo(Request $request){
        try {
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');


            $var = new ParameterujiInfo;
            $var->id_parameteruji = $data['id_parameteruji'];
            $var->id_metode = $data['id_metode'];
            $var->id_unit = $data['id_unit'];
            $var->id_lod = $data['id_lod'];
            $var->created_at = time::now();
            $var->inserted_user = $id_user;
            $var->save();

            return response()->json(array(
                "status" => true,
                "message" => "Success Saving data"
            ));

        } catch (\Exception $e){
            return response()->json($e->getMessage());
        }
    }

    public function indexContract(Request $request)
    {
        $data = $request->input('data');

        $model=ParameterUji::with([
            'lab',
            'parametertype',
            'parameterprice',
            'parameterinfo',
        ])
        ->where('name_id','not like','%**%')
        ->whereIn('id',[\DB::raw('SELECT parameteruji_id FROM parameter_price GROUP BY parameteruji_id')])
        ->groupBy(\DB::raw('UPPER(name_id)'))
        ->orderBy('id','asc');

        if(!empty($data['search'])){
            if(strlen($data['search']) > 2){
                $model=$model->where(\DB::raw('UPPER(name_id)'),'like','%'.strtoupper($data['search']).'%');
            } else {
                $model=$model->where(\DB::raw('UPPER(name_id)'),strtoupper($data['search']));
            }
        }

        if(!empty($data['idlab'])){
            $model = $model->where('mstr_laboratories_laboratory_id',$data['idlab']); 
        }

        if(!empty($data['sort_id']) && !empty($data['sort_status'])){
            if($data['sort_id'] == 'name_id'){
                $model = $model->orderBy('name_id',strtoupper($data['sort_status']));
            } else if ($data['sort_id'] == 'lab'){
                $model = $model->orderBy('mstr_laboratories_laboratory_id', strtoupper($data['sort_status'])); 
            }
        }
            
        if(!empty($data['status'])){
            if($data['status'] == 'all'){
                $model = $model->get();
            } else {
                $model = $model->paginate(25);
            }
        } else {
            $model=$model->paginate(25);
        }
        
        return response()->json($model);
    }

    public function show(Request $request,$id)
    {
        $model=$model=ParameterUji::with([
            'lab',
            'parametertype',
            'parameterprice',
            'parameterinfo',
            'parameterprice.employee',
            'analystgroup'
        ])->find($id);
        return response()->json($model);
    }

    public function acceptPrice(Request $request){
        try {
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;

            $var = ParameterPrice::find($request->input('parameterprice_id'));
            $var->status = $request->input('status');
            $var->updated_at = time::now();
            $var->update_user = $id_user;   
            $var->save();

            $data = array(
                "status" => true,
                "message" => "parameter accepted"
            );

            return response()->json($data);
            
        } catch (\Exception $e){
            $data = array(
                "status" => false,
                "message" => "Ooops Something went wrong !!"
            );

            return response()->json($data);
        }
    }

    public function update(Request $request,$id){
        try{
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            $parameteruji = ParameterUji::find($id);
            $parameteruji->name_id = $data['name_id'];
            $parameteruji->name_en = $data['name_en'];
            $parameteruji->description = !empty($data['desc']) ? $data['desc'] : null;
            $parameteruji->active = $data['active'];
            $parameteruji->mstr_laboratories_laboratory_id = $data['lab_id'];
            $parameteruji->mstr_laboratories_parametertype_id = $data['parametertype_id'];
            $parameteruji->id_analystgroup = !empty($data['group_id']) ? $data['group_id'] : null ;
            $parameteruji->update_user = $id_user;
            $parameteruji->updated_at = time::now();
            $parameteruji->save();

            foreach($data['parameter'] as $c){
                    $h = !empty($c['idPrice']) ? ParameterPrice::find($c['idPrice']) : new ParameterPrice;
                    $h->parameteruji_id = $parameteruji->id;
                    $h->status = $c['status'] == 2 ? 0 : $c['status'];
                    $h->price = $c['price'];
                    $h->description = $c['desc'];
                    $h->updated_at = time::now();
                    $h->update_user = $id_user;
                    $h->save();
            }

            $data=array(
                'success'=>true,
                'message'=>'Update Success'
            );

            return response()->json($data);

        } catch(\Exception $e){

            $data=array(
                'success'=>false,
                'message'=>'Update Error'
            );

            return response()->json($e->getMessage());

        }
        
    }
    public function destroy($id)
    {
        $model=ParameterUji::find($id);
        $m = \DB::table('transaction_parameter as a')->where('a.id_parameteruji',$id)->get();
        if(count($m) > 0){
            $data=array(
                'value'=>false,
                'message'=>'Data failed to deleted'
            );
            return response()->json($data);
        } else {
            $del=$model->delete();
                $data=array(
                    'value'=>true,
                    'message'=>'Data deleted'
                );
            return response()->json($data);
        }
    }

    public function store(Request $request){
        try{
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');
            $message = [];

            $c = ParameterUji::all();
            $z = Lab::find($data['lab_id']);
            $labcode = $z->id == 1 ? 'NON' : substr(trim($z->nama_lab),0,3);
            $codeparam = 'PAR-'.strtoupper($labcode).'-'.(count($c) + 1);
            
            // $checknama = ParameterUji::where(\DB::raw('UPPER(name_id)','like','%'.strtoupper($data['name_id']).'%'))
            // ->orWhere(\DB::raw('UPPER(name_en)'),'like','%'.strtoupper($data['name_en']).'%')->get();

            // if(count($checknama) < 1){
                $parameteruji = new ParameterUji;
                $parameteruji->parameter_code = $codeparam;
                $parameteruji->name_id = $data['name_id'];
                $parameteruji->name_en = $data['name_en'];
                $parameteruji->active = 1;
                $parameteruji->mstr_laboratories_laboratory_id = $data['lab_id'];
                $parameteruji->mstr_laboratories_parametertype_id = $data['parametertype_id'];
                $parameteruji->id_analystgroup = $data['group_id'];
                $parameteruji->insert_user = $id_user;
                $parameteruji->created_at = time::now();
                $parameteruji->save();
    
                $parameterprice = new ParameterPrice;
                $parameterprice->parameteruji_id = $parameteruji->id;
                $parameterprice->price = $data['harga'];
                $parameterprice->updated_at = time::now();
                $parameterprice->status = 1;
                $parameterprice->update_user = $id_user;
                $parameterprice->description = $data['desc'];
                $parameterprice->save();

                array_push($message, array(
                    "status" => true,
                    "message" => "Saving Success"
                ));

            

            return response()->json($message);
        } catch(\Exception $e){
            $data=array(
                'success'=>false,
                'message'=>'Saving Error'
            );
            return response()->json($e->getMessage());
            // return $e->getMessage();
        }
        
    }

    public function storeHarga(Request $request){
        try {
            
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');


            $parameteruji = ParameterUji::find($data['parameteruji_id']);
            $parameteruji->name_id = $data['name_id'];
            $parameteruji->name_en = $data['name_en'];
            $parameteruji->active = 0;
            $parameteruji->mstr_laboratories_laboratory_id = $data['lab_id'];
            $parameteruji->mstr_laboratories_parametertype_id = $data['parametertype_id'];
            $parameteruji->id_analystgroup = $data['group_id'];
            $parameteruji->insert_user = $id_user;
            $parameteruji->created_at = time::now();
            $parameteruji->save();


            foreach ($data['price'] as $k) {

                    $g = ParameterPrice::where('parameteruji_id',$data['parameteruji_id'])->get();
                    // $dt = $k['created_date'];
                    if(count($g) > 0){
                        foreach($g as $x){
                            ParameterPrice::find($x->id)->delete();
                        }   
                    }
            }

            foreach($data['price'] as $v){
                $parameterprice = new ParameterPrice;
                $parameterprice->parameteruji_id = $data['parameteruji_id'];
                $parameterprice->price = $v['price'];
                $parameterprice->created_at = time::now();
                $parameterprice->status = $v['status'];
                $parameterprice->description = $v['desc'];
                $parameterprice->insert_user = $id_user;
                $parameterprice->save();
            }

            $data=array(
                'success'=>true,
                'message'=>'Saving Success'
            );
            return response()->json($data);

        } catch (\Exception $e){
            return response()->json($e->getMessage());
        }
    }
}
