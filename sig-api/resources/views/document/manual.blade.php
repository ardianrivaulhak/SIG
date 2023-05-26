<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Manual Certificate</title>

    <style>
        /** Define the margins of your page **/
        body {
            margin: 0;
            padding: 0;
            text-align: left;
            font-family: Tahoma, Verdana, sans-serif;
            text-align: left;
        }

        @page {
            margin: 100px 25px;
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
            bottom: -40px;
            height: 50px;

            background-color: #fff;
            color: white;
            line-height: 35px;
        }

        .cover-page{
            margin:0 30px 0 36px;
            font-size:13px;
        }

        .row-cover {
            margin: 0;

        }

        .ul-row-1 {
            list-style: none;
            padding-left: 0;
        }

        .ul-row-1-right {
            list-style: none;
            float: right;
            margin-top: -60px;
        }

        .row-2-cover {
            padding-top: 30px;
            margin-bottom: 10px;
        }

        /* LHU CSS */
        .head-lhu {
            position: fixed;
            top: -80px;
            left: 0px;
            right: 0px;
            margin-bottom:50px;
            height:120px;
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
            text-align: left;
            line-height: 35px;
        }

        .container {
            counter-reset: section - 1;

        }
        /* .foot-lhu .pages:after {
            counter-increment: section;
            content: counter(section, upper-roman);
        } */

        .head-result {
            padding-top: 50px;
            text-align: left;
        }


        .pages{
            margin:0  0 0 56px;
        }

        .lhu table {
            font-size:12px;
            font-family: Arial, Helvetica, sans-serif;
            text-align: left;
        }

        .pages .lhu .row-3 {
            text-align: center;
            font-size: 12px;
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
            font-size: 12px;
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

        table { border-collapse: collapse; }

    </style>
</head>
<body>
    <!-- cover container-->
    <div class="container">
        <!-- header footer cover -->
        <div class="head-cover">
            <img class="img img-responsive" src="assets/img/logo/logo.png" style="width:25%; margin:0 0 0px 40px;">
        </div><br>
        <hr style="color:black; ">
        <div class="foot-cover">
            <div style="margin-left: 40px;">
                <span style="font-size:10px; margin-top:40px;  line-height: 80%; font-family: Arial, Helvetica, sans-serif; color:#000; line-height:1;">
                    PT. Saraswanti Indo Genetech <br>
                    Jl. Rasamala No. 20, Taman Yasmin, Bogor Jawa Barat 16113. <br>
                    Tel. +62 251 7532348 Hotline. +62 821 11 516 516. <br>
                    www.siglaboratory.com <br>
                </span>
                <img class="img img-responsive" src="assets/img/logo/ilac-kan.png" style="width:50%; margin: -70px 0 0 350px; position: absolute;">
            </div>
        </div>
        <!-- end header footer  cover-->
        <!-- cover pages -->
        <div class="cover-page" style="page-break-after: always; ">
            <div class="cover" style="margin-top:50px;">
                <div class="row-cover">
                   

                    <table class="ul-row-1">
                        <tr>
                            <td>No</td>
                            <td>:</td>
                            <td>{{ $sertifikat['cl_number'] }}</td>
                        </tr>
                        <tr>
                            <td>Lamp</td>
                            <td>:</td>
                            <td> 1 Halaman</td>
                        </tr>
                        <tr>
                            <td>Perihal</td>
                            <td>:</td>
                            <td>Laporan Hasil Uji Laboratorium</td>
                        </tr>
                    </table>
                    <ul class="ul-row-1-right">
                        <li>Bogor,   {{ date('d F Y', strtotime($sertifikat['date_at'])) }}</li>
                    </ul>
                </div>
                <div class="row-2-cover">
                    <p>Kepada Yth. <br>
                       {{ $sertifikat['customer']['customer_name'] }}
                        <br>
                         {{ $sertifikat['address']['address'] }}
                        <br>
                    </p>
                </div>
                <div class="row-3-cover">
                    <p>Dengan hormat, <br>Berdasarkan surat order marketing nomor :  {{ $sertifikat['transaction_sample']['kontrakuji']['contract_no'] }} , maka bersama ini   kami sampaikan hasil uji analisis laboratorium.<br><br>
                        Demikian surat ini kami sampaikan semoga dapat dipergunakan sebagaimana mestinya.<br> Atas kerjasamanya yang baik kami mengucapkan terima kasih.
                    </p>
                </div>
                <br><br><br>
                <div class="row-4-cover">
                    <p>Hormat kami, <br> PT. Saraswanti Indo Genetech <br>
                        <img src="assets/img/logo/aryo.png" style="position:absolute; margin-top:-10px; width:25%;">
                        <br><br><br><br><br><br><br>
                        <b>RB Ernesto Arya</b> <br>GM <br>Sales & Marketing
                    </p>
                </div>
            </div>
        </div>
         <!-- end cover pages-->
    </div>
    <!-- end cover container -->

        <!-- header footer LHU-->
        <div class="head-lhu">
            <img class="img img-responsive" src="assets/img/logo/logo.png" style="width:25%; margin:0 0 0 40px;">
            <div class="rev-iso" style="font-size:11px; margin:-10px 50px 30px 0;">
                <span style="float:right; font-size:12px;">
                    <small style="float:right;">No. 28.1/F-PP/SMM-SIG</small><br>
                    <small class="pages" style="float:right;" >
                </span>
            </div>
            <hr>
        </div>
       <div class="foot-lhu">
            <div style="margin-left: 40px;">
                <span style="font-size:10px; 
                margin-top:40px;  
                line-height: 80%; 
                font-family: Arial, Helvetica, sans-serif; 
                color:#000; 
                line-height:1;">
                    PT. Saraswanti Indo Genetech <br>
                    Jl. Rasamala No. 20, Taman Yasmin, Bogor Jawa Barat 16113. <br>
                    Tel. +62 251 7532348 Hotline. +62 821 11 516 516. <br>
                    www.siglaboratory.com <br>
                </span>
                <span style="width:50%; margin: -30px 0 0 275px; 
                    position: absolute; 
                    font-size:10px; 
                    line-height: 80%; 
                    font-family: Arial, Helvetica, sans-serif; 
                    color:#000;
                    text-align: right;
                    line-height:1;">
                    
                    The results of these tests relate only to the sample(s) submitted.<br>
                    This report shall not be reproduced except in full context,<br>
                    without the written approval of PT. Saraswanti Indo Genetech
                    </span>
            </div>
        </div>
       <!-- end header footer LHU-->
        
        <div class="container">
            <!-- Next page -->        
            <div class="pages" style="page-break-after: never;">
                <div class="lhu">
                    <div class="row-3-parent">
                        <div class="head-result" style="padding-top:10px; text-align: center;">
                            <h4>RESULT OF ANALYSIS / LEMBAR HASIL UJI </h4>
                        </div>
                        <div style="margin-bottom: 50px;">
                            <table>
                                <!-- Nomor -->
                                <tr>
                                    <th width="20px" style="text-align: left;">I. </th>
                                    <th width="300px " style="text-align: left;">Number / Nomor </th>
                                    <th width="2px " style="text-align: left;"></th>
                                    <th></th>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>1.1. Order No. / No. Order</td>
                                    <td>: </td>
                                    <td>{{ $sertifikat['transaction_sample']['kontrakuji']['contract_no'] }} </td>
                                </tr>
                                <!-- Pelanggan -->
                                <tr>
                                    <td> <b> II.</b></td>
                                    <td> <b>Principal / Pelanggan</b></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>2.1. Name / Nama</td>
                                    <td>: </td>
                                    <td>  {{ $sertifikat['customer']['customer_name'] }}</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>2.2. Address / Alamat</td>
                                    <td>: </td>
                                    <td>   {{ $sertifikat['address']['address'] }}</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>2.3. Phone / Telepon</td>
                                    <td>: </td>
                                    <td>  {{ $sertifikat['customer_telp'] }}</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>2.4. Contact Person / Personil Penghubung</td>
                                    <td>: </td>
                                    <td>{{ $sertifikat['contact_person']['name'] }}</td>
                                </tr>
                                <!-- Sample -->
                                <tr>
                                    <td> <b>III.</b></td>
                                    <td> <b>Sample / Contoh Uji</b></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>3.1. Sample Code / Kode Sampel</td>
                                    <td>: </td>
                                    <td>{{ $sertifikat['kode_sample'] }}</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>3.2. Batch Number / No Batch</td>
                                    <td>: </td>
                                    <td> {{ $sertifikat['batch_number'] }}</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>3.3. Lot Number / No Lot</td>
                                    <td>: </td>
                                    <td> {{ $sertifikat['lot_number'] }}</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>3.4. Packaging / Kemasan</td>
                                    <td>: </td>
                                    <td> {{ $sertifikat['jenis_kemasan'] }}</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>3.5. Production Date / Tanggal Produksi</td>
                                    <td>: </td>
                                    <td> {{ $sertifikat['tgl_produksi'] }}</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>3.6. Expire Date / Tanggal Kadaluarsa</td>
                                    <td>: </td>
                                    <td>  {{ $sertifikat['tgl_produksi'] }}</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>3.7. Factory Name / Nama Pabrik</td>
                                    <td>: </td>
                                    <td>{{ $sertifikat['nama_pabrik'] }}</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>3.8. Factory Address / Alamat Pabrik</td>
                                    <td>: </td>
                                    <td>{{ $sertifikat['alamat_pabrik'] }}</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>3.9. Trade Mark / Nama Dagang</td>
                                    <td>: </td>
                                    <td>{{ $sertifikat['nama_dagang'] }}</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>3.10. Sample Name / Nama Sample</td>
                                    <td>: </td>
                                    <td> {{ $sertifikat['transaction_sample']['sample_name'] }}</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>3.11. Other Information / Keterangan Lain</td>
                                    <td>: </td>
                                    <td> {{ $sertifikat['transaction_sample']['keterangan_lain'] }}</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>3.12. Date of Sampling / Tanggal Sampling</td>
                                    <td>:</td>
                                    <td>{{ $sertifikat['tgl_sampling'] }} </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>3.13. Date of Acceptance  / Diterima</td>
                                    <td>: </td>
                                    <td> {{ $sertifikat['tgl_input'] }}</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>3.14. Date of Analysis / Tanggal Uji</td>
                                    <td>: </td>
                                    <td> {{ $sertifikat['tgl_estimasi_lab'] }}</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>3.15. Type of Analysis / Jenis Uji</td>
                                    <td>: </td>
                                    <td> Terlampir</td>
                                </tr>
                                <!-- Hasil -->
                                <tr>
                                    <td> <b>IV.</b> </td>
                                    <td> <b>Result / Hasil Uji</b> </td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                {{-- content manual --}}
                    <div style="margin:0 30px 0 36px;">
                        {!!  $sertifikat['manual'] == null ? '-' : $sertifikat['manual']['datamanual'] !!}
                        
                         <div class="row-4">
                            <p style="font-size:11px;">Bogor, &nbsp; {{ date('d F Y', strtotime($sertifikat['date_at'])) }}<br> PT. Saraswanti Indo Genetech <br>
                                <img src="assets/img/logo/dwi.png" style="position:absolute; margin:-20px 0 20px 0; width:30%;">
                                <img src="data:image/png;base64, {!! $qr !!}" style="margin: 0 0 0 250px; width:15%;"><br>
                                 <br>
                                <b>Dwi Yulianto Laksono, S.Si</b> <br> General Laboratory Manager
                                <br>
                            </p>
                        </div>
                    </div>
                    
            </div>
          <script type="text/php">
            $pdf->page_script('
                if ($PAGE_NUM > 1) {
                    $font = $fontMetrics->get_font("Arial, Helvetica, sans-serif", "normal");
                    $size = 10;
                    $pagekurang = $PAGE_NUM - 1;
                    $totalpagekurang = $PAGE_COUNT - 1;
                    $text = "Result of Analysis | Page ".$pagekurang." of ".$totalpagekurang;
                    $width = $fontMetrics->get_text_width($text, $font, $size) / 2;
        
                    $x = ($pdf->get_width() - $width) / 1.35;
                    $y = $pdf->get_height() - 100;
                    $pdf->text($x, $y, $text, $font, $size);
                } else {
                    $font = $fontMetrics->get_font("Arial, Helvetica, sans-serif", "normal");
                    $size = 10;
                    $pageText = "";
                    $width = 21 / 2;
                    $x = ($pdf->get_width() - $width) / 1.35;
                    $y = $pdf->get_height() - 100;
                    $pdf->text($x, $y, $pageText, $font, $size);
                }
            ');
        </script>
</body>
</html>