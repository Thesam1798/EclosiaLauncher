import {Component} from '@angular/core';
import {AppService} from "./service/app.service";
import data from "./service/obejct/data";
import {AlertService} from "./_alert/service/alert.service";
import {GamesService} from "./_login/service/games.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public static data: data
  public static upgrade: boolean
  public static autoUpdate: boolean
  title: string | undefined = '!! ERROR !!';
  private readonly bg: number;

  constructor(
    private app: AppService,
    private alert: AlertService
  ) {
    app.isDev().then(responce => {
      AppService.dev = responce;
    })

    app.getData().then(responce => {
      AppComponent.data = responce;
      this.title = AppComponent.data.title;
    })

    app.getLastVersion().then(response => {
      AppComponent.upgrade = response.upgrade === true;
      AppComponent.autoUpdate = response.version === 'win32'

      if (AppComponent.upgrade) {
        this.alert.info('Mise a jours', 'La version ' + response.version + ' est disponibles !', true, false)
      }

    })

    let item = localStorage.getItem('bg');
    this.bg = 0;

    if (item !== null) {
      this.bg = parseInt(item) + 1
      if (this.bg > 7) this.bg = 0;
      localStorage.setItem('bg', this.bg + '')
    } else {
      this.bg = 0
      if (this.bg > 7) this.bg = 0;
      localStorage.setItem('bg', this.bg + '')
    }
  }

  style(): string {
    let retour = "background-repeat: no-repeat; background-position: center; background-size: cover; transition: background-image 0.5s linear; ";

    if (GamesService.gameSelected().length > 0) {

      retour = retour + "background-image: url('assets/images/backgrounds/" + GamesService.gameSelected()[0].dir + "/" + this.bg + ".jpg');";

    } else {
      retour = retour + "background-image: url('assets/images/backgrounds/0.jpg');";
    }

    return retour;
  }
}
