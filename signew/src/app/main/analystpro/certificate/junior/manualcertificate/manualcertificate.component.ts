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
import * as _moment from "moment";
import { EmployeeService } from "app/main/hris/employee/employee.service";
import { CKEditor5, ChangeEvent, FocusEvent, BlurEvent } from '@ckeditor/ckeditor5-angular';


@Component({
  selector: 'app-manualcertificate',
  templateUrl: './manualcertificate.component.html',
  styleUrls: ['./manualcertificate.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None,
})
export class ManualcertificateComponent implements OnInit {

  htmlContent = '';    
  ckeConfig: any;

  constructor() { }

  ngOnInit(): void {
  }

}
