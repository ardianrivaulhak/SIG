import { Component, OnInit, Optional, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { HighlightSpanKind } from 'typescript';
import { LabService } from "../../../lab.service";
import Swal from 'sweetalert2';
import * as globals from "app/main/global";
import { PageEvent } from "@angular/material/paginator";


@Component({
  selector: 'app-detail-approve',
  templateUrl: './detail-approve.component.html',
  styleUrls: ['./detail-approve.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class DetailApproveComponent implements OnInit {
  dataMedia = [];
  displayedColumns: string[] = [
    'checkbox',
    'status',
    'product_name', 
    'kode_media', 
    'no_katalog',
    'kemasan',
    'target_bakteria',
    'unit'
    ];
    total: number;
    from: number;
    to: number;
    pages = 1;
    current_page : number;
    checkList = [];
    pageEvent: PageEvent;
    allComplete: boolean = false;
    load = false;

  constructor(
    public dialogRef: MatDialogRef<DetailApproveComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public labdetail: any,
    private _actRoute: ActivatedRoute,
    private _formBuild: FormBuilder,
    private _snackBar: MatSnackBar,
    private _route: Router,
    private _flabServ : LabService,
    private _matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
   this.getData();
  }

  getData()
  {
    this.dataMedia = this.labdetail.product_media_r_t_u;
    console.log(this.dataMedia)
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.dataMedia == null) {
      return;
    }
    if(completed == true)
    {
      this.dataMedia.forEach(t => t.completed = completed);
      this.dataMedia.forEach( x => {
        this.checkList = this.checkList.concat({
          id: x.id,
          checked : true
        })
      })
      this.checkList = globals.uniq(this.checkList, (it) => it.id);
    }else{
      this.dataMedia.forEach(t => t.completed = completed);
      this.checkList = [];
    }
  }

  updateAllComplete() {
    this.allComplete = this.dataMedia != null && this.dataMedia.every(t => t.completed);
  }

  someComplete(): boolean {
    if (this.dataMedia == null) {
      return false;
    }
    return this.dataMedia.filter(t => t.completed).length > 0 && !this.dataMedia;      
  }

  checkBox(ev,id){
    let z = this.checkList.filter(o => o.id == id);
    console.log(ev)
    if(ev){
      if(z.length > 0){
        z[0].checked = ev
      } else {
        this.checkList = this.checkList.concat({
          id: id,
          checked : true
        });
      }
    } else {
      let z = this.checkList.filter(x => x.id == id);
      z[0].checked = ev;
    }
  }

  async cancelChecklist()
  {
    this.checkList = await [];
    this.dataMedia = await [];
    await this.getData();
  }

  async approve()
  {
    let u = [];
    this.checkList.forEach(x => {
      if(x.checked){
        u = u.concat({
          id: x.id, 
          checked : x.checked
        })
      }
    })
    
    console.log(u)
    this._flabServ.changeStatus(u).then(x => {
      this.load = true;
      let message = {
        text: 'Successfully approve',
        action: 'Done'
      }
      setTimeout(()=>{  
        this.openSnackBar(message);
        this.checkList = []
        this.dataMedia = [];
        this.getData();
        this.closeModal(false)
        this.load = false;
      },1000)
    })
  }

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }

  closeModal(v) {
    return this.dialogRef.close({
      v
    });
  }

  

  

  


}
