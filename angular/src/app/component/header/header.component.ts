import {Component, Input} from '@angular/core';
import {AppService} from "../../service/app.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  @Input('title') title: string | undefined;

  constructor(private app: AppService) {
  }

  closeApp() {
    console.log("Close App !");
    this.app.closeApp().then(() => {
      window.close();
    });
  }

  miniApp() {
    console.log("Minimize App");
    this.app.minApp().then(() => {
      console.log("Done");
    });
  }
}
