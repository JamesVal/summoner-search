import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NavigationEnd } from '@angular/router';

import { SummonerService } from '../summoner.service';

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
  
  getMatchResult(participantId: number, matchData: any): boolean {
    for (var eachParticipantIdx = 0; eachParticipantIdx < matchData.participants.length; eachParticipantIdx++) {
      if (participantId == matchData.participants[eachParticipantIdx].participantId) {
        return matchData.participants[eachParticipantIdx].stats.win;
      }
    }
    
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
  
  setChampionData(matchList: matchDetails[], championData: any): void {
    for (var eachMatchIdx = 0; eachMatchIdx < matchList.length; eachMatchIdx++) {
      if (championData.key == matchList[eachMatchIdx].championId) {
        matchList[eachMatchIdx].championName = championData.name;
        matchList[eachMatchIdx].championImg = championData.image.full;
      }
    }
  }
  
  updateMatchData(): void {
    var summonerName = this.route.parent.snapshot.paramMap.get('name');   

    this.summonerService.getSummonerData(summonerName).subscribe(summonerData => {
      this.summonerService.getRecentMatchDetails(summonerData.accountId).subscribe(recentMatchData => {
        this.recentMatchData = recentMatchData.matches;
        this.matchDataList = [];
        
        // JJV DEBUG - only get the last match
        for (var eachMatchIdx = 0; eachMatchIdx < (this.recentMatchData.length-10); eachMatchIdx++) {
          this.summonerService.getMatchDetails(this.recentMatchData[eachMatchIdx].gameId).subscribe(matchData => {
            
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
            
            this.matchDataList.push(curData);
            
            var sortedMatches = this.matchDataList.sort((n1,n2) => {
              if (n2.date > n1.date) {
                return 1;
              } else if (n1.date > n2.date) {
                return -1;
              }
          
              return 0;
            });
            
            this.matchDataList = sortedMatches;
            
            // This originally was an API call but instead am now just using a static file that is hosted server-side (which itself was downloaded from Data Dragon - We can't use Riot's API here because Static Data is heavily rate-limited
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
