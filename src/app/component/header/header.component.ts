import {Component, Input, OnInit} from '@angular/core';
import {AppService} from "../../service/app.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input('title') title: string;

  constructor(private app: AppService) {
  }

  ngOnInit(): void {
  }

  closeApp() {
    console.log("Close App !")
    this.app.closeApp().then(() => {
      window.close();
    });
  }

  miniApp() {
    console.log("Minimize App")
    this.app.minApp().then(() => {
      console.log("Done")
    });
  }

  maxiApp() {
    console.log("Minimize App")
    this.app.maxApp().then(() => {
      console.log("Done")
    });
  }
}
