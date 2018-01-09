import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NavigationStart } from '@angular/router';

import { SummonerDTO } from '../summoner-data';

@Component({
  selector: 'app-summoner-details',
  templateUrl: './summoner-details.component.html',
  styleUrls: ['./summoner-details.component.css']
})
export class SummonerDetailsComponent implements OnInit {

  summonerData: any;
  
  updateSummonerData(): void {
    const summonerName = this.route.snapshot.paramMap.get('name');
  }
  
  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.updateSummonerData();
	
	this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.updateSummonerData();
	  }
	});
  }
  
}
