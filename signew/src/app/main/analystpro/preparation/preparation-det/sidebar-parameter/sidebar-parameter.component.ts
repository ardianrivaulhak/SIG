import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { PreparationService } from '../../preparation.service';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar-parameter',
  templateUrl: './sidebar-parameter.component.html',
  styleUrls: ['./sidebar-parameter.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class SidebarParameterComponent implements OnInit {

  message:any;
  subscription: Subscription;

  parameterData = [];
  dataParameter = {
    id_sample: ''
  };
  idsample: any;
  displayedColumns: any[] = ['name_id'];
  state:any;

  constructor(
    private _preparationServ:PreparationService,
    private _actRoute: ActivatedRoute,
    public activatedRoute: ActivatedRoute,
  ) { 
    this.idsample = this._actRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.getDataParameter();
  }

  getDataParameter(){
    // this.dataParameter.id_sample = this.idsample;
    // // console.log(this.dataParameter);

    // this._preparationServ.getDataDetailPreparationParameter(this.dataParameter).then(x => {
    //   this.parameterData = this.parameterData.concat(Array.from(x['data']));
    //   console.log(this.parameterData);
    // })

    
    // this.subscription = this._preparationServ.getDataDetailPreparationParameter().subscribe(message => { this.message = message; });
    
    console.log(this.message);
  }

  receiveMessage($event) {
    this.message = $event;
  }
}
