import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { concatMap } from 'rxjs/operators';
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
  summonerLevel: string;
  iconFull: string;
}

export class teamDetails {
  teamId: number;
  teamMembers: string[];
}

export class KDA {
  kills: number;
  deaths: number;
  assists: number;
}

export class matchDetails {
  date: number;
  gameMode: string;
  championId: number;
  championName: string;
  championImg: string;
  kda: KDA;
  teams: teamDetails[];
  result: string;
};

@Injectable()
export class SummonerService {

  private summonerDataURL = 'api/riotAPI/getSummoner/';
  private recentMatchesURL = 'api/riotAPI/getRecentMatches/'
  private recentMatchesByIndexURL = 'api/riotAPI/getRecentMatchesByIndex/'
  private matchDataURL = 'api/riotAPI/getMatch/';
  private championDataURL = 'api/riotAPI/getChampion/';
  private summonerAccountId : number;
  summonerName: string = "";
  
  summonerObservable: Observable<any>;
  summonerDetails: SummonerDetails = new SummonerDetails();
  summonerDetailsReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  matchesObservable: Observable<any>;
  matchDetails: matchDetails[] = [];
  matchDetailsReady: BehaviorSubject<boolean> = new BehaviorSubject(false); 

  getSummonerDetails(): SummonerDetails {
    return this.summonerDetails;
  }

  getSummonerData(name: string): void {
    this.summonerName = name;
    if (!this.summonerName) return;

    this.summonerDetailsReady.next(false);

    /*this.summonerObservable = of(testSummonerData);*/
    this.summonerObservable = this.http.get<any>(environment.hostURL+this.summonerDataURL+this.summonerName);

    this.summonerObservable.pipe(
      concatMap((data) => {
        this.summonerDetails.name = data.name;
        this.summonerDetails.summonerLevel = data.summonerLevel;
        return this.getProfileIconDetails(data.profileIconId);
      }),
      concatMap((data) => {
        this.summonerDetails.iconFull = data.image.full;
        return of(1);
      }),
    ).subscribe((data) => {
      this.summonerDetailsReady.next(true);
    });
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

  getRecentMatchDetails(accountId: number): Observable<any> {
    // JJV DEBUG - Spoof test object since server will not always be running
    return of(testRecentMatchData);
    
    //return this.http.get<any>(this.recentMatchesURL+accountId);
  }
  
  getRecentMatchDetailsByIndex(accountId: number, beginIndex: number, endIndex: number): Observable<any> {
    // JJV DEBUG - Spoof test object since server will not always be running
    return of(testRecentMatchData);
    
    //return this.http.get<any>(this.recentMatchesByIndexURL+accountId+"?beginIndex="+beginIndex+"&endIndex="+endIndex);
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
  
    
  constructor(private http: HttpClient) { }

}
