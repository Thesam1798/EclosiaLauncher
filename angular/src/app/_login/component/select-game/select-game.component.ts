import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {AppService} from "../../../service/app.service";
import {GamesService} from "../../service/games.service";
import {Router} from "@angular/router";
import {AlertService} from "../../../_alert/service/alert.service";
import GameData from "../../service/objects/gamesData";

@Component({
  selector: 'app-select-game',
  templateUrl: './select-game.component.html',
  styleUrls: ['./select-game.component.scss']
})
export class SelectGameComponent implements OnInit, AfterViewInit {

  @ViewChild("slideContainer") slideContainer: ElementRef | undefined;
  public games = GamesService.games;
  private innerHeight: number | undefined;

  constructor(private app: AppService, private router: Router, private alert: AlertService) {
  }

  ngOnInit() {
    this.innerHeight = window.innerHeight;
  }

  ngAfterViewInit(): void {
    if (this.slideContainer !== null && this.slideContainer !== undefined) {
      this.slideContainer.nativeElement.slick()
    }
  }

  style() {
    if (typeof this.innerHeight === "undefined") this.innerHeight = 100;
    return "min-height: " + (this.innerHeight - 22) + "px;"
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerHeight = window.innerHeight;
  }

  selectGame(game: GameData) {
    this.games.forEach(data => {
      data.active = false;
    })
    game.active = true;
    GamesService.games = this.games;
  }

  toLogin(): string {
    if (GamesService.gameSelected().length != 1) {
      return '';
    } else {
      return <string>GamesService.gameSelected()[0].dir;
    }
  }
}
