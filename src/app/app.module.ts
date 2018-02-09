import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';

import { AppComponent } from './app.component';
import { SearchbarComponent } from './searchbar/searchbar.component';
import { AppRoutingModule } from './app-routing.module';
import { SummonerDetailsComponent } from './summoner-details/summoner-details.component';
import { SummonerService } from './summoner.service';
import { MatchDetailsComponent } from './match-details/match-details.component';
import { SummonerBaseComponent } from './summoner-base/summoner-base.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchbarComponent,
    SummonerDetailsComponent,
    MatchDetailsComponent,
    SummonerBaseComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [SummonerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
