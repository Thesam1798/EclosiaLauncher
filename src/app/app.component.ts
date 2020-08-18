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
  title = 'angular-electron';

  constructor(private app: AppService) {
    app.isDev().then(responce => {
      AppService.dev = responce;
    })

    app.getData().then(responce => {
      // @ts-ignore
      AppComponent.data = responce;

      this.title = AppComponent.data.title;
    })
  }
}
