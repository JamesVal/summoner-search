import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';

import { SummonerService, SummonerDetails } from '../summoner.service';
import { CreateExcelService } from '../create-excel.service';
import { MatchDataHelper, KDA, MatchDetails } from '../match-data-helper';

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

class TeamDetails {
  teamId: number;
  teamMembers: string[];
}

class MatchDetailsTeams extends MatchDetails {
  teams: TeamDetails[];
}

@Component({
  selector: 'app-match-details',
  templateUrl: './match-details.component.html',
  styleUrls: ['./match-details.component.css']
})
export class MatchDetailsComponent implements OnInit {

  summonerDetailsSub: Subscription = new Subscription();
  summonerDetails: SummonerDetails = new SummonerDetails();
  matchDetailsSub: Subscription = new Subscription();

  matchDataList: MatchDetails[] = [];

  matchDataExcelList: matchDetailsExcel[];
  
  convertToExcelObject(matchList: MatchDetails[]): matchDetailsExcel[] {
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
  
  isOdd(idx: number): boolean {
    return ((idx & 0x01) == 1);
  }
  
  isSummoner(summonerName: string): boolean {
    return (summonerName.toLowerCase().replace(/\s/g,'') == this.summonerDetails.name.toLowerCase().replace(/\s/g,''));
  }

  getTeamMembers(teamId: number, matchData: any): string[] {
    var teamMembers: string[] = [];
    
    for (var eachParticipantIdx = 0; eachParticipantIdx < matchData.participants.length; eachParticipantIdx++) {
      if (teamId == matchData.participants[eachParticipantIdx].teamId) {
        var partipantname = this.matchDataHelper.getParticipantName(matchData.participants[eachParticipantIdx].participantId, matchData);
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

  getTeamDetails(matchData: any): TeamDetails[] {
    let teamDetails = [];

    var teamNumbers: number[] = [];
    teamNumbers = this.getTeamNumbers(matchData);            
    for (var eachTeamIdx = 0; eachTeamIdx < teamNumbers.length; eachTeamIdx++) {
      var team = new TeamDetails();
      team.teamId = teamNumbers[eachTeamIdx];
      team.teamMembers = this.getTeamMembers(teamNumbers[eachTeamIdx], matchData);
      teamDetails.push(team);
    }

    return teamDetails;
  }

  constructor(private summonerService: SummonerService, private matchDataHelper: MatchDataHelper, private createExcelService: CreateExcelService, private datePipe: DatePipe) { }

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
          var newMatchDetails = this.matchDataHelper.createMatchDetails(this.summonerDetails, allMatchDetailData[i]) as MatchDetailsTeams;
          newMatchDetails.teams = this.getTeamDetails(allMatchDetailData[i]);
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
    this.matchDetailsSub.unsubscribe();
  }
}
