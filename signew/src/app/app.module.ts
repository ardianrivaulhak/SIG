import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule, Routes } from "@angular/router";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { TranslateModule } from "@ngx-translate/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatProgressBarModule } from "@angular/material/progress-bar";
// import {MatBadgeModule} from '@angular/material/badge';
import "hammerjs";
import { MatNativeDateModule } from "@angular/material/core";
import { LocationStrategy, HashLocationStrategy } from "@angular/common";

import { FuseModule } from "@fuse/fuse.module";
import { FuseSharedModule } from "@fuse/shared.module";
import {
    FuseProgressBarModule,
    FuseSidebarModule,
    FuseThemeOptionsModule,
} from "@fuse/components";

import { fuseConfig } from "app/fuse-config";
import { AppComponent } from "app/app.component";
import { LayoutModule } from "app/layout/layout.module";
import { SampleModule } from "app/main/sample/sample.module";
import { LoginModule } from "app/main/login/login.module";
import { SplashModule } from "./main/splash/splash.module";
import { AppsModule } from "./main/apps/apps.module";
import { UserModule } from "app/main/user/user.module";
import { ScrollToBottomDirective } from "./directives/scroll-to-bottom.directive";
//firebase
import { AngularFireMessagingModule } from "@angular/fire/messaging";
import { AngularFireFunctionsModule } from "@angular/fire/functions";
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireModule } from "@angular/fire";
import { MessagingService } from "./messaging.service";
import { environment } from "../environments/environment";
import { AsyncPipe } from "@angular/common";
import { SpinnerModalsComponent } from "./main/global/spinner-modals/spinner-modals.component";
import { EdocsComponent } from "./main/edocs/edocs.component";

const appRoutes: Routes = [
    {
        path: "",
        redirectTo: "splash",
        pathMatch: "full",
    },
    {
        path: "user",
        loadChildren: () =>
            import("./main/user/user.module").then((m) => m.UserModule),
    },
    {
        path: "analystpro",
        loadChildren: () =>
            import("./main/analystpro/analystpro.module").then(
                (m) => m.AnalystproModule
            ),
    },
    {
        path: "hris",
        loadChildren: () =>
            import("./main/hris/hris.module").then((m) => m.HrisModule),
    },
    {
        path: "products",
        loadChildren: () =>
            import("./main/products/products.module").then(
                (p) => p.ProductsModule
            ),
    },
    {
        path: "scan",
        loadChildren: () =>
            import(
                "./main/analystpro/contract-track/contract-track/contract-track.module"
            ).then((k) => k.ContractTrackModule),
    },
    {
        path: "certificate",
        loadChildren: () =>
            import(
                "./main/analystpro/certificate/pdf-certificate/pdf-certificate.module"
            ).then((k) => k.PdfCertificateModule),
    },
    {
        path: "edoc",
        loadChildren: () =>
            import("./main/edocs/edocs.module").then((p) => p.EdocModule),
    },
    {
        path: "**",
        redirectTo: "splash",
    },
];

@NgModule({
    declarations: [
        AppComponent,
        ScrollToBottomDirective,
        SpinnerModalsComponent,
        EdocsComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        // MatBadgeModule,
        RouterModule.forRoot(appRoutes),

        TranslateModule.forRoot(),

        // Material moment date module
        MatMomentDateModule,

        //firebase
        AngularFireDatabaseModule,
        AngularFireAuthModule,
        AngularFireMessagingModule,
        AngularFireFunctionsModule,
        AngularFireModule.initializeApp(environment.firebase),

        // Material
        // MatFormFieldModule,
        MatCheckboxModule,
        MatNativeDateModule,
        MatProgressBarModule,
        MatIconModule,
        MatButtonModule,
        // MatInputModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // App modules
        LayoutModule,
        SampleModule,
        LoginModule,
        SplashModule,
        AppsModule,
        UserModule,
    ],
    bootstrap: [AppComponent],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        MessagingService,
        AsyncPipe,
    ],
})
export class AppModule {}
