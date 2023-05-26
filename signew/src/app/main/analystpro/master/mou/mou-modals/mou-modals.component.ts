import { Component, OnInit, Inject } from "@angular/core";
import {
    MatDialogRef,
    MatDialog,
    MAT_DIALOG_DATA,
} from "@angular/material/dialog";

@Component({
  selector: 'app-mou-modals',
  templateUrl: './mou-modals.component.html',
  styleUrls: ['./mou-modals.component.scss']
})
export class MouModalsComponent implements OnInit {

  datafor = [];
  judul: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
        private _dialogRef: MatDialogRef<MouModalsComponent>,
  ) {
    if (data) {
      console.log(data);
      this.datafor = this.datafor.concat(data.info);
      this.judul = data.judul;
    }
   }

  ngOnInit(): void {
  }

}
