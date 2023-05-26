import {
  Component,
  OnInit,
  Optional,
  Inject,
  ViewEncapsulation,
} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ComplainService } from 'app/main/analystpro/complain/complain.service';
@Component({
  selector: 'app-resultmodalcomplain',
  templateUrl: './resultmodalcomplain.component.html',
  styleUrls: ['./resultmodalcomplain.component.scss']
})
export class ResultmodalcomplainComponent implements OnInit {

  datacomplainresult = [];
  headcomp = [];

  constructor(
    public dialogRef: MatDialogRef<ResultmodalcomplainComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _ComplServ: ComplainService
  ) { 
    if(data){
      this.getDataResult(data);
    }
  }

  ngOnInit(): void {
  }

  getDataResult(v){
    this._ComplServ.getDataResultAll(v.id).then((x : any)=> {
        this.headcomp = this.headcomp.concat({
          complaino: x.complain_no,
          complain_result: x.complain_result,
          actual_complain_result: x.actual_complain_result
        })
        this.datacomplainresult = x.complaindetagain.length > 0 ? this.datacomplainresult.concat(x.complaindetagain) : [];
        this.datacomplainresult = this.datacomplainresult.concat(x.transactionparameter);
    }).then(() => console.log(this.datacomplainresult));
  }
}
