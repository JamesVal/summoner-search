import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NavigationEnd } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';

import { SummonerService, SummonerDetails } from '../summoner.service';
import { CreateExcelService } from '../create-excel.service';

class matchDetailsExcel {
  date: string;
  gameMode: string;
  championName: string;
  kills: number;
  deaths: number;
  assists: number;
  team1: string;
  team2: string;
  result: string;
}

class teamDetails {
  teamId: number;
  teamMembers: string[];
}

class KDA {
  kills: number;
  deaths: number;
  assists: number;
}

class matchDetails {
  date: number;
  gameMode: string;
  championId: number;
  championName: string;
  championImg: string;
  kda: KDA;
  teams: teamDetails[];
  result: string;
};

@Component({
  selector: 'app-match-details',
  templateUrl: './match-details.component.html',
  styleUrls: ['./match-details.component.css']
})
export class MatchDetailsComponent implements OnInit {

  matchDetailsSub: Subscription = new Subscription();
  summonerDetailsSub: Subscription = new Subscription();
  summonerDetails: SummonerDetails = new SummonerDetails();

  // Decided not to define the API response since the order it actually responds in doesn't match the order specified in their documentation - so now I just grab whatever object that is returned
  matchDataList: matchDetails[] = [];

  matchDataExcelList: matchDetailsExcel[];
  
  convertToExcelObject(matchList: matchDetails[]): matchDetailsExcel[] {
    var excelMatchList: matchDetailsExcel[] = [];
    
    for (var eachMatchIdx = 0; eachMatchIdx < matchList.length; eachMatchIdx++) {
      var excelMatch = new matchDetailsExcel();
      
      excelMatch.date = this.datePipe.transform(matchList[eachMatchIdx].date,"short");
      excelMatch.gameMode = matchList[eachMatchIdx].gameMode;
      excelMatch.championName = matchList[eachMatchIdx].championName;
      excelMatch.kills = matchList[eachMatchIdx].kda.kills;
      excelMatch.deaths = matchList[eachMatchIdx].kda.deaths;
      excelMatch.assists = matchList[eachMatchIdx].kda.assists;
    
      excelMatch.team1 = matchList[eachMatchIdx].teams[0].teamMembers[0] + ", " + matchList[eachMatchIdx].teams[0].teamMembers[1] + ", " + matchList[eachMatchIdx].teams[0].teamMembers[2] + ", " + matchList[eachMatchIdx].teams[0].teamMembers[3] + ", " + matchList[eachMatchIdx].teams[0].teamMembers[4];
      
      excelMatch.team2 = matchList[eachMatchIdx].teams[1].teamMembers[0] + ", " + matchList[eachMatchIdx].teams[1].teamMembers[1] + ", " + matchList[eachMatchIdx].teams[1].teamMembers[2] + ", " + matchList[eachMatchIdx].teams[1].teamMembers[3] + ", " + matchList[eachMatchIdx].teams[1].teamMembers[4];

      excelMatch.result = matchList[eachMatchIdx].result;
      
      excelMatchList.push(excelMatch);
    }
    
    return excelMatchList;
  }
  
  saveData(): void {
    //We must format the object appropriately for this service
    this.createExcelService.exportAsExcelFile(this.convertToExcelObject(this.matchDataList), "matchdata");
  }
  
  getSummonerParticipantId(summonerName: string, matchData: any): number {
    for (var eachParticipantIdx = 0; eachParticipantIdx < matchData.participantIdentities.length; eachParticipantIdx++) {
      if (summonerName.toLowerCase().replace(/\s/g,'') == matchData.participantIdentities[eachParticipantIdx].player.summonerName.toLowerCase().replace(/\s/g,'')) {
        return matchData.participantIdentities[eachParticipantIdx].participantId;
      }
    }
    
    return -1; // error?
  }
  
  isOdd(idx: number): boolean {
    return ((idx & 0x01) == 1);
  }
  
  isSummoner(summonerName: string): boolean {
    return (summonerName.toLowerCase().replace(/\s/g,'') == this.summonerDetails.name.toLowerCase().replace(/\s/g,''));
  }

  getSummonerChampionId(participantId: number, matchData: any): number {
    for (var eachParticipantIdx = 0; eachParticipantIdx < matchData.participants.length; eachParticipantIdx++) {
      if (participantId == matchData.participants[eachParticipantIdx].participantId) {
        return matchData.participants[eachParticipantIdx].championId;
      }
    }
    
    return -1; // error?
  }
  
