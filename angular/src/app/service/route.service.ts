import {Injectable} from '@angular/core';
import {Route, Router, Routes} from "@angular/router";

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
    return this.routes.filter(value => value.path === url)[0];
  }

  public static getNameFromUrl(url: string): string {
    return this.routesName.filter(value => value.route.path === url)[0].name;
  }

  public static getUrlFromName(name: string): Route {
    return this.routesName.filter(value => value.name === name)[0].route;
  }

  public static addRoute(name: string, route: Route): void {
    this.routes.push(route);
    this.routesName.push({name: name, route: route});
  }

  public static navigateByName(router: Router, name: string, valid: any = null, error: any = null): void {
    const url = this.getUrlFromName(name).path;
    if (url != undefined) {
      router.navigateByUrl(url).then(valid).catch(error);
    } else {
      console.error("Impossible de trouver l'url pour : " + name);
    }
  }

}
