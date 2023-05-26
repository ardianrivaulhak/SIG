import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { TranslateService } from "@ngx-translate/core";
import * as _ from "lodash";
import { LoginService } from "app/main/login/login.service";
import { FuseConfigService } from "@fuse/services/config.service";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";
import { LocalStorage } from "@ngx-pwa/local-storage";
// import { navigation } from 'app/navigation/navigation';
import { Router, ActivatedRoute } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { UserProfilComponent } from "./user-profil/user-profil.component";
import { FuseNavigationService } from "@fuse/components/navigation/navigation.service";
import { SisterCompanyService } from "app/main/hris/sister-company/sister-company.service";
import { url } from "app/main/url";
import { MessagingService } from "app/messaging.service";
@Component({
    selector: "toolbar",
    templateUrl: "./toolbar.component.html",
    styleUrls: ["./toolbar.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class ToolbarComponent implements OnInit, OnDestroy {
    urlnow = url;
    me = [];
    horizontalNavbar: boolean;
    rightNavbar: boolean;
    hiddenNavbar: boolean;
    languages: any;
    navigation: any;
    selectedLanguage: any;
    userStatusOptions: any[];
    message = [];
    // Private
    messageDatabase = [];
    private _unsubscribeAll: Subject<any>;
    title_button: string = 'Select Company';
    company_id: number;
    datacompany = [];
    
    displaymenu;

    analystpro = false;
    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {TranslateService} _translateService
     *
     *
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _fuseSidebarService: FuseSidebarService,
        private _translateService: TranslateService,
        private _loginServ: LoginService,
        private _localStorage: LocalStorage,
        private _route: Router,
        private dialog: MatDialog,
        private _actRoute: ActivatedRoute,
        private _messaginServ: MessagingService,
        private _fuseNavigationService: FuseNavigationService,
        private _sistServ: SisterCompanyService
    ) {
        this.displaymenu = window.location.href.split('/')[4] == 'hris' ? true : false;
        
        this._messaginServ.getDataCompany().subscribe((o) =>{
            this.company_id = o.id;
            this.title_button = o.text;
        })

        this._messaginServ.currentMessage.subscribe((x) => {
            if (x) {
                this.message.push({
                    contract_no: x["notification"].title.split("-")[0],
                    status: x["notification"].body.split(" ")[2],
                    employee_name: x["notification"].body.split(" ")[0],
                    title: x["notification"].title,
                    message: x["notification"].body,
                    read: false,
                });
            }
        });
        // Set the defaults
        this.userStatusOptions = [
            {
                title: "Online",
                icon: "icon-checkbox-marked-circle",
                color: "#4CAF50",
            },
            {
                title: "Away",
                icon: "icon-clock",
                color: "#FFC107",
            },
            {
                title: "Do not Disturb",
                icon: "icon-minus-circle",
                color: "#F44336",
            },
            {
                title: "Invisible",
                icon: "icon-checkbox-blank-circle-outline",
                color: "#BDBDBD",
            },
            {
                title: "Offline",
                icon: "icon-checkbox-blank-circle-outline",
                color: "#616161",
            },
        ];

        this.languages = [
            {
                id: "en",
                title: "English",
                flag: "us",
            },
            {
                id: "tr",
                title: "Turkish",
                flag: "tr",
            },
        ];

        // this.navigation = navigation;

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }
    // this.storage.set('company',e.value);

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */

    notif() {
        this.message = [];
    }

    // sendMessage(): void {
    //     // send message to subscribers via observable subject
        
    // }

    // clearMessages(): void {
    //     // clear messages
    //     this._messaginServ.clearMessagesd();
    // }

    setData(i) {
        this.company_id = i.id;
        this.title_button = i.company_name;

        this._messaginServ.setDataCompany({id: this.company_id, text: this.title_button});
    }

    gotoMoreHistory() {
        this._route.navigateByUrl("analystpro/history-contract");
    }

    ngOnInit(): void {
        this._sistServ
            .getSisterCompanyData()
            .then((x: any) => {
                (this.datacompany = this.datacompany.concat(x))});
        this._loginServ
            .checking_me()
            .then((x) => (this.me = this.me.concat(x)));
        // Subscribe to the config changes

        let c = window.location.href;
        let location = c.split("/");
        this.analystpro = location[4] == "analystpro" ? true : false;

        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((settings) => {
                this.horizontalNavbar =
                    settings.layout.navbar.position === "top";
                this.rightNavbar = settings.layout.navbar.position === "right";
                this.hiddenNavbar = settings.layout.navbar.hidden === true;
            });

        // Set the selected language from default languages
        this.selectedLanguage = _.find(this.languages, {
            id: this._translateService.currentLang,
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    async gotologin() {
        if (this.me.length > 1) {
            await this._fuseNavigationService.unregister(
                `analystpro_${this.me[0].employee_id}`
            );
        }
        await this._localStorage.removeItem("token").subscribe(() => {});
        await this._route.navigateByUrl("login");
    }

    gotoapps() {
        this._route.navigateByUrl("apps");
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle sidebar open
     *
     * @param key
     */
    toggleSidebarOpen(key): void {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }

    /**
     * Search
     *
     * @param value
     */
    search(value): void {
        // Do your search here...
        console.log(value);
    }

    menuOpened() {
        this.messageDatabase = [];
        if (this.analystpro) {
            this._messaginServ.getData().then((x) => {
                this.messageDatabase = this.message.concat(x);
            });
        }
    }

    ViewDetails(v) {
        this._route.navigateByUrl("analystpro/view-contract/" + v);
    }

    /**
     * Set the language
     *
     * @param lang
     */
    setLanguage(lang): void {
        // Set the selected language for the toolbar
        this.selectedLanguage = lang;

        // Use the selected language for translations
        this._translateService.use(lang.id);
    }

    goToProfil() {
        let dialogCust = this.dialog.open(UserProfilComponent, {
            height: "600px",
            width: "630px",
            data: {
                data: this.me,
            },
            panelClass: "custom-modalbox",
        });
        dialogCust.afterClosed().subscribe((result) => {});
    }
}
