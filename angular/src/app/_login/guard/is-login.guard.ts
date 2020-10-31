import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {MojangService} from "../../service/mojang.service";
import {RouteService} from "../../service/route.service";
import {AlertService} from "../../_alert/service/alert.service";

@Injectable({
  providedIn: 'root'
})
export class IsLoginGuard implements CanActivate {
  constructor(private router: Router, private mojang: MojangService, private alert: AlertService) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (
      MojangService.user !== null &&
      MojangService.user.accessToken !== null &&
      MojangService.user.clientToken !== null &&
      typeof MojangService.user.accessToken !== "undefined" &&
      typeof MojangService.user.clientToken !== "undefined" &&
      MojangService.user.accessToken !== "" &&
      MojangService.user.clientToken !== ""
    ) {

      this.mojang.validate(MojangService.user.accessToken, MojangService.user.clientToken)
        .then(() => {
          this.alert.success("Bon retour " + "", "Éclosia est heureux de vous revoir");
          RouteService.navigateByName(this.router, 'server');
          return false;
        })
        .catch(() => {
          this.alert.warn("Merci de vous identifier", "Votre clé d'identification Mojang n'est plus valid");
          return true;
        });

    }
    return true;
  }

}
