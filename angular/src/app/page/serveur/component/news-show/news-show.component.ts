import {Component, Input, OnInit} from '@angular/core';
import {RouteService} from "../../../../service/route.service";
import {EventService} from "../../../../service/event.service";

interface flux {
  title: string,
  pubDate: string,
  creator: string,
  content: string,
  comments: string,
  link: string
}

@Component({
  selector: 'app-news-show',
  templateUrl: './news-show.component.html',
  styleUrls: ['./news-show.component.scss']
})
export class NewsShowComponent implements OnInit {

  @Input('news') public news: flux[] | null | undefined;
  public news_id = 0;
  public readonly _curentRoute = RouteService.getUrlFromName('server').path + "#null";

  constructor(private app: EventService) {
  }

  ngOnInit(): void {
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

  openLink(url: string) {
    this.app.openUrl(url);
  }
}
