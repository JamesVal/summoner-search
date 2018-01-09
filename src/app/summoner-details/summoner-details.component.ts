import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SummonerDTO } from '../summoner-data';

@Component({
  selector: 'app-summoner-details',
  templateUrl: './summoner-details.component.html',
  styleUrls: ['./summoner-details.component.css']
})
export class SummonerDetailsComponent implements OnInit {

  summonerData: SummonerDTO;

  getSummonerData(): void {
    const summonerName = this.route.snapshot.paramMap.get('name');
	console.log(summonerName);
  }
  
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.getSummonerData();
  }

}
