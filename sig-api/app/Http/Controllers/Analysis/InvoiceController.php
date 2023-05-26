<?php
namespace App\Http\Controllers\Analysis;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Analysis\Invoice;
class InvoiceController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function index(Request $request)
    {
         $var = Invoice::with([
             'contracUji'
         ])->where('id_kontrakuji',110107)->get();
         return response()->jSon($var);
    }
     
}