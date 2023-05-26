import {
  Component,
  OnInit,
  Optional,
  Inject,
  ViewEncapsulation,
} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { fuseAnimations } from "@fuse/animations";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { BrowserModule } from "@angular/platform-browser";
import { ComplainService } from "../../../complain.service";
import { DivisionService } from "app/main/hris/division/division.service";
var moment = require('moment-business-days');
import { DatePipe } from '@angular/common';
import Swal from "sweetalert2";

@Component({
  selector: 'app-action-complaint',
  templateUrl: './action-complaint.component.html',
  styleUrls: ['./action-complaint.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None,
})
export class ActionComplaintComponent implements OnInit {

  selectChange = [
    {
        value: 0,
        name: "undone",
    },
    {
        value: 1,
        name: "done",
    },
    {
        value: 2,
        name: "pending",
    },
    {
      value: 3,
      name: "cancel",
    },
  ];  

  formdata = {
    id : this.data.id,
    id_complaint : this.data.id_complain,
    status :null,
    repair :null
  };

  load = false;

  constructor(
    public dialogRef: MatDialogRef<ActionComplaintComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar,
    private _complainServ: ComplainService,
  ) { }

  ngOnInit(): void {
    console.log(this.data)
    this.formdata.repair = this.data.perbaikan;
    console.log(this.formdata.repair )
  }

  closeModal(param){
    return this.dialogRef.close({
        param
    });
  }

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }


  saveForm(){
     console.log(this.formdata);
    if(this.formdata.status == null || this.formdata.repair == null ){
      Swal.fire({
        title: "Incomplete Data",
        text: "Please complete the blank data!",
        icon: "warning",
        confirmButtonText: "Ok",
    });
    }else{
      this._complainServ.changeDataNontechnical(this.formdata).then(y => {
        this.load = true;
        let message = {
          text: 'Data Succesfully Updated',
          action: 'Done'
        }
        setTimeout(()=>{  
          this.openSnackBar(message);
          this.closeModal(this.load);
          this.load = false;
        },1000)
      })
    }   
  }

}
