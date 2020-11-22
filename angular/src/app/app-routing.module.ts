import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {RouteService} from "./service/route.service";
import {LoginComponent} from "./_login/component/login.component";
import {ServeurComponent} from "./page/serveur/serveur.component";
import {IsLoginGuard} from "./_login/guard/is-login.guard";

RouteService.addRoute('home', {path: '', component: LoginComponent, canActivate: [IsLoginGuard]});
RouteService.addRoute('server', {path: 'server', component: ServeurComponent});
RouteService.addRoute('404', {path: '**', component: LoginComponent});

@NgModule({
  imports: [RouterModule.forRoot(RouteService.routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
