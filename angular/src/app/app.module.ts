import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './_login/component/login.component';
import {HeaderComponent} from './component/header/header.component';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {AlertComponent} from "./_alert/component/alert.component";
import {LoaderComponent} from './component/loader/loader.component';
import {ServeurComponent} from './page/serveur/serveur.component';
import {ConnectionServiceModule} from "ng-connection-service";
import {ProgressBarComponent} from './component/progress-bar/progress-bar.component';
import {NewsShowComponent} from './page/serveur/component/news-show/news-show.component';
import {JavaDownloadComponent} from './page/serveur/component/java-download/java-download.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    AlertComponent,
    LoaderComponent,
    ServeurComponent,
    ProgressBarComponent,
    NewsShowComponent,
    JavaDownloadComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FontAwesomeModule,
    ConnectionServiceModule,
  ],
  providers: [HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule {
}
