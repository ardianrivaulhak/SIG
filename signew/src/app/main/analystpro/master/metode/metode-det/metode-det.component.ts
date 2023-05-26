import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MetodeService } from '../metode.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-metode-det',
  templateUrl: './metode-det.component.html',
  styleUrls: ['./metode-det.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class MetodeDetComponent implements OnInit {

  metodeForm: FormGroup;
  detaildata = [];
  idmetode: any;
  hide = true;
  load = false;
  saving = false;

  constructor(
    private _metodeServ: MetodeService,
    private _actRoute: ActivatedRoute,
    private _formBuild: FormBuilder,
    private _snackBar: MatSnackBar,
    private _route: Router
  ) {
    this.idmetode = this._actRoute.snapshot.params['id'];
   }

   ngOnInit(): void {
    this.getdatadetail();
  }

  enableForm(){
    this.hide = false;
    this.metodeForm.get('metode').enable();
    this.metodeForm.get('keterangan').enable();
  }

  disableForm(){
    this.hide = true;
    this.metodeForm.get('metode').disable();
    this.metodeForm.get('keterangan').disable();
  }

  saveForm(){
    // console.log(this.metodeForm);
    this._metodeServ.updateDataMetode(this.idmetode, this.metodeForm.value).then(y => {
      this.load = true;
      let message = {
        text: 'Data Succesfully Updated',
        action: 'Done'
      }
      setTimeout(()=>{
        this.openSnackBar(message);
        this.load = false;
        this._route.navigateByUrl('analystpro/metode');
      },2000)
    })
  }

  deleteForm(){
    this._metodeServ.deleteDataMetode(this.idmetode).then(g => {
      this.load = true;
      let message = {
        text: 'Data Succesfully Deleted',
        action: 'Done'
      }
      setTimeout(()=>{
        this.openSnackBar(message);
        this.load = false;
        this._route.navigateByUrl('analystpro/metode');
      },2000)
    });
  }

  saveNewForm(){
    this._metodeServ.addDataMetode(this.metodeForm.value).then(g => {
      this.load = true;
      let message = {
        text: 'Data Succesfully Save',
        action: 'Done'
      }
      setTimeout(()=>{
        this.openSnackBar(message);
        this.load = false;
        this._route.navigateByUrl('analystpro/metode');
      },2000)
    });
  }
  getdatadetail(){
    this._metodeServ.getDataDetailMetode(this.idmetode)
    .then(x => this.detaildata = this.detaildata.concat(x))
    .then(()=> this.metodeForm = this.createLabForm());
  }

  createLabForm(): FormGroup {
    return this._formBuild.group({
        metode:[{
          value: this.idmetode !== 'add' ? this.detaildata[0].metode : '',
          disabled: this.idmetode !== 'add' ? true : false
        }, { validator: Validators.required }],
        keterangan: [{
          value: this.idmetode !== 'add' ? this.detaildata[0].keterangan : '',
          disabled: this.idmetode !== 'add' ? true : false
        }],
    })
  }

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }

}
