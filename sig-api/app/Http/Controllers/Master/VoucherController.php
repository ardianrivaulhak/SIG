<?php
namespace App\Http\Controllers\Master;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Master\Voucher;
use Firebase\JWT\JWT;
use Carbon\Carbon as time;

class VoucherController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function index(Request $request)
    {
        try {
            
            $var = Voucher::select('*');

            if($request->has('search')){
                $var = $var->where(\DB::raw('UPPER(voucher_name)'),'like','%'.strtoupper($request->input('search')).'%');
            }

            return response()->json($var->get());

        } catch (\Exception $e){
            return response()->json(array(
                "status" => false,
                "message" => "data gagal di ambil"
            ));
        }
    }
    public function show(Request $request,$id)
    {
        $model=Voucher::find($id);
        return response()->json($model);
    }

    public function setstatus(Request $request)
    {
        $model=Voucher::find(intVal($request->input('id')));
        $model->active = $request->input('status') == 'Y' ? 'N' : 'Y';
        $model->save();
        return response()->json(array(
            "status" => true,
            "message" => 'Saving Success'
        ));
    }

    public function update(Request $request,$id){
        try{
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            $voc = Voucher::find($id);
            $voc->voucher_name = $data['vouchername'];
            $voc->valid_until = time::parse($data['validate'])->format('Y-m-d');
            $voc->price = !empty($data['price']) ? $data['price'] : null;
            $voc->discount = !empty($data['disc']) ? $data['disc'] : null;
            $voc->status = intVal($data['status']);
            $voc->active = 'N';
            $voc->desc = $data['desc'];
            $voc->created_at = time::now();
            $voc->insert_user = $id_user;
            $voc->save();

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

            return response()->json($data);
        }
        
    }
    
    public function destroy(Request $request, $id)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;

        $model=Voucher::find($id);
        $del=$model->delete();
        if($del){
            $data=array(
                'success'=>true,
                'message'=>'Data deleted'
            );
        }else{
            $data=array(
                'success'=>false,
                'message'=>'Data failed to deleted'
            );
        }
        return response()->json($data);
    }

    public function store(Request $request)
    {
        try{
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');
    
            $voc = new Voucher;
            $voc->voucher_name = $data['vouchername'];
            $voc->valid_until = time::parse($data['validate'])->format('Y-m-d');
            $voc->price = !empty($data['price']) ? $data['price'] : null;
            $voc->discount = !empty($data['disc']) ? $data['disc'] : null;
            $voc->status = intVal($data['status']);
            $voc->active = 'N';
            $voc->desc = $data['desc'];
            $voc->created_at = time::now();
            $voc->insert_user = $id_user;
            $voc->save();

            $data=array(
                'success'=>true,
                'message'=>'Saving Success'
            );

            return response()->json($data);
        } catch(\Exception $e){
            $data=array(
                'success'=>false,
                'message'=>'Saving Error'   
            );
            return response()->json($data);
        }
        
    }
}
