import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AlertService} from "../../../_alert/service/alert.service";
import {GamesService} from "../../service/games.service";
import {AppService} from "../../../service/app.service";
import {MojangService} from "../../../service/mojang.service";
import GameData from "../../service/objects/gamesData";

@Component({
  selector: 'app-home',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {

  @ViewChild("loginButton") loginButton: ElementRef | undefined;
  @ViewChild("username") username: ElementRef | undefined;
  @ViewChild("password") password: ElementRef | undefined;
  @ViewChild("checkmark") checkmark: ElementRef | undefined;
  @ViewChild("circleLoader") circleLoader: ElementRef | undefined;
  @ViewChild("checkmarkDraw") checkmarkDraw: ElementRef | undefined;
  @ViewChild("checked") checked: ElementRef | undefined;

  loginText: string;
  user = {}
  private innerHeight: number | undefined;
  private game: GameData | undefined;

  constructor(
    private app: AppService,
    private mojang: MojangService,
    private alert: AlertService,
    private router: Router,
    private actRoute: ActivatedRoute
  ) {
    this.loginText = "VALIDER";
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
    if (typeof this.innerHeight === "undefined") this.innerHeight = 100;
    return "min-height: " + (this.innerHeight - 22) + "px;"
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerHeight = window.innerHeight;
  }

  login() {
    this.disabledForm(true);

    if (typeof this.username === "undefined" || typeof this.password === "undefined") return;

    this.mojang.authenticate(this.username.nativeElement.value, this.password.nativeElement.value, null).then(result => {

      if (result.body !== null && typeof result.body.accessToken !== "undefined") {
        let user = result.body;

        if (user.user !== null && typeof user.user !== "undefined" && typeof this.checked !== "undefined") {
          user.user.autologin = this.checked.nativeElement.checked;
        }

        MojangService.user = user;

        setTimeout(() => {
          let querySelector = document.querySelector('.circle-loader');

          if (typeof querySelector === "undefined" || querySelector === null || typeof this.checkmarkDraw === "undefined") return;

          querySelector.classList.add('load-complete');
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

  ngOnInit() {
    this.innerHeight = window.innerHeight;

    this.actRoute.paramMap.subscribe(params => {
      if ((<string>params.get('game')).length <= 0) {
        this.router.navigateByUrl('select-game').then(() => {
          this.alert.warn("Sélection du jeux", "Merci de sélectionner votre jeux avant de valider")
        })
      } else {

        const tempGame = GamesService.games.filter((data) => {
          return data.dir === params.get('game');
        });

        if (tempGame.length === 1) {
          this.game = tempGame[0]
        } else {
          this.router.navigateByUrl('select-game').then(() => {
            this.alert.error("Sélection du jeux", "Impossible de trouver le jeux sélectionner")
          })
        }

      }
    });
  }

  private disabledForm(value: boolean) {

    if (
      typeof this.loginButton === "undefined" ||
      typeof this.username === "undefined" ||
      typeof this.password === "undefined" ||
      typeof this.checkmark === "undefined" ||
      this.loginButton === null ||
      this.username === null ||
      this.password === null ||
      this.checkmark === null
    ) return;

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
