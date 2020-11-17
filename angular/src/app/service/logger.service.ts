import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor() {
  }

  static log(data: string, scope = "unknown") {
    const log = "[" + scope + "] : " + data;
    console.log(log);
  }

  static error(data: string, scope = "unknown") {
    const log = "[" + scope + "] : " + data;
    console.error(log);
  }
}
