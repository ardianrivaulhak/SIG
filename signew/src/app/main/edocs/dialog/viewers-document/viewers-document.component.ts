import { Component, OnInit, Optional, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { EdocsService } from "../../edocs.service";

@Component({
  selector: 'app-viewers-document',
  templateUrl: './viewers-document.component.html',
  styleUrls: ['./viewers-document.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ViewersDocumentComponent implements OnInit {

  viewedData = [];

  constructor(
    public dialogRef: MatDialogRef<ViewersDocumentComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _esocServ : EdocsService
  ) { }

  ngOnInit(): void {
    console.log(this.data)
    this.getData();
  }

  async getData()
  {
    await this._esocServ.getViewedDocuments(this.data.data).then( (x) => {
      this.viewedData = this.viewedData.concat(Array.from(x['data']))
    });
    await console.log(this.viewedData);
  }

}
