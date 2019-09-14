import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { concatMap, concatAll } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

// JJV DEBUG - for testing
import { testSummonerData } from './test-data';
import { testRecentMatchData } from './test-data';
import { testMatchInformation } from './test-data';

import { allChampionInformation } from './champion-static-data';
import { profileIconInformation } from './profile-icon-static-data';

import { environment } from '../environments/environment';

export class SummonerDetails {
  name: string;
  summonerLevel: number;
  iconFull: string;
  accountId: string;
  id: string;
}

@Injectable()
export class SummonerService {

  private summonerDataURL = 'api/riotAPI/getSummoner/';
  private recentMatchesURL = 'api/riotAPI/getRecentMatches/'
  private matchDataURL = 'api/riotAPI/getMatch/';
  private summonerAccountId : number;
  summonerName: string = "";
  
  summonerDetails: SummonerDetails;
  summonerDetailsReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  matchData: any = [];
  matchDataReady: BehaviorSubject<boolean> = new BehaviorSubject(false); 

  getSummonerInfo(): SummonerDetails {
    return this.summonerDetails;
  }

  getSummonerData(name: string): void {
    this.summonerName = name;
    if (!this.summonerName) return;

    this.summonerDetailsReady.next(false);
    this.summonerDetails = new SummonerDetails();

    this.matchDataReady.next(false);
    this.matchData = [];

    this.getSummonerDetails().pipe(
      concatMap((data) => {
        this.summonerDetails.name = data.name;
        this.summonerDetails.summonerLevel = data.summonerLevel;
        this.summonerDetails.accountId = data.accountId;
        this.summonerDetails.id = data.id;
        this.summonerDetails.iconFull = this.getProfileIconDetails(data.profileIconId).image.full;
        this.summonerDetailsReady.next(true);
        return this.getRecentMatches();
      }),
      concatMap((data) => {
        return this.getMatchDetails(data.matches);
      }),
      concatAll()
    ).subscribe({
      next: (data) => {
        this.matchData.push(data);
      },
      complete: () => {
        this.matchDataReady.next(true);
      }
    });
  }

  getSummonerDetails(): Observable<any> {
    return of(testSummonerData);
    //return this.http.get<any>(environment.hostURL+this.summonerDataURL+this.summonerName);
  }

  getRecentMatches(): Observable<any> {
    // JJV DEBUG - Spoof test object since server will not always be running
    return of(testRecentMatchData);
    //return this.http.get<any>(environment.hostURL+this.recentMatchesURL+this.summonerDetails.accountId);
  }
   
  getMatchDetails(matchArray): Observable<any> {
    let maxLength = matchArray.length;
    if (maxLength > 25) maxLength = 25;

    return new Observable((observer) => {
      for (let i = 0; i < maxLength; i++) {
        observer.next(of(testMatchInformation));
        //observer.next(this.http.get<any>(environment.hostURL+this.matchDataURL+matchArray[i].gameId));
      }
      observer.complete();
    });
  }
 
  getMatchInfo(): any[] {
    return this.matchData;
  } 

  getProfileIconDetails(iconId: number): any {
    var iconObj: any;
    
    for (var key in profileIconInformation.data) {
      if (iconId == profileIconInformation.data[key].id) {
        iconObj = profileIconInformation.data[key];
      }
    }
    
    return iconObj;
  }

  getChampionDetails(championId: number): any {
    // We're no longer doing the API call as the Static Data API is heavily rate-limited, instead just use Data Dragon
    var championObj: any;
    
    for (var key in allChampionInformation.data) {
      if (championId == allChampionInformation.data[key].key) {
        championObj = allChampionInformation.data[key];
      }
    }
    
    return championObj;
  }
  
  constructor(private http: HttpClient) { }
}
