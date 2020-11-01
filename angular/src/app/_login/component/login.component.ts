import {Component, ElementRef, ViewChild} from '@angular/core';
import {AppService} from "../../service/app.service";
import {MojangService} from "../../service/mojang.service";
import {AlertService} from "../../_alert/service/alert.service";
import {Router} from "@angular/router";
import {RouteService} from "../../service/route.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  @ViewChild("email") email: ElementRef | undefined;
  @ViewChild("password") password: ElementRef | undefined;

  constructor(private app: AppService, private mojang: MojangService, private alert: AlertService, private router: Router) {
  }

  openLink(url: string) {
    this.app.openUrl(url);
  }

  login() {
    if (typeof this.email === "undefined" || typeof this.password === "undefined") return;
    if (this.email.nativeElement.value.length < 1 || this.password.nativeElement.value.length < 1) return;

    try {
      this.mojang.authenticate(this.email.nativeElement.value, this.password.nativeElement.value, null).then(result => {
        if (result.body !== null && typeof result.body.accessToken !== "undefined") {
          MojangService.user = result.body;
          this.alert.success("Connection", "Connection valider par Mojang.");
          RouteService.navigateByName(this.router, 'server');
        }
      }).catch((ex) => {
        if (ex.title !== undefined && ex.desc !== undefined) {
          this.alert.error(ex.title, ex.desc);
        } else {
          this.alert.error("Erreur inconnue lors de la connection", "Erreur inconnue lors de la connection");
        }
      });
    } catch (ex) {
      this.alert.error("Error", ex.toString());
    }
  }
}