import { Component, OnInit, Output, ViewEncapsulation  } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import * as globals from "app/main/global";
import { PageEvent } from "@angular/material/paginator";
import { ProductsService } from "../../../../products.service";
import { MediartucontractService } from "../../../pdf/mediartucontract.service";
import { CustomerService } from "app/main/analystpro/master/customers/customer.service";
import { FuseConfigService } from '@fuse/services/config.service';
@Component({
  selector: 'app-contractpdf',
  templateUrl: './contractpdf.component.html',
  styleUrls: ['./contractpdf.component.scss']
})
export class ContractpdfComponent implements OnInit {

  idcontract = this._actRoute.snapshot.params['id'];

  constructor(
    private _productServ: ProductsService,
    private _pdfConMedia : MediartucontractService,
    private _actRoute: ActivatedRoute,
    private _fuseConfigService: FuseConfigService,
  ) {
    this._fuseConfigService.config = {
      layout: {
          navbar   : {
              hidden: true
          },
          toolbar  : {
              hidden: true
          },
          footer   : {
              hidden: true
          },
          sidepanel: {
              hidden: true
          }
      }
    };
   }

  ngOnInit(): void {
    this.openContractProduct()
  }

  async openContractProduct()
  {
        // this.getProduct = await [];
        let dt: any;

        await this._productServ.getProductMediaRTU(this.idcontract).then( async x => {
            dt  = x
        })
          console.log(dt)
        // data.product = this.getProduct;
        // await console.log(data);
        await this._pdfConMedia.generatePdf(dt);
        // this.mediartuData = await [];
        // await this.getData();
  } 

}
