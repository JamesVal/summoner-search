import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

// JJV DEBUG - FOR TESTING
const testSummonerData = {"id":67972542,"accountId":228054520,"name":"ShuntStick","profileIconId":982,"revisionDate":1515464902000,"summonerLevel":46};

const testRecentMatchData = {"matches":[{"platformId":"NA1","gameId":2689965687,"champion":3,"queue":450,"season":9,"timestamp":1515463953850,"role":"NONE","lane":"MID"},{"platformId":"NA1","gameId":2689960441,"champion":117,"queue":450,"season":9,"timestamp":1515462579060,"role":"NONE","lane":"MID"},{"platformId":"NA1","gameId":2689935029,"champion":202,"queue":450,"season":9,"timestamp":1515461044456,"role":"NONE","lane":"MID"},{"platformId":"NA1","gameId":2689141480,"champion":268,"queue":450,"season":9,"timestamp":1515374246492,"role":"NONE","lane":"MID"},{"platformId":"NA1","gameId":2689115326,"champion":22,"queue":450,"season":9,"timestamp":1515372635487,"role":"NONE","lane":"MID"},{"platformId":"NA1","gameId":2689066981,"champion":57,"queue":450,"season":9,"timestamp":1515369503197,"role":"NONE","lane":"MID"},{"platformId":"NA1","gameId":2689012157,"champion":54,"queue":450,"season":9,"timestamp":1515362979466,"role":"NONE","lane":"MID"},{"platformId":"NA1","gameId":2688991354,"champion":24,"queue":450,"season":9,"timestamp":1515361864764,"role":"NONE","lane":"MID"},{"platformId":"NA1","gameId":2688966696,"champion":51,"queue":450,"season":9,"timestamp":1515360446566,"role":"NONE","lane":"MID"},{"platformId":"NA1","gameId":2688471103,"champion":16,"queue":450,"season":9,"timestamp":1515286816983,"role":"NONE","lane":"MID"},{"platformId":"NA1","gameId":2688456663,"champion":117,"queue":450,"season":9,"timestamp":1515285618720,"role":"NONE","lane":"MID"},{"platformId":"NA1","gameId":2688411063,"champion":57,"queue":450,"season":9,"timestamp":1515280589269,"role":"NONE","lane":"MID"},{"platformId":"NA1","gameId":2688352705,"champion":74,"queue":450,"season":9,"timestamp":1515275927817,"role":"NONE","lane":"MID"},{"platformId":"NA1","gameId":2688321104,"champion":90,"queue":450,"season":9,"timestamp":1515272118890,"role":"NONE","lane":"MID"},{"platformId":"NA1","gameId":2686250230,"champion":90,"queue":450,"season":9,"timestamp":1515038896811,"role":"NONE","lane":"MID"},{"platformId":"NA1","gameId":2686163075,"champion":161,"queue":450,"season":9,"timestamp":1515032126731,"role":"NONE","lane":"MID"},{"platformId":"NA1","gameId":2686154168,"champion":268,"queue":450,"season":9,"timestamp":1515030331018,"role":"NONE","lane":"MID"},{"platformId":"NA1","gameId":2686116655,"champion":36,"queue":450,"season":9,"timestamp":1515027692356,"role":"NONE","lane":"MID"},{"platformId":"NA1","gameId":2685834129,"champion":111,"queue":450,"season":9,"timestamp":1514968287126,"role":"NONE","lane":"MID"},{"platformId":"NA1","gameId":2685830483,"champion":90,"queue":450,"season":9,"timestamp":1514966186271,"role":"NONE","lane":"MID"}],"startIndex":0,"endIndex":20,"totalGames":136};

@Injectable()
export class SummonerService {

  private summonerDataURL = 'api/riotAPI/byName/';
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

  getMatchDetails(accountID: number) : Observable<any> {
    // JJV DEBUG - Spoof test object since server will not always be running
	return of(testRecentMatchData);
	
	// JJV DEBUG - NEED API CALL HERE
  }
  
  constructor(private http: HttpClient) { }

}
