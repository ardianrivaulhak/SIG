import { Component, OnInit, Optional, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { CertificateService } from '../../../certificate.service';
import { DataSource } from '@angular/cdk/table';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-parameter-all',
  templateUrl: './parameter-all.component.html',
  styleUrls: ['./parameter-all.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ParameterAllComponent implements OnInit {

    parameter = [];
    parameterForm: FormGroup;
    checkList = [];
    parameterselect : any;
    load = false;
    id_contract = 0;

    constructor(
        public dialogRef: MatDialogRef<ParameterAllComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
        private _certServ: CertificateService,
        private _formBuild: FormBuilder,
        private _snackBar: MatSnackBar,
    ) { }

    ngOnInit(): void {
        this.id_contract = this.data.idcontract;
        this.getParameter();
    }

    async getParameter()
    {
        await this._certServ.getAllParameter(this.data).then(async x => {
            this.parameter = this.parameter.concat(x)
        })
        .then(() => this.parameterForm = this.createForm())
    }

    createForm(): FormGroup {
        return this._formBuild.group({
            parameterselect: ['', { validator: Validators.required }],
            parameter_id: '',
            parameter_en: '',
            hasiluji: '',
            unit: '',
            lod: '',
            metode: '',
            standart: '',

        })
    }

    checkBox(ev, data){
        let z = this.checkList.filter(o => o.id == DataSource);
          if(ev){
            if(z.length > 0){
              z[0].checked = ev
            } else {
              this.checkList = this.checkList.concat({
                id: data,
                checked : true,
              });
            }
          } else {
            let z = this.checkList.filter(x => x.id == data);
            z[0].checked = ev;
          }
    }

    saveForm()
    {  
        let z = [];
        this.parameterselect = this.parameterForm.value.parameterselect;

        this.checkList.forEach( 
            x => {
            switch (x.id) {
                case 'parameter_id':
                let paramid = {
                        data : x.id,
                        value : this.parameterForm.value.parameter_id
                    }
                    z.push(paramid)
                break;

                case 'parameter_en':
                    let paramen = {
                            data : x.id,
                            value : this.parameterForm.value.parameter_en
                        }
                        z.push(paramen)
                break;

                case 'hasiluji':
                    let hasiluji = {
                            data : x.id,
                            value : this.parameterForm.value.hasiluji
                        }
                        z.push(hasiluji)
                break;

                case 'unit':
                    let unit = {
                            data : x.id,
                            value : this.parameterForm.value.unit
                        }
                        z.push(unit)
                break;

                case 'lod':
                    let lod = {
                            data : x.id,
                            value : this.parameterForm.value.lod
                        }
                        z.push(lod)
                break;

                case 'metode':
                    let metode = {
                            data : x.id,
                            value : this.parameterForm.value.metode
                        }
                        z.push(metode)
                break;

                case 'standart':
                  let standart = {
                          data : x.id,
                          value : this.parameterForm.value.standart
                      }
                      z.push(standart)
              break;
        
            
                default:
                break;
            }
                
            }
            
            );
        
          this._certServ.updateAllParameter(this.data, z, this.parameterselect)
          .then(y => {
            this.load = true;
            let message = {
              text: 'Data Succesfully Updated',
              action: 'Done'
            }
            setTimeout(()=>{  
              this.openSnackBar(message);
              this.closeDialog(false);
              this.load = false;
            },1000)
          })
        }
      
        openSnackBar(message) {
            this._snackBar.open(message.text, message.action, {
              duration: 2000,
            });
          }
        
        
          closeDialog(v){
            return this.dialogRef.close({
              v
            });
          }

}
