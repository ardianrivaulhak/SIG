<?php
namespace App\Http\Controllers\Printout;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Analysis\Customerhandle;
use Firebase\JWT\JWT;
use Barryvdh\DomPDF\Facade as PDF;
use Carbon\Carbon as time;

class TandaTerimaController extends Controller
{

    

    public function testing(Request $request){
        $v = \DB::table('transaction_sample as a')
            ->selectRaw('
            d.no_invoice,
            d.cust_code,
            j.customer_name,
            g.address,
            i.telpnumber,
            i.fax,
            d.no_po,
            b.contract_no,
            d.tgl_faktur,
            d.termin,
            d.tgl_jatuhtempo,
            i.name AS contact_person,
            d.description AS other_ref,
            a.no_sample,
            a.sample_name,
            e.name AS status_pengujian,
            f.name AS tujuan_pengujian,
            a.price,
            a.discount,
            a.price - a.discount AS totalprice,
            if(DATA1.price_akg IS NULL, 0, DATA1.price_akg) AS price_akg,
            if(DATA2.price_sampling IS NULL, 0, DATA2.price_sampling) AS price_ing,
            k.ppn,
            k.downpayment,
            d.id
            ')
            ->leftJoin('mstr_transaction_kontrakuji as b','b.id_kontrakuji','a.id_contract')
            ->leftJoin('invoice_detail as c','c.id_sample','a.id')
            ->leftJoin('invoice_header as d','d.id','c.id_inv_header')
            ->leftJoin('mstr_transaction_statuspengujian as e','e.id','a.id_statuspengujian')
            ->leftJoin('mstr_transaction_tujuanpengujian as f','f.id','a.id_tujuanpengujian')
            ->leftJoin('mstr_customers_address as g','g.id_address','d.id_cust_address')
            ->leftJoin('mstr_customers_taxaddress as h','h.id_taxaddress','d.id_cust_taxaddress')
            ->leftJoin('mstr_customers_contactperson as i','i.id_cp','d.idcp')
            ->leftJoin('mstr_customers_customer as j','j.id_customer','d.idcust')
            ->leftJoin(\DB::raw('(SELECT SUM(bb.price) AS price_akg, aa.id_transaction_kontrakuji FROM transaction_akg_contract aa
                        LEFT JOIN mstr_transaction_akg bb ON bb.id = aa.id_mstr_transaction_akg
                        GROUP BY aa.id_transaction_kontrakuji) AS DATA1'),'DATA1.id_transaction_kontrakuji','b.id_kontrakuji')
            ->leftJoin(\DB::raw('(SELECT SUM(dd.price) AS price_sampling, cc.id_transaction_contract FROM transaction_sampling_contract cc
                        LEFT JOIN mstr_transaction_sampling dd ON dd.id = cc.id_mstr_transaction_sampling
                        GROUP BY cc.id_transaction_contract) as DATA2'),'DATA2.id_transaction_contract','b.id_kontrakuji')
            ->leftJoin('payment_contract as k','k.id_contract','b.id_kontrakuji')
            ->where('d.id',$request->input('idinv'))->get();
            // return response()->json($v);
        


        $pdf = PDF::loadView('invoice/tandaTerimaPrintOut',array('data' => $v))->setPaper('a4', 'portrait');
        return $pdf->download('BeritaAcara.pdf');   
    }

}