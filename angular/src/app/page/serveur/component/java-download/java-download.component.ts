import {Component, Input, NgZone} from '@angular/core';
import {IpcRenderer} from "electron";
import {EventService} from "../../../../service/event.service";
import {AlertService} from "../../../../_alert/service/alert.service";

@Component({
  selector: 'app-java-download',
  templateUrl: './java-download.component.html',
  styleUrls: ['./java-download.component.scss']
})
export class JavaDownloadComponent {

  @Input('alert_only') alert_only = false;
  percent = 0;
  update = false;
  java_error = false;
  java_dir = "";
  private downloadPercent = 0;
  private unzipPercent = 0;
  private readonly ipc: IpcRenderer | undefined;

  constructor(
    private app: EventService,
    private ngZone: NgZone,
    private event: EventService,
    private alert: AlertService
  ) {
    this.ipc = this.event.ipc;

    if (this.ipc !== undefined) {
      this.addEvent("javaInstallEventDownload");
      this.addEvent("javaInstallEventUnzip");
      this.addEvent("javaInstallEventReturn");
      this.addEvent("javaInstallEventError");

      this.ipc.send("javaInstallEvent");
    }
  }

  addEvent(name: string): void {
    if (this.ipc !== undefined) {
      this.ipc.removeAllListeners(name);
      this.ipc.on(name, (event: any, arg: any) => {
        if (name === "javaInstallEventDownload") {
          this.downloadPercent = arg;
          this.updateDownload(arg);
        }

        if (name === "javaInstallEventUnzip") {
          this.unzipPercent = arg;
          this.updateDownload(arg);
        }

        if (name === "javaInstallEventReturn") {
          this.ngZone.run(() => {
            if (this.alert_only || this.update) {
              this.update = false;
              this.unzipPercent = 100;
              this.downloadPercent = 100;
              this.java_error = false;
              this.java_dir = arg;
              if (!this.alert_only) {
                this.percent = (this.downloadPercent + this.unzipPercent);
              } else {
                this.alert.success("Java Download", "Nous venons d'installer java pour le launcher", true, false);
              }
              this.closeDownload();
            }
          });
          localStorage.setItem('java_dir', arg);
        }

        if (name === "javaInstallEventError") {
          if (this.alert_only || this.update) {
            this.unzipPercent = 50;
            this.downloadPercent = 50;
            this.java_error = true;
            this.java_dir = arg;
            if (!this.alert_only) {
              this.update = true;
              this.percent = (this.downloadPercent + this.unzipPercent);
            } else {
              this.alert.error("Java Download", arg, false, false);
            }
            this.closeDownload();
          }
        }
      });
    }
  }

  closeDownload(now = false) {
    if (now) {
      this.ngZone.run(() => {
        this.unzipPercent = 0;
        this.downloadPercent = 0;
        this.percent = (this.downloadPercent + this.unzipPercent);
      });
    } else {
      setTimeout(() => {
        this.ngZone.run(() => {
          this.unzipPercent = 0;
          this.downloadPercent = 0;
          this.percent = (this.downloadPercent + this.unzipPercent);
        });
      }, 5000);
    }
  }

  getDownloadStyle(): string {
    if (this.percent > 10) {
      return '0';
    } else {
      return '-250vh';
    }
  }

  private updateDownload(arg: any) {
    this.ngZone.run(() => {
      this.unzipPercent = parseInt(arg);
      if (!this.alert_only) {
        this.update = true;
        this.percent = (this.downloadPercent + this.unzipPercent);
      }
    });
  }

}
