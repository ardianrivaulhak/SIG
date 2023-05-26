import { Component, OnInit, Optional, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CertificateService } from '../../certificate.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-modal-sample',
  templateUrl: './modal-sample.component.html',
  styleUrls: ['./modal-sample.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ModalSampleComponent implements OnInit {

  dataSampleLab = [];
  idContract = this.data.data;
  sampleForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ModalSampleComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _certServ: CertificateService,
    private _formBuild: FormBuilder,
  ) { 
    
  }

  ngOnInit(): void {
    this.getDetailSample();
  }

  getDetailSample(){
    this._certServ.getTransactionSample(this.idContract)
    .then(x => this.dataSampleLab = this.dataSampleLab.concat(x))
    .then(() => this.sampleForm = this.createForm())
    .then(() => console.log(this.dataSampleLab));
  }

  closeModal(){
    return this.dialogRef.close({
      
    });
  }

  createForm(): FormGroup {
    return this._formBuild.group({
        tgl_produksi: this.dataSampleLab[0].tgl_produksi,
        tgl_kadaluarsa: [{
          value: this.dataSampleLab[0].tgl_kadaluarsa 
        }],
        tanggal_terima: [{
          value: this.dataSampleLab[0].kontrakuji.tanggal_terima  // evaluasi
        }],
        tgl_uji_mulai: [{
          value: this.dataSampleLab[0].kontrakuji.tanggal_terima  // evaluasi || ??
        }],
        tgl_uji_selesai: [{
          value: this.dataSampleLab[0].kontrakuji.tanggal_terima  // evaluasi || ??
        }], 
        merk: [{
          value: this.dataSampleLab[0].merk 
        }],
        factory_address: [{
          value: this.dataSampleLab[0].factory_address // evaluasi || ??
        }],
        no_sample: [{
          value: this.dataSampleLab[0].no_sample  // evaluasi || ??
        }],
        batch_number: [{
          value: this.dataSampleLab[0].batch_number 
        }],
        tgl_sampling: [{
          value: this.dataSampleLab[0].tgl_sampling // evaluasi || ??
        }],
        sample_name: [{
          value: this.dataSampleLab[0].sample_name // evaluasi || ??
        },{ validator: Validators.required }],
        ket_lain: [{
          value: this.dataSampleLab[0].ket_lain // evaluasi || ??
        }],
        jenis_kemasan: [{
          value: this.dataSampleLab[0].jenis_kemasan 
        }],
        ket_sertifikat: [{
          value: this.dataSampleLab[0].ket_sertifikat // evaluasi || ??
        }],
    })
}

}
