import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { DepartementService } from "../departement.service";
import { SisterCompanyService } from "app/main/hris/sister-company/sister-company.service";
import * as global from "app/main/global";
import { MessagingService } from "app/messaging.service";

@Component({
  selector: 'app-modal-departemen',
  templateUrl: './modal-departemen.component.html',
  styleUrls: ['./modal-departemen.component.scss']
})
export class ModalDepartemenComponent implements OnInit {
  deptForm: FormGroup;
  status;
  sisterCompany = [];
  company_id;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
        private _deptServ: DepartementService,
        private dialogRef: MatDialogRef<ModalDepartemenComponent>,
        private _formBuild: FormBuilder,
        private _sisterserv: SisterCompanyService,
        private messageServ: MessagingService,

  ) { 
    this.messageServ.getDataCompany().subscribe((m) => {
      this.company_id = m.id;
  });
    if(data){
      if (data.idstatus) {
          this.setValueForm(data.idstatus);
      } else {
          this.status = "add";
      }
  }
  this.dialogRef.backdropClick().subscribe((v) => { 
    this.close();
  });
  }

  ngOnInit(): void {
    this.deptForm = this.createForm();
    this.getDataSisterCompany();
  }

  getDataSisterCompany() {
    this._sisterserv
        .getSisterCompany()
        .then(
            (x: any) => (this.sisterCompany = this.sisterCompany.concat(x))
        );
}


  createForm(){
    return this._formBuild.group({
      dept_code: new FormControl(),
      dept_name: new FormControl(),
      company_name: new FormControl(),
    })
  }

  async setValueForm(v){
    this.status = await v;
    this.deptForm = await this.createForm();
    await this._deptServ.getDataDepartementDet(v).then((x: any) => {
      this.deptForm.patchValue({
        dept_code: x.dept_code,
        dept_name: x.dept_name,
        company_name: x.company_id,
      })
    });
  }

  serviceAct(){
    if(this.status !== 'add') {
      this._deptServ.updateDepartement(this.deptForm.value, this.status).then(x => {
        global.swalsuccess("Success","Success Updating Division")
      })
      .then(() => this.close())
      .catch(e => global.swalerror("Error Updating Division"));
    } else {
      this._deptServ.storeDept(this.deptForm.value).then(x => {
        global.swalsuccess("Success","Success Updating Division")
      })
      .then(() => this.close())
      .catch(e => global.swalerror("Error Adding Division"));
    }
  }

  close(){
    this.dialogRef.close();
  }

}
