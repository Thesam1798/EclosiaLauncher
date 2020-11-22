import {Component} from '@angular/core';
import {environment} from '../environments/environment';
import {EventService} from "./service/event.service";
import {ConnectionService} from "ng-connection-service";
import {AlertService} from "./_alert/service/alert.service";
import {LoggerService} from "./service/logger.service";
import {Router} from "@angular/router";
import {RouteService} from "./service/route.service";

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
  appDir: any;

  constructor(
    private appService: EventService,
    private networkService: ConnectionService,
    private alert: AlertService,
    private router: Router
  ) {
    console.clear();
    LoggerService.log("Ouverture du front", "App Component");

    this.networkService.monitor().subscribe(isConnected => {
      if (isConnected) {
        this.alert.clear();
      } else {
        this.alert.warn("Erreur de connection", "Merci de vérifier votre connection internet", false, false, true);
      }
      LoggerService.log("Connection internet : " + isConnected, "App Component");
    });

    if (!environment.production) {
      LoggerService.log("Environment de DEV", "App Component");
      setTimeout(() => {
        LoggerService.log("Définition des variable pour le front", "App Component");
        this.appReady = true;
        this.appName = "Eclosia";
        this.appVersion = "DEV";
        this.appBuildDate = "25-10-2020 13:23:40";
        setTimeout(() => {
          LoggerService.log("Hide loader", "App Component");
          this.hideLoader = true;
          setTimeout(() => {
            RouteService.navigateByName(this.router, 'server');
          }, 2000);
        }, 2000);
        this.getDir();
      }, 2500);
    } else {
      setTimeout(() => {
        this.getName();
        this.getBuild();
        this.getVersion();
        this.getDir();
      }, 2500);
    }

    document.addEventListener('keydown', function (e) {
      if ((e.key === 'I' || e.key === 'i') && e.ctrlKey && e.shiftKey) {
        LoggerService.log("Demande d'ouverture de la console", "App Component");
        appService.toggleDevTools().then();
      }
    });
  }

  background(): string {
    return "background-image: url('assets/background.jpg');";
  }

  private getName() {
    LoggerService.log("Tentative de la récupération du nom de l'application", "App Component");
    this.appService.getAppName().then((name: any) => {
      this.appName = name;
      this.showApp();
    }).catch((ex: string) => {
      LoggerService.log(ex, "App Component");
      setTimeout(() => this.getName(), 500);
    });
  }

  private getDir() {
    LoggerService.log("Tentative de la récupération du dossier de l'application", "App Component");
    this.appService.getAppDir().then((dir: any) => {
      this.appDir = dir;
      this.showApp();
    }).catch((ex: string) => {
      LoggerService.log(ex, "App Component");
      setTimeout(() => this.getDir(), 500);
    });
  }

  private getVersion() {
    LoggerService.log("Tentative de la récupération du numéro de build", "App Component");
    this.appService.getLastVersion().then((version: any) => {
      this.appVersion = version;
      this.showApp();
    }).catch((ex: string) => {
      LoggerService.log(ex, "App Component");
      setTimeout(() => this.getVersion(), 500);
    });
  }

  private getBuild() {
    LoggerService.log("Tentative de la récupération de la date du build", "App Component");
    this.appService.getBuildDate().then((formatDate: any) => {
      this.appBuildDate = formatDate;
      this.showApp();
    }).catch((ex: string) => {
      LoggerService.log(ex, "App Component");
      setTimeout(() => this.getBuild(), 500);
    });
  }

  private showApp() {
    if (this.appVersion !== null && typeof this.appVersion === "string" && this.appVersion.length > 0) {
      if (this.appBuildDate !== null && typeof this.appBuildDate === "string" && this.appBuildDate.length > 0) {
        if (this.appName !== null && typeof this.appName === "string" && this.appName.length > 0) {
          LoggerService.log("Toute les information on été récupérer", "App Component");
          this.appReady = true;
          setTimeout(() => {
            LoggerService.log("Hide loader", "App Component");
            this.hideLoader = true;
          }, 1900);
        }
      }
    }
  }
}
