<html>
<head>
  <style>
    @page { margin-top: 150px; margin-bottom: 10px; margin-left: 25px; margin-right: 25px; }
    header { position: fixed; top: -130px; left: 0px; right: 0px; height: 200px; }
    footer { position: fixed; bottom: -90px; left: 0px; right: 0px;  height: 200px; }
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
        
    </footer> 

    <main>
    <section >
        <!-- cover container-->
        <div class="container">
            <!-- Next page -->
            <div class="pages" page-break-after: never;>
              <div class="lhu">
                <div class="head-result">
                  <h3>KONTRAK PENGUJIAN</h3>
                  <h4 style="margin-top: -20px"><i>{{$data->contract_no}}</i> 
                  </h4>
                </div>
                    <div>
                      <table style="margin-top: 20px; font-size: 10px; width: 100%; padding: 0" >
                        <tr>
                          <td style="width: 2%;">-</td>
                          <td style="width: 25%;">Nama Pelanggan</td>
                          <td style="width: 2%;">:</td>
                          <td >{{$data->customers_handle->customers->customer_name}}</td>
                        </tr>
                        <tr>
                          <td>-</td>
                          <td>Personil Penghubung</td>
                          <td style="width: 2%;">:</td>
                          <td >{{$data->customers_handle->contact_person->name}}</td>
                        </tr>
                        <tr>
                          <td>-</td>
                          <td>Alamat</td>
                          <td style="width: 2%;">:</td>
                          <td>{{$data->cust_address->address}}</td>
                        </tr>
                        <tr>
                          <td>-</td>
                          <td>No. Telp / Fax / Email</td>
                          <td style="width: 2%;">:</td>
                          <td >{{$data->customers_handle->contact_person->telpnumber}} / {{$data->customers_handle->contact_person->email}}</td>
                        </tr> 
                        <tr>
                          <td>-</td>
                          <td>No Penawaran</td>
                          <td style="width: 2%;">:</td>
                          <td >-</td>
                        </tr>
                        <tr>
                          <td>-</td>
                          <td colspan="3">Informasi Contoh Uji</td>
                        </tr>
                      </table> 

                      <div style="margin-top: 0px" class="row-1-cover">
                      <table class="laporan-tbl" style="margin-top: 10px; border: 1px solid black; border-collapse: collapse;" >
                        <tr>
                          <td style="width: 4%;border: 1px solid black;">No.</td>
                          <td style="width: 10%;border: 1px solid black;">No. Identifikasi Sample</td>
                          <td style="width: 10%;border: 1px solid black;">Tanggal Selesai</td>
                          <td style="width: 13%;border: 1px solid black;">Jenis Produk </td>
                          <td style="width: 15%;border: 1px solid black;">Nama Sample</td>
                          <td style="width: 13%;border: 1px solid black;">Jenis Kemasan</td>
                          <td style="width: 10%;border: 1px solid black;">Status Pengujian</td>
                          <td style="width: 10%;border: 1px solid black;">Parameter Uji</td>
                        </tr> 

                        @php
                        $x= 1
                        @endphp
                        @foreach($data->transactionsample as $d) 
                        @if($x % 12 != 0)
                        <tr style="page-break-after: avoid">
                          <td style="width: 5%;border: 1px solid black;">{{$x}}</td>
                          <td style="width: 10%;border: 1px solid black;">{{$d->no_sample}}</td>
                          <td style="width: 10%;border: 1px solid black;">{{date_format(date_create($d->tgl_selesai),"d F Y")}}</td>
                          <td style="width: 13%;border: 1px solid black;">{{$d->nama_dagang}}</td>
                          <td style="width: 15%;border: 1px solid black;">{{$d->sample_name}}</td>
                          <td style="width: 13%;border: 1px solid black;">{{$d->jenis_kemasan}}</td>
                          <td style="width: 10%;border: 1px solid black;">{{$d->statuspengujian->name}}</td>
                          <td style="width: 10%;border: 1px solid black;">Terlampir</td>
                        </tr>
                        continue
                        @endif
                        @if($x % 12 == 0)
                        <tr style="page-break-after: avoid">
                          <td style="width: 5%;border: 1px solid black;">{{$x}}</td>
                          <td style="width: 10%;border: 1px solid black;">{{$d->no_sample}}</td>
                          <td style="width: 10%;border: 1px solid black;">{{date_format(date_create($d->tgl_selesai),"d F Y")}}</td>
                          <td style="width: 13%;border: 1px solid black;">{{$d->nama_dagang}}</td>
                          <td style="width: 15%;border: 1px solid black;">{{$d->sample_name}}</td>
                          <td style="width: 13%;border: 1px solid black;">{{$d->jenis_kemasan}}</td>
                          <td style="width: 10%;border: 1px solid black;">{{$d->statuspengujian->name}}</td>
                          <td style="width: 10%;border: 1px solid black;">Terlampir</td>
                        </tr>
                        @if($x != 1)
                      </table> 
                      </div>       
                      @endif
                      @if($x != 1)
                      <div style="margin-top: 0px" class="row-2-cover">
                      <table class="laporan-tbl" style="margin-top: 20px; border: 1px solid black;" >
                        <tr>
                          <td style="width: 4%;">No.</td>
                          <td style="width: 10%;">No. Identifikasi Sample</td>
                          <td style="width: 10%;">Tanggal Selesai</td>
                          <td style="width: 13%;">Jenis Produk Pangan </td>
                          <td style="width: 15%;">Nama Sample</td>
                          <td style="width: 13%;">Jenis Kemasan</td>
                          <td style="width: 10%;">Status Pengujian</td>
                          <td style="width: 10%;">Parameter Uji</td>
                        </tr> 
                        @endif
                            @endif
                            {{ $x++ }}
                        @endforeach
                        </table>
                        <br>
                        <br>
                        <br>
                        <br>

                         
                          <div style="display: flex; flex-direction: column; justify-content: space-around; align-items: center;">
                            <div class="row-4" style="margin-top: 0px;">
                              <p>Pelanggan,
                              <br>
                              <br>
                              <br>
                              <br>
                              <br> 
                              <br> 
                              {{$data->customers_handle->contact_person->name}}
                              <br>
                              </p>
                            </div>
                            <div class="ul-row-1-right" style="font-size: 13px; margin-top: 0px;">
                              <p>{{ date_format(date_create($data->transactionsample[0]->tgl_input),"d F Y") }}
                              <br>
                              Penerima contoh uji
                              <br>
                              <br>
                              <br> 
                              <br> 
                              <br> 
                              Manager Laboratorium
                              <br>
                              </p>
                            </div>
                          </div> 
                          <div>
                            <table  style=" width: 50%; font-size: 10px; border: 1px solid black; border-radius: 10px;" class="ul-row-1"> 
                              <tr> 
                                <td></td> 
                              </tr>
                              <tr> 
                                <td><b>Nomor Rekening Pembayaran</b> / <b style="font-style: italic;">Bank Account Number ( IDR )</b></td> 
                              </tr>  
                              <tr> 
                                <td>&nbsp;</td> 
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
                              <tr>  
                                <td>&nbsp;</td> 
                              </tr>
                            </table>
                            <table style=" width: 100%; font-size: 10px; border: 1px; margin-top: -85px; margin-left: 160px" class="ul-row-1"> 
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
                              <tr>  
                                <td>&nbsp;</td> 
                              </tr>
                            </table> 
          
                            <div style="margin-top: 5px; width: 100%; font-size: 10px;"> 
                              <span style="margin-left: 0px;font-size: 8px; font-style: italic;">* syarat dan ketentuan pengujian bisa dilihat dihalaman belakang lembar ini</span>
                            </div>
                
                          </div>  
                          <div style="margin-top: -35px">
                              <ul style="margin-right: 0px; width: 42%; font-size: 10px; border: 1px solid black; border-radius: 10px; height: 130px" class="ul-row-1-right"> 
                                <li><b>Keterangan:</b></li>
                                <li>{{$data->desc}}</li>
                              </ul>  
                          </div>
                        
                      </div>  
                    </div>  
                    
              </div>
              
            </div> 
            <!-- Next page -->
        </div>
    </section>

    <section>
      <!-- cover container-->
        <div class="container">
            <!-- Next page -->
            <div class="pages" page-break-after: never;>
              <div class="lhu"> 
                <div class="head-result">
                  <h3>PARAMETER PENGUJIAN</h3>
                  <h3 style="margin-top: -20px; font-size: 15px;">Lampiran Kontrak Uji {{$data->contract_category->title}}</h3>
                </div>

                <div style="margin-top: 0px" class="row-1-cover">
                   

                    @php
                      $x= 1
                    @endphp
                    @foreach($data->transactionsample as $d) 
                      <table  class="laporan-tbl" style="page-break-after: avoid; width: 100%; margin-top: 50px;" >
                        
                        <tr style="page-break-after: avoid;">
                        <td colspan="2">{{$d->no_sample}} - <span style="text-transform: uppercase;">{{$d->sample_name}}</span> </td>
                        </tr>
                        
                        @php
                          $s= 1
                        @endphp
                        @foreach($d->transactionparameter as $x)
                        @if($s % 20 != 0) 
                        <tr style="page-break-after: avoid;">
                          <!-- <td style="text-align: left;">{{$x->parameteruji->name_id}} - {{$x->position}}
                          </td> -->
                          <td style="text-align: left;">
                          @php
                          if(!empty($x->position)){
                            echo $x->parameteruji->name_id.' - '.$x->position;
                          } else {
                            echo $x->parameteruji->name_id;
                          }
                          @endphp
                          </td>
                          <td>{{$x->status_string}}                           
                          </td> 
                        </tr>
                        continue
                        @endif
                        @if($s % 20 == 0)
                        <tr style="page-break-after: avoid;">
                        <td style="text-align: left;">
                          @php
                          if(!empty($x->position)){
                            echo $x->parameteruji->name_id.' - '.$x->position;
                          } else {
                            echo $x->parameteruji->name_id;
                          }
                          @endphp
                          </td>
                        <!-- <td style="text-align: left;">{{$x->parameteruji->name_id}} - {{$x->position}}; -->
                          </td>
                          <td>{{$x->status_string}}                           
                          </td> 
                        </tr>
                        @if($s != 1)

                        @endif
                        @if($s != 1)

                        
                        @endif
                        @endif
                        {{ $s++ }}
                        @endforeach 

                        <tr style="page-break-after: avoid;">
                        <td style="text-align: left;"><b>Total Rp.</b></td>
                        <td style="text-align: right;"><b>{{number_format($d->price,0,",",".")}}</b></td>
                        </tr>
                      </table>
                    @endforeach
                
                </div>






              </div>
            </div>
        </div>
    </section>
 
    </main>   
    


</body>