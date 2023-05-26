import {
    Component,
    OnInit,
    Optional,
    Inject,
    ViewEncapsulation,
    ViewChild,
} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl,
} from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { fuseAnimations } from "@fuse/animations";
import { ActivatedRoute, Router } from "@angular/router";
import { CertificateService } from "../../../../../certificate.service";

@Component({
  selector: 'app-addparamakg',
  templateUrl: './addparamakg.component.html',
  styleUrls: ['./addparamakg.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None,
})
export class AddParamAkgComponent implements OnInit {

  a = {
    id_transaction : 0,
    pages : 1
  }
  listParameter = [];
  selectParameter: any;

  constructor(
    public dialogRef: MatDialogRef<AddParamAkgComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _service : CertificateService
  ) { }

  ngOnInit(): void {
    console.log(this.data)
    this.getParameter();
  }


  async getParameter()
  {
    this.a.id_transaction = await this.data;
    await this._service.getParameter(this.a).then( x => 
        this.listParameter = this.listParameter.concat(Array.from(x['data']))
    );
    await console.log(this.listParameter)
  }

  addButton()
  {
    this.closeDialog(false)
    console.log(this.selectParameter)
  }

  closeDialog(v){
    return this.dialogRef.close({
      d : {
        close : v,
        select: this.selectParameter
      }
    });
  }

}
