import { Component, OnInit } from '@angular/core';
import { TrainingService } from 'app/main/hris/training/training.service';
import { EmployeeService } from 'app/main/hris/employee/employee.service';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";
import {
  MomentDateModule,
  MomentDateAdapter,
} from "@angular/material-moment-adapter";
import {MatDatepickerModule} from '@angular/material/datepicker';
import { FormGroup, FormControl, Validators } from '@angular/forms'; 

@Component({
  selector: 'app-add-training',
  templateUrl: './add-training.component.html',
  styleUrls: ['./add-training.component.scss']
})
export class AddTrainingComponent implements OnInit {

   

  constructor(
    private _emploeeserv: EmployeeService,
    private _trainingserv: TrainingService,
  ) { }

  ngOnInit(): void {
  }

}
