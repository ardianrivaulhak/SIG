import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { ContractService } from '../../services/contract/contract.service';  
import { LoginService } from "app/main/login/login.service";

@Component({
  selector: 'app-view-contract-det',
  templateUrl: './view-contract-det.component.html',
  styleUrls: ['./view-contract-det.component.scss'],
  animations   : fuseAnimations
})
export class ViewContractDetComponent implements OnInit {
  dataSource: any = [];
  dataSample = [];
  displayedColumns: string[] = [
    'no',
    'parameter', 
    'type',  
    'lod', 
    'standart',
    'satuan',
    'pkm',
    'st_lab',
  ];
  statusPengujian = []; 
  me = [];
  hidingprice;
  hasilhide;

  constructor( 
    private _kontrakServ: ContractService,
    private _snackBar: MatSnackBar, 
    private _dialogRef: MatDialogRef<ViewContractDetComponent>,
    private _loginServ: LoginService,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    if(data){
      this.hidingprice = data.hide;
      this.hasilhide = data.hidesee;
      this._kontrakServ.getDataDetailParameter(data.idsample).then(x => {
        this.dataSample = this.dataSample.concat(x); 
        this.getData();
      });
      
    }
    this._dialogRef.backdropClick().subscribe(v => {
      this.closeModal()
    });
   }

  ngOnInit(): void {
    // this.checkme();
  }

  getData(){
    this.dataSource = this.dataSample[0]['transactionparameter'];
  }

  closeModal(){
    return this._dialogRef.close({
      
    });
  }

  changingvalue(v){
    return v ? v.includes('^') ? `${v.split("^")[0]}${v.split('^')[1].sup()}` : v : '-';
  }

  sortData(sort: Sort) {
    const data = this.dataSource.slice();
    if ( !sort.active || sort.direction === '') {
      this.dataSource = data;
      return;
    }
    this.dataSource = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'parameter': return this.compare(a.parameter, b.parameter, isAsc);
        case 'type': return this.compare(a.type, b.type, isAsc);
        case 'lod': return this.compare(a.lod, b.lod, isAsc);
        case 'standart': return this.compare(a.standart, b.standart, isAsc);
        case 'satuan': return this.compare(a.satuan, b.satuan, isAsc);
        case 'pkm': return this.compare(a.pkm, b.pkm, isAsc);
        case 'st_lab': return this.compare(a.st_lab, b.st_lab, isAsc);
        default: return 0;
      }
    });
  }
  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

//   checkme() {
//     this._loginServ
//         .checking_me()
//         .then((x) => (this.me = this.me.concat(x)))
//         .then(() => {
//             if (this.me[0].id_bagian == 12) {
//                 if (this.me[0].id_level > 18) {
//                     this.hidingprice = true;
//                 } else {
//                     this.hidingprice = false;
//                 }
//             } else {
//                 this.hidingprice = false;
//             }
//         });
// }

}
