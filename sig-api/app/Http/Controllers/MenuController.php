<?php
namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Menu\MenuChild;
use App\Models\Menu\MenuParent;
use App\Models\Menu\MenuAuth;
use Firebase\JWT\JWT;
use Carbon\Carbon as time;

class MenuController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function index(Request $request)
    {
        // $request->all();
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $var = MenuAuth::with([
            'menuchild',
            'menuchild.menuparent' => function ($q) use ($request){
                return $q->where(\DB::raw('LOWER(menu_name)'),'like',$request->input('menu'));
            }
        ])->has('menuchild')->where('id_user',$id_user)->get();


        $return = [];
        
        
        array_push($return,array(
            "id" => 'analystpro',
            "title" => 'analystpro',
            "type" => 'group',
            "children" => []
        ));

        foreach($var as $v){
            if($v->menuchild->id_parent == 0){
                $return[0]['children'][] = array(
                    "id" => $v->menuchild->menu_id,
                    "title" => $v->menuchild->title,
                    "type" => $v->menuchild->type,
                    "icon" => $v->menuchild->icon,
                    "url" => $v->menuchild->url,
                    "position" => $v->menuchild->position
                );
            }   
        }

        array_push($return[0]['children'],array(
            "id" => "master",
            "title" => "Master",
            "type" => "collapsable",
            "icon" => "control_camera",
            "position" => null,
            "children" => array()
        ));

        array_push($return[0]['children'],array(
            "id" => "report",
            "title" => "Report",
            "type" => "collapsable",
            "icon" => "control_camera",
            "position" => null,
            "children" => array()
        ));

        // $datagroup =  array_map(function($b) {
        //     if($b['type'] == 'group'){
        //         return $b;
        //     } else return;
        // }, $return[0]['children']);

        $datagroup =  array_filter($return[0]['children'], function($b) {
            return $b['id'] == 'master';
        });

        $datagroupreport =  array_filter($return[0]['children'], function($b) {
            return $b['id'] == 'report';
        });

        $datagroup = array_values($datagroup);
        $datagroupreport = array_values($datagroupreport);
        
        $menufil = [];
        $menufilreport = [];

        foreach ($var as $g) {
            // return $g;
            if($g->menuchild->id_parent == 9){
                // return $v->menuchild;
                $datagroup[0]['children'][] = array(
                    "id" => $g->menuchild->menu_id,
                    "title" => $g->menuchild->title,
                    "type" => $g->menuchild->type,
                    "icon" => $g->menuchild->icon,
                    "url" => $g->menuchild->url,
                );
            }

            if($g->menuchild->id_parent == 10){
                // return $v->menuchild;
                $datagroupreport[0]['children'][] = array(
                    "id" => $g->menuchild->menu_id,
                    "title" => $g->menuchild->title,
                    "type" => $g->menuchild->type,
                    "icon" => $g->menuchild->icon,
                    "url" => $g->menuchild->url,
                );
            }
        }
        
        
        array_push($menufil,$datagroup[0]);
        array_push($menufilreport,$datagroupreport[0]);

        $datasort = array_filter($return[0]['children'], function($b) {
            return $b['position'] !== null;
        });
        $orderby = [];
        foreach ($datasort as $key => $value) {
            $orderby[$key] = $value['position'];
        }
        array_multisort($orderby, SORT_ASC, $datasort);
        $return[0]['children'] = array();
        $return[0]['children'] = $datasort;
        $return[0]['children'][] = $menufil[0];
        $return[0]['children'][] = $menufilreport[0];
        array_push($menufil,$return[0]['children']);
        array_push($menufilreport,$return[0]['children']);
        return response()->json($return);
    }


    public function getdata(Request $request){
        try {
            
            $var = \DB::table('menu_auth as a')
            ->selectRaw('
                a.id,
                b.nik,
                b.employee_name,
                b.photo,
                e.status,
                b.id_bagian,
                c.division_name,
                b.id_sub_bagian,
                d.name as subagian,
                f.title,
                a.create,
                a.approve,
                a.update,
                a.delete,
                b.user_id,
                a.menu_id,
                f.title,
                f.id_menu_parent,
                g.menu_name,
                f.id_parent
            ')
            ->leftJoin('hris_employee as b','b.user_id','a.id_user')
            ->leftJoin('hris_division as c','c.id_div','b.id_bagian')
            ->leftJoin('hris_sub_division as d','d.id_subagian','b.id_sub_bagian')
            ->leftJoin('hris_employee_status as e','e.id_employee_status','b.status')
            ->leftJoin('menu_master as f','f.id','a.menu_id')
            ->leftJoin('menu_apps as g','g.id','f.id_menu_parent')
            ->where('b.user_id',$request->input('user'))
            ->where('f.type','<>','group')
            ->groupBy('a.menu_id')
            ->get();


            return response()->json($var);

        }catch (\Exception $e){
            return response()->json($e->getMessage());
        }
    }


    public function userget(Request $request){
        try {
            
            $var = \DB::table('hris_employee as a')
            ->leftJoin('users as b','b.id','a.user_id')
            ->leftJoin('hris_division as c','c.id_div','a.id_bagian')->get();

            return response()->json($var);

        } catch (\Exception $e){
            return response()->json($e->getMessage());
        }
    }


    public function menuregister(Request $request){
        try {
            
            $var = MenuChild::selectRaw('*');

            if($request->has('q')){
                $var=$var->where(\DB::raw('UPPER(title)'),'like','%'.strtoupper($request->input('search')).'%');
            }

            return response()->json($var->get());

        } catch (\Exception $e){

            return response()->json($e->getMessage());

        }
    }

    public function menuadd(Request $request){
        try {
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            $var = new MenuAuth;
            $var->menu_id = $data['menu_id'];
            $var->id_user = $data['user_id'];
            $var->create = $data['create'];
            $var->approve = $data['approve'];
            $var->update = $data['update'];
            $var->delete = $data['delete'];
            $var->save();

            return response()->json(array(
                "status" => true,
                "message" => "Saving Success"
            ));

        } catch (\Exception $e){
            return response()->json($e->getMessage());
        }
    }

    public function menupdate(Request $request,$id){
        try {
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');

            foreach ($data as $key => $value) {
                $var = MenuAuth::find($id);
                $var->$key = $value;
                $var->save();
            }
            // return $data[key];
            
            
            return response()->json(array(
                "status" => true,
                "message" => "Saving Success"
            ));
            return response()->json($var);
        } catch (\Exception $e){
            return response()->json(array(
                "status" => false,
                "message" => "Saving Failed, Database Error"
            ));
        }
    }


    public function deleteMenu(Request $request,$id) {
        try {
            $token = $request->bearerToken();
            $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
            $id_user = $users->sub;
            $data = $request->input('data');


            $var = MenuAuth::find($id)->Delete();

            return response()->json(array(
                "status" => true,
                "message" => "Delete Success"
            ));

        } catch (\Exception $e){
            return response()->json(array(
                "status" => false,
                "message" => "Delete Failed, Database Error"
            ));
        }
    }

}
