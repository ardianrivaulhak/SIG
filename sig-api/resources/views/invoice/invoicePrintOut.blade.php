<html>
<head>
  <style>
    @page { margin: 100px 25px; }
    header { position: fixed; top: -60px; left: 0px; right: 0px; height: 50px; }
    footer { position: fixed; bottom: -60px; left: 0px; right: 0px;  height: 200px; }
    section { page-break-after: always; }
    section:last-child { page-break-after: never; }


     /** Define the margins of your page **/
     body {
            margin: 0;
            padding: 0;
            text-align: left;
            font-family: Tahoma, Verdana, sans-serif;
            text-align: left;
        } 

        /*  Cover CSS */

        .head-cover{
            position: fixed;
            top: -60px;
            left: 0px;
            right: 0px;
            margin-bottom:50px;
            height:100px;
        }

        .head-cover img {
            width:100%;
            display:block;
            margin-right:auto;
            margin-left:auto;
            margin-top:-30px;
        }

        .foot-cover {
            position: fixed;
            bottom: -60px;
            left: 0px;
            right: 0px;
            height: 50px;

            background-color: #fff;
            color: white;
            text-align: center;
            line-height: 35px;
        }

        .cover-page{
            margin:0 50px 0 56px;
        }

        .row-cover {
            margin: 100 30 10 0;
        }

        .ul-row-1 {
            list-style: none;
            padding-left: 0;
        }

        .ul-row-1-right {
            list-style: none;
            float: right;
            margin-top: -100px;
        }

        .row-2-cover {
            padding-top: 100px;
            margin-bottom:50px;
        }

        /* LHU CSS */
        .head-lhu {
            position: fixed;
            top: -60px;
            left: 0px;
            right: 0px;
            margin-bottom:50px;
            height:100px;
        }

        .head-lhu img {
            width:100%;
            display:block;
            margin-right:auto;
            margin-left:auto;
            margin-top:-30px;
        }

        .foot-lhu {
            position: fixed;
            bottom: -30px;
            left: 0px;
            right: 0px;
            height: 50px;
            /** Extra personal styles **/
            color: black;
            text-align: center;
            line-height: 35px;
        }

        .container {
            counter-reset: section - 1;

        }
        .foot-lhu .pages:after {
            counter-increment: section;
            content: counter(section, upper-roman);
        }

        .head-result {
            padding-top: 50px;
            text-align: center;
        }

        .head-result h4 {
            font-size: 12px;
        }

        .pages{
            margin:0 50px 0 56px;
        }

        .lhu table {
            font-size:13px;
            font-family: Tahoma, Verdana, sans-serif;
            text-align: left;
        }

        .pages .lhu .row-3 {
            text-align: center;
            font-size: 13px;W
        }

        .row-3-parent {
            position: relative;
            top: 30px;
            margin-bottom:350px;
        }

        .row-3-child {
            position: relative;
            top:50px;
        }

        .pages .lhu .row-4 {
            text-align: left;
            font-size: 13px;
        }

        .laporan-tbl {
            border: 2px black solid;
        }

        .laporan-tbl,
        .laporan-tbl th,
        .laporan-tbl td {
            border: 1px solid black;
            border-collapse: collapse;

        }

        .laporan-tbl,
        .laporan-tbl th,
        .laporan-tbl td {
            text-align: center;
        }
  </style>
