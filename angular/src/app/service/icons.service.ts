import {Injectable} from '@angular/core';
import {
  faBug,
  faCheckCircle,
  faExclamationTriangle,
  faGamepad,
  faInfo,
  faInfoCircle,
  faTerminal,
  faTimes,
  faTimesCircle,
  faWindowMinimize
} from '@fortawesome/free-solid-svg-icons';

@Injectable({
  providedIn: 'root'
})
export class IconsService {

  public close = faTimesCircle;
  public bug = faBug;
  public infoCircle = faInfoCircle;
  public info = faInfo;
  public warning = faExclamationTriangle;
  public check = faCheckCircle;
  public windowMinimize = faWindowMinimize;
  public windowClose = faTimes;
  public terminal = faTerminal;
  public gamepad = faGamepad;

  constructor() {
  }
}
