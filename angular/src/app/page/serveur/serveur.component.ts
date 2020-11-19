import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {EventService} from "../../service/event.service";
import {RouteService} from "../../service/route.service";

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
export class ServeurComponent implements OnInit {

  public news: flux[] | null | undefined;
  public news_id = 0;
  public readonly _curentRoute = RouteService.getUrlFromName('server').path + "#null";
  private news_show = false;

  constructor(private http: HttpClient, private app: EventService) {
    this.http.get('https://api.eclosia.life/forums/index.php?data=annonce-et-%C3%89v%C3%A9nements.51').subscribe(r => {
      // @ts-ignore
      this.news = r;
      console.log(this.news);
    });
  }

  ngOnInit(): void {
  }

  scroll(type: string = ""): string {
    if (this.news_show) {
      switch (type) {
        case 'news':
          return 'top: -94vh;';
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
          return 'top: -25px;';
        default:
          return 'top: 22px;';
      }
    }
  }

  showNews(): void {
    this.news_show = !this.news_show;
  }

  getNewsContent(id: number): string {
    if (this.news && this.news[id]) {
      let flux = this.news[id];
      let content = flux.content;
      content = content.replace('<a href="' + flux.link + '" class="link link--internal"/' + flux.title + '>', '');
      content = content.replace('/data/attachments', 'https://forum.eclosia.life/data/attachments');
      content = content.replace('<iframe>', '');
      content = content.replace('<script>', '');
      return content;
    } else {
      return '';
    }
  }

  openLink(url: string) {
    this.app.openUrl(url);
  }

  getNewsUrl(id: number) {
    if (this.news && this.news[id]) {
      return this.news[id].link;
    } else {
      return '';
    }
  }

  getNewsTitle(id: number) {
    if (this.news && this.news[id]) {
      return this.news[id].title;
    } else {
      return '';
    }
  }

  getNewsDate(id: number) {
    if (this.news && this.news[id]) {
      return new Date(this.news[id].pubDate);
    } else {
      return '';
    }
  }

  getNewsCreator(id: number) {
    if (this.news && this.news[id]) {
      return this.news[id].creator;
    } else {
      return '';
    }
  }

  getNewsComment(id: number) {
    if (this.news && this.news[id]) {
      return this.news[id].comments;
    } else {
      return '0';
    }
  }

  getNewsLength() {
    if (this.news) {
      return this.news.length;
    } else {
      return '0';
    }
  }

  addNewsId() {
    if (this.news) {
      if ((this.news_id + 1) > this.news.length - 1) {
        this.news_id = 0;
      } else {
        this.news_id = (this.news_id + 1);
      }
    }
  }

  minNewsId() {
    if (this.news) {
      if ((this.news_id - 1) < 0) {
        this.news_id = this.news.length - 1;
      } else {
        this.news_id = (this.news_id - 1);
      }
    }
  }
}
