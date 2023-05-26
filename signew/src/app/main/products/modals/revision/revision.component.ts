import { Component, OnInit, Optional, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef,MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as globals from "app/main/global";
import { ProductsService } from "../../products.service";
import { ModalPhotoComponent } from "app/main/analystpro/modal/modal-photo/modal-photo.component";
import { ContractService } from "app/main/analystpro/services/contract/contract.service";
import { url, urlApi } from "app/main/url";
import * as global from "app/main/global";

@Component({
  selector: 'app-revision',
  templateUrl: './revision.component.html',
  styleUrls: ['./revision.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class RevisionComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<RevisionComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
  }

}
