<?php
namespace App\Http\Controllers\Master;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Master\Mou;
use App\Models\Master\MouDetail;
use App\Models\Master\AttachmentMou;
use App\Models\Hris\Employee;
use Firebase\JWT\JWT;
use Illuminate\Support\Facades\File;
use Carbon\Carbon as time;
use Illuminate\Support\Facades\Response;

class MouController extends Controller
{
    /**
    * Create a new controller instance.
    *
    * @return void
    */
    public function index(Request $request)
    {
        try {
            

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');


            $var = Mou::with([
                'customer',
                'employee',
                'attachment',
                'detail' => function ($q){
                    return $q->select(
                        'id',
                        'id_cust_mou_header',
                        \DB::raw('IF(mou_type = 1,"BUSINESS","NON BUSINESS") as mou_type'),
                        \DB::raw('IF(cust_mou_detail.condition = 1, "STATUS PENGUJIAN",IF(cust_mou_detail.condition = 2,"DISCOUNT",IF(cust_mou_detail.condition = 3, "SPECIAL","NON BUSINESS"))) as condition_name'),
                        'discount',
                        'desc',
                        'status',
                        \DB::raw('IF(cust_mou_detail.values is NULL, id_status_pengujian, cust_mou_detail.values) as value'),
                        'id_status_pengujian'
                    );
                },
                'detail.statuspengujian'])
            ->has('customer')
            ->has('detail')->groupBy('id_customer');

            if(!empty($data['search'])){
                // return $request->input('search');
                $var = $var->whereHas('customer', function($q) use ($data){
                    return $q->where(\DB::raw('UPPER(customer_name)'),'like','%'.strtoupper($data['search']).'%');
                });
            }

            if($data['status'] !== 'all'){
                $var = $var->where('status',intval($data['status']));
            }

            if($data['expired'] !== 'all'){
                if($data['expired'] === '1'){
                    $var = $var->where('end_date',"<",\DB::raw('NOW()'));
                } else {
                    $var = $var->where('end_date',">",\DB::raw('NOW()'));
                }
            }

            return response()->json($var->paginate(100));
            
        } catch (\Exception $e){
            return response()->json($e->getMessage());
        }
    }

    public function sendAttachment(Request $request, $id)
    {
        
        try {
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;


            $response = null;

            $getMou = Mou::find($id);
            $attachmentMou = AttachmentMou::where('id_cust_mou_header', $id)->get();

            $data = (object) ['file' => ""];

            if ($request->hasFile('file')) {
                $original_filename = $request->file('file')->getClientOriginalName();
                $original_filename_arr = explode('.', $original_filename);
                $file_ext = end($original_filename_arr);
                $destination_path = './mou/' . $getMou->no_cust_mou . '/attachment/';
                $filename = 'attachment_mou_' . (count($attachmentMou) + 1) . '-' . $getMou->no_cust_mou . '.' . $file_ext;
    
                if ($request->file('file')->move($destination_path, $filename)) {
                    $data->file = './mou/' . $getMou->no_cust_mou . '/attachment/' . $filename;
    
                    $setAttachment = new AttachmentMou;
                    $setAttachment->id_cust_mou_header = $id;
                    $setAttachment->filename = $filename;
                    $setAttachment->type = 'file';
                    $setAttachment->ext = $request->file('file')->getClientOriginalExtension();
                    $setAttachment->insert_user = $id_user;
                    $setAttachment->save();
    
                    return response()->json(array(
                        "status" => true,
                        "message" => "Success Uploading Data"
                    ));

                } else {
                    return $this->responseRequestError('Cannot upload file');
                }
            }
        } catch (\Exception $e){
            return response()->json($e->getMessage());
        }
    }

    public function deleteAttachment(Request $request){
        try {

            $v = AttachmentMou::with([
                'mouheader'
            ])->find($request->input('attachment_id'));

            $destinationPath = public_path('mou/' . $v['mouheader']->no_cust_mou . '/attachment');
            $checkfile = File::delete($destinationPath . '/' . $v->filename);

            $v = AttachmentMou::find($request->input('attachment_id'))->forceDelete();

            return response()->json(array(
                "status" => true,
                "message" => 'Succesfully Deleted'
            ));

        } catch (\Exception $e){
            return response()->json($e->getMessage());
        }
    }

    public function mouattachment(Request $request){
        try {

            $var = \DB::table('cust_mou_attachment as a')
            ->where('a.id_cust_mou_header',$request->input('id_cust_mou_header'))
            ->get();


            return response()->json($var);


        } catch (\Exception $e){
            return response()->json($e->getMessage());
        }
    }


    public function show(Request $request)
    {
        try {
            
            $var = Mou::with(['customer','employee','detail'])
            ->find($request->input('id_customer'));

            return response()->json($var);
            
        } catch (\Exception $e){
            
            return response()->json($e->getMessage());
            
        }
    }
    
