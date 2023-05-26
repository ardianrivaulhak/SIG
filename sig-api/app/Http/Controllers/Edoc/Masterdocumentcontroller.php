<?php
namespace App\Http\Controllers\Edoc;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Firebase\JWT\JWT;
use Carbon\Carbon as time;
use App\Models\Edoc\Masterdocuments;

class Masterdocumentcontroller extends Controller
{
      /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function basicdocument(Request $request)
    {
        try {
            $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = Masterdocuments::where('inheritance', 0)->orWhere('inheritance', 1)->paginate(100);
        return response()->json($model);
        } catch(\Exception $e){
            return response()->json($e->getMessage());
        }
    }

    public function basicInheritancedocument(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = Masterdocuments::where('inheritance', 2)->where('inheritance_document', $data['id'])->paginate(100);
        return response()->json($model);
    }
}