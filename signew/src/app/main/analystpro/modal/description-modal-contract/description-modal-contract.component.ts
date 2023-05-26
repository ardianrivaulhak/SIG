import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
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
import { ContractService } from 'app/main/analystpro/services/contract/contract.service';
import { LoginService } from 'app/main/login/login.service';
import { url } from 'app/main/url';

@Component({
  selector: 'app-description-modal-contract',
  templateUrl: './description-modal-contract.component.html',
  styleUrls: ['./description-modal-contract.component.scss']
})
export class DescriptionModalContractComponent implements OnInit {

  @ViewChild("isichat") d1: ElementRef;
  sendchat;
  idContrack;
  chatnumber;
  chat = [];
  chatnew = [];
  me = [];


  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private _loginServ: LoginService,
    private dialogRef: MatDialogRef<DescriptionModalContractComponent>,
    public kontrakServ: ContractService
  ) {
    if(data){
      this.checkme();
      this.idContrack = data.idcontract;
      this.getDataInternal(data.idcontract);
    }
   }

  ngOnInit(): void {
  }

  checkme() {
    this._loginServ
        .checking_me()
        .then((x) => (this.me = this.me.concat(x)));
  }

  send(){
    this.kontrakServ.sendChat({idcontract: this.idContrack, chat: this.sendchat}).then(x => {
      this.sendchat = '';
      this.chat = [];
      this.getDataInternal(this.idContrack);
    });
  }

  refresh(){
    this.chat = [];
    this.getDataInternal(this.idContrack);
  }

  getDataInternal(v) {
    this.kontrakServ.getChat(v).then(async (x) => {
      this.chat = this.chat.concat(x);
    });
}
}
