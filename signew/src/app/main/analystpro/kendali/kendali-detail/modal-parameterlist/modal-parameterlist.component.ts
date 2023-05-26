import { Component, OnInit, Optional, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { KendaliService } from '../../kendali.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-modal-parameterlist',
  templateUrl: './modal-parameterlist.component.html',
  styleUrls: ['./modal-parameterlist.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ModalParameterlistComponent implements OnInit {

  idkendali: any;
  paramForm : FormGroup;
  detaildata = [];
  load = false;


  constructor(
    public dialogRef: MatDialogRef<ModalParameterlistComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _kendaliServ: KendaliService,
    private _actRoute: ActivatedRoute,
    private _formBuild: FormBuilder,
    private _snackBar: MatSnackBar,
    private _route: Router
  ) { }

  ngOnInit(): void {
    this.getDataDetail();
  }

  getDataDetail(){
    this._kendaliServ.getDataSampleModals(this.data.data.id)
    .then((x) => this.detaildata = this.detaildata.concat(x))
    .then(()=> this.paramForm = this.createLabForm())
    .then(() => console.log(this.data))
  }

  onDateChange(){
    console.log(this.paramForm.value.tgl_estimasi_lab._i);
    this._kendaliServ.updateEstimatelab(this.data.data.id, this.paramForm.value.tgl_estimasi_lab._i).then(y => {
      this.load = true;
      let message = {
        text: 'Data Succesfully Updated',
        action: 'Done'
      }
      setTimeout(()=>{
        this.openSnackBar(message);
        this.load = false;
        this.dialogRef.close();
      },1000)
    })
  }

  createLabForm(): FormGroup {                                                                                                                                                                                                                                                                              
    return this._formBuild.group({
      tgl_estimasi_lab: [new Date(this.data.data.tgl_estimasi_lab)],
    })    
  }

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }


}
