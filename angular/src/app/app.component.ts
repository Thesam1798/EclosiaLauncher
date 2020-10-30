import {Component} from '@angular/core';
import {environment} from '../environments/environment';
import {AppService} from "./service/app.service";

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

  constructor(appService: AppService) {
    if (!environment.production) {
      setTimeout(() => {
        this.appReady = true;
        this.appName = "Eclosia";
        this.appVersion = "DEV";
        this.appBuildDate = "25-10-2020 13:23:40";
        setTimeout(() => {
          this.hideLoader = true;
        }, 1900);
      }, 1500);
    } else {
      setTimeout(() => {
        appService.getAppName().then((name) => {
          this.appName = name;

          appService.getLastVersion().then((version) => {
            this.appVersion = version;

            appService.getBuildDate().then((formatDate) => {
              this.appBuildDate = formatDate;

              this.appReady = true;
              setTimeout(() => this.hideLoader = true, 1900);
            }).catch((ex) => {
              console.error(ex);
            });
          }).catch((ex) => {
            console.error(ex);
          });
        }).catch((ex) => {
          console.error(ex);
        });
      }, 2200);
    }

  }

  background(): string {
    return "background-image: url('assets/background.jpg');";
  }
}
