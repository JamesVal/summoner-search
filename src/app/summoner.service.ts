import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

// JJV DEBUG - for testing
import { testSummonerData } from './test-data';
import { testRecentMatchData } from './test-data';
import { testMatchInformation } from './test-data';
import { testChampionInformation } from './test-data';

@Injectable()
export class SummonerService {

  private summonerDataURL = 'api/riotAPI/getSummoner/';
  private matchDataURL = 'api/riotAPI/getMatch/';
  private championDataURL = 'api/riotAPI/getChampion/';
  private summonerAccountId : number;
  private summonerData$: Observable<any>;
  private summonerName: string;
 
  getSummonerData(name: string) : Observable<any> {
    
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

  getRecentMatchDetails(accountId: number) : Observable<any> {
    // JJV DEBUG - Spoof test object since server will not always be running
    return of(testRecentMatchData);
    
    // JJV DEBUG - NEED API CALL HERE
  }
  
  getMatchDetails(matchId: number) : Observable<any> {
    // JJV DEBUG - Spoof test object since server will not always be running
    return of(testMatchInformation);
    
    //return this.http.get<any>(this.matchDataURL+matchId);
  }
  
  getChampionDetails(championId: number): Observable<any> {
    // JJV DEBUG - Spoof test object since server will not always be running
    return of(testChampionInformation);
    
    //return this.http.get<any>(this.championDataURL+championId);
  }
  
  constructor(private http: HttpClient) { }

}
