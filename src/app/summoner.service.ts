import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

// JJV DEBUG - for testing
import { testSummonerData } from './test-data';
import { testRecentMatchData } from './test-data';
import { testMatchInformation } from './test-data';
import { testAllChampionInformation } from './test-data';
import { testChampionInformation } from './test-data';

import { allChampionInformation } from './champion-static-data';
import { profileIconInformation } from './profile-icon-static-data';

@Injectable()
export class SummonerService {

  private summonerDataURL = 'api/riotAPI/getSummoner/';
  private recentMatchesURL = 'api/riotAPI/getRecentMatches/'
  private matchDataURL = 'api/riotAPI/getMatch/';
  private championDataURL = 'api/riotAPI/getChampion/';
  private summonerAccountId : number;
  private summonerData$: Observable<any>;
  private summonerName: string;
 
  getSummonerData(name: string): Observable<any> {
    
    if (name != this.summonerName) {
      this.summonerName = name;
      this.summonerData$ = null;
    }
    
    if (this.summonerData$) {
      return (this.summonerData$);
    }
    
    // JJV DEBUG - Spoof test object since server will not always be running
    this.summonerData$ = of(testSummonerData);    
    //this.summonerData$ = this.http.get<any>(this.summonerDataURL+name);
    
    return (this.summonerData$);
  }

  getRecentMatchDetails(accountId: number): Observable<any> {
    // JJV DEBUG - Spoof test object since server will not always be running
    return of(testRecentMatchData);
    
    //return this.http.get<any>(this.recentMatchesURL+accountId);
  }
  
  getMatchDetails(matchId: number): Observable<any> {
    // JJV DEBUG - Spoof test object since server will not always be running
    return of(testMatchInformation);
    
    //return this.http.get<any>(this.matchDataURL+matchId);
  }
    
  getChampionDetails(championId: number): Observable<any> {
    // We're no longer doing the API call as the Static Data API is heavily rate-limited, instead just use Data Dragon
    // JJV DEBUG - Spoof test object since server will not always be running
    //return of(testChampionInformation);
    
    //return this.http.get<any>(this.championDataURL+championId);
    
    var championObj: any;
    
    for (var key in allChampionInformation.data) {
      if (championId == allChampionInformation.data[key].key) {
        championObj = allChampionInformation.data[key];
      }
    }
    
    return of(championObj);
  }
  
  getProfileIconDetails(iconId: number): Observable<any> {
    
    var iconObj: any;
    
    for (var key in profileIconInformation.data) {
      if (iconId == profileIconInformation.data[key].id) {
        iconObj = profileIconInformation.data[key];
      }
    }
    
    return of(iconObj);
  }
    
  constructor(private http: HttpClient) { }

}
