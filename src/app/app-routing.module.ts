import { NgModule }                  from '@angular/core';
import { RouterModule, Routes }      from '@angular/router';

import { SummonerDetailsComponent }  from './summoner-details/summoner-details.component';
import { MatchDetailsComponent }     from './match-details/match-details.component';

const routes: Routes = [
  { path: 'summonerdetails/:name', component: SummonerDetailsComponent, children: [
    { path: '',   redirectTo: 'matchdetails', pathMatch: 'full' },
    { path: 'matchdetails', component: MatchDetailsComponent }
  ]}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}