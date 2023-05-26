import { Component, OnInit, Inject } from "@angular/core";
import {
    MatDialogRef,
    MatDialog,
    MAT_DIALOG_DATA,
} from "@angular/material/dialog";

@Component({
  selector: 'app-penawaran-view-detail',
  templateUrl: './penawaran-view-detail.component.html',
  styleUrls: ['./penawaran-view-detail.component.scss']
})
export class PenawaranViewDetailComponent implements OnInit {

  dataParam = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<PenawaranViewDetailComponent>,
  ) { 
    if(data){
      console.log(data);
      this.dataParam = this.dataParam.concat(data);
    }
  }

  ngOnInit(): void {
  }

}
