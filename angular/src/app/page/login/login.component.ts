import {Component, ElementRef, ViewChild} from '@angular/core';
import anime from '../../../assets/js/anime.es.js';
import {AppService} from "../../service/app.service";
import {MojangService} from "../../service/mojang.service";
import {AlertService} from "../../_alert/service/alert.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  @ViewChild("email") email: ElementRef | undefined;
  @ViewChild("password") password: ElementRef | undefined;
  private current: object | undefined;

  constructor(private app: AppService, private mojang: MojangService, private alert: AlertService) {
  }

  focus(input: string) {
    switch (input) {
      case 'email':
        this.current = anime({
          targets: "path",
          strokeDashoffset: {
            value: 0,
            duration: 700,
            easing: "easeOutQuart"
          },
          strokeDasharray: {
            value: "240 1386",
            duration: 700,
            easing: "easeOutQuart"
          }
        });
        break;

      case 'password':
        this.current = anime({
          targets: "path",
          strokeDashoffset: {
            value: -336,
            duration: 700,
            easing: "easeOutQuart"
          },
          strokeDasharray: {
            value: "240 1386",
            duration: 700,
            easing: "easeOutQuart"
          }
        });
        break;

      case 'submit':
        this.current = anime({
          targets: "path",
          strokeDashoffset: {
            value: -730,
            duration: 700,
            easing: "easeOutQuart"
          },
          strokeDasharray: {
            value: "530 1386",
            duration: 700,
            easing: "easeOutQuart"
          }
        });
        break;
    }

  }

  openLink(url: string) {
    this.app.openUrl(url);
  }

  login() {

    if (typeof this.email === "undefined" || typeof this.password === "undefined") return;

    try {
      this.mojang.authenticate(this.email.nativeElement.value, this.password.nativeElement.value, null).then(result => {
        if (result.body !== null && typeof result.body.accessToken !== "undefined") {
          MojangService.user = result.body;
          this.alert.success("Connection", "Connection valider par Mojang.");
        }
      }).catch((ex) => {
        this.alert.error(ex.title, ex.desc);
      });
    } catch (ex) {
      this.alert.error("Error", ex.toString());
    }
  }

  background() {
    return "background-image: url('assets/background.jpg');";
  }
}
