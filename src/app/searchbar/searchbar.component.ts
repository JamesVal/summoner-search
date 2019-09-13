import { Component, OnInit } from '@angular/core';
import { NavigationEnd } from '@angular/router';
import { Router } from '@angular/router';

import { SummonerService } from '../summoner.service';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent implements OnInit {

  summonerName: string = "";

  PressedEnter(evt): void {
    evt.target.blur();
    if (this.summonerNameValid()) {
      this.summonerService.getSummonerData(this.summonerName);
      this.router.navigate(["./summonerbase"]);
    }
  }
  
  onClick(evt): void {
    if (this.summonerNameValid())
      this.summonerService.getSummonerData(this.summonerName);
  }

  summonerNameValid(): boolean {
    return (this.summonerName.length > 0);
  }
  
  constructor(private router: Router, private summonerService: SummonerService) { }

  ngOnInit() {}

}
