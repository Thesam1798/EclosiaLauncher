import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ServerComponent} from "./pages/server/server.component";
import {HomeComponent} from "./_login/component/home.component";
import {IsLoginGuard} from "./_login/guard/is-login.guard";

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: HomeComponent, canActivate: [IsLoginGuard]},
  {path: 'server', component: ServerComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
