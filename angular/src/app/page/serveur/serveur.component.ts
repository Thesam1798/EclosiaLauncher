import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-serveur',
  templateUrl: './serveur.component.html',
  styleUrls: ['./serveur.component.scss']
})
export class ServeurComponent implements OnInit {

  private news = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  scroll(type: string = ""): string {
    if (this.news) {
      switch (type) {
        case 'news':
          return 'top: -94vh;';
        case 'news-show':
          return 'top: -100vh;';
        default:
          return 'top: -200vh;';
      }
    } else {
      switch (type) {
        case 'news-show':
          return 'top: 100vh;';
        case 'news':
          return 'top: -25px;';
        default:
          return 'top: 22px;';
      }
    }
  }

  showNews(): void {
    this.news = !this.news;
  }
}
