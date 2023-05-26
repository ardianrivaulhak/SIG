import { Component, OnInit, Optional, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { CertificateService } from "../../../../certificate.service";
import { GroupService } from "app/main/analystpro/master/group/group.service";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-select-team',
  templateUrl: './select-team.component.html',
  styleUrls: ['./select-team.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class SelectTeamComponent implements OnInit {

  groupdata = []
  datasent = {
    pages : 1,
    marketing : null,
  }
  teamForm: FormGroup;
  load = false;
  modeselect = null


  constructor(
    public dialogRef: MatDialogRef<SelectTeamComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _certService: CertificateService,
    private _groupService : GroupService,
    private _actRoute: ActivatedRoute,
    private _formBuild: FormBuilder,
    private _snackBar: MatSnackBar,
    private _route: Router,
  ) { }

  ngOnInit(): void {
    this.getData();
    this.getGroup();
  }

  getData(){
    this.teamForm = this.createForm()
    console.log(this.data)
  }

  async getGroup(){
    await this._certService.getSelectTeam(this.datasent).then(x => {
      this.groupdata = this.groupdata.concat(x);
      console.log(this.groupdata)
    })
  }

  createForm(): FormGroup {
    return this._formBuild.group({
      team : ['',{ validator: Validators.required }]
    })
  }

  openSnackBar(message) {
    this._snackBar.open(message.text, message.action, {
      duration: 2000,
    });
  }

  async saveForm(){
    // console.log(this.teamForm.value)
    // console.log(this.data)
    this.load = await true;
    this.teamForm.value.team == null ? 
    await Swal.fire({
        title: 'Incomplete Data',
        text: 'Please complete the blank data!',
        icon: 'warning', 
        confirmButtonText: 'Ok'
      })
    : 
    await this._certService.addSelectTeam(this.data, this.teamForm.value)
    let message =  await {
        text: 'Data Succesfully Updated',
        action: 'Done'
    }
    await setTimeout( async ()=>{        
       this.load = await false;
       await this.openSnackBar(message);       
       await this.closeModal();
    }, 3000);
  }

  closeModal(){
    return this.dialogRef.close({
      
    });


  }
}
