<?php
namespace App\Http\Controllers\Edoc;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Firebase\JWT\JWT;
use Carbon\Carbon as time;
use App\Models\Edoc\Masterdocuments;
use App\Models\Edoc\AttachmentDocuments;
use App\Models\Edoc\DocumentInheritances;
use App\Models\Edoc\Documents;
use App\Models\Edoc\DocumentViewers;
use App\Models\Edoc\DocumentAccess;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use DB;
use Auth;
use App\Models\Hris\Employee;
use App\Models\Hris\Employee_education;
use App\Models\Hris\Competence;
use App\Models\Hris\EmployementDetail;
use App\User;
use App\Models\Edoc\TransactionGroups;


use Intervention\Image\ImageManagerStatic as Image;

class DocumentsController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function StoreFileDocuments(Request $request)
    { 
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $response = null;
        $data = (object) ['file' => ""];


        if ($request->hasFile('file')) {
            
            $original_filename = $request->file('file')->getClientOriginalName();
            $original_filename_arr = explode('.', $original_filename);
            $withoutExt = preg_replace('/\\.[^.\\s]{3,4}$/', '', $original_filename);

            $file_ext = end($original_filename_arr);
            
            $destination_path = './edoc/temporary/';
            $namedirectory = str_replace(' ', '', $withoutExt) .'.'. $file_ext;
            $filename = str_replace(' ', '', $withoutExt);
            
            if ($request->file('file')->move($destination_path, $namedirectory)) {

                $setAttachment = new AttachmentDocuments;
                $setAttachment->filename = $filename;
                $setAttachment->ext = $request->file('file')->getClientOriginalExtension();
                $setAttachment->user_id = $id_user;
                $setAttachment->save();

                return $this->responseRequestSuccess($data, $setAttachment);
            } else {
                return $this->responseRequestError('Cannot upload file');
            }
        } else {
            return $this->responseRequestError('File not found');
        }
    }

    protected function responseRequestSuccess($ret, $setAttachment)
    {
        return response()->json(['status' => 'success', 'data' => $ret, 'file' => $setAttachment], 200)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    }

    protected function responseRequestError($message = 'Bad request', $statusCode = 200)
    {
        return response()->json(['status' => 'error', 'error' => $message], $statusCode)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    }

    public function documentView(Request $request, $id)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $m = AttachmentDocuments::where('id', $id)->first();

        return response()->json($m);
    }

    public function storeNewDocuments(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = New Documents;
        $model->type = $data['type_inheritance'] > 0 ? $data['type_inheritance'] :  $data['type_document']['id'];
        $model->title = $data['title'];
        $model->document_number = $data['document_number'];
        $model->issue_number = $data['issue_number'];
        $model->date_of_issue = date('Y-m-d',strtotime($data['issued_date']));
        $model->revision_number = $data['revision_number'];
        $model->date_of_revision = date('Y-m-d',strtotime($data['revision_date']));
        $model->total_pages = $data['total_pages'];
        $model->information = $data['information'];
        $model->user_id = $id_user;
        $model->save();

        $mstr = Masterdocuments::where('id', $data['type_document']['id'])->first();

        $first_folder  = str_replace(' ', '', strtolower($mstr->document_name));
        if( $data['type_inheritance'] > 0)
        {
            $inh = Masterdocuments::where('id', $data['type_inheritance'])->first();
            $second_folder  = '/' . str_replace(' ', '', strtolower($inh->document_name));
        } else{
            $second_folder = '';
        }
        $folder = $first_folder . $second_folder;

        // documents    
        if(count($data['documents']) > 0){        
            foreach($data['documents'] as $doc){
                $attch = AttachmentDocuments::where('id',$doc['file']['file']['id'])->first();
                $attch->id_document =  $model->id;
                $attch->type_document = $data['type_document']['id'];
                $attch->type = 1;
                $attch->save();         
                $oldPath = public_path().'./edoc/temporary/'.$doc['file']['file']['filename'].'.'.$doc['file']['file']['ext'];
                $newPath = public_path().'./edoc/'.$folder.'/'.date('Y').'/'.date('m').'/'. str_replace('/', '',$data['document_number']) . $data['title'].'/documents/'.$doc['file']['file']['filename'].'.'.$doc['file']['file']['ext'];
                $folderDocument = public_path().'./edoc/'.$folder.'/'.date('Y').'/'.date('m').'/'. str_replace('/', '',$data['document_number']) . $data['title'].'/documents/';
                if (File::exists($oldPath)) {
                    if(!File::exists($folderDocument)){
                        File::makeDirectory($folderDocument, 0777, true);
                    }
                    File::move($oldPath, $newPath);
                } 
            }
        }
        
        // amandement
        if(count($data['amandements']) > 0){
            foreach ($data['amandements'] as $amandement) {
                $amd = New DocumentInheritances;
                $amd->id_documents =$model->id;
                $amd->type = 2;
                $amd->title = $amandement['title'];
                $amd->document_number = $amandement['document_number'];
                $amd->issue_number = $amandement['issue_number'];
                $amd->date_of_issue = date('Y-m-d',strtotime($amandement['date_of_issue'])); 
                $amd->revision_number = $amandement['revision_number'];
                $amd->date_of_revision =  date('Y-m-d',strtotime($amandement['date_of_revision']));
                $amd->total_pages = $amandement['total_pages'];
                $amd->user_id = $id_user;
                $amd->save();
                
                if($amandement['file'] != ''){
                    foreach ($amandement['file'] as $fileamd) {    
                        $attch = AttachmentDocuments::where('id',$fileamd['file']['file']['id'])->first();
                        $attch->id_document =  $model->id;
                        $attch->id_document_inheritance =  $amd->id;
                        $attch->type_document =  $data['type_document']['id'];
                        $attch->type = 2;
                        $attch->save();        
                        $oldAmandementPath = public_path().'./edoc/temporary/'.$fileamd['file']['file']['filename'].'.'.$fileamd['file']['file']['ext'];
                        $newPath = public_path().'./edoc/'.$folder.'/'.date('Y').'/'.date('m').'/'. str_replace('/', '',$data['document_number']) . $data['title'].'/amandement/'.$doc['file']['file']['filename'].'.'.$doc['file']['file']['ext'];
                        $folderDocument = public_path().'./edoc/'.$folder.'/'.date('Y').'/'.date('m').'/'. str_replace('/', '',$data['document_number']) . $data['title'].'/amandement/';            
                        if (File::exists($oldAmandementPath)) {
                            if(!File::exists($folderDocument)){
                                File::makeDirectory($folderDocument, 0777, true);
                            }
                            File::move($oldAmandementPath, $newPath);
                        } 
                    } 
                }
                   
            }
        }

        // flowchart
        if(count($data['flowcharts']) > 0){
            foreach ($data['flowcharts'] as $flowchart) {
                $flw = New DocumentInheritances;
                $flw->id_documents =$model->id;
                $flw->type = 3;
                $flw->title = $flowchart['title'];
                $flw->document_number = $flowchart['document_number'];
                $flw->issue_number = $flowchart['issue_number'];
                $flw->date_of_issue = date('Y-m-d',strtotime($flowchart['date_of_issue'])); 
                $flw->revision_number = $flowchart['revision_number'];
                $flw->date_of_revision =  date('Y-m-d',strtotime($flowchart['date_of_revision']));
                $flw->total_pages = $flowchart['total_pages'];
                $flw->user_id = $id_user;
                $flw->save();
                
                if($flowchart['file'] != ''){
                    foreach ($flowchart['file'] as $fileflow) {    
                        $attch = AttachmentDocuments::where('id',$fileflow['file']['file']['id'])->first();
                        $attch->id_document =  $model->id;
                        $attch->id_document_inheritance =  $flw->id;
                        $attch->type_document =  $data['type_document']['id'];
                        $attch->type = 3;
                        $attch->save();        
                        $oldFlowchartPath = public_path().'/edoc/temporary/'.$fileflow['file']['file']['filename'].'.'.$fileflow['file']['file']['ext'];
                        $newFlowchartPath = public_path().'/edoc/'.$folder.'/'.date('Y').'/'.date('m').'/'. str_replace('/', '',$data['document_number']) . $data['title'].'/flowchart/'.$doc['file']['file']['filename'].'.'.$doc['file']['file']['ext'];
                        $folderDocument = public_path().'/edoc/'.$folder.'/'.date('Y').'/'.date('m').'/'. str_replace('/', '',$data['document_number']) . $data['title'].'/flowchart/';            
                        if (File::exists($oldFlowchartPath)) {
                            if(!File::exists($folderDocument)){
                                File::makeDirectory($folderDocument, 0777, true);
                            }
                            File::move($oldFlowchartPath, $newFlowchartPath);
                        } 
                    } 
                }
                   
            }
        }

        // formulirs
        if(count($data['form']) > 0){
            foreach ($data['form'] as $formulirs) {
                $frm = New DocumentInheritances;
                $frm->id_documents =$model->id;
                $frm->type = 4;
                $frm->title = $formulirs['title'];
                $frm->document_number = $formulirs['document_number'];
                $frm->issue_number = $formulirs['issue_number'];
                $frm->date_of_issue = date('Y-m-d',strtotime($formulirs['date_of_issue'])); 
                $frm->revision_number = $formulirs['revision_number'];
                $frm->date_of_revision =  date('Y-m-d',strtotime($formulirs['date_of_revision']));
                $frm->total_pages = $formulirs['total_pages'];
                $frm->user_id = $id_user;
                $frm->save();
                
                if($formulirs['file'] != ''){
                    foreach ($formulirs['file'] as $fileform) {
    
                        $attch = AttachmentDocuments::where('id',$fileform['file']['file']['id'])->first();
                        $attch->id_document =  $model->id;
                        $attch->id_document_inheritance =  $frm->id;
                        $attch->type_document =  $data['type_document']['id'];
                        $attch->type = 4;
                        $attch->save();
        
                        $oldFormulirPath = public_path().'/edoc/temporary/'.$fileform['file']['file']['filename'].'.'.$fileform['file']['file']['ext'];
                        $newFormulirPath = public_path().'/edoc/'.$folder.'/'.date('Y').'/'.date('m').'/'. str_replace('/', '',$data['document_number']) . $data['title'].'/form/'.$doc['file']['file']['filename'].'.'.$doc['file']['file']['ext'];
                        $folderFormulir = public_path().'/edoc/'.$folder.'/'.date('Y').'/'.date('m').'/'. str_replace('/', '',$data['document_number']) . $data['title'].'/form/';
            
                        if (File::exists($oldFormulirPath)) {
                            if(!File::exists($folderFormulir)){
                                File::makeDirectory($folderFormulir, 0777, true);
                            }
                            File::move($oldFormulirPath, $newFormulirPath);
                        } 
                    } 
                }
                   
            }
        }

        // amandement form
        if(count($data['amandement_form']) > 0){
            foreach ($data['amandement_form'] as $amandement_form) {
              
                $amdfrm = New DocumentInheritances;
                $amdfrm->id_documents =$model->id;
                $amdfrm->type = 6;
                $amdfrm->title = $amandement_form['title'];
                $amdfrm->document_number = $amandement_form['document_number'];
                $amdfrm->issue_number = $amandement_form['issue_number'];
                $amdfrm->date_of_issue = date('Y-m-d',strtotime($amandement_form['date_of_issue'])); 
                $amdfrm->revision_number = $amandement_form['revision_number'];
                $amdfrm->date_of_revision =  date('Y-m-d',strtotime($amandement_form['date_of_revision']));
                $amdfrm->total_pages = $amandement_form['total_pages'];
                $amdfrm->user_id = $id_user;
                $amdfrm->save();
                
                if($amandement_form['file'] != ''){
                    foreach ($amandement_form['file'] as $fileAmandform) {
    
                        $attch = AttachmentDocuments::where('id',$fileAmandform['file']['file']['id'])->first();
                        $attch->id_document =  $model->id;
                        $attch->id_document_inheritance =  $amdfrm->id;
                        $attch->type_document =  $data['type_document']['id'];
                        $attch->type = 6;
                        $attch->save();
        
                        $oldFormulirPath = public_path().'/edoc/temporary/'.$fileAmandform['file']['file']['filename'].'.'.$fileAmandform['file']['file']['ext'];
                        $newFormulirPath = public_path().'/edoc/'.$folder.'/'.date('Y').'/'.date('m').'/'. str_replace('/', '',$data['document_number']) . $data['title'].'/amandementform/'.$doc['file']['file']['filename'].'.'.$doc['file']['file']['ext'];
                        $folderFormulir = public_path().'/edoc/'.$folder.'/'.date('Y').'/'.date('m').'/'. str_replace('/', '',$data['document_number']) . $data['title'].'/amandementform/';
            
                        if (File::exists($oldFormulirPath)) {
                            if(!File::exists($folderFormulir)){
                                File::makeDirectory($folderFormulir, 0777, true);
                            }
                            File::move($oldFormulirPath, $newFormulirPath);
                        } 
                    } 
                }
                   
            }
        }

        // change history
        if(count($data['changeHistory']) > 0){
            foreach ($data['changeHistory'] as $history) {
                $hstr = New DocumentInheritances;
                $hstr->id_documents =$model->id;
                $hstr->type = 5;
                $hstr->title = $history['title'];
                $hstr->document_number = $history['document_number'];
                $hstr->issue_number = $history['issue_number'];
                $hstr->date_of_issue = date('Y-m-d',strtotime($history['date_of_issue'])); 
                $hstr->revision_number = $history['revision_number'];
                $hstr->date_of_revision =  date('Y-m-d',strtotime($history['date_of_revision']));
                $hstr->total_pages = $history['total_pages'];
                $hstr->user_id = $id_user;
                $hstr->save();
                
                if($history['file'] != ''){
                    foreach ($history['file'] as $filehist) {
    
                        $attch = AttachmentDocuments::where('id',$filehist['file']['file']['id'])->first();
                        $attch->id_document =  $model->id;
                        $attch->id_document_inheritance =  $hstr->id;
                        $attch->type_document = $data['type_document']['id'];
                        $attch->type = 5;
                        $attch->save();
        
                        $oldHistoryPath = public_path().'/edoc/temporary/'.$filehist['file']['file']['filename'].'.'.$filehist['file']['file']['ext'];
                        $newHistoryPath = public_path().'/edoc/'.$folder.'/'.date('Y').'/'.date('m').'/'. str_replace('/', '',$data['document_number']) . $data['title'].'/history/'.$doc['file']['file']['filename'].'.'.$doc['file']['file']['ext'];
                        $folderHistory = public_path().'/edoc/'.$folder.'/'.date('Y').'/'.date('m').'/'. str_replace('/', '',$data['document_number']) . $data['title'].'/history/';
            
                        if (File::exists($oldHistoryPath)) {
                            if(!File::exists($folderHistory)){
                                File::makeDirectory($folderHistory, 0777, true);
                            }
                            File::move($oldHistoryPath, $newHistoryPath);
                        } 
                    } 
                }
                   
            }
        }
        

        // end documents
        $message = array(
            'status' => true,
            'message' => 'success'
        );

        return response()->json($message);
        
    }

    public function getDataDocuments(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = Documents::with(['MasterDocument','Employee']);

        switch ($data['category']) {
            case 'panduan-mutu':
                $model = $model->where('type', 1);
                break;

            case 'prosedur-pelaksanaan':
                $model = $model->where('type', 2);
                break;

            case 'instruksi-kerja-metode-uji':
                $model = $model->where('type', 3);
                break;

            case 'instruksi-kerja-prosedur-pelaksanaan':
                $model = $model->where('type', 4);
                break;

            case 'instruksi-kerja-alat':
                $model = $model->where('type', 5);
                break;

            case 'instruksi-kerja-pengecekan-antara':
                $model = $model->where('type', 6);
                break;

            case 'instruksi-kerja-pengoprasian':
                $model = $model->where('type', 7);
                break;
            
            case 'instruksi-kerja-perawatan':
                $model = $model->where('type', 8);
                break;
            
            case 'analitik':
                $model = $model->where('type', 9);
                break;
            
            case 'bioteknologi':
                $model = $model->where('type', 10);
                break;
            
            case 'farmasi':
                $model = $model->where('type', 11);
                break;
            
            case 'gc':
                $model = $model->where('type', 12);
                break;
            
            case 'gc-msms':
                $model = $model->where('type', 13);
                break;
            
            case 'logam':
                $model = $model->where('type', 14);
                break;

            case 'mainan':
                $model = $model->where('type', 15);
                break;

            case 'sampling':
                $model = $model->where('type', 16);
                break;

            case 'bioteknologi':
                $model = $model->where('type', 17);
                break;

            case 'spektrofotometri':
                $model = $model->where('type', 18);
                break;

            case 'toksisitas':
                $model = $model->where('type', 19);
                break;

            case 'umur-simpan':
                $model = $model->where('type', 20);
                break;



            default:
                $model = $model->where('type', 1);
                break;
        }

        if(!empty($data['document_name'])){
            $model=$model->where(\DB::raw('UPPER(title)'),'like','%'.$data['document_name'].'%');
        }

        if(!empty($data['document_number'])){
            $model=$model->where(\DB::raw('UPPER(document_number)'),'like','%'.$data['document_number'].'%');
        }

        
        $model = $model->paginate(25);

        return response()->json($model);

    }

    public function getDataDetailDocuments(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = Documents::with(['MasterDocument','Employee', 'Document_inheritance']);

        switch ($data['category']) {
            case 'panduan-mutu':
                $model = $model->where('type', 1);
                break;

            case 'prosedur-pelaksanaan':
                $model = $model->where('type', 2);
                break;

            case 'instruksi-kerja-metode-uji':
                $model = $model->where('type', 3);
                break;

            case 'instruksi-kerja-prosedur-pelaksanaan':
                $model = $model->where('type', 4);
                break;

            case 'instruksi-kerja-alat':
                $model = $model->where('type', 5);
                break;

            case 'instruksi-kerja-pengecekan-antara':
                $model = $model->where('type', 6);
                break;

            case 'instruksi-kerja-pengoprasian':
                $model = $model->where('type', 7);
                break;
            
            case 'instruksi-kerja-perawatan':
                $model = $model->where('type', 8);
                break;
            
            case 'analitik':
                $model = $model->where('type', 9);
                break;
            
            case 'bioteknologi':
                $model = $model->where('type', 10);
                break;
            
            case 'farmasi':
                $model = $model->where('type', 11);
                break;
            
            case 'gc':
                $model = $model->where('type', 12);
                break;
            
            case 'gc-msms':
                $model = $model->where('type', 13);
                break;
            
            case 'logam':
                $model = $model->where('type', 14);
                break;

            case 'mainan':
                $model = $model->where('type', 15);
                break;

            case 'sampling':
                $model = $model->where('type', 16);
                break;

            case 'bioteknologi':
                $model = $model->where('type', 17);
                break;

            case 'spektrofotometri':
                $model = $model->where('type', 18);
                break;

            case 'toksisitas':
                $model = $model->where('type', 19);
                break;

            case 'umur-simpan':
                $model = $model->where('type', 20);
                break;



            default:
                $model = $model->where('type', 1);
                break;
        }
        
        $model = $model->where('id', $data['id'])->first();

        return response()->json($model);

    }

    public function editDocument(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = Documents::with(['Attachment'])->where('id', $data['id'])->first();
        
        $checktype = Masterdocuments::where('id', $model->type)->first();
        if($checktype->inheritance > 1){
            $doc_first = Masterdocuments::where('id', $checktype->inheritance_document)->first();

            $folder = public_path().'/edoc/' . str_replace(' ', '', strtolower($doc_first->document_name)) .'/'. str_replace(' ', '', strtolower($checktype->document_name)) .'/'. $model->created_at->format('Y') .'/'. $model->created_at->format('m').'/'. str_replace('/', '',$model->document_number) . $model->title;

            $newPath = public_path().'/edoc/' . str_replace(' ', '', strtolower($doc_first->document_name)) .'/'. str_replace(' ', '', strtolower($checktype->document_name)) .'/'. $model->created_at->format('Y') .'/'. $model->created_at->format('m').'/'. str_replace('/', '',$data['document_number']) . $data['document_title'];

            File::move($folder, $newPath);
        }else{
            $folder = public_path().'/edoc/' . str_replace(' ', '', strtolower($checktype->document_name)) .'/'. $model->created_at->format('Y') .'/'. $model->created_at->format('m').'/'. str_replace('/', '',$model->document_number) . $model->title;

            $newPath = public_path().'/edoc/' . str_replace(' ', '', strtolower($checktype->document_name)) . '/'. $model->created_at->format('Y') .'/'. $model->created_at->format('m').'/'. str_replace('/', '',$data['document_number']) . $data['document_title'];
            File::move($folder, $newPath);
        }

        $model->title = $data['document_title'];
        $model->document_number = $data['document_number'];
        $model->issue_number = $data['issue_number'];
        $model->date_of_issue = $data['date_of_issue'];
        $model->revision_number = $data['revision_number'];
        $model->date_of_revision = $data['date_of_revision'];
        $model->total_pages = $data['total_pages'];
        $model->information = $data['information'];
        $model->save();

        $message = array(
            'status' => true,
            'message' => 'success'
        );

        return response()->json($message);
    }

    public function listAmandement(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = AttachmentDocuments::with(['documents', 'inheritance_document'])
        ->where('id_document', $data['id']);

        if(!empty($data['type_doc'])){
            $model= $model->where('type', $data['type_doc']);
        }

        $model= $model->get();

        return response()->json($model);
    }


    public function setActive(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = AttachmentDocuments::where('id', $data['id'])->first();
        $model->active = $data['active'];
        $model->save();

        $message = array(
            'status' => true,
            'message' => 'success'
        );

        return response()->json($message);
    }

    public function updateAttachment(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = DocumentInheritances::where('id', $data['id'])->first();
        $model->title = $data['document_title'];
        $model->document_number = $data['document_number'];
        $model->issue_number = $data['issue_number'];
        $model->date_of_issue = $data['date_of_issue'];
        $model->revision_number = $data['revision_number'];
        $model->date_of_revision = $data['date_of_revision'];
        $model->total_pages = $data['total_pages'];
        $model->information = $data['information'];
        $model->save();

        $message = array(
            'status' => true,
            'message' => 'success'
        );

        return response()->json($message);
    }

    public function AttachmentDetail(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = AttachmentDocuments::with(['documents.MasterDocument', 'inheritance_document'])
        ->where('id', $data['id'])
        ->first();

        return response()->json($model);
    }

    public function viewedDocument(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = new DocumentViewers;
        $model->id_document = $data['id'];
        $model->id_document_inheritance = $data['document_inheritance']['id'];
        $model->id_user = $id_user;
        $model->save();
        
        $message = array(
            'status' => true,
            'message' => 'success'
        );

        return response()->json($message);

    }

    public function geviewedDocuments(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = DocumentViewers::with(['Documents', 'Document_inheritance', 'Employee'])->where('id_document', $data['id'] )->paginate(50);

        return response()->json($model);
    }

    public function accessDocuments(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');
        
        $model = DocumentAccess::with([
            'documents', 
            'employee', 
            'employee.bagian'
        ])->where('id_document', $data['id']);

        // if(!empty($data['search'])){
        //     $search = $data['search'];
        //     $model=$model ->whereHas('employee',function($q) use ($search){
        //         return $q->where(DB::raw('UPPER(employee_name)'),'like','%'.strtoupper($search).'%');
        //     });
        // }

        if(!empty($data['search'])){
            $search = $data['search'];
            $model = $model->whereHas('employee',function($query) use ($search){
                     $query->where(\DB::raw('UPPER(employee_name)'),'like','%'.strtoupper($search).'%');
            });
        }
        
        $model = $model->paginate(50);
        return $model;
    }   

    public function removeFile(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $attch = AttachmentDocuments::where('id',$data['id'])->first();
       
        $oldPath = public_path().'/edoc/temporary/'.$attch->filename.'.pdf';
       
        if (File::exists($oldPath)) {
            File::delete($oldPath);
        }

        $attch->delete();

        $message = array(
            'status' => true,
            'message' => 'success'
        );

        return response()->json($message);
    }

    public function employeeData(Request $request)
    {

        $var = $request->input('datasend');
        $w = $var['id_document'];
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
                'documentaccess' => function($q) use ($w) {
                    $q->where('id_document', $w);
                }
           
            ])
            // ->where('status',1)
            ->where('user_id','<>',309)
            ->orderBy('employee_name','ASC');

        if(!empty($var['search'])){
            $model=$model->where(DB::raw('UPPER(employee_name)'),'like','%'.strtoupper($var['search']).'%')
            ->orWhereHas('user',function($q) use ($var){
                return $q->where(DB::raw('UPPER(email)'),'like','%'.strtoupper($var['search']).'%');
            });
        }

        $model=$model->paginate(500);
        
        return response()->json($model);
    }

    public function addUserToAccess(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = New DocumentAccess;
        $model->id_document = $data['id_document'];
        $model->id_user = $data['id_user'];
        $model->user_create = $id_user;
        $model->save();

        $message = array(
            'status' => true,
            'message' => 'success'
        );

        return response()->json($message);
    }

    public function deleteUserToAccess(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $model = DocumentAccess::where('id', $data)->first();
        $model->delete();

        $message = array(
            'status' => true,
            'message' => 'success'
        );

        return response()->json($message);
    }

    public function addAccessByGroup(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $transactions = TransactionGroups::where('id_group', $data['id_group'])->get();
        foreach ($transactions as $trans) {
            $model = New DocumentAccess;
            $model->id_document = $data['id_document'];
            $model->id_user = $trans->id_user;
            $model->user_create = $id_user;
            $model->save();
        }

        $message = array(
            'status' => true,
            'message' => 'success'
        );

        return response()->json($message);
    }

    public function StoreFileAddDocuments(Request $request)
    { 
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');
        $attach = $request->input('id_attachment');
        $category = $request->input('category');
        $type = $request->input('type');

        $att = AttachmentDocuments::where('id', $attach['file']['id'])->first();
        $att->id_document =  $data['id'];
        $att->type_document = $data['type'];
        $att->id_document_inheritance = $data['document_inheritance'] == null ? 0 : $data['document_inheritance'];
        $att->type = $data['document_inheritance'] == null ? 1 : 2;
        $att->save(); 

        $oldPath = public_path().'/edoc/temporary/'. $attach['file']['filename'] .'.'. $attach['file']['filename'];
        $newPath = public_path().'/edoc/'.str_replace(' ', '', strtolower($category)).'/'.date('Y').'/'.date('m').'/'. str_replace('/', '',$data['document_number']) . $data['title'].'/'. $type .'/'. $attach['file']['filename'] .'.'. $attach['file']['filename'];
        $folderDocument = public_path().'/edoc/'.str_replace(' ', '', strtolower($category)).'/'.date('Y').'/'.date('m').'/'. str_replace('/', '',$data['document_number']) . $data['title'].'/'.$type;

        if (File::exists($oldPath)) {
            if(!File::exists($folderDocument)){
                File::makeDirectory($folderDocument, 0777, true);
            }
            File::move($oldPath, $newPath);
        }

        $message = array(
            'status' => true,
            'message' => 'success'
        );

        return response()->json($message);


    }

    public function storeDataDocuments(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');
      
        $inheritance = New DocumentInheritances;
        $inheritance->id_documents = $data['id_document'];
        $inheritance->type = $data['type_document'];
        $inheritance->title = $data['document_title'];
        $inheritance->document_number = $data['document_number'];
        $inheritance->issue_number = $data['issue_number'];
        $inheritance->date_of_issue = $data['date_of_issue'];
        $inheritance->revision_number = $data['revision_number'];
        $inheritance->date_of_revision = $data['date_of_revision'];
        $inheritance->total_pages = $data['total_pages'];
        $inheritance->information = $data['information'];
        $inheritance->user_id = $id_user;
        $inheritance->save();

        $documents = Documents::where('id', $data['id_document'])->first();
        $category = MasterDocuments::where('id', $documents->type)->first();

        if($category->inheritance_document > 0){
            $cat_first = MasterDocuments::where('id', $category->inheritance_document)->first();
            $folder = str_replace(' ', '', strtolower($cat_first->document_name)).'/'.str_replace(' ', '', strtolower($category->document_name));
        }else{
            $folder = str_replace(' ', '', strtolower($category->document_name));
        }

        foreach ($data['doc'] as $doc) {
            $att = AttachmentDocuments::where('id', $doc['file']['file']['id'])->first();
            $att->id_document =   $data['id_document'];
            $att->type_document = $data['type'];
            $att->id_document_inheritance = $inheritance->id;
            $att->type = $data['type_document'];
            $att->save();
            

            //  wehwheh
            $oldPath = public_path().'/edoc/temporary/'. $doc['file']['file']['filename'] .'.'. $doc['file']['file']['ext'];
            $newPath = public_path().'/edoc/'.$folder.'/'. $documents->created_at->format('Y') .'/'. $documents->created_at->format('m').'/'. str_replace('/', '',$documents->document_number) . $documents->title.'/'. $doc['type'] .'/'. $doc['file']['file']['filename'] .'.'. $doc['file']['file']['ext'];
            $folderDocument = public_path().'/edoc/'.$folder.'/'. $documents->created_at->format('Y') .'/'. $documents->created_at->format('m').'/'. str_replace('/', '',$data['document_number']) . $data['document_title'].'/'.$doc['type'];
    
            if (File::exists($oldPath)) {
                if(!File::exists($folderDocument)){
                    File::makeDirectory($folderDocument, 0777, true);
                }
                File::move($oldPath, $newPath);
            }
            //  hawhahw

        }

        $message = array(
            'status' => true,
            'message' => 'success'
        );

        return response()->json($message);
        

    }

    public function deleteAttachment(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        $data = $request->input('data');

        $attch = AttachmentDocuments::where('id',$data['id'])->first();

        $documents = Documents::where('id', $attch->id_document)->first();
        $category = MasterDocuments::where('id', $documents->type)->first();

        if($category->inheritance_document > 0){
            $cat_first = MasterDocuments::where('id', $category->inheritance_document)->first();
            $folder = str_replace(' ', '', strtolower($cat_first->document_name)).'/'.str_replace(' ', '', strtolower($category->document_name));
        }else{
            $folder = str_replace(' ', '', strtolower($category->document_name));
        }
       
        $oldPath = public_path().'/edoc/'.$folder.'/'. $documents->created_at->format('Y') .'/'. $documents->created_at->format('m').'/'. str_replace('/', '',$documents->document_number) . $documents->title.'/'. $attch->type .'/'. $attch->filename .'.'. $attch->ext;
       
        if (File::exists($oldPath)) {
            File::delete($oldPath);
        }

        $attch->delete();

        $message = array(
            'status' => true,
            'message' => 'success'
        );

        return response()->json($message);
    }

    public function createDirectory(Request $request)
    {
        $token = $request->bearerToken();
        $users = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        $id_user = $users->sub;
        // $data = $request->input('data');

        $get = Documents::all();

        foreach ($get as $g) {
            $att = New AttachmentDocuments;
            $att->type_document = $g->type;
            $att->id_document = $g->id;
            $att->type = 1;
            $att->user_id = 1;
           


            $documents = Documents::where('id', $g->id)->first();
            $category = MasterDocuments::where('id', $documents->type)->first();
            $folder = str_replace(' ', '', strtolower($category->document_name));

            $folderDocument = public_path().'/edoc/'.$folder.'/'. $g->created_at->format('Y') .'/'. $g->created_at->format('m').'/'. str_replace('/', '',$g->document_number) .' '. $g->title.'/documents/';
           

            if(!File::exists($folderDocument)){
                File::makeDirectory($folderDocument, 0777, true);
            }
            $att->save();

        }

    }

}