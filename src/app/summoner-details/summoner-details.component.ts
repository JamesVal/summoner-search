import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { SummonerService, SummonerDetails } from '../summoner.service';

@Component({
  selector: 'app-summoner-details',
  templateUrl: './summoner-details.component.html',
  styleUrls: ['./summoner-details.component.css']
})
export class SummonerDetailsComponent implements OnInit {

  summonerDetailsSub: Subscription = new Subscription();
  summonerDetails: SummonerDetails = new SummonerDetails();
  
  constructor(private summonerService: SummonerService) { }

  ngOnInit() {
    this.summonerDetailsSub = this.summonerService.summonerDetailsReady.subscribe((dataReady) => {
      if (dataReady) {
        this.summonerDetails = this.summonerService.getSummonerDetails();
      } else {
        this.summonerDetails = null;
      }
    }); 
  }

  ngOnDestroy() {
    this.summonerDetailsSub.unsubscribe();
  }
}
