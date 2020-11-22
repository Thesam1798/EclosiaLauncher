import {Injectable} from '@angular/core';
import {Route, Router, Routes} from "@angular/router";
import {LoggerService} from "./logger.service";

interface RouterName {
  name: string,
  route: Route
}

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  public static routes: Routes = [];

  public static routesName: RouterName[] = [];

  public static getFromUrl(url: string): Route {
    LoggerService.log("Demande de récupération de la route via l'url : " + url, "Route Service");
    return this.routes.filter(value => value.path === url)[0];
  }

  public static getNameFromUrl(url: string): string {
    LoggerService.log("Demande de récupération de l'url via le nom de la route : " + url, "Route Service");
    return this.routesName.filter(value => value.route.path === url)[0].name;
  }

  public static getUrlFromName(name: string): Route {
    LoggerService.log("Demande de récupération de la route via le nom : " + name, "Route Service");
    return this.routesName.filter(value => value.name === name)[0].route;
  }

  public static addRoute(name: string, route: Route): void {
    LoggerService.log("Demande d'ajout d'une route : " + name, "Route Service");
    this.routes.push(route);
    this.routesName.push({name: name, route: route});
  }

  public static navigateByName(router: Router, name: string, valid: any = null, error: any = null): void {
    LoggerService.log("Demande de redirection sur la route : " + name, "Route Service");
    const url = this.getUrlFromName(name).path;
    if (url != undefined) {
      router.navigateByUrl(url).then(valid).catch(error);
    } else {
      LoggerService.error("Impossible de trouver l'url pour : " + name, "Route Service");
    }
  }

}
