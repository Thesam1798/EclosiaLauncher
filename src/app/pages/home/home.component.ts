import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {AppService} from "../../service/app.service";
import {MojangService} from "../../service/mojang.service";
import {AlertService} from "../../_alert/service/alert.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild("loginButton") loginButton: ElementRef;
  @ViewChild("username") username: ElementRef;
  @ViewChild("password") password: ElementRef;
  @ViewChild("checkmark") checkmark: ElementRef;
  @ViewChild("circleLoader") circleLoader: ElementRef;
  @ViewChild("checkmarkDraw") checkmarkDraw: ElementRef;
  @ViewChild("checked") checked: ElementRef;

  loginText: string;
  user = {}
  private innerHeight: number;

  constructor(
    private app: AppService,
    private mojang: MojangService,
    private alert: AlertService,
    private router: Router
  ) {
    this.loginText = "VALIDER";
  }

  ngOnInit() {
    this.innerHeight = window.innerHeight;
  }

  ngAfterViewInit(): void {
    this.disabledForm(false);
  }

  openUrl(url: string) {
    this.app.openUrl(url).then(result => {
      if (result) {
        console.log("Open : " + url + " in browser")
      } else {
        console.error("Une erreur est survenue dans l'ouverture de l'url")
      }
    });
  }

  style() {
    return "min-height: " + (this.innerHeight - 22) + "px;"
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerHeight = window.innerHeight;
  }

  login() {
    this.disabledForm(true);

    this.mojang.authenticate(this.username.nativeElement.value, this.password.nativeElement.value, null).then(result => {

      if (typeof result.body.accessToken !== "undefined") {
        let user = result.body;
        user.user.autologin = this.checked.nativeElement.checked;

        MojangService.user = user;

        setTimeout(() => {
          document.querySelector('.circle-loader').classList.add('load-complete');
          this.checkmarkDraw.nativeElement.style = "display: inherit;";

          setTimeout(() => {
            this.router.navigateByUrl('server').then();
          }, 500)

        }, 500)

      } else {
        this.disabledForm(false);
      }
    }).catch((ex) => {
      this.alert.error(ex.title, ex.desc);
      this.disabledForm(false);
    });
  }

  private disabledForm(value: boolean) {
    this.loginButton.nativeElement.disabled = value;
    this.username.nativeElement.disabled = value;
    this.password.nativeElement.disabled = value;
    this.checkmark.nativeElement.disabled = value;

    if (value) {
      this.loginText = "CONNECTION";
      this.loginButton.nativeElement.setAttribute('loading', true)
    } else {
      this.loginText = "VALIDER";
      this.loginButton.nativeElement.removeAttribute('loading')
    }
  }
}
