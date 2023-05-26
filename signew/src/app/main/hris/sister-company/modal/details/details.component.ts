import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { SisterCompanyService } from "../../sister-company.service";
import * as global from "app/main/global";

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  SisterCompanyForm: FormGroup;
  status;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
        private _levelServ: SisterCompanyService,
        private dialogRef: MatDialogRef<DetailsComponent>,
        private _formBuild: FormBuilder
  ) {
    if (data) {
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
    this.SisterCompanyForm = this.createForm();
}

close() {
    this.dialogRef.close();
}

async setValueForm(v) {
    this.status = await v;
    this.SisterCompanyForm = await this.createForm();
    await this._levelServ.getSisterCompanyDataDetail(v).then((x: any) => {
        this.SisterCompanyForm.patchValue({
            company_name: x.company_name,
            desc: x.desc
        });
    });
}

createForm(): FormGroup {
    return this._formBuild.group({
        company_name: new FormControl(),
        desc: new FormControl(),
    });
}

serviceAct() {
    if (this.status == "add") {
        this._levelServ
            .saveDataSisterCompany(this.SisterCompanyForm.value)
            .then((x) => {
                global.swalsuccess("Success", "Adding Data !");
            })
            .then(() => this.close())
            .catch((e) => global.swalerror("Error Saving Data"));
    } else {
        this._levelServ
            .updateDataSisterCompany(this.SisterCompanyForm.value, this.status)
            .then((x) => {
                global.swalsuccess("Success", "Edit data !");
            })
            .then(() => this.close())
            .catch((e) => global.swalerror("Error Saving Data"));
    }
}

}
