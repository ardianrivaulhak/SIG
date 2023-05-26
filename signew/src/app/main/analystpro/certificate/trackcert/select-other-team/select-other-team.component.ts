import { Component, OnInit, Optional, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { CertificateService } from "../../certificate.service";
import { GroupService } from "app/main/analystpro/master/group/group.service";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-select-other-team',
  templateUrl: './select-other-team.component.html',
  styleUrls: ['./select-other-team.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})

export class SelectOtherTeamComponent implements OnInit {

  groupdata = []
  datasent = {
    pages : 1,
    marketing : null,
  }
  teamForm: FormGroup;
  load = false;
  modeselect = null
  sendData = {
    team : 0,
    id_contract: 0
  }
  
  constructor(
    public dialogRef: MatDialogRef<SelectOtherTeamComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _certService: CertificateService,
    private _groupService : GroupService,
    private _actRoute: ActivatedRoute,
    private _formBuild: FormBuilder,
    private _snackBar: MatSnackBar,
    private _route: Router,
  ) { }

  ngOnInit(): void {
    this.sendData.team = this.data.id;
    this.sendData.id_contract = this.data.id_contract;
    this.getGroup();
  }

  async getGroup(){
    await this._certService.getSelectTeam(this.datasent).then(x => {
      this.groupdata = this.groupdata.concat(x);
      console.log(this.groupdata)
    })
  }

  async saveForm()
  {
    this._certService.changeTeam(this.sendData).then(y => {
      this.load = true;
      let message = {
        text: 'Data Succesfully Updated',
        action: 'Done'
      }
      setTimeout(()=>{  
        this.openSnackBar(message);
        this.closeModal(false);
        this.load = false;
      },1000)
    })
  }

  closeModal(ev){
    return this.dialogRef.close({
      ev
    });
  }
  
  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }
  

}
