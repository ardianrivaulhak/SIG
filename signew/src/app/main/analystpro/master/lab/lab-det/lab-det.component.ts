import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LabService } from '../lab.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-lab-det',
  templateUrl: './lab-det.component.html',
  styleUrls: ['./lab-det.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class LabDetComponent implements OnInit {

  labForm: FormGroup;
  detaildata = [];
  idlab: any;
  hide = true;
  load = false;
  saving = true;

  constructor(
    private _masterServ: LabService,
    private _actRoute: ActivatedRoute,
    private _formBuild: FormBuilder,
    private _snackBar: MatSnackBar,
    private _route: Router
  ) { 
    this.idlab = this._actRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.getdatadetail();
  }

  enableForm(){
    this.hide = false;
    // this.labForm.get('kode_lab').enable();
    this.labForm.get('nama_lab').enable();
    this.labForm.get('ket_lab').enable();
  }

  disableForm(){
    this.hide = true;
    // this.labForm.get('kode_lab').disable();
    this.labForm.get('nama_lab').disable();
    this.labForm.get('ket_lab').disable();
  }

  saveForm(){
    this._masterServ.updateDataLab(this.idlab, this.labForm.value).then(y => {
      this.load = true;
      let message = {
        text: 'Data Succesfully Updated',
        action: 'Done'
      }
      setTimeout(()=>{
        this.openSnackBar(message);
        this._route.navigateByUrl('analystpro/lab');
        this.load = false;
      },2000)
    })
  }

  deleteForm(){
    this._masterServ.deleteData(this.idlab).then(g => {
      this.load = true;
      let message = {
        text: 'Data Succesfully Deleted',
        action: 'Done'
      }
      setTimeout(()=>{
        this.openSnackBar(message);
        this._route.navigateByUrl('analystpro/lab');
        this.load = false;
      },2000)
    });
  }

  saveNewForm(){
    let value = this.labForm.value;
    if(value.nama_lab.length > 0){
      this._masterServ.addDataLab(this.labForm.value).then(g => {
        this.load = true;
        let message = {
          text: 'Data Succesfully Save',
          action: 'Done'
        }
        setTimeout(()=>{
          this.openSnackBar(message);
          this._route.navigateByUrl('analystpro/lab');
          this.load = false;
        },2000)
      });
    } else {
      this.saving = true;
    }
  }
  
  getdatadetail(){
    this._masterServ.getDataDetailLab(this.idlab)
    .then(x => this.detaildata = this.detaildata.concat(x))
    .then(()=> this.labForm = this.createLabForm());
  }

  createLabForm(): FormGroup {                                                                                                                                                                                                                                                                                    
    return this._formBuild.group({
        // kode_lab: this.idlab !== 'add' ? [{
        //   value: this.detaildata[0].kode_lab,
        //   disabled: true                                                                                                
        // },{validator: Validators.required}] : '',
        nama_lab: this.idlab !== 'add' ? [{                                                                                 
          value: this.detaildata[0].nama_lab,
          disabled: true
        },{validator: Validators.required}] : '',
        ket_lab: this.idlab !== 'add' ? [{
          value: this.detaildata[0].ket_lab,
          disabled: true
        }] : '',
    })
  }

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }

}
