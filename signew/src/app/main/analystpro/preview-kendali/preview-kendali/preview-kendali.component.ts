import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { Sort } from '@angular/material/sort';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-preview-kendali',
  templateUrl: './preview-kendali.component.html',
  styleUrls: ['./preview-kendali.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class PreviewKendaliComponent implements OnInit {
  displayedColumns: string[] = ['no', 'sample', 'uraian', 'jenis_parameter', 'parameter_uji', 'metode', 'tgl_estimasi', 'hasil_uji', 'lod', 'satuan', 'apprv_spv'];
  dataSource: any = [
    {
      "sample": "000.R.5784",
      "uraian": "Coklat Powder",
      "jenis_parameter": "Mikrobiologi",
      "parameter_uji": "Colifom",
      "metode": "SNI ISO 4031-2012",
      "tgl_estimasi": "12 Feb",
      "hasil_uji": "Nihil",
      "lod": "Lod",
      "satuan": "MPN/g",
      "apprv_spv": "UnApproved"
    },
    {
      "sample": "000.R.5785",
      "uraian": "Coklat Powder",
      "jenis_parameter": "Mikrobiologi",
      "parameter_uji": "Colifom",
      "metode": "SNI ISO 4031-2012",
      "tgl_estimasi": "12 Feb",
      "hasil_uji": "Nihil",
      "lod": "Lod",
      "satuan": "Odorless (Tidak berbau)",
      "apprv_spv": "UnApproved"
    }
  ];
  @ViewChild('pdfKendali', {static: false}) pdfKendali: ElementRef;
  constructor() { }

  ngOnInit(): void {
  }


  previewInvoice(){
    console.log("buat PDF");
    var opt = {
      margin:       0.2,
      filename:     'Formulir Spesifikasi Pengujian.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },  
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    }; 

    html2pdf().set(opt).from(this.pdfKendali.nativeElement).toPdf().save();     
    
  }

}
