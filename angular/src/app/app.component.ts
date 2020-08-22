import {Component} from '@angular/core';
import {AppService} from "./service/app.service";
import data from "./service/obejct/data";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public static data: data
  public static upgrade: boolean
  public static autoUpdate: boolean
  title: string | undefined = 'angular-electron';

  constructor(private app: AppService) {
    app.isDev().then(responce => {
      AppService.dev = responce;
    })

    app.getData().then(responce => {
      // @ts-ignore
      AppComponent.data = responce;

      this.title = AppComponent.data.title;
    })

    app.getLastVersion().then(response => {
      console.log(response)
      AppComponent.upgrade = response.upgrade === true;
      AppComponent.autoUpdate = response.version === 'win32'
    })
  }
}
