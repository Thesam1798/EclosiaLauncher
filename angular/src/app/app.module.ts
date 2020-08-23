import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from './component/header/header.component';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {AlertComponent} from "./_alert/component/alert.component";
import {ServerComponent} from './pages/server/server.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {LoaderComponent} from './_login/content/loader/loader.component';
import {CheckboxComponent} from './_login/content/checkbox/checkbox.component';
import {SelectGameComponent} from './_login/component/select-game/select-game.component';
import {LoginComponent} from "./_login/component/login/login.component";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    AlertComponent,
    AlertComponent,
    ServerComponent,
    LoaderComponent,
    CheckboxComponent,
    SelectGameComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FontAwesomeModule,
  ],
  providers: [HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule {
}
