import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {RouteService} from "./service/route.service";
import {LoginComponent} from "./page/login/login.component";
import {ServeurComponent} from "./page/serveur/serveur.component";

RouteService.addRoute('home', {path: '', component: LoginComponent});
RouteService.addRoute('server', {path: 'server', component: ServeurComponent});
RouteService.addRoute('404', {path: '**', component: LoginComponent});

@NgModule({
  imports: [RouterModule.forRoot(RouteService.routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
