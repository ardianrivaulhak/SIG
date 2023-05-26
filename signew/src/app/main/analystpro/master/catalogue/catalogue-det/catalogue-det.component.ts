import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogueService } from '../catalogue.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { MenuService } from 'app/main/analystpro/services/menu/menu.service';

@Component({
  selector: 'app-catalogue-det',
  templateUrl: './catalogue-det.component.html',
  styleUrls: ['./catalogue-det.component.scss']
})
export class CatalogueDetComponent implements OnInit {

  catalogueForm: FormGroup;
  detaildata = [];
  id_catalogue: any;
  hide = true;
  load = false;
  saving = false;

  constructor(
    private _masterServ: CatalogueService,
    private _actRoute: ActivatedRoute,
    private _formBuild: FormBuilder,
    private _snackBar: MatSnackBar,
    private _route: Router,
    private _menuServ: MenuService
  ) {
    this.id_catalogue = this._actRoute.snapshot.params['id'];
   }

   ngOnInit(): void {
    this.getdatadetail();
    this.checkauthentication();
  }

  checkauthentication(){
    this._menuServ.checkauthentication(this._route.url).then(x => {
      console.log(x)
      if(!x.status){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'You dont an access to this page !',
        }).then(res => {
          if(res.isConfirmed || res.isDismissed) {
            this._route.navigateByUrl('apps');
          }
        });
      }
    });
  }

  enableForm(){
    this.hide = false;
    // this.catalogueForm.get('catalogue_code').enable();
    this.catalogueForm.get('catalogue_name').enable();
    this.catalogueForm.get('description').enable();
  }

  disableForm(){
    this.hide = true;
    // this.catalogueForm.get('catalogue_code').disable();
    this.catalogueForm.get('catalogue_name').disable();
    this.catalogueForm.get('description').disable();
  }

  saveForm(){
    console.log(this.catalogueForm);
    this._masterServ.updateDataCatalogue(this.id_catalogue, this.catalogueForm.value).then(y => {
      this.load = true;
      let message = {
        text: 'Data Succesfully Updated',
        action: 'Done'
      }
      setTimeout(()=>{
        this.openSnackBar(message);
        this._route.navigateByUrl('analystpro/catalogue');
        this.load = false;
      },2000)
    })
  }

  deleteForm(){
    this._masterServ.deleteDataCatalogue(this.id_catalogue).then(g => {
      this.load = true;
      let message = {
        text: 'Data Succesfully Deleted',
        action: 'Done'
      }
      setTimeout(()=>{
        this.openSnackBar(message);
        this._route.navigateByUrl('analystpro/catalogue');
        this.load = false;
      },2000)
    });
  }

  saveNewForm(){
    this._masterServ.addDataCatalogue(this.catalogueForm.value).then(g => {
      this.load = true;
      let message = {
        text: 'Data Succesfully Save',
        action: 'Done'
      }
      setTimeout(()=>{
        this.openSnackBar(message);
        this._route.navigateByUrl('analystpro/catalogue');
        this.load = false;
      },2000)
    });
  }

  getdatadetail(){
    this._masterServ.getDataCatalogueDetail(this.id_catalogue)
    .then(x => this.detaildata = this.detaildata.concat(x))
    .then(()=> this.catalogueForm = this.createLabForm());
  }

  createLabForm(): FormGroup {
        return this._formBuild.group({
            // catalogue_code: [{
            //   value: this.id_catalogue !== 'add' ? this.detaildata[0].catalogue_code : '',
            //   disabled: this.id_catalogue !== 'add' ? true : false
            // },{ validator: Validators.required }],
            catalogue_name: [{
              value: this.id_catalogue !== 'add' ? this.detaildata[0].catalogue_name : '',
              disabled: this.id_catalogue !== 'add' ? true : false
            },{ validator: Validators.required }],
            description: [{
              value: this.id_catalogue !== 'add' ? this.detaildata[0].description : '',
              disabled: this.id_catalogue !== 'add' ? true : false
            },{ validator: Validators.required }],
        })
  }

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }

}
