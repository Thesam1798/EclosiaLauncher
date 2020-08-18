import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {MojangService} from "../../service/mojang.service";

@Injectable({
  providedIn: 'root'
})
export class IsLoginGuard implements CanActivate {

  constructor(private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (
      MojangService.user !== null &&
      typeof MojangService.user.accessToken !== "undefined" &&
      MojangService.user.accessToken !== null &&
      MojangService.user.accessToken !== "" &&
      typeof MojangService.user.user !== "undefined" &&
      MojangService.user.user !== null &&
      typeof MojangService.user.user.autologin !== "undefined" &&
      MojangService.user.user.autologin !== null &&
      MojangService.user.user.autologin
    ) {
      this.router.navigateByUrl('server').then();

      MojangService.user = {
        accessToken: undefined,
        availableProfiles: undefined,
        clientToken: undefined,
        selectedProfile: undefined,
        user: undefined
      };

      return false;
    }
    return true;
  }

}
