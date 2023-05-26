import { Component, OnInit, Inject } from '@angular/core';
import { MenuServices } from '../menu.service';
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-component',
  templateUrl: './modal-component.component.html',
  styleUrls: ['./modal-component.component.scss']
})
export class ModalComponentComponent implements OnInit {

  menu = [];

  checkbox = [
    {
      id: 0,
      title: "Create",
      checked: false
    },
    {
      id: 1,
      title: "Approve",
      checked: false
    },
    {
      id: 2,
      title: "Update",
      checked: false
    },
    {
      id: 3,
      title: "Delete",
      checked: false
    }
  ];

  sendingdata = {
    user_id: null,
    menu_id: null,
    create: 0,
    approve: 0,
    update: 0,
    delete: 0
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ModalComponentComponent>,
    public menuServ : MenuServices
  ) { 
    if(data){
      this.sendingdata.user_id = data;
      this.getDataMenu();  
    }
  }

  ngOnInit(): void {
  }

  async getDataMenu(q?){
    await this.menuServ.getDataMenuRegister(q ? q : null)
    .then(x => this.menu = this.menu.concat(x));
    await console.log(this.menu);
  }

  getValChange(ev){
    this.sendingdata.menu_id = ev.id;
  }

  reset(ev){
    console.log(ev);
  }

  onSearch(ev){
    if(ev.term.length > 3){
      this.menu = [];
      this.getDataMenu(ev.term);
    }
  }

  setAll(ev, chk){
    this.checkbox[chk.id].checked = ev;
    console.log(this.checkbox);
  }

  save(){
    this.sendingdata = {
      user_id : this.sendingdata.user_id,
      menu_id : this.sendingdata.menu_id,
      create : this.checkbox[0].checked ? 1 : 0,
      approve : this.checkbox[1].checked ? 1 : 0,
      update: this.checkbox[2].checked ? 1 : 0,
      delete: this.checkbox[3].checked ? 1 : 0
    } 
    this.swalFire();   
  }


  swalFire(){
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) { 
        this.menuServ.addData(this.sendingdata)
        .then(x => Swal.fire(
          x['status'] ? 'Success' : 'Fail',
          x['message'],
          x['status'] ? 'success' : 'error'
        ))
        .then(() => this.dialogRef.close(this.sendingdata.user_id));
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire(
          'Cancelled',
          'Your Data file is safe :)',
          'error'
        )
      }
    })
  }

}
