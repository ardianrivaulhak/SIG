<html>
<head>
  <style>
    @page { margin: 100px 25px; }
    header { position: fixed; top: -60px; left: 0px; right: 0px; height: 50px; }
    footer { position: fixed; bottom: -60px; left: 0px; right: 0px; height: 50px; }
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
        <hr>
    </header>
    <footer>
        <div style="margin-top: 30px">
                    <ul class="ul-row-1-right"> 
                      <li>Bogor,  {{ date('d F Y') }}</li>
                      <br><br><br><br><br>
                      <li>Rina Sugiarti</li> 
                    </ul>  
        </div>
    </footer> 
    <section>
    <div class="container">
        <!-- Next page -->
        <div class="pages" style="margin-bottom: -15px">
            <div class="lhu">
                <div class="head-result" style="margin-left: 220px">
                    <h2>K W I T A N S I</h2>    
                    <p style="margin-top: -20px;">No. T.1260017</p>
                </div>
            </div>
        </div>
        <hr>
        <div> 
            <table class="ul-row-1">
                <tr>
                    <td>Telah terima dari</td>
                    <td>:</td>
                    <td>{{$data[0]->customer_name}}</td>
                </tr>
                <tr>
                    <td>Uang Sejumlah</td>
                    <td>:</td>
                    <td style="border-bottom:3px dashed #f6f6f6; border-opacity: 1; width: 580px;">{{ $terbilangsisapembayaran }}</td> 
                </tr>
                <tr>
                    <td>&nbsp;</td>  
                </tr>
                <tr>
                    <td>Untuk Pembayaran</td>
                    <td>:</td>
                    <td>Analisa {{$data[0]->no_invoice}}</td>
                </tr>
                <tr>
                    <td>&nbsp;</td>
                    <td>:</td>
                    <td style="border-bottom:3px dashed #f6f6f6; border-opacity: 1; width: 580px;"  >{{$data[0]->other_ref}}</td>
                </tr>
            </table>  
        </div>    
    </div>
        
    </section>

    </body>
</html>