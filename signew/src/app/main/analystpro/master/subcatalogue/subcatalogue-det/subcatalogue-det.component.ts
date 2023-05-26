import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SubcatalogueService } from '../subcatalogue.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface Catalogue{
  id_catalogue: string;
  catalogue_name: string;
}

@Component({
  selector: 'app-subcatalogue-det',
  templateUrl: './subcatalogue-det.component.html',
  styleUrls: ['./subcatalogue-det.component.scss']
})
export class SubcatalogueDetComponent implements OnInit {

  subcatalogueForm: FormGroup;
  detaildata = [];
  catalogue: Catalogue[] = [];
  id_sub_catalogue: any;
  hide = true;
  load = false;
  saving = false;

  constructor(
    private _masterServ: SubcatalogueService,
    private _actRoute: ActivatedRoute,
    private _formBuild: FormBuilder,
    private _snackBar: MatSnackBar,
    private _route: Router
  ) { 
    this.id_sub_catalogue = this._actRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.getdatadetail();
  }

  enableForm(){
    this.hide = false;
    // this.subcatalogueForm.get('sub_catalogue_code').enable();
    this.subcatalogueForm.get('sub_catalogue_name').enable();
    this.subcatalogueForm.get('id_catalogue').enable();
    this.subcatalogueForm.get('description').enable();
  }

  disableForm(){
    this.hide = true;
    // this.subcatalogueForm.get('sub_catalogue_code').disable();
    this.subcatalogueForm.get('sub_catalogue_name').disable();
    this.subcatalogueForm.get('id_catalogue').disable();
    this.subcatalogueForm.get('description').disable();
  }

  saveForm(){
    console.log(this.subcatalogueForm);
    this._masterServ.updateDataSubcatalogue(this.id_sub_catalogue, this.subcatalogueForm.value).then(y => {
      this.load = true;
      let message = {
        text: 'Data Succesfully Updated',
        action: 'Done'
      }
      setTimeout(()=>{
        this.openSnackBar(message);
        this._route.navigateByUrl('analystpro/subcatalogue');
        this.load = false;
      },2000)
    })
  }

  deleteForm(){
    this._masterServ.deleteDataSubcatalogue(this.id_sub_catalogue).then(g => {
      this.load = true;
      let message = {
        text: 'Data Succesfully Deleted',
        action: 'Done'
      }
      setTimeout(()=>{
        this.openSnackBar(message);
        this._route.navigateByUrl('analystpro/subcatalogue');
        this.load = false;
      },2000)
    });
  }

  saveNewForm(){
    this._masterServ.addDataSubcatalogue(this.subcatalogueForm.value).then(g => {
      this.load = true;
      let message = {
        text: 'Data Succesfully Save',
        action: 'Done'
      }
      setTimeout(()=>{
        this.openSnackBar(message);
        this._route.navigateByUrl('analystpro/subcatalogue');
        this.load = false;
      },2000)
    });
  }

  getdatadetail(){
    this._masterServ.getDataSubcatalogueDetail(this.id_sub_catalogue)
    .then(x => this.detaildata = this.detaildata.concat(x))
    .then(() => this.getdataCatalogue())
    .then(()=> this.subcatalogueForm = this.createLabForm());
  }

  getdataCatalogue(){
    this._masterServ.getDataCatalogueAll().then(x =>{
      let ab = [];
      ab = ab.concat(x);
      this.catalogue = this.catalogue.concat(ab);
    })
  }

  createLabForm(): FormGroup {
        return this._formBuild.group({
          // sub_catalogue_code: [{
          //     value: this.id_sub_catalogue !== 'add' ? this.detaildata[0].sub_catalogue_code : '',
          //     disabled: this.id_sub_catalogue !== 'add' ? true : false
          //   },{ validator: Validators.required }],
            sub_catalogue_name: [{
              value: this.id_sub_catalogue !== 'add' ? this.detaildata[0].sub_catalogue_name : '',
              disabled: this.id_sub_catalogue !== 'add' ? true : false
            },{ validator: Validators.required }],
            id_catalogue: [{
              value: this.id_sub_catalogue !== 'add' ? this.detaildata[0].id_catalogue : '',
              disabled: this.id_sub_catalogue !== 'add' ? true : false
            },{ validator: Validators.required }],
            description: [{
              value: this.id_sub_catalogue !== 'add' ? this.detaildata[0].description : '',
              disabled: this.id_sub_catalogue !== 'add' ? true : false
            }],
        })
  }

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }

}

