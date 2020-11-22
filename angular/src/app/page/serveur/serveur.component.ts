import {Component, NgZone} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {EventService} from "../../service/event.service";

interface flux {
  title: string,
  pubDate: string,
  creator: string,
  content: string,
  comments: string,
  link: string
}

@Component({
  selector: 'app-serveur',
  templateUrl: './serveur.component.html',
  styleUrls: ['./serveur.component.scss']
})
export class ServeurComponent {

  public news: flux[] | null | undefined;
  private news_show = false;

  constructor(
    private http: HttpClient,
    private ngZone: NgZone,
    private app: EventService
  ) {
    this.http.get('https://api.eclosia.life/forums/index.php').subscribe(r => {
      // @ts-ignore
      this.news = r;
    });
  }

  scroll(type: string = ""): string {
    if (this.news_show) {
      switch (type) {
        case 'news':
          return 'top: -92%;';
        case 'news-show':
          return 'top: -100vh;';
        case 'news-show-bg':
          return 'background-color: rgba(0,0,0,0.7);';
        default:
          return 'top: -200vh;';
      }
    } else {
      switch (type) {
        case 'news-show':
          return 'top: 100vh;';
        case 'news-show-bg':
          return 'background-color: rgba(0,0,0,0);';
        case 'news':
          return 'top: -35px;';
        default:
          return 'top: 22px;';
      }
    }
  }

  showNews(): void {
    this.news_show = !this.news_show;
  }

  openLink(url: string) {
    this.app.openUrl(url);
  }
}
