import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NavigationEnd } from '@angular/router';

import { SummonerService } from '../summoner.service';

@Component({
  selector: 'app-summoner-details',
  templateUrl: './summoner-details.component.html',
  styleUrls: ['./summoner-details.component.css']
})
export class SummonerDetailsComponent implements OnInit {

  // Decided not to define the API response since the order it actually responds in doesn't match the order specified in their documentation - so now I just grab whatever object that is returned
  summonerData: any;
  
  updateSummonerData(): void {
    var summonerName = this.route.snapshot.paramMap.get('name');

    this.summonerService.getSummonerData(summonerName).subscribe(summonerData => {
      this.summonerData = summonerData;

      // JJV DEBUG
      console.log(this.summonerData.accountId);
    });
  }
  
  constructor(private route: ActivatedRoute, private router: Router, private summonerService: SummonerService) { }

  ngOnInit() {
    this.updateSummonerData();
    
    // Check if the route has updated
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateSummonerData();
      }
    });
  }
  
}
