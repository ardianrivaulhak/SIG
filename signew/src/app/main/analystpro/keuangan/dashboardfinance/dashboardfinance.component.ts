import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { multi } from './data';
import { KeuanganService } from "../keuangan.service";
import * as globals from "app/main/global";
import { LoginService } from 'app/main/login/login.service';
import * as _moment from "moment";


@Component({
  selector: 'app-dashboardfinance',
  templateUrl: './dashboardfinance.component.html',
  styleUrls: ['./dashboardfinance.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class DashboardfinanceComponent implements OnInit {
  multi: any[];
  // view: any[] = [1024, 500];

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = false;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Month';
  showYAxisLabel: boolean = true;
  yAxisLabel: string = 'Price';
  // legendTitle: string = 'Status';

  colorScheme = {
    domain: ['#0578AA', '#3AB4F2', '#47B5FF']
  };

  userTopGlobal = [];
  user = null;
  currentHours = null;
  currentTime = null;
  currentDay = null;

  priceInvoiceDay = null;
  totalInvoiceDay = null;

  month = [
    {value: 1, viewValue: 'January'},
    {value: 2, viewValue: 'February'},
    {value: 3, viewValue: 'March'},
    {value: 4, viewValue: 'April'},
    {value: 5, viewValue: 'May'},
    {value: 6, viewValue: 'June'},
    {value: 7, viewValue: 'July'},
    {value: 8, viewValue: 'August'},
    {value: 9, viewValue: 'September'},
    {value: 10, viewValue: 'October'},
    {value: 11, viewValue: 'November'},
    {value: 12, viewValue: 'Desember'}
  ];

  years = [
    { value: 2021, viewValue: '2021'},
    { value: 2022, viewValue: '2022'},
    { value: 2023, viewValue: '2023'},
  ]


  formDate = {
    month : _moment().month(),
    year : _moment().year()
  }

  constructor(
    private _masterServ: KeuanganService,
    private _loginServ: LoginService,
  ) {
    Object.assign(this, { multi })
   }

  ngOnInit(): void {
    console.log(_moment().month())
    this.getDataUserTopGlobals();
    this.getMe();
    this.getTimeNow();
    this.getPriceInvoiceDay();
    this.getTotalInvoiceDay();
  }

  async getMe(){
    await this._loginServ.checking_me().then( async x => {
       this.user = await x[0].employee_name
    });
  }

  getTimeNow()
  {
    let current = new Date();
    current.getHours() < 12 ? this.currentHours = 'Good Morning,' : current.getHours() < 18 ? this.currentHours = 'Good Afternoon,' : this.currentHours = 'Good Evening,';
    this.currentDay = current.toLocaleString('en-us', {weekday:'long'}) + ', ' + current.toLocaleString('default', { month: 'long' }) + ' ' + current.getDay() + ', ' + current.getFullYear();
  }


  async getDataUserTopGlobals()
  {
    await this._masterServ.userTopGlobals('wewew').then( x => {
      this.userTopGlobal = this.userTopGlobal.concat(x);
      this.userTopGlobal = globals.uniq(this.userTopGlobal, (it) => it.user_id);
    })
    .then(()=> console.log(this.userTopGlobal))
  }

  async getPriceInvoiceDay()
  {
    await this._masterServ.getPriceInvoiceDay('wewew').then( x => {
      this.priceInvoiceDay = x[0].total_day;
    })
    .then(()=> console.log(this.priceInvoiceDay))
  }

  async getTotalInvoiceDay()
  {
    await this._masterServ.getTotalInvoiceDay('wewew').then( x => {
      this.totalInvoiceDay = x[0].sum;
    })
    .then(()=> console.log(this.totalInvoiceDay))
  }

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

}
