import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NavigationEnd } from '@angular/router';

import { SummonerService } from '../summoner.service';

@Component({
  selector: 'app-match-details',
  templateUrl: './match-details.component.html',
  styleUrls: ['./match-details.component.css']
})
export class MatchDetailsComponent implements OnInit {

  // Decided not to define the API response since the order it actually responds in doesn't match the order specified in their documentation - so now I just grab whatever object that is returned
  matchData: any;

  updateMatchData(): void {
    var summonerName = this.route.parent.snapshot.paramMap.get('name');
	console.log('summoner_name:' + summonerName);

	this.summonerService.getSummonerData(summonerName).subscribe(summonerData => {
	  this.summonerService.getMatchDetails(summonerData.accountId).subscribe(matchData => {
        this.matchData = matchData;
		
		// JJV DEBUG
		console.log('got match data');
	  })
	});

  }
  
  constructor(private route: ActivatedRoute, private router: Router, private summonerService: SummonerService) { }

  ngOnInit() {
    this.updateMatchData();
	
	// Check if the route has updated
	this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateMatchData();
	  }
	});
  }

}
