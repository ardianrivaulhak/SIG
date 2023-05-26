<html>
<head>
  <style>
    @page { margin: 100px 25px; }
    header { position: fixed; top: -60px; left: 0px; right: 0px; height: 50px; }
    footer { position: fixed; bottom: -60px; left: 0px; right: 0px; background-color: lightblue; height: 50px; }
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
    <br><br><br><br>
    <table class="ul-row-1">
      <tr>
      <td>No</td>
      <td>:</td>
      <td>SIG.CL.X.{{ date('Y') }}.{{ $nosigcl }}.{{ date('His') }}</td>
      </tr>
      <tr>
      <td>Perihal</td>
      <td>:</td>
      <td><b>Berita Acara</b></td>
      </tr>
    </table> 
    <ul class="ul-row-1-right">
      <li>Bogor, {{ date('d F Y') }}</li>
    </ul> 
  </header> 
  <!-- <footer>footer on each page</footer> -->
  
  <main>
  @foreach($data as $d) 
    <section>
      <div class="row-2-cover">
        <p>
          Kepada Yth. <br><br>
          {{$d->customer_name}} <br>
          {{$d->address}}
        </p>
      </div>
      <br><br><br>
      <div class="row-3-cover">
        <p>Dengan hormat, <br>Berdasarkan surat order marketing nomor : {{$d->contract_no}}, untuk pengerjaan<br>
        Yang dimaksud dengan rincian berikut, telah selesai dilaksanakan,
        </p>
      </div>
      <div style="margin-left: 50px;" class="row-3-cover">
        <table class="ul-row-1">
          <tr>
          <td>Nama Sample</td>
          <td>:</td>
          <td>{{$d->sample_name}}</td>
          </tr>
          <tr>
          <td>Keterangan</td>
          <td>:</td>
          <td>{{$d->other_ref}}</td>
          </tr>
        </table>
      </div>
      <div class="row-3-cover">
        <p>Demikian surat ini kami sampaikan semoga dapat dipergunakan sebagaimana mestinya.<br>
        Atas kerjasama yang baik kami mengucapkan terima kasih.
        </p>
      </div>
      <br><br><br><br><br>
      <div class="row-4-cover"> 
        <p>Hormat kami, <br> PT. Saraswanti Indo Genetech <br>
        <!-- <img src="{{ public_path('assets/backend/images/aryo42.png') }}" style="position:absolute; margin-top:-10px; width:30%;"> -->
        <br><br><br><br><br><br><br>
        <b>Robertus B.Aryo</b> <br> Manager Marketing
        </p>  

        <ul style="margin-top: -400px;" class="ul-row-1-right">
          <li>Telah diterima oleh,</li>
          <li>{{$d->customer_name}}</li>
          <br><br><br><br><br><br><br><br>
          <li>( &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; )</li> 
        </ul> 
      </div>
    </section> 
    @endforeach
  </main>

</body>
</html>