import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NavigationEnd } from '@angular/router';

import { SummonerService } from '../summoner.service';

class teamDetails {
  teamId: number;
  teamMembers: string[];
}

class matchDetails {
  gameMode: string;
  championId: number;
  championName: string;
  championImg: string;
  teams: teamDetails[];
};

@Component({
  selector: 'app-match-details',
  templateUrl: './match-details.component.html',
  styleUrls: ['./match-details.component.css']
})
export class MatchDetailsComponent implements OnInit {

  // Decided not to define the API response since the order it actually responds in doesn't match the order specified in their documentation - so now I just grab whatever object that is returned
  recentMatchData: any;
  matchDataList: matchDetails[];
  
  getSummonerParticipantId(summonerName: string, matchData: any): number {
    for (var eachParticipantIdx = 0; eachParticipantIdx < matchData.participantIdentities.length; eachParticipantIdx++) {
      if (summonerName == matchData.participantIdentities[eachParticipantIdx].player.summonerName) {
        return matchData.participantIdentities[eachParticipantIdx].participantId;
      }
    }
    
    return -1; // error?
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
  
  setChampionData(matchList: matchDetails[], championData: any): void {
    for (var eachMatchIdx = 0; eachMatchIdx < matchList.length; eachMatchIdx++) {
      if (championData.id == matchList[eachMatchIdx].championId) {
        matchList[eachMatchIdx].championName = championData.name;
        matchList[eachMatchIdx].championImg = championData.image.full;
      }
    }
  }
  
  updateMatchData(): void {
    var summonerName = this.route.parent.snapshot.paramMap.get('name');   

    this.summonerService.getSummonerData(summonerName).subscribe(summonerData => {
      this.summonerService.getRecentMatchDetails(summonerData.accountId).subscribe(recentMatchData => {
        this.recentMatchData = recentMatchData;

        this.matchDataList = [];
        
        // JJV DEBUG - only get the first 5 matches
        for (var eachMatchIdx = 0; eachMatchIdx < (this.recentMatchData.matches.length-15); eachMatchIdx++) {
          this.summonerService.getMatchDetails(this.recentMatchData.matches[eachMatchIdx].gameId).subscribe(matchData => {
            
            var curData = new matchDetails();
            curData.gameMode = matchData.gameMode;
            
            var participantId = this.getSummonerParticipantId(summonerName, matchData);
            var championId = this.getSummonerChampionId(participantId, matchData);
            curData.championId = championId;
            curData.championName = "";
            curData.championImg = "";
           
            curData.teams = [];
            var teamNumbers: number[] = [];
            teamNumbers = this.getTeamNumbers(matchData);            
            for (var eachTeamIdx = 0; eachTeamIdx < teamNumbers.length; eachTeamIdx++) {
              var team = new teamDetails();
              team.teamId = teamNumbers[eachTeamIdx];
              team.teamMembers = this.getTeamMembers(teamNumbers[eachTeamIdx],matchData);
              curData.teams.push(team);
            }
            
            this.matchDataList.push(curData);
            
            // JJV DEBUG - this isn't exactly the most elegant way to go about with this since it will unnecessarily update if the same champion is in the game
            this.summonerService.getChampionDetails(championId).subscribe(championData => {
              this.setChampionData(this.matchDataList, championData);
            });
            
          });
        }
      });
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
