import {Injectable} from '@angular/core';
import {
  faBug,
  faCheckCircle,
  faExclamationTriangle,
  faInfoCircle,
  faTimesCircle
} from '@fortawesome/free-solid-svg-icons';

@Injectable({
  providedIn: 'root'
})
export class IconsService {

  public close = faTimesCircle;
  public bug = faBug;
  public info = faInfoCircle;
  public warning = faExclamationTriangle;
  public check = faCheckCircle;

  constructor() {
  }
}
