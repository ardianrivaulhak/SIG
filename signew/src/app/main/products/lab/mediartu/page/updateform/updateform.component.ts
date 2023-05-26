import { Component, OnInit, Output, ViewEncapsulation  } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import * as globals from "app/main/global";
import { PageEvent } from "@angular/material/paginator";
import { ProductsService } from "../../../../products.service";
import { LabService } from "../../../lab.service";
import * as _moment from 'moment';
import * as ClassicEditor from 'assets/js/ckeditor/ckeditor';

@Component({
  selector: 'app-updateform',
  templateUrl: './updateform.component.html',
  styleUrls: ['./updateform.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class UpdateformComponent implements OnInit {

  load = false;
  data = {
    nama : '',
    id_product : this._activedRoute.snapshot.params['id']
  }
  dataLab : any;
  public editorValue: string = '';
  htmlContent = '';    
  ckeConfig: any;
  public Editor = ClassicEditor;

  formData = {
    id: this._activedRoute.snapshot.params['id'],
    tgl_produksi : '',
    tgl_expired : '',
    teks: ''
  }

  public onReady( editor ) {
      editor.ui.getEditableElement().parentElement.insertBefore(
          editor.ui.view.toolbar.element,
          editor.ui.getEditableElement()
      );
  }

  constructor(
    private _productServ: ProductsService,
    private _labServ: LabService,
    private _snackBar: MatSnackBar,
    private _matDialog: MatDialog,
    private _route: Router,
    private _activedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  async getData()
  { 
    await this._labServ.getDetailMedia(this.data).then( async x => {
      this.dataLab = await x
      
    });
    console.log(this.dataLab)
    
    this.formData.tgl_produksi = await this.dataLab.tgl_produksi;
    this.formData.tgl_expired = await this.dataLab.tgl_expired;
    this.formData.teks = await this.dataLab.coa_mediartu == null ? '' : this.dataLab.coa_mediartu.data;
  }

  submit()
  {
    console.log(this.formData)
    this._labServ.sumitDataCoa(this.formData).then( async x => {
      console.log(x)
      this.load = true;
      let message =  await {
        text: 'Data Succesfully Updated',
        action: 'Done'
      }
      await setTimeout( async ()=>{        
        this.load = await false;
        await this.openSnackBar(message);   
     }, 3000);
    })
  }

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }

}
