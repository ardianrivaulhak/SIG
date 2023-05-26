import { Component, OnInit, Inject } from "@angular/core";
import {
    MatDialogRef,
    MatDialog,
    MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray,
  Form,
} from "@angular/forms";
import { LabPengujianService } from '../lab-pengujian.service';
@Component({
  selector: 'app-modal-late-comment',
  templateUrl: './modal-late-comment.component.html',
  styleUrls: ['./modal-late-comment.component.scss']
})
export class ModalLateCommentComponent implements OnInit {

  dataarr = [];


  
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
        private _dialogRef: MatDialogRef<ModalLateCommentComponent>,
        private _fb: FormBuilder,
        private _labServ: LabPengujianService
  ) { 
    if (data) {
      data.value.forEach(p => {
        console.log(p);
        this.dataarr = this.dataarr.concat({
          id: p.id,
          excuse: null,
          no_sample: p.no_sample,
          name_id: p.name_id,
          tgl_estimasi_lab: p.tgl_estimasi_lab
        })
      })
    }
  }

  ngOnInit(): void {
  }

  uniq(data, key) {
    return [...new Map(data.map((x) => [key(x), x])).values()];
}

setValueExcuse(v,i){
  this.dataarr[i].excuse = v.target.value;
}

savingexcuse(){
  this._labServ.sendExcuse(this.dataarr).then(x => this._dialogRef.close({
    b: "close",
    c: 'Success'
  }));
}

}
