import { Component, OnInit, Inject } from '@angular/core';
import { AttendanceService } from '../attendance.service';
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
import { SubdivService } from '../../subdiv/subdiv.service';

@Component({
  selector: 'app-modal-timetablefor',
  templateUrl: './modal-timetablefor.component.html',
  styleUrls: ['./modal-timetablefor.component.scss']
})
export class ModalTimetableforComponent implements OnInit {

  timetable: FormArray = this._formBuilder.array([]);
  FormTimetable: FormGroup = this._formBuilder.group({
      timetablefor: this.timetable,
  });
  time_table = [];
  datasubdiv = [];
  search;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ModalTimetableforComponent>,
    private _attServ: AttendanceService,
    private _formBuilder: FormBuilder,
    private _subDivServ: SubdivService
  ) { }

  ngOnInit(): void {
    this.getDataTimetableFor();
    this.getDataSubDiv();
  }

  settimetable(v?){
    console.log('asd')
  }


  getDataSubDiv(){
    this._subDivServ.getDataSubDiv(this.search)
    .then(x => this.datasubdiv = this.datasubdiv.concat(x));
  }

  getDataTimetableFor(){
    this._attServ.gettimetablefor().then((x: any) => {
      if(x.length > 0){
        x.forEach(h => {
          this.addFormData(h);
        })
        // this.addFormData(x)
      }
    });
  }

  addFormData(v){
    const timetable = this._formBuilder.group({
       id: v.id,
       id_subdiv: v.id_subdiv.toString()
    });
    this.timetable.push(timetable);
  }

  close(){
    this.dialogRef.close();
  }

  addRow(){
    const timetable = this._formBuilder.group({
      id: new FormControl(),
      id_subdiv: new FormControl()
   });
   this.timetable.push(timetable);
  }

  saveData(){
    global.swalyousure("Are you sure ?").then(x => {
      if(x.isConfirmed){
        let a = this.FormTimetable.controls.timetablefor['value'].filter(x => !x.id_subdiv);
    if(a.length > 0){
      global.swalerror("ada data yang belum lengkap harap lengkapi");
    } else {
      this._attServ.addtimetablefor(this.FormTimetable.controls.timetablefor['value'])
      .then(x => global.swalsuccess('Success',"Data Added !"))
      .catch(e => global.swalerror("Failed"))
    }
      }
    })
  }

  deleteRow(e,v){
   if(v.id){
    global.swalyousure("Are you sure ?").then(x => {
      if(x.isConfirmed){
        this._attServ.deletetimetablefor(v.id).then( async (x:any) => {
          if(x.success){
            await global.swalsuccess("Success","Data Deleted !");
            await this.timetable.removeAt(e);
          } else {
            await global.swalerror("Error Deleting Data !")
          }
        })
      }
    })
   } else {
     this.timetable.removeAt(e);
   }
  }

}
