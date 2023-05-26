<!DOCTYPE html>
<html>
<head>
    <title>Page Title</title>
    <style>
        .heading {
            display: block;
            margin-bottom: 100px;
        }
        .heading h1{
            font-size:14px;
            text-align: center;
        }

        .heading #left {
            float: left;
        }

        .heading #right {
            float: right;
        }

        .content table {
            border-collapse: collapse;
        }
        
        .content table tr th {
            border: 1px solid #000;
        }
        .content table tr td {
            border: 1px solid #000;
        }
    </style>
</head>
<body>
    <div class="heading">
        <h1>FORMULIR SPESIFIKASI PENGUJIAN</h1>

        <div id="left">
            <table>
                <tr>
                    <td>No. Kontrak Uji</td>
                    <td>:</td>
                    <td>{{ $sample[0]->kontrakuji->contract_no }}</td>
                </tr>
                <tr>
                    <td>Penerima Sample di Laboratorium</td>
                    <td>:</td>
                    <td>0</td>
                </tr>
                <tr>
                    <td>Tanggal Terima Sample di Laboratorium</td>
                    <td>:</td>
                    <td>{{ $sample['0']->tgl_input }}</td>
                </tr>
                <tr>
                    <td colspan="3">Page 1 of 1</td>
                </tr>
            </table>
        </div>

        <div id="right">
            <p>No. 26.2/F-PP/SMM-SIG<br>
            Revisi: 3</p>
        </div>
        

    </div>

    <div class="content">
        <table style="width:100%">
            <tr>
              <th>No</th>
              <th>No. Identifikasi Sample</th>
              <th>Jenis / Uraian Sample</th>
              <th>Parameter yg diuji</th>
              <th>Metode</th>
              <th>Tgl Estimasi Selesai Lab</th>
              <th>Hasil Uji</th>
              <th>LOD</th>
              <th>Satuan</th>
            </tr>
            @php $no=1; @endphp
            @foreach ($parameters as $parameter)
            <tr>
                <td>{{ $no }}</td>
                <td>Smith</td>
                <td>50</td>
                <td>{{ $parameter->parameteruji->name_id }}</td>
                <td>{{ $parameter->metode->metode }}</td>
                <td>{{ $parameter->metode->metode }}</td>
                <td>{{ $parameter->hasiluji }}</td>
                <td>{{ $parameter->lod == null ? 'empty' : $parameter->lod->nama_lod }}</td>
                <td>{{ $parameter->unit->nama_unit }}</td>
              </tr>
              @php $no++; @endphp
            @endforeach
          </table> 
    </div>


</body>
</html> 