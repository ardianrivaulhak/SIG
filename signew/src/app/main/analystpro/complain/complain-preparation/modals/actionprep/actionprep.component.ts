import { Component, OnInit, Optional, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { ContractService } from "app/main/analystpro/services/contract/contract.service";
import { KeuanganService } from "app/main/analystpro/keuangan/keuangan.service";
import { ComplainService } from "../../../complain.service";
import * as internal from 'assert';
import { MessagingService } from "app/messaging.service";

@Component({
  selector: 'app-actionprep',
  templateUrl: './actionprep.component.html',
  styleUrls: ['./actionprep.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ActionprepComponent implements OnInit {

  status = [
    {
      'id' : 1,
      'name' : 'Go'
    },
    {
      'id' : 2,
      'name' : 'Hold'
    },
    // {
    //   'id' : 2,
    //   'name' : 'New'
    // },
  ];

  valueStat = null
  load = false

  constructor(
    public dialogRef: MatDialogRef<ActionprepComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar,
    private _compServ : ComplainService,
    private _fbserv: MessagingService
  ) { }


  ngOnInit(): void {
    console.log(this.data)
  }

  async saveForm(){
    let senddata = await {
        id : this.data.id,
        value : this.valueStat
    }
    await this._compServ.StatusPrep(senddata).then((x) => {
        this.load = true;
        let message = {
            text: "Data Succesfully Updated",
            action: "Done",
        };
        setTimeout(() => {
          this._fbserv.sendMessage({
                        notification: {
                            title: `complain updated`,
                            body: `{"idtechdet": "${this.data.id}", "value":"${this.valueStat}"}`,
                        },
                        to: 'topics/complain'
                    },'complain').then(x => console.log(x));
            this.openSnackBar(message);
            this.closeModal(false)
            this.load = false;
        }, 2000);
    });
  }

  
  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
        duration: 2000,
    });
  }

  closeModal(v){
    return this.dialogRef.close({
        v
    });
    
  }


}
