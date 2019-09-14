import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';
import { DatePipe } from '@angular/common';

import { AppComponent } from './app.component';
import { SearchbarComponent } from './searchbar/searchbar.component';
import { AppRoutingModule } from './app-routing.module';
import { SummonerDetailsComponent } from './summoner-details/summoner-details.component';
import { SummonerService } from './summoner.service';
import { CreateExcelService } from './create-excel.service';
import { MatchDetailsComponent } from './match-details/match-details.component';
import { SummonerBaseComponent } from './summoner-base/summoner-base.component';

import { AuthGuard } from './auth/auth.guard';

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
  providers: [SummonerService, CreateExcelService, DatePipe, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
