import { Component, OnInit, Inject } from '@angular/core';
import { AttendanceService } from '../attendance.service';
import { ModalTimetableforComponent } from 'app/main/hris/attendance/modal-timetablefor/modal-timetablefor.component';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray,
  Form,
} from "@angular/forms";
import * as global from 'app/main/global';
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";

@Component({
  selector: 'app-modal-rules',
  templateUrl: './modal-rules.component.html',
  styleUrls: ['./modal-rules.component.scss']
})
export class ModalRulesComponent implements OnInit {
  displayedColumns: string[] = [
  'name',
  'jam_keluar',
  'jam_masuk',
  'tolerance_time',
  'worktime',
  'action',
  ];

  rules: FormArray = this._formBuilder.array([]);
  rulesForm: FormGroup = this._formBuilder.group({
      rules_attendance: this.rules,
  });
  time_table = [];
  
  

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ModalRulesComponent>,
    private _attServ: AttendanceService,
    private _formBuilder: FormBuilder,
    private _dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getDataTimeTable();
  }

  settimetable() {
    let dialogCust = this._dialog.open(ModalTimetableforComponent, {
        height: "auto",
        width: "500px",
    });

    dialogCust.afterClosed().subscribe(async (result) => {});
}

  getDataTimeTable(){console.log(this.rules)
    this._attServ.gettimetable().then((x:any) => {
      x.forEach(h => {
        this.addFormData(h);
      })
    })
    .then(() => this.rules.controls.filter(x => x.status !== 'delete'));
  }

  saveData(){
    let checkdata = this.rulesForm.controls.rules_attendance['value'];
    let checkjammasuk = checkdata.filter(x => {
     return x.jam_masuk.split(':').length > 2;
    })
    let checkjamkeluar = checkdata.filter(x => {
      return x.jam_keluar.split(':').length > 2;
     })

     let checkworktime = checkdata.filter(x => {
      return x.worktime.split(':').length > 2;
     })
    if(
      checkjammasuk.length < this.rulesForm.controls.rules_attendance['value'].length ||
      checkjamkeluar.length < this.rulesForm.controls.rules_attendance['value'].length || 
      checkworktime.length < this.rulesForm.controls.rules_attendance['value'].length 
    ){
      global.swalerror("Ada Format yang salah harap check kembali")
    } else {
      this._attServ.savetimetable(this.rulesForm.controls.rules_attendance['value']).then(x => console.log(x))
    }
  }

  addFormData(v){
    const timetable = this._formBuilder.group({
       id: v.id,
       jam_masuk: v.jam_masuk,
       jam_keluar: v.jam_keluar,
       name: v.name,
       tolerance_time: v.tolerance_time,
       worktime: v.worktime,
       status: 'edit'
    });
    this.rules.push(timetable);
  }

  close(){
    this.dialogRef.close();
  }

  addRow(){
    const timetable = this._formBuilder.group({
      id: new FormControl(),
      jam_masuk: new FormControl(),
      jam_keluar: new FormControl(),
      name: new FormControl(),
      tolerance_time: new FormControl(),
      worktime: new FormControl(),
      status: 'new'
   });
   this.rules.push(timetable);
  }

  deleteRow(e,v){
   if(v.id){
    global.swalyousure("Are you sure ?").then(x => {
      if(x.isConfirmed){
        this._attServ.deletetimetable(v.id).then( async (x:any) => {
          if(x.success){
            await global.swalsuccess("Success","Data Deleted !");
            await this.rules.removeAt(e);
          } else {
            await global.swalerror("Error Deleting Data !")
          }
        })
      }
    })
   } else {
     this.rules.removeAt(e);
   }
  }

}
