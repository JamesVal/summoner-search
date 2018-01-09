import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

// JJV DEBUG - FOR TESTING
const testObj = {"id":67972542,"accountId":228054520,"name":"ShuntStick","profileIconId":982,"revisionDate":1515464902000,"summonerLevel":46};

@Injectable()
export class SummonerService {

  private summonerDataURL = 'api/riotAPI/byName/'

  getSummonerData(name: string) : Observable<any> {
    // JJV DEBUG - Spoof test object since server will not always be running
    //return of(testObj);
	return this.http.get<any>(this.summonerDataURL+name);
  }

  constructor(private http: HttpClient) { }

}
