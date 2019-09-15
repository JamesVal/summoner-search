import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { SummonerService, SummonerDetails } from '../summoner.service';
import { MatchDataHelper, KDA, MatchDetails, TeamDetails } from '../match-data-helper';

class ChampionStats {
  championName: string;
  championImg: string;
  kda: KDA = new KDA();
  matchesPlayed: number = 1;
  wins: number;
  losses: number;

  updateKDA(kda: KDA): void {
    this.kda.kills += kda.kills;
    this.kda.deaths += kda.deaths;
    this.kda.assists += kda.assists;
  }

  constructor(champion: any, matchDetails: MatchDetails) {
    this.championName = champion.name;
    this.championImg = champion.image.full;

    this.matchesPlayed = 1;
    if (matchDetails.result == "Win") {
      this.wins = 1;
      this.losses = 0;
    } else {
      this.wins = 0;
      this.losses = 1;
    }
    this.updateKDA(matchDetails.kda);
  }
};
  
@Component({
  selector: 'app-champion-summary',
  templateUrl: './champion-summary.component.html',
  styleUrls: ['./champion-summary.component.css']
})
export class ChampionSummaryComponent implements OnInit {
  championDataList: ChampionStats[] = [];

  summonerDetailsSub: Subscription = new Subscription();
  summonerDetails: SummonerDetails = new SummonerDetails();
  matchDetailsSub: Subscription = new Subscription();

  isOdd(idx: number): boolean {
    return ((idx & 0x01) == 1);
  }

  updateChampionList(champion: any, matchDetails: MatchDetails): void {
    let isNewChampion = true;

    for (let i = 0; i < this.championDataList.length; i++) {
      if (champion.name === this.championDataList[i].championName) {
        isNewChampion = false;
        this.championDataList[i].matchesPlayed++;
        if (matchDetails.result == "Win") {
          this.championDataList[i].wins++;
        } else {
          this.championDataList[i].losses++;
        }
        this.championDataList[i].updateKDA(matchDetails.kda);
      }
    }

    if (isNewChampion) {
      let newChampion = new ChampionStats(champion, matchDetails);
      this.championDataList.push(newChampion);
    }
  }

  constructor(private summonerService: SummonerService, private matchDataHelper: MatchDataHelper) { }

  ngOnInit() {
    this.summonerDetailsSub = this.summonerService.summonerDetailsReady.subscribe((dataReady) => {
      if (dataReady) {
        this.summonerDetails = this.summonerService.getSummonerInfo();
      } else {
        this.summonerDetails = null;
      }
    });

    this.matchDetailsSub = this.summonerService.matchDataReady.subscribe((dataReady) => {
      if (dataReady) {
        var allMatchDetailData = this.summonerService.getMatchInfo();

        for (let i = 0; i < allMatchDetailData.length; i++) {
          var matchDetails = this.matchDataHelper.createMatchDetails(this.summonerDetails, allMatchDetailData[i]);
          var championDetails = this.summonerService.getChampionDetails(matchDetails.championId);
          console.log(championDetails, matchDetails);
          this.updateChampionList(championDetails, matchDetails);
        }
        
        var sortedChampionList = this.championDataList.sort((n1,n2) => {
          if (n2.matchesPlayed > n1.matchesPlayed) {
            return 1;
          } else if (n1.matchesPlayed > n2.matchesPlayed) {
            return -1;
          }
      
          return 0;
        });
        
        this.championDataList = sortedChampionList;
      } else {
        this.championDataList = [];
      }
    });
  }

  ngOnDestroy() {
    this.summonerDetailsSub.unsubscribe();
    this.matchDetailsSub.unsubscribe();
  }
}
