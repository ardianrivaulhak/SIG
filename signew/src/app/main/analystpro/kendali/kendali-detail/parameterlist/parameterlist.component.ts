import { Component, OnInit, Output, ViewEncapsulation, EventEmitter  } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { KendaliService } from '../../kendali.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from '@angular/material/dialog';
import { ModalParameterlistComponent } from "../modal-parameterlist/modal-parameterlist.component";
import { Console } from 'console';

@Component({
  selector: 'parameter-list',
  templateUrl: './parameterlist.component.html',
  styleUrls: ['./parameterlist.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ParameterlistComponent implements OnInit {

  idkendali: any;
  sampledata = [];
  displayedColumns: any[] = ['no_sample', 'sample_name', 'tgl_input','id_statuspengujian' ,'tgl_estimasi_lab', 'lab', 'icon'];
  selected = 0;
  mark : any;
  onChangeDate = {
    data: []
  }
  dataDetailSample = {
    id_sample: ''
  };

  
  textValue : string = '';
  load = false;


  @Output() sampleDatas = new EventEmitter<string>();

  sampleForm: FormGroup;
  // sampleForm = new FormGroup({
  //     tgl_estimasi_lab : new FormControl([Validators.required])
  // });
  waw :any;

  constructor(
    private _kendaliServ: KendaliService,
    private _actRoute: ActivatedRoute,
    private _matDialog: MatDialog,
    private _formBuild: FormBuilder,
    private _snackBar: MatSnackBar,
    private _route: Router
   
  ) { 
    this.idkendali = this._actRoute.snapshot.params['id'];
  }

  ngOnInit() {
    this.getDataSample();
  }

  getDataSample(){
    this._kendaliServ.getDataSamples(this.idkendali)
    .then(x => this.sampledata = this.sampledata.concat(x))
    .then(() => console.log(this.sampledata))
    
  }

  sendMessage(data) {
    this.selected = data.id;
    console.log(data)
    this.sampleDatas.emit(data);
  }

  openDialog(data) : void {
    const dialogRef = this._matDialog.open(ModalParameterlistComponent, {
      panelClass: 'parameterlist-dialog',
      data: { data: data }
    });
    console.log(data)

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
     
    });
  }

  // createLabForm(): FormGroup {                                                                                                                                                                                                                                                                               
  //   return this._formBuild.group({
  //     tgl_estimasi_lab: [{
  //         value: this.sampledata[0].tgl_estimasi_lab,                                                                    
  //       },{validator: Validators.required}],
  //   })
    
  // }

  // onDateChange(id){
  //   this.sampleForm = this.createLabForm()
  //   console.log(this.sampleForm)
  //   this._kendaliServ.updateEstimatelab(id, this.sampleForm.value).then(y => {
  //     this.load = true;
  //     let message = {
  //       text: 'Data Succesfully Updated',
  //       action: 'Done'
  //     }
  //     setTimeout(()=>{
  //       this.openSnackBar(message);
  //       this._route.navigateByUrl('analystpro/kendali/'+this.idkendali);
  //       this.load = false;
  //     },2000)
  //   })
  // }

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }


}
