import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ParametertypeService } from "../parametertype.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { fuseAnimations } from "@fuse/animations";
import Swal from "sweetalert2";

@Component({
    selector: "app-parametertype-det",
    templateUrl: "./parametertype-det.component.html",
    styleUrls: ["./parametertype-det.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class ParametertypeDetComponent implements OnInit {
    datasub = {
        page: 1,
        id_catalogue: null,
        search: null,
    };
    parametertypeForm: FormGroup;
    detaildata = [];

    idparametertype: any;
    dataId = {
        id_paketuji: "",
        parameteruji: [],
    };
    ideditparametertype: number;
    hide = true;
    load = false;
    saving = false;
    active = [
        { value: 1, viewValue: "Active" },
        { value: 0, viewValue: "Not Active" },
    ];

    constructor(
        private _masterServ: ParametertypeService,
        private _actRoute: ActivatedRoute,
        private _formBuild: FormBuilder,
        private _snackBar: MatSnackBar,
        private _route: Router
    ) {
        this.idparametertype = this._actRoute.snapshot.params["id"];
    }

    ngOnInit(): void {
        this.getdatadetail();
    }

    enableForm() {
        this.hide = false;
        this.parametertypeForm.get("name").enable();
        this.parametertypeForm.get("description").enable();
        // this.parametertypeForm.get('active').enable();
    }

    disableForm() {
        this.hide = true;
        this.parametertypeForm.get("name").disable();
        this.parametertypeForm.get("description").disable();
        // this.parametertypeForm.get('active').enable();
        // this.parametertypeForm.get('disable').enable();
    }

    getdatadetail() {
        this._masterServ
            .getDataParameterTypeDetail(this.idparametertype)
            .then((x) => (this.detaildata = this.detaildata.concat(x)))
            .then(() => (this.parametertypeForm = this.createLabForm()));
    }

    createLabForm(): FormGroup {
        return this._formBuild.group({
            name: [
                {
                    value:
                        this.idparametertype !== "add"
                            ? this.detaildata[0].name
                            : "",
                    disabled: this.idparametertype !== "add" ? false : false,
                },
            ],
            description: [
                {
                    value:
                        this.idparametertype !== "add"
                            ? this.detaildata[0].description
                            : "",
                    disabled: this.idparametertype !== "add" ? false : false,
                },
            ],
        });
    }

    openSnackBar(message) {
        this._snackBar.open(message.text, message.action, {
            duration: 2000,
        });
    }

    saveNewForm() {
        this._masterServ
            .addDataParameterType(this.parametertypeForm.value)
            .then((y) => {
                this.load = true;
                let message = {
                    text: "Data Succesfully Save",
                    action: "Done",
                };
                setTimeout(() => {
                    this.openSnackBar(message);
                    this._route.navigateByUrl("analystpro/parameter-type");
                    this.load = false;
                }, 2000);
            });
    }

    saveForm() {
        this._masterServ
            .updateDataParameterType(
                this.idparametertype,
                this.parametertypeForm.value
            )
            .then((y) => {
                this.load = true;
                let message = {
                    text: "Data Succesfully Updated",
                    action: "Done",
                };
                setTimeout(() => {
                    this.openSnackBar(message);
                    this._route.navigateByUrl("analystpro/parameter-type");
                    this.load = false;
                }, 2000);
            });
    }

    deleteForm() {
        this._masterServ
            .deleteDataParameterType(this.idparametertype)
            .then((g) => {
                this.load = true;
                let message = {
                    text: "Data Succesfully Deleted",
                    action: "Done",
                };
                setTimeout(() => {
                    this.openSnackBar(message);
                    this._route.navigateByUrl("master/unit");
                    this.load = false;
                }, 2000);
            });
    }
}
