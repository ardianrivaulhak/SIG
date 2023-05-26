import { Component, OnInit, Optional, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { CertificateService } from '../../../../certificate.service';
import { MatDialog } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { MatSort, Sort } from '@angular/material/sort'
import { ContractService } from "app/main/analystpro/services/contract/contract.service";
import { PdfService } from "app/main/analystpro/services/pdf/pdf.service";
import * as globals from "app/main/global";
import { MatTable } from "@angular/material/table";
import { AddParamAkgComponent } from "./addparamakg/addparamakg.component";
import Swal from "sweetalert2";

@Component({
  selector: 'app-addakg',
  templateUrl: './addakg.component.html',
  styleUrls: ['./addakg.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class AddakgComponent implements OnInit { 
  loadingfirst = false;
  displayedColumns: string[] = [
    'number',
    'checkbox', 
    'parameter',
    'unit_akg', 
    'unit_lhp',
    'result_lhp',
    'result_akg', 
    'result_takaran_saji', 
    'pencantuman', 
    'nilai_acuan', 
    'persen_akg',
    'pencantuman_akg'
  ];

  selectData = [
    { id : 550 },
    { id : 725 },
    { id : 1125 },
    { id : 2150 },
    { id : 2510 },
    { id : 2615 },
    { id : 2000 },
  ]

  selectType = [
    {
      id : 1,
      name : 'gram'
    },
    {
      id : 2,
      name : 'mL'
    }
  ]

  id_contract:any;
  load = false;
  dataContract = [];
  dataFilterContract = {
    pages: 1,
    type: "paginate",
    category: null,
    month: null,
    customers: null,
    contact_person: null,
    date: null,
    search: null,
  };
  listContract = [];
  sendData = {
    format: null,
    id_contracts : null,
    id_lhu : 0,
    select_takaran_saji: null,
    takaran_saji : null,
    bj : null,
    energi : null,
    size: null,
    servingperpack: null
  }
  filterLhu = {
    pages: 1,
    type: "paginate",
    id_contract: this._actRoute.snapshot.params['id'],
    date: null,
    search: null,
  }
  listLhu = [];
  filterParameter = {
    id_lhu : null,
  }
  listParameter = [];
  disabledBUtton = false;
  checkParameter = [];
  checkList = []
  allComplete: boolean = false;
  @ViewChild(MatTable) table: MatTable<any>;
  loading = false;

  dataParameter: any;
  format = [];
  
  cantumTakaranSaji = [];
  pencantumanAkg = [];

  disabledForm = true;

  constructor(
    private _certServ: CertificateService,
    private _formBuild: FormBuilder,
    private _matDialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _actRoute: ActivatedRoute,
    private _route: Router,
    private _kontrakServ: ContractService,
    private PdfServ: PdfService,
  ) { 
    this.id_contract = this._actRoute.snapshot.params['id'];
  }


  ngOnInit(): void {
    this.getContractDetail();
    this.getAkgFomat();
  }

  openDisabled(v)
  {
    this.disabledForm = false;
   
  }

  ServSize(v)
  {
    if(this.sendData.size == 2)
    {
      this.sendData.takaran_saji = v*this.sendData.bj
    }else{
      this.sendData.takaran_saji = v;
    }
  }

  bobotJenis(v)
  {
    console.log(v)
    if(this.sendData.size == 2)
    {
      this.sendData.takaran_saji = v*this.sendData.select_takaran_saji
    }else{
      this.sendData.takaran_saji = this.sendData.select_takaran_saji;
    }
  }
  

  async getContractDetail(){
    await this._certServ.getContractDetail(this.id_contract)
       .then(x => this.dataContract = this.dataContract.concat(x))
      
    this.sendData.id_contracts  = await  this.dataContract[0].id_kontrakuji;
    this.dataFilterContract.search = await this.dataContract[0].contract_no;
    await this.getDataContract();
    
    this.loadingfirst == await false;
  }

  async getDataContract() {
    await this._certServ
        .getContractList(this.dataFilterContract)
        .then((x) => {
          this.listContract = this.listContract.concat(Array.from(x['data']));            
          this.listContract = globals.uniq(this.listContract, (it) => it.id_kontrakuji);         
    });
    await this.getLhu();
  }

  onScrollToEnd(e) {
    if (e === "no_kontrak") {
        this.dataFilterContract.pages = this.dataFilterContract.pages + 1;
        this.getDataContract();
    }
    if (e === "no_lhu") {
      this.filterLhu.pages = this.filterLhu.pages + 1;
      this.getDataContract();
  }
  }

  async getValKontrak(ev) {
    console.log(ev)
    this.filterLhu.id_contract = await ev.id_kontrakuji;
    this.getLhu();
  }

  onsearchselect(ev, val) {
    if (val === "kontrak") {
        this.listContract = [];
        this.dataFilterContract.search = ev.term;
        this.dataFilterContract.pages = 1;
        this.getDataContract();
    }

    if (val === "lhu") {
      this.listLhu = [];
      this.filterLhu.search = ev.term;
      this.filterLhu.pages = 1;
      this.getLhu();
  }
  }

  async getLhu()
  {
    await this._certServ
    .listLHUbyContract(this.filterLhu)
    .then((x) => {
      this.listLhu = this.listLhu.concat(Array.from(x['data']));            
      this.listLhu = globals.uniq(this.listLhu, (it) => it.id);         
    });
  }

   inclusionsServiceSize(x,i, hasiltakaransaji)
  {
    if(x.akg_master.p_takaransaji == 1){
      this.cantumTakaranSaji[i] =  hasiltakaransaji < 5 ? 0 : hasiltakaransaji < 50 ? 5 * Math.round(hasiltakaransaji / 5) : 10 * Math.round(hasiltakaransaji / 10);
    }
    else if(x.akg_master.p_takaransaji == 2){
      this.cantumTakaranSaji[i] = hasiltakaransaji < 2 ? 0 : hasiltakaransaji < 5 ? 1 * Math.round(hasiltakaransaji/1) :  5 * Math.round(hasiltakaransaji/5);
    }
    else if(x.akg_master.p_takaransaji == 3){
      this.cantumTakaranSaji[i] =hasiltakaransaji < 0.5 ? 0 : hasiltakaransaji < 5 ? 0.5 * Math.round(hasiltakaransaji/0.5) : 1 * Math.round(hasiltakaransaji/1);
    }
    else if(x.akg_master.p_takaransaji == 4){
      this.cantumTakaranSaji[i] = hasiltakaransaji < 0.5 ? 0 : 1 * Math.round(hasiltakaransaji/1);
    }
    else if(x.akg_master.p_takaransaji == 5){
      this.cantumTakaranSaji[i] = hasiltakaransaji < 5 ? 0 : hasiltakaransaji < 140 ? 5 * Math.round(hasiltakaransaji/5) : 10 * Math.round(hasiltakaransaji/10);        
    }    
    else{
      this.cantumTakaranSaji[i] =  0;
    }
    console.log(this.cantumTakaranSaji[i])
  }
  
  inclusionsIng(x,i, cantums)
  {    
    console.log(Math.round(cantums[i]/1))
    if(x.akg_master.p_akg == 1){
        this.pencantumanAkg[i] = cantums[i] < 1 ? 0 : 1 * Math.round(cantums[i]/1);
    }
    if(x.akg_master.p_akg == 2){
      this.pencantumanAkg[i] = cantums[i] < 2 ? 0 : cantums[i] < 10 ? 2 * Math.round(cantums[i]/2) : 5 * Math.round(cantums[i]/5);
    }    
    if(x.akg_master.p_akg == 3){
      this.pencantumanAkg[i] = 0;
    }
    if(x.akg_master.p_akg == 4){
      this.pencantumanAkg[i] = cantums[i];
    }
  }

  alg = [];
  cantumAkg = [];

  acuanLabelGizi(x, energi, i)
  {
    this.alg[i] = energi == 550 ? x.akg_master.newborn : energi == 725 ? x.akg_master.infant :energi == 1125 ? x.akg_master.toddler : energi == '2150' ? x.akg_master.general : energi == 2510 ? x.akg_master.pregnant_mother : energi == 2615 ? x.akg_master.breastfeeding_mothers : energi == 2000 ? x.akg_master.two_tho_cal : 0
  }

  ingPersen(i, hasiltakaransaji, alg)
  {
    this.cantumAkg[i] =  hasiltakaransaji / alg * 100 == 0 || isNaN(hasiltakaransaji / alg * 100) ? 0 : hasiltakaransaji / alg * 100;
  }


  async getParameterinLhu()
  {
    if(!this.sendData.format || 
      !this.sendData.size || 
      !this.sendData.select_takaran_saji ||
      !this.sendData.bj ||
      !this.sendData.energi){
        await Swal.fire({
          title: "Check Again!",
          text: "please double check the data you input",
          icon: "warning",
          confirmButtonText: "Ok",
      });
      }else{
          
      this.disabledBUtton = await true;
      this.loadingfirst =  await true;
      this.checkParameter = await [];
      this.filterParameter.id_lhu = await this.sendData.id_lhu;

        await this._certServ.listParameterinCertificate(this.filterParameter)
        .then(async (x) => {
            let b = [];
            b = await b.concat(x);
            await b.forEach((x, i) => {
              console.log(x)
              let hasiltakaransaji =  x.hasiluji == '' ? x.simplo*x.duplo/2 : x.hasiluji == 'Not detected' ? 0 : x.hasiluji.includes("<") ? 0 : x.hasiluji / 100 * this.sendData.takaran_saji;
              this.acuanLabelGizi(x, this.sendData.energi, i);
              this.ingPersen(i, hasiltakaransaji, this.alg[i]);              
              this.inclusionsServiceSize(x, i, hasiltakaransaji);
              this.inclusionsIng(x, i, this.cantumAkg);
              
              //check lemak jenuh (id lemak jenuh pada database)
              if (x.id_parameteruji == 392 || x.id_parameteruji == 1362) {
                this.checkParameter = this.checkParameter.concat({
                  completed: false,
                  // id dari energi dari lemak jenuh
                  id: null,
                  id_parameteruji: 9941,
                  id_contract: this.sendData.id_contracts,
                  id_lhu: this.sendData.id_lhu,
                  parameteruji_id: 'Energi dari Lemak Jenuh',
                  unit_akg: 0,
                  unit_lhp: 0,
                  result_lhp: x.hasiluji == 'Not detected' ? 0 : isNaN(x.hasiluji) ? 0 : x.hasiluji == null ? 0 : x.hasiluji * 9,
                  result_akg: x.hasiluji == 'Not detected' ? 0 : isNaN(x.hasiluji) ? 0 : x.hasiluji == null ? 0 : x.hasiluji * 9,
                  result_takaran_saji: hasiltakaransaji.toFixed(2),
                  pencantuman: this.cantumTakaranSaji[i] ,
                  ref: this.alg[i],
                  akg: this.cantumAkg[i].toFixed(2),
                  pencantuman_akg :this.pencantumanAkg[i],
                  que: 3,
                  akg_master : x.akg_master
                });
              }
    
              this.checkParameter = this.checkParameter.concat({
                completed: false,
                id: x.id,
                id_parameteruji: x.id_parameteruji,
                id_contract: this.sendData.id_contracts,
                id_lhu: this.sendData.id_lhu,
                parameteruji_id: x.parameteruji_id,
                unit_akg: x.akg_master.master_unit.nama_unit,
                unit_lhp: x.unit,
                result_lhp: x.hasiluji,
                result_akg: x.hasiluji,
                result_takaran_saji: hasiltakaransaji.toFixed(2),
                pencantuman: this.cantumTakaranSaji[i] ,
                ref: this.alg[i],
                akg: this.cantumAkg[i].toFixed(2),
                pencantuman_akg : this.pencantumanAkg[i],
                que: x.akg_master.queue,
                akg_master : x.akg_master
              });
            }) 
          });
    
          await console.log(this.checkParameter)
    
          this.checkParameter.sort((a, b) => {
            return (a.que > b.que) ? 1 : ((b.que > a.que) ? -1 : 0);
          })
    
          this.checkParameter.filter( x => {
            let up = x.parameteruji_id.toUpperCase();
            return up == "LEMAK JENUH";
          }).length;
          
    
          this.listParameter = await this.listParameter.concat(this.checkParameter)
          await setTimeout( async () =>{
          this.disabledBUtton = await false;
          this.loadingfirst =  await false;
          },1000)
      }
    
  }

  async removeParameter()
  {
    this.disabledBUtton = await false;
    this.loadingfirst =  await false;
    this.listParameter = await [];
     this.sendData.id_lhu = await null;
    await  this.getParameterinLhu();
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.checkParameter == null) {
      return;
    }
    if(completed == true)
    {
      this.checkParameter.forEach(t => t.completed = completed);
      this.checkParameter.forEach( x => {
        this.checkList = this.checkList.concat({
          id: x.id,
          checked : true
        })
      })
      this.checkList = globals.uniq(this.checkList, (it) => it.id);
    }else{
      this.checkParameter.forEach(t => t.completed = completed);
      this.checkList = [];
    }
    console.log(this.checkList)
  }

  updateAllComplete() {
    this.allComplete = this.checkParameter != null && this.checkParameter.every(t => t.completed);
    console.log(this.allComplete)
  }

  someComplete(): boolean {
    if (this.checkParameter == null) {
      return false;
    }
    console.log(this.allComplete)
    return this.checkParameter.filter(t => t.completed).length > 0 && !this.allComplete;      
  }

  checkBox(ev, id){
    let z = this.checkList.filter(o => o.id == id);
   
    if(ev){
      if(z.length > 0){
        z[0].checked = ev
      } else {
        this.checkList = this.checkList.concat({
          id: id,
          checked : true
        });
      }
    } else {
      let z = this.checkList.filter(x => x.id == id);
      z[0].checked = ev;
    }
  }

  removeCheckParameter()
  {
    let u = [];
    this.checkList.forEach((x) => {
        if (x.checked) {
            u = u.concat({
                id: x.id,
            });
        }
    });
    this.listParameter =  this.listParameter.filter(t => t.completed == false);  
  }

  addAkg(id)
  { 
    const dialogRef = this._matDialog.open(AddParamAkgComponent, {
      panelClass: 'akg-add-dialog',
      width: '600px',
      data: {id : id},
      disableClose : true
    });

    dialogRef.afterClosed().subscribe((result) => {
      if(result.d.close == false){
        this.getOneParameter(id, result.d.select)
      }
    });
  }

    async getOneParameter(idlhu, par)
    {
      console.log(this.sendData)
        await this._certServ.getLhuInContractwithOneParameters(idlhu, par)
        .then(async (x) => { 
          let b = [];
          b = await b.concat(x);          
          await b.forEach(x => {
           if(x.akg_master == null || x.akg_master == ''){
              Swal.fire({
                title: "Warning!",
                text: "The parameter that has been selected is not the akg parameter",
                icon: "warning",
                confirmButtonText: "Ok",
              });
           }else{
            let a = x.hasiluji == 'Not detected' ? 0 : x.hasiluji.includes("<") ? 0 :  x.hasiluji/100*this.sendData.takaran_saji;
            let z = this.sendData.energi == 550 ? x.akg_master.newborn : this.sendData.energi == 725 ? x.akg_master.infant : this.sendData.energi == 1125 ? x.akg_master.toddler : this.sendData.energi == '2150' ? x.akg_master.general : this.sendData.energi == 2510 ? x.akg_master.pregnant_mother : this.sendData.energi == 2615 ? x.akg_master.breastfeeding_mothers : this.sendData.energi == 2000 ?   x.akg_master.two_tho_cal : 0;

            this.checkParameter = this.checkParameter.concat({
                completed : false,
                id : x.id,
                id_contract : this.sendData.id_contracts,
                id_lhu : this.sendData.id_lhu,
                parameteruji_id : x.parameteruji_id,
                unit_akg : x.akg_master.master_unit.nama_unit,
                unit_lhp : x.unit,
                result_lhp : x.hasiluji,
                result_akg : x.hasiluji,
                result_takaran_saji :  a.toFixed(2),
                pencantuman : Math.round(a),
                ref : z,
                akg : a / z  * 100 == 0 ? 0 : Math.round(a / z  * 100),
                que: x.akg_master.queue
            })
           }            
          }) 
        });
        this.checkParameter.sort((a, b) => {
          return (a.que > b.que) ? 1 : ((b.que > a.que) ? -1 : 0);
        })
        this.listParameter = await []
        this.listParameter = await this.listParameter.concat(this.checkParameter)
        
    }

    async submitButton()
    {
      await console.log(this.listParameter)
      let data = await {
        identity : this.sendData, 
        parameter : this.listParameter
      }
      await this._certServ.submitAkg(data).then((x) => {
        this.loading = true;
        let message = {
            text: "Data Succesfully Updated",
            action: "Done",
        };
        setTimeout(() => {
            this.loading = false;
        }, 2000);
      });
      await this._route.navigateByUrl("analystpro/certificate/"+ this.filterLhu.id_contract +"/lhu/ing");
    }

    async getAkgFomat()
    {
      await this._certServ.getAkgFormat()
        .then(async (x) => {
          this.format = this.format.concat(x);
        });
        await console.log(this.format)

    }

    async lhpResult(v, i)
    {
      await console.log(this.listParameter[i].result_lhp)
      this.listParameter[i].result_akg = await this.listParameter[i].result_lhp;
      this.listParameter[i].result_takaran_saji = await this.listParameter[i].result_akg/100 * this.sendData.takaran_saji;
   
      await this.inclusionsServiceSize(this.listParameter[i], i, this.listParameter[i].result_takaran_saji);
      this.listParameter[i].pencantuman = await this.cantumTakaranSaji[i];

    }




}
