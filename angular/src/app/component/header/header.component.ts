import {Component, Input} from '@angular/core';
import {EventService} from "../../service/event.service";
import {LoggerService} from "../../service/logger.service";
import {IconsService} from "../../service/icons.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  @Input('title') title: string | undefined;
  @Input('version') version: string | undefined;
  @Input('build') build: string | undefined;
  @Input('dir') dir: string | undefined;
  info: boolean = false;

  constructor(private app: EventService, public icons: IconsService) {
  }

  openLink(url: string) {
    this.app.openUrl(url).then();
  }

  closeApp() {
    LoggerService.log("Demande de fermeture de l'application", "Header Component");
    this.app.closeApp().then(() => {
      window.close();
    });
  }

  miniApp() {
    LoggerService.log("Demande de minimize de l'application", "Header Component");
    this.app.minApp().then(() => {
      console.log("Done");
    });
  }

  showName(): boolean {
    return this.title !== undefined && this.build !== undefined && this.version !== undefined;
  }

  openConsole() {
    this.app.toggleDevTools().then();
  }

  showInfo() {
    this.info = !this.info;
  }

  openDir(dir: string | undefined) {
    if (dir != undefined) {
      this.app.openDir(dir).then();
    }
  }
}
