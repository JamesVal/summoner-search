import { NgModule }                  from '@angular/core';
import { RouterModule, Routes }      from '@angular/router';

import { SummonerDetailsComponent }  from './summoner-details/summoner-details.component';

const routes: Routes = [
  { path: 'summonerdetails/:name', component: SummonerDetailsComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}