    public function update(Request $request,$id){
        try{
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

                $s = Mou::with(['detail'])->find($id);
                $s->id_customer = $data['idcust'];
                $s->salesforecast = !empty($data['salesforcast']) ? $data['salesforcast'] : null;
                $s->termin = !empty($data['termin']) ? $data['termin'] : null;
                $s->start_date = $data['from'];
                $s->end_date = $data['to'];
                $s->user_id = Employee::find($data['idsales'])->user_id;
                $s->updated_at = time::now();
                $s->status = 0;
                $s->save();
    
    
                if(!empty($data['disc'])){
                    $g = MouDetail::where('id_cust_mou_header',$id)->first();
                    $c = MouDetail::find($g->id);
                    $c->id_cust_mou_header = $s->id_cust_mou_header;
                    $c->mou_type = 1;
                    $c->condition = 2;
                    $c->discount = $data['disc'];
                    $c->desc = !empty($data['desc']) ? $data['desc'] : null;
                    $c->status = 1;
                    $c->save();
                }
    
    
                if(!empty($data['detailmou'])){
                    foreach($data['detailmou'] as $d => $z){
                        $cz = MouDetail::find($z['id']);
                        $cz->id_cust_mou_header = $s->id_cust_mou_header;
                        $cz->mou_type = 1;
                        $cz->condition = 1;
                        $cz->id_status_pengujian = $d + 1;
                        $cz->discount = $z['disc'];
                        $cz->values = $z['values'];
                        $cz->desc = 'Status Pengujian';
                        $cz->status = 1;
                        $cz->save();
                    }
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

    public function approveMou(Request $request){
        try {
            
            $var = Mou::find($request->input('id_cust_mou_header'));
            $var->status = $request->input('app');
            $var->save();

            $data = array(
                "status" => true,
                "message" => "approved successfully"
            );

            return response()->json($data);
            
        } catch (\Exception $e){

            return response()->json($e->getMessage());

        }
    }
    
    public function destroy($id)
    {
        $model=Mou::with(['detail'])->find($id);

        if(count($model->detail) > 0){
            foreach($model->detail as $va){
                $r = MouDetail::find($va['id'])->delete();
            }
        }
       

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
    
    public function store(Request $request){
        try{
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');


            $tanggal_terima = time::now()->format('Y-m-d');
            $pecahtahun = explode('-',$tanggal_terima);

            
            $v = count(Mou::all());
            $getnumber = $v + 1;
            $nomor_mou = 'SIG.MARK.CM.'.$this->integerToRoman($pecahtahun[1]).'.'.$pecahtahun[0].'.'.$this->leftPad($getnumber,6).'';
            $chdata = \DB::table('cust_mou_header')->where('id_customer',$data['idcust'])->get();
            if(count($chdata) > 0){
                $a = array(
                    'status' => false,
                    'message' => 'Data Customer sudah ada di database, harap delete terlebih dahulu'
                );
                return response()->json($a);
            } else {
                $s = new Mou;
                $s->no_cust_mou = $nomor_mou;
                $s->id_customer = $data['idcust'];
                $s->salesforecast = !empty($data['salesforcast']) ? $data['salesforcast'] : null;
                $s->termin = !empty($data['termin']) ? $data['termin'] : null;
                $s->start_date = $data['from'];
                $s->end_date = $data['to'];
                $s->user_id = Employee::find($data['idsales'])->user_id;
                $s->status = 0;
                $s->inserted_at = time::now();
                $s->save();
    
    
                if(!empty($data['disc'])){
                    $c = new MouDetail;
                    $c->id_cust_mou_header = $s->id_cust_mou_header;
                    $c->mou_type = 1;
                    $c->condition = 2;
                    $c->discount = $data['disc'];
                    $c->desc = !empty($data['desc']) ? $data['desc'] : null;
                    $c->status = 1;
                    $c->save();
                }
    
    
                if(!empty($data['detailmou'])){
                    foreach($data['detailmou'] as $d => $z){
                        $cz = new MouDetail;
                        $cz->id_cust_mou_header = $s->id_cust_mou_header;
                        $cz->mou_type = 1;
                        $cz->condition = 1;
                        $cz->id_status_pengujian = $d + 1;
                        $cz->discount = $z['disc'];
                        $cz->values = $z['values'];
                        $cz->desc = 'Status Pengujian';
                        $cz->status = 1;
                        $cz->save();
                    }
                }
              
                $data=array(
                    'success'=>true,
                    'message'=>'Saving Success'
                );
                return response()->json($data);
            }
        } catch(\Exception $e){
            $data=array(
                'success'=>false,
                'message'=>'Saving Error'
            );
            return response()->json($e->getMessage());
            // return $e->getMessage();
        }
        
    }

    private function integerToRoman($integer){
        // Convert the integer into an integer (just to make sure)
        $integer = intval($integer);
        $result = '';
        
        // Create a lookup array that contains all of the Roman numerals.
        $lookup = array('M' => 1000,
        'CM' => 900,
        'D' => 500,
        'CD' => 400,
        'C' => 100,
        'XC' => 90,
        'L' => 50,
        'XL' => 40,
        'X' => 10,
        'IX' => 9,
        'V' => 5,
        'IV' => 4,
        'I' => 1);
        
        foreach($lookup as $roman => $value){
        // Determine the number of matches
        $matches = intval($integer/$value);
        
        // Add the same number of characters to the string
        $result .= str_repeat($roman,$matches);
        
        // Set the integer to be the remainder of the integer and the value
        $integer = $integer % $value;
        }
        
        // The Roman numeral should be built, return it
        return $result;
    }

    private function leftPad($number, $targetLength) {
        $output = strlen((string)$number);
        $selisih = intval($targetLength) - intval($output);
        $nol = '';
        for ($i=0; $i < $selisih; $i++) { 
            $nol .= '0';
        }
        $nol .= strval($number);
        return $nol;
    }
}