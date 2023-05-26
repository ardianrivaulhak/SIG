import { Component, OnInit, Inject } from '@angular/core'; 
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog'; 

@Component({
  selector: 'app-modal-set-complain-status',
  templateUrl: './modal-set-complain-status.component.html',
  styleUrls: ['./modal-set-complain-status.component.scss']
})
export class ModalSetComplainStatusComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private _dialogRef: MatDialogRef<ModalSetComplainStatusComponent>
  ) { 
    if(data){
      console.log(data);
    }  
  }

  ngOnInit(): void {
  }

  setValue(v){
    return parseInt(v);
}

}
