<?php

namespace App\Http\Controllers;

use Validator;
use App\User;
use Firebase\JWT\JWT;
use Illuminate\Http\Request;
use Firebase\JWT\ExpiredException;
use Illuminate\Support\Facades\Hash;
use Laravel\Lumen\Routing\Controller as BaseController;
use App\Models\Hris\Employee;
use Carbon\Carbon as time;
use App\Models\Log;
class AuthController extends BaseController
{
    /**
    * The request instance.
    *
    * @var \Illuminate\Http\Request
    */
    private $request;

    /**
    * Create a new controller instance.
    *
    * @param  \Illuminate\Http\Request  $request
    * @return void
    */
    public function __construct(Request $request) {
        $this->request = $request;
    }

    /**
    * Create a new token.
    *
    * @param  \App\User   $user
    * @return string
    */
    protected function jwt(User $user) {
        $payload = [
            'iss' => "lumen-jwt", // Issuer of the token
            'sub' => $user->id, // Subject of the token
            'iat' => time::now() // Time when JWT was issued.
            // 'exp' => time() + 60*60 // Expiration time
        ];

        // As you can see we are passing `JWT_SECRET` as the second parameter that will
        // be used to decode the token in the future.
        return JWT::encode($payload, env('JWT_SECRET'));
    }

    /**
    * Authenticate a user and return the token if the provided credentials are correct.
    *
    * @param  \App\User   $user
    * @return mixed
    */
    public function authenticate(User $user) {
        // return Hash::make('saraswanti');
        // try {
            $this->validate($this->request, [
                'email'     => 'required|email',
                'password'  => 'required'
                ]);

                // Find the user by email
                $user = User::where('email', trim($this->request->input('email')))->first();

                if (!$user) {
                    return response()->json([
                        'error' => 'Email does not exist.'
                    ], 400);
                }

                // Verify the password and generate the token
                if (Hash::check($this->request->input('password'), $user->password)) {
                    $token = $this->jwt($user);
                    $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
                    $id_user = $users->sub;
                    $set = new Log;
                    $set->user_id = $id_user;
                    $set->online_at = time::now();
                    $set->save();

                    return response()->json([
                        'token' => $token
                    ], 200);
                }

                // Bad Request response
                return response()->json([
                    'error' => 'Email or password is wrong.'
                ], 400);
        // } catch(\Exception $e){
        //     return response()->json($e);
        // }
    }

    public function getDataEmployee(Request $request){
        $var = Employee::with([
            'bagian',
            'subagian',
            'position',
            'city'
            ])
            ->select(
                'nik',
                'employee_name',
                'tempat_lahir',
                'tgl_lahir',
                'tgl_masuk',
                'gender',
                'alamat',
                'religion',
                'photo',
                'martial_status',
                'id_bagian',
                'id_position',
                'id_sub_bagian'
            )
            ->where(\DB::raw('replace(employee_name," ","")'),preg_replace('/\s+/', '', $request->input('employee-name')))->first();

            return response()->json($var);
    }

    public function approvedContract(Request $request){
        return response()->json(
            array(
                array(
                    "iduser"    => 65,
                    "type"      => array(1)
                ),
                array(
                    "iduser"    => 235,
                    "type"      => array(2)
                ),
                array(
                    "iduser"    => 135,
                    "type"      => array(4)
                ),
                array(
                    "iduser"    => 411,
                    "type"      => array(4)
                ),
                array(
                    "iduser"    => 29,
                    "type"      => array(3)
                ),
                array(
                    "iduser"    => 230,
                    "type"      => array(3)
                ),
                array(
                    "iduser"    => 307,
                    "type"      => array(1,2,3,4)
                ),
                array(
                    "iduser"    => 440,
                    "type"      => array(5)
                ),
                array(
                    "iduser"    => 106,
                    "type"      => array(5)
                ),
            ),
        );
            
           

    }

    public function me(Request $request){
        try {
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;

            //ini berubah
            $var = Employee::with([
                'user',
                'user.menuget',
                'user.menuget.menuchild',
                'user.menuget.menuchild.menuparent',
                'bagian',
                'subagian',
                'level'
                ])->where('user_id',$id_user)->get();

                return response()->json($var);
            } catch(\Exception $e){
                return $e->getMessage();
            }
    }

    public function checkpassword(Request $request){
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;

            $test = User::where('id',$id_user)->first();
            $checkPassword = Hash::check('saraswanti', $test->password);

            return response()->json(array(
                "success" => $checkPassword ? true : false,
                "message" => $checkPassword ? 'Change Password' : 'Password Changed'
            ));

        } catch(\Exception $e){
            return response()->json(array(
                "success" => false,
                "message" => "Server Error"
            ));
        }
    }

    public function change_password(Request $request){
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');
            $test = User::find($id_user);
            $test->password = Hash::make($data['password']);
            $test->save();  
            
            


            return response()->json(array(
                "success" => true,
                "message" =>'Password Changed'
            ));

        } catch(\Exception $e){
            return response()->json(array(
                "success" => false,
                "message" => "Server Error"
            ));
        }
    }

    public function setpassword(Request $request){
        try {

            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            // return ;
            // return $passwordchecker = isset($request->input('passwordlama')) ? $request->input('passwordlama') : '';

            $test = User::where('id',$id_user)->first();
            if(!empty($request->input('passwordlama'))){
                if(Hash::check($passwordchecker, $test->password)){
                
                    $test->password = Hash::make($request->input('password'));
                    $test->save();
    
                    return response()->json(array(
                        "success" => true,
                        "message" => 'Password Changed'
                    ));
    
                } else {
                    return response()->json(array(
                        "success" => false,
                        "message" => 'Password Can`t Changed, Old Password Wrong'
                    ));
                }
            } else {
                $test->password = Hash::make($request->input('password'));
                $test->save();

                return response()->json(array(
                    "success" => true,
                    "message" => 'Password Changed'
                ));
            }         

        } catch(\Exception $e){
            return response()->json(array(
                "success" => false,
                "message" => "Server Error"
            ));
        }
    }

    public function urlactive(){
        return env('APP_URL');
    }
}
