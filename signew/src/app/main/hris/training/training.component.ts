import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from "@angular/material/dialog";
import { AddTrainingComponent } from '../training/add-training/add-training.component';
import { TrainingService } from '../training/training.service';
import { EmployeeService } from '../employee/employee.service';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss']
})
export class TrainingComponent implements AfterViewInit, OnInit  {

  displayedColumns: string[] = ['index', 'name','dept','name_training','lembaga','cost', 'weight', 'status_hrd', 'symbol'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  constructor(
    private _matDialog: MatDialog,
   
) {
}

  @ViewChild(MatPaginator) paginator: MatPaginator;


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    
  }

  async addnew(id?) {
    let dialogCust = await this._matDialog.open(AddTrainingComponent, {
        height: "550px",
        width: "600px",
        data: {
            idstatus: id ? id.id_level : null,
        },
    });
}

}

export interface PeriodicElement {
  index: number;
  cost: number;
  name: string;
  dept: string ;
  name_training: string ;
  lembaga: string;
  weight: string;
  symbol: string;
  status_hrd: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {index: 1, cost: 12, name: 'Hydrogen', dept: 'test', name_training: 'test', lembaga:'asd',  weight: '01 Januari 2023', symbol: 'H', status_hrd:'H'},
  {index: 2, cost: 12, name: 'Hydrogen', dept: 'test', name_training: 'test', lembaga:'asd',  weight: '01 Januari 2023', symbol: 'H', status_hrd:'H'},
  {index: 3, cost: 12, name: 'Hydrogen', dept: 'test', name_training: 'test', lembaga:'asd',  weight: '01 Januari 2023', symbol: 'H', status_hrd:'H'},
  {index: 4, cost: 12, name: 'Hydrogen', dept: 'test', name_training: 'test', lembaga:'asd',  weight: '01 Januari 2023', symbol: 'H', status_hrd:'H'},
  {index: 5, cost: 12, name: 'Hydrogen', dept: 'test', name_training: 'test', lembaga:'asd',  weight: '01 Januari 2023', symbol: 'H', status_hrd:'H'},
];