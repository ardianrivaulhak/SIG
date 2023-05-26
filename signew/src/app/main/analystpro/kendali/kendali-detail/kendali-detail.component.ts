import { Component, OnInit, ViewEncapsulation, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { KendaliService } from '../kendali.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from '@angular/material/dialog';
import { ModalKendaliDetailComponent } from "./modal-kendali-detail/modal-kendali-detail.component";

@Component({
  selector: 'app-kendali-detail',
  templateUrl: './kendali-detail.component.html',
  styleUrls: ['./kendali-detail.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class KendaliDetailComponent implements OnInit {

  idkendali: any;
  sampledata = [];
  resultsample :string;
  Message: any;

  constructor(
    private _kendaliServ: KendaliService,
    private _actRoute: ActivatedRoute,
    private _matDialog: MatDialog
  ) { 
    this.idkendali = this._actRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.getdatadetail();   
  }

  getdatadetail(){
    this._kendaliServ.getDataDetails(this.idkendali)
    .then(x => this.sampledata = this.sampledata.concat(x))
    .then(c => console.log(this.sampledata))
  }

  receiveMessage($event) {
    this.resultsample = $event 
    const mapped = Object.keys(this.resultsample)
    .map(key => ({type: key, value: this.resultsample[key]}));
    
    this.Message = mapped
    console.log(this.Message)
  }

  openDialog(id) : void {
    const dialogRef = this._matDialog.open(ModalKendaliDetailComponent, {
      panelClass: 'kendali-detail-dialog',
      data: { data: this.sampledata[id] }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
     
    });
  
  }
  

  

  

  

}