</head>
<body>
  <header>
    <table style="width: 100%">
    <td style="width: 30%" align="center"><img src="{{ public_path('assets/img/logo/siglog.png') }}" style="width: 100px; height: auto" /></td>
    <td style="width: 70%">
    <span style="font-size: 14px; font-weight: bold;">PT SARASWANTI INDO GENETECH</span><br/>
            <span style="font-size: 12px;">Graha SIG Jl. Rasamala No. 20 Taman Yasmin</span><br/>
            <span style="font-size: 12px;">Bogor 16113 INDONESIA</span><br/>
            <span style="font-size: 12px;">Phone +62 251 7532 348 49 ( Hunting ), 0821 1151 6516</span><br/>
            <span style="font-size: 12px;">Fax +62 251 7540 927</span><br/>
            <a style="font-size: 12px;" href="http://www.siglaboratory.com">http://www.siglaboratory.com</a>
    </td>
    </table> 
  </header>
  <footer class="pages">
                  <table  style=" margin-top: 5px; border: 1px solid black; width: 55%; font-size: 10px; border: 1px;" class="ul-row-1"> 
                    <tr> 
                      <td><b>Mohon bukti potong PPh 23 mencantumkan data berikut :</b></td> 
                    </tr>  
                    <tr> 
                      <td>Withholding tax please refer to data below :</td> 
                    </tr>  
                    <tr> 
                      <td>Nama / name : PT. Saraswanti Indo Genetech</td> 
                    </tr> 
                    <tr> 
                      <td>NPWP / TIN : 02.059.423.0-431.000</td> 
                    </tr>
                    <tr> 
                      <td>Alamat / Address : {{$data[0]->address}}</td> 
                    </tr>
                    <tr>
                      <td>&nbsp;</td> 
                    </tr>
                    <tr> 
                      <td><b>Nomor Rekening Pembayaran / Bank Account Number</b></td> 
                    </tr>
                    <tr> 
                      <td>PT. Saraswanti Indo Genetech </td>    
                    </tr>
                    <tr> 
                      <td>A/C No. 133-00-0116081-1</td>  
                    </tr>
                    <tr> 
                      <td>Bank Mandiri, Bogor</td>  
                    </tr>
                    <tr> 
                      <td>Swift Code : BMRIIDJA</td>  
                    </tr>
                  </table>
                  <table style=" width: 100%; font-size: 10px; border: 1px; margin-top: -67px; margin-left: 200px" class="ul-row-1"> 
                    <tr>  
                      <td>PT. Saraswanti Indo Genetech</td> 
                    </tr>
                    <tr>  
                      <td>A/C No. 8-000-45938800</td> 
                    </tr>
                    <tr>  
                      <td>Bank CIMB Niaga, Surabaya</td> 
                    </tr>
                    <tr>  
                      <td>Swift Code : BNIAIDJA</td> 
                    </tr>
                  </table> 
                  <div style="margin-top: -200px">
                    <ul style="margin-right: 50px; font-size: 10px;" class="ul-row-1-right"> 
                      <li>PT. Saraswanti Indo Genetech</li>
                      <br><br><br><br><br><br><br>
                      <li>Samrin Sabarudin</li>
                      <li>Finance Manager</li> 
                    </ul>  
                  </div>  
  </footer>
  <main>
    <section >
    <!-- cover container-->
    <div class="container">
        <!-- Next page -->
        <div class="pages" >
            <div class="lhu">
              <br><br><br>
              <div class="head-result" style="margin-left: 200px">
                <h3>FAKTUR PENJUALAN /INVOICE</h3>
                <h4 style="margin-top: -20px"><i>{{$data[0]->no_invoice}}</i> 
                </h4>
              </div>
              <div>
                <table style="border: 1px solid black; width: 42%; font-size: 10px; border: 1px;" class="ul-row-1"> 
                  <tr>
                    <td>Kepada / Bill To :</td> 
                  </tr>
                  <tr> 
                    <td>{{$data[0]->customer_name}}</td> 
                  </tr>  
                  <tr> 
                    <td>{{$data[0]->address}}</td> 
                  </tr>
                  <tr>
                    <td>&nbsp;</td> 
                  </tr>
                  <tr> 
                    <td>Telepon / Phone : {{$data[0]->telpnumber}}</td> 
                  </tr>
                  <tr> 
                    <td>Faks  / Fax : {{$data[0]->fax}}</td> 
                  </tr> 
                </table>
                <table style="border: 1px solid black; margin-top: -250px; width: 57%; font-size: 10px; border: 1px;" class="ul-row-1-right"> 
                  <tr>
                    <td>No. PO / PO Number : {{$data[0]->no_po !== null ? $data[0]->no_po : "-"}}</td> 
                  </tr>
                  <tr> 
                    <td>No. Kontrak / Contract Number : {{$data[0]->contract_no}}</td> 
                  </tr>
                  <tr>
                    <td>Tgl. Faktur Penjualan / Invoice Date : {{$data[0]->tgl_faktur}}</td> 
                  </tr>
                  <tr> 
                    <td>Termin  / Terms : {{$data[0]->termin}}</td> 
                  </tr>
                  <tr>
                    <td>Tgl. Jatuh Tempo / Due Date : {{$data[0]->tgl_jatuhtempo}}</td> 
                  </tr>
                  <tr> 
                    <td>Personil Penghubung / Contact Person : {{$data[0]->contact_person}}</td> 
                  </tr>
                  <tr> 
                    <td>Mata uang  / Currency : IDR</td> 
                  </tr>
                  <tr> 
                    <td>Referensi Lain  / Other Reference : {{$data[0]->other_ref}}</td> 
                  </tr>
                </table>
              </div> 
            </div>
        </div>
 

            <div class="pages" style="page-break-after: never; margin-top: 50px">
              <div class="lhu">
                <div style="margin-top: 8px" class="row-2-cover">
                  <table class="laporan-tbl" style=" width: 100%; font-size: 10px; border: 1px;"> 
                    <tr>  
                      <th>No.</th>
                      <th>Nama Sample / Sample Description</th>
                      <th>Status Pengujian / Test Status</th>
                      <th>Harga Satuan / Unit Price</th>
                      <th>Diskon / Discount</th>
                      <th>Jumlah / Ammount</th>
                    </tr>
                    @php
                      $x= 1
                    @endphp
                    @foreach($data as $d) 
                    @if($x % 15 != 0)
                    <tr style="page-break-after: avoid">
                      <td>{{$x}}</td>
                      <td>{{$d->sample_name}}</td> 
                      <td>{{$d->status_pengujian}}</td> 
                      <td style="text-align: right;">{{$d->price}}</td> 
                      <td style="text-align: right;">{{$d->discount}}</td> 
                      <td style="text-align: right;">{{$d->totalprice}}</td> 
                    </tr>
                    continue
                    @endif
                    @if($x % 15 == 0)
                    <tr style="page-break-after: avoid">
                      <td>{{$x}}</td>
                      <td>{{$d->sample_name}}</td> 
                      <td>{{$d->status_pengujian}}</td> 
                      <td style="text-align: right;">{{$d->price}}</td> 
                      <td style="text-align: right;">{{$d->discount}}</td>
                      <td style="text-align: right;">{{$d->totalprice}}</td> 
                    </tr>
                    @if($x != 1)
                  </table>
                </div>  
                @endif
                @if($x != 1)
                <div style="margin-top: 8px" class="row-2-cover">
                  <table class="laporan-tbl" style=" width: 100%; font-size: 10px; border: 1px;margin-top:130px;"> 
                    <tr>  
                      <th>No.</th>
                      <th>Nama Sample / Sample Description</th>
                      <th>Status Pengujian / Test Status</th>
                      <th>Harga Satuan / Unit Price</th>
                      <th>Diskon / Discount</th>
                      <th>Jumlah / Ammount</th>
                    </tr>
                            @endif
                            @endif
                            {{ $x++ }}
                        @endforeach
                    
                      <tr>
                        <td colspan="6"> &nbsp; </td>
                      </tr>  

                      <tr>
                      <td colspan="2" rowspan="9" style="text-align: left;">
                      Catatan  / Notes : <br>
                      Pembayaran harap mencantumkan nomor invoice dan bukti pembayaran di email ke -  paymentinfo-sig@saraswanti.com atau fax ke 0251-7540927 <br>
                      Please write the invoice number on your payment and fax the payment receipt to 0251-7540927 or email to paymentinfo-sig@saraswanti.com
                      </td>   
                      <td style="text-align: left; width: 190px">Biaya Pengujian/ Cost Analysis :</td>
                      <td style="width: 50px; text-align: right;">
                      {{ $biayapengujian }}
                      </td>  
                      <td style="width: 95px; text-align: right;">
                      {{ $jumlahdiscount }}  
                      </td>
                      <td style="text-align: right;">
                       {{ $jumlahtotalprice }}
                      </td>  
                    </tr>
                    <tr>
                      <td style="text-align: left;">Biaya peng. sampel / sampling cost :</td>
                      <td style="text-align: right;">{{ $biayaakg }}</td>  
                      <td style="text-align: right;">-</td> 
                      <td style="text-align: right;">{{ $biayaakg }}</td> 
                    </tr>
                    <tr>
                      <td style="text-align: left;">Biaya ING / ING Cost :</td>
                      <td style="text-align: right;">-</td>    
                      <td style="text-align: right;">-</td> 
                      <td style="text-align: right;">{{ $biayaing }}</td> 
                    </tr>
                    <tr>
                      <td style="text-align: left;">Sub Total / Sub Total :</td>
                      <td style="text-align: right;">-</td>    
                      <td style="text-align: right;">-</td> 
                      <td style="text-align: right;">{{ $subtotal }}</td> 
                    </tr>
                    <tr>     
                      <td style="text-align: left;">PPN / VAT :</td>
                      <td rowspan="5" colspan="2" style="text-align: right; background-color: black;">-</td>     
                      <td style="text-align: right;">{{ $ppn }}</td> 
                    </tr> 
                    <tr>    
                      <td style="text-align: left;">Kode Pembayaran  / Payment Code :</td>   
                      <td style="text-align: right;">-</td> 
                    </tr> 
                    <tr>    
                      <td style="text-align: left;">TOTAL / Total :</td>  
                      <td style="text-align: right;">{{ $totalppn }}</td> 
                    </tr>  
                    <tr>     
                      <td style="text-align: left;">Uang Muka / Down Payment :</td>  
                      <td style="text-align: right;">{{ $downpayment }}</td> 
                    </tr>
                    <tr>    
                      <td style="text-align: left;">Sisa Pembayaran / Balance :</td>  
                      <td style="text-align: right;">{{ $sisapembayaran }}</td> 
                    </tr>
                  </table>
                  <br>
                  <table style="border: 1px solid black; width: 100%; font-size: 10px; border: 1px;" class="ul-row-1"> 
                    <tr> 
                      <td>Terbilang / Say : {{ $terbilangsisapembayaran }}</td> 
                    </tr>  
                  </table> 
                </div> 
                        
              </div>  
            </div> 
              
    </div>
        
    </section> 
  </main>
</body>
</html>