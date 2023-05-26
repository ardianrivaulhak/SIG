import { Component, OnInit, Optional, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { CertificateService } from "../../certificate.service";
import { GroupService } from "app/main/analystpro/master/group/group.service";
import Swal from 'sweetalert2';
import * as globals from "app/main/global";

@Component({
  selector: 'app-list-lhu',
  templateUrl: './list-lhu.component.html',
  styleUrls: ['./list-lhu.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ListLhuComponent implements OnInit {
  dataFilter = {
    id_contract : 0
  }
  certData = [];

  constructor(
    public dialogRef: MatDialogRef<ListLhuComponent>,
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
  }

  async getData(){
     this.dataFilter.id_contract = await this.data.id_contract;
    await this._certService.getDataCertificatinContract(this.dataFilter).then(x => {
      this.certData = this.certData.concat(x);
      this.certData = globals.uniq(this.certData, (it) => it.id);
    })
    .then(x => console.log(this.certData));
  }

  goCertificate(id, ev) {
    const url = this._route.serializeUrl(
        ev == 'ID' ? this._route.createUrlTree([`/certificate/pdf-certificate/` + id  + `/id`]) : this._route.createUrlTree([`/certificate/pdf-certificate/` + id  + `/en`])
    );      
    let baseUrl = window.location.href.replace(this._route.url, '');
    window.open(baseUrl + url, '_blank');
  }



  closeModal(ev){
    return this.dialogRef.close({
      ev
    });
  }

}
