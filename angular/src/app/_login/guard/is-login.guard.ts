import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {MojangService} from "../../service/mojang.service";
import {RouteService} from "../../service/route.service";
import {AlertService} from "../../_alert/service/alert.service";
import {LoggerService} from "../../service/logger.service";

@Injectable({
  providedIn: 'root'
})
export class IsLoginGuard implements CanActivate {
  constructor(private router: Router, private mojang: MojangService, private alert: AlertService) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    LoggerService.log("Vérification de la route", "Is-login Guard");
    if (
      MojangService.user !== null &&
      MojangService.user.accessToken !== null &&
      MojangService.user.clientToken !== null &&
      typeof MojangService.user.accessToken !== "undefined" &&
      typeof MojangService.user.clientToken !== "undefined" &&
      MojangService.user.accessToken !== "" &&
      MojangService.user.clientToken !== ""
    ) {
      LoggerService.log("Demande de validation par Mojang", "Is-login Guard");

      this.mojang.validate(MojangService.user.accessToken, MojangService.user.clientToken)
        .then(() => {
          LoggerService.log("Validation du compte valider", "Is-login Guard");
          this.alert.success("Bon retour " + MojangService.user.user?.username + "", "Éclosia est heureux de vous revoir");
          RouteService.navigateByName(this.router, 'server');
        })
        .catch(() => {
          LoggerService.log("Validation du compte non valid", "Is-login Guard");
          this.alert.warn("Merci de vous identifier", "Votre clé d'identification Mojang n'est plus valid");
        });
    } else {
      LoggerService.log("Route disponible", "Is-login Guard");
    }
    return true;
  }
}