  getParticipantName(participantId: number, matchData: any): string {
    for (var eachParticipantIdx = 0; eachParticipantIdx < matchData.participantIdentities.length; eachParticipantIdx++) {
      if (participantId == matchData.participantIdentities[eachParticipantIdx].participantId) {
        return matchData.participantIdentities[eachParticipantIdx].player.summonerName;
      }
    }
    
    return ""; // error?
  }
  
  getTeamMembers(teamId: number, matchData: any): string[] {
    var teamMembers: string[] = [];
    
    for (var eachParticipantIdx = 0; eachParticipantIdx < matchData.participants.length; eachParticipantIdx++) {
      if (teamId == matchData.participants[eachParticipantIdx].teamId) {
        var partipantname = this.getParticipantName(matchData.participants[eachParticipantIdx].participantId,matchData);
        teamMembers.push(partipantname);
      }
    }
    
    if (teamMembers.length == 0) {
      // error?
    }
    
    return teamMembers;
  }
  
  getTeamNumbers(matchData: any): number[] {
    var teamNumbers: number[] = [];
    
    for (var eachTeamIdx = 0; eachTeamIdx < matchData.teams.length; eachTeamIdx++) {
      teamNumbers.push(matchData.teams[eachTeamIdx].teamId);
    }
    
    if (teamNumbers.length == 0) {
      // error?
    }
    
    return teamNumbers;
  }
  
  getMatchResult(participantId: number, matchData: any): boolean {
    for (var eachParticipantIdx = 0; eachParticipantIdx < matchData.participants.length; eachParticipantIdx++) {
      if (participantId == matchData.participants[eachParticipantIdx].participantId) {
        return matchData.participants[eachParticipantIdx].stats.win;
      }
    }
    
    // error ?
    return false;
  }
  
  getParticipantKDA(participantId: number, matchData: any): KDA {
    var kda = new KDA();
    
    for (var eachParticipantIdx = 0; eachParticipantIdx < matchData.participants.length; eachParticipantIdx++) {
      if (participantId == matchData.participants[eachParticipantIdx].participantId) {
        kda.kills = matchData.participants[eachParticipantIdx].stats.kills;
        kda.deaths = matchData.participants[eachParticipantIdx].stats.deaths;
        kda.assists = matchData.participants[eachParticipantIdx].stats.assists;
      }
    }
    
    return kda;
  }
  
  createMatchDetails(matchData: any): matchDetails {
    var summonerName = this.summonerDetails.name;
    
    var curData = new matchDetails();
    curData.date = matchData.gameCreation;
    curData.gameMode = matchData.gameMode;
            
    var participantId = this.getSummonerParticipantId(summonerName, matchData);
    var championId = this.getSummonerChampionId(participantId, matchData);
    curData.championId = championId;
    curData.championName = "";
    curData.championImg = "";
    
    curData.kda = this.getParticipantKDA(participantId, matchData);
    
    var result = this.getMatchResult(participantId, matchData);
    if (result) {
      curData.result = "Win";
    } else {
      curData.result = "Loss";
    }
           
    curData.teams = [];
    var teamNumbers: number[] = [];
    teamNumbers = this.getTeamNumbers(matchData);            
    for (var eachTeamIdx = 0; eachTeamIdx < teamNumbers.length; eachTeamIdx++) {
      var team = new teamDetails();
      team.teamId = teamNumbers[eachTeamIdx];
      team.teamMembers = this.getTeamMembers(teamNumbers[eachTeamIdx],matchData);
      curData.teams.push(team);
    }
    
    // JJV DEBUG - need an error check of some sort here
    
    return curData;
  }
  
  constructor(private route: ActivatedRoute, private router: Router, private summonerService: SummonerService, private createExcelService: CreateExcelService, private datePipe: DatePipe) { }

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
          var newMatchDetails = this.createMatchDetails(allMatchDetailData[i]);
          var championDetails = this.summonerService.getChampionDetails(newMatchDetails.championId);

          newMatchDetails.championName = championDetails.name;
          newMatchDetails.championImg = championDetails.image.full;

          this.matchDataList.push(newMatchDetails);
          /*
          var sortedMatches = this.matchDataList.sort((n1,n2) => {
            if (n2.date > n1.date) {
              return 1;
            } else if (n1.date > n2.date) {
              return -1;
            }
        
            return 0;
          });
          
          this.matchDataList = sortedMatches;
          */
        }
      } else {
        this.matchDataList = [];
      }
    });
  }

  ngOnDestroy() {
    this.summonerDetailsSub.unsubscribe();
  }
}
