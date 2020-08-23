import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ServerComponent} from "./pages/server/server.component";
import {IsLoginGuard} from "./_login/guard/is-login.guard";
import {LoginComponent} from "./_login/component/login/login.component";
import {SelectGameComponent} from "./_login/component/select-game/select-game.component";

const routes: Routes = [
  {path: '', redirectTo: 'select-game', pathMatch: 'full'},
  {path: 'select-game', component: SelectGameComponent, canActivate: [IsLoginGuard]},
  {path: 'login/:game', component: LoginComponent, canActivate: [IsLoginGuard]},
  {path: 'server', component: ServerComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollOffset: [0, 0], scrollPositionRestoration: 'top'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
