import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StandartService } from '../standart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';

@Component({
  selector: 'app-standart-det',
  templateUrl: './standart-det.component.html',
  styleUrls: ['./standart-det.component.scss'],
})
export class StandartDetComponent implements OnInit {

  standartForm: FormGroup;
  detaildata = [];
  idStandart: any;
  hide = true;
  load = false;
  saving = true;


  constructor(
    private _standartServ: StandartService,
    private _actRoute: ActivatedRoute,
    private _formBuild: FormBuilder,
    private _snackBar: MatSnackBar,
    private _route: Router
  ) {
    this.idStandart = this._actRoute.snapshot.params['id'];
   }

  ngOnInit(): void {
    this.getdatadetail();
  }

  enableForm(){
    this.hide = false;
    this.standartForm.get('nama_standart').enable();
    this.standartForm.get('ket_standart').enable();
  }

  disableForm(){
    this.hide = true;
    this.standartForm.get('nama_standart').disable();
    this.standartForm.get('ket_standart').disable();
  }

  saveForm(){
    let value = this.standartForm.value;
    if(value.nama_standart.length > 0){
      this._standartServ.updateDataStandart(this.idStandart, this.standartForm.value).then(y => {
        this.load = true;
        let message = {
          text: 'Data Succesfully Updated',
          action: 'Done'
        }
        setTimeout(()=>{
          this.openSnackBar(message);
          this._route.navigateByUrl('analystpro/standart');
          this.load = false;
        },2000)
      })
    } else {
      this.saving = true;
    }
  }

  deleteForm(){
    this._standartServ.deleteDataStandart(this.idStandart).then(g => {
      this.load = true;
      let message = {
        text: 'Data Succesfully Deleted',
        action: 'Done'
      }
      setTimeout(()=>{
        this.openSnackBar(message);
        this._route.navigateByUrl('analystpro/standart');
        this.load = false;
      },2000)
    });
  }

  saveNewForm(){
    this._standartServ.addDataStandart(this.standartForm.value).then(g => {
      this.load = true;
      let message = {
        text: 'Data Succesfully Save',
        action: 'Done'
      }
      setTimeout(()=>{
        this.openSnackBar(message);
        this._route.navigateByUrl('analystpro/standart');
        this.load = false;
      },2000)
    });
  }

  getdatadetail(){
    this._standartServ.getDataDetailStandart(this.idStandart)
    .then(x => this.detaildata = this.detaildata.concat(x))
    .then(()=> this.standartForm = this.createLabForm());
  }

  validation(ev){
    if(this.standartForm.value.kode_standart > 0 && this.standartForm.value.nama_standart) {
      this.saving = false;
    } else {
      this.saving = true;
    }
  }

  createLabForm(): FormGroup {
        return this._formBuild.group({
            nama_standart: [{ 
              value: this.idStandart !== 'add' ? this.detaildata[0].nama_standart : '',
              disabled: this.idStandart !== 'add' ? true : false
            },{ validator: Validators.required }],

            ket_standart: [{ 
              value: this.idStandart !== 'add' ? this.detaildata[0].ket_standart : '',
              disabled: this.idStandart !== 'add' ? true : false
            },{ validator: Validators.required }],
        })
  }

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }

  
}
