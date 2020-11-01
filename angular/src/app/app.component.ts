import {Component} from '@angular/core';
import {environment} from '../environments/environment';
import {AppService} from "./service/app.service";
import {ConnectionService} from "ng-connection-service";
import {AlertService} from "./_alert/service/alert.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  appName: any;
  appVersion: any;
  appBuildDate: any;
  appReady: boolean = false;
  hideLoader: boolean = false;

  constructor(private appService: AppService, private connectionService: ConnectionService, private alert: AlertService) {

    this.connectionService.monitor().subscribe(isConnected => {
      if (isConnected) {
        this.alert.clear();
      } else {
        this.alert.warn("Erreur de connection", "Merci de vérifier votre connection internet", false, false, true);
      }
    });

    if (!environment.production) {
      setTimeout(() => {
        this.appReady = true;
        this.appName = "Eclosia";
        this.appVersion = "DEV";
        this.appBuildDate = "25-10-2020 13:23:40";
        setTimeout(() => {
          this.hideLoader = true;
        }, 1900);
      }, 2500);
    } else {
      setTimeout(() => {
        console.log("Call Event");
        this.getName();
        this.getBuild();
        this.getVersion();
      }, 2500);
    }

    document.addEventListener('keydown', function (e) {
      if ((e.key === 'I' || e.key === 'i') && e.ctrlKey && e.shiftKey) {
        appService.toggleDevTools().then();
      }
    });
  }

  background(): string {
    return "background-image: url('assets/background.jpg');";
  }

  private getName() {
    this.appService.getAppName().then((name) => {
      this.appName = name;
      this.showApp();
    }).catch((ex) => {
      console.error(ex);
      setTimeout(() => this.getName(), 500);
    });
  }

  private getVersion() {
    this.appService.getLastVersion().then((version) => {
      this.appVersion = version;
      this.showApp();
    }).catch((ex) => {
      console.error(ex);
      setTimeout(() => this.getVersion(), 500);
    });
  }

  private getBuild() {
    this.appService.getBuildDate().then((formatDate) => {
      this.appBuildDate = formatDate;
      this.showApp();
    }).catch((ex) => {
      console.error(ex);
      setTimeout(() => this.getBuild(), 500);
    });
  }

  private showApp() {
    if (this.appVersion !== null && typeof this.appVersion === "string" && this.appVersion.length > 0) {
      if (this.appBuildDate !== null && typeof this.appBuildDate === "string" && this.appBuildDate.length > 0) {
        if (this.appName !== null && typeof this.appName === "string" && this.appName.length > 0) {
          this.appReady = true;
          setTimeout(() => this.hideLoader = true, 1900);
        }
      }
    }
  }
}
