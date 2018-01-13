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
  recentMatchData: any;
   
  updateMatchData(): void {
    var summonerName = this.route.parent.snapshot.paramMap.get('name');
	console.log('summoner_name:' + summonerName);

	this.summonerService.getSummonerData(summonerName).subscribe(summonerData => {
	  this.summonerService.getRecentMatchDetails(summonerData.accountId).subscribe(recentMatchData => {
        this.recentMatchData = recentMatchData;
		
		// JJV DEBUG
		console.log('got match data');
		

        // JJV DEBUG - may need to do a recursive subscribe of sort right here		
		for (var eachMatchIdx = 0; eachMatchIdx < this.recentMatchData.matches.length; eachMatchIdx++) {
          //this.summonerService.getMatchDetails
		  console.log(this.recentMatchData.matches[eachMatchIdx].gameId);
		}
	  })
	});

  }
  
  constructor(private route: ActivatedRoute, private router: Router, private summonerService: SummonerService) { }

  ngOnInit() {
    this.updateMatchData();

	this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateMatchData();
	  }
	});
  }

}
