import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContractcategoryService } from '../contractcategory.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contractcategory-det',
  templateUrl: './contractcategory-det.component.html',
  styleUrls: ['./contractcategory-det.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ContractcategoryDetComponent implements OnInit {
  datasub = {
    page: 1,
    id_catalogue: null,
    search: null,
  };
  contractcategoryForm: FormGroup;
  detaildata = [];
  hasildata = {
    id : '',
    title: '',
		category_code: '',
		cover_code: '',
		lhu_code: '',
		sample_code: '',
    description: '',
    active:''
  }
  idcontractcategory: any;
  dataId = {
    id_paketuji: '',
    parameteruji: []
  }
  ideditcontractcategory: number;
  hide = true;
  load = false;
  saving = false;
  active = [
    {value: 1, viewValue: 'Active'},
    {value: 0, viewValue: 'Not Active'},
  ];

  constructor(
    private _masterServ: ContractcategoryService,
    private _actRoute: ActivatedRoute,
    private _formBuild: FormBuilder,
    private _snackBar: MatSnackBar,
    private _route: Router
  ) { 
    
    this.idcontractcategory = this._actRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.getdatadetail();
  }

  getdatadetail(){
    this._masterServ.getDataContractCategoryDetail(this.idcontractcategory)
    .then(x => this.detaildata = this.detaildata.concat(x))
    .then(()=> this.contractcategoryForm = this.createLabForm());
    // this.paketparameterForm = this.createLabForm();
  }



  createLabForm(): FormGroup {
    
    console.log(this.detaildata);
    return this._formBuild.group({
       
      title :[{
          value: this.idcontractcategory !== 'add' ? this.detaildata[0].title : '',
          disabled: this.idcontractcategory !== 'add' ? false : false
        }],
      category_code :[{
          value: this.idcontractcategory !== 'add' ? this.detaildata[0].category_code : '',
          disabled: this.idcontractcategory !== 'add' ? false : false
        }],
      cover_code :[{
          value: this.idcontractcategory !== 'add' ? '' : '',
          disabled: this.idcontractcategory !== 'add' ? true : false
        }],
      lhu_code :[{
          value: this.idcontractcategory !== 'add' ? '' : '',
          disabled: this.idcontractcategory !== 'add' ? true : false
        }],
      sample_code :[{
          value: this.idcontractcategory !== 'add' ? '' : '',
          disabled: this.idcontractcategory !== 'add' ? true : false
        }],
      description :[{
          value: this.idcontractcategory !== 'add' ? '' : '',
          disabled: this.idcontractcategory !== 'add' ? true : false
        }],
      active :[{
        value: this.idcontractcategory !== 'add' ? '' : '',
      }]
    })
  }

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }

  saveNewForm(){    
    this._masterServ.addDataContractCategory(this.contractcategoryForm.value).then(y => {
      this.load = true;
      let message = {
        text: 'Data Succesfully Save',
        action: 'Done'
      }
      setTimeout(()=>{
        this.openSnackBar(message);
        this._route.navigateByUrl('analystpro/contract-category');
        this.load = false;
      },2000)
    })
  }

  updateForm(){
    this.hasildata.id = this.hasildata.id.concat(this.idcontractcategory);
    this.hasildata.title = this.hasildata.title.concat(this.contractcategoryForm.value.title);
    this.hasildata.category_code = this.hasildata.category_code.concat(this.contractcategoryForm.value.category_code);
    this.hasildata.active = this.hasildata.active.concat(this.contractcategoryForm.value.active);
    console.log(this.hasildata);
    
    this._masterServ.updateDataContractCategory(this.idcontractcategory, this.hasildata).then(y => {
      this.load = true;
      let message = {
        text: 'Data Succesfully Updated',
        action: 'Done'
      }
      setTimeout(()=>{
        this.openSnackBar(message);
        this._route.navigateByUrl('analystpro/contract-category');
        this.load = false;
      },2000)
    })
  }

}
