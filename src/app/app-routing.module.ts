import { NgModule }                  from '@angular/core';
import { RouterModule, Routes }      from '@angular/router';

import { SummonerBaseComponent } from './summoner-base/summoner-base.component';
import { SummonerDetailsComponent }  from './summoner-details/summoner-details.component';
import { MatchDetailsComponent }     from './match-details/match-details.component';

import { AuthGuard } from './auth/auth.guard';

/*
const routes: Routes = [
  { path: 'summonerdetails/:name', component: SummonerDetailsComponent, children: [
    { path: '',   redirectTo: 'matchdetails', pathMatch: 'full' },
    { path: 'matchdetails', component: MatchDetailsComponent }
  ]}
];
*/

const routes: Routes = [
  { path: 'summonerbase', component: SummonerBaseComponent, children: [
    { path: '',   redirectTo: 'summonerdetails', pathMatch: 'full' },
    { path: 'summonerdetails', component: SummonerDetailsComponent },
    { path: 'matchdetails', component: MatchDetailsComponent }
  ], canActivate: [AuthGuard]}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}