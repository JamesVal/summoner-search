import { Injectable } from '@angular/core';
import { SummonerDetails } from './summoner.service';

export class KDA {
  kills: number = 0;
  deaths: number = 0;
  assists: number = 0;
}

export class MatchDetails {
  date: number;
  gameMode: string;
  championId: number;
  championName: string;
  championImg: string;
  kda: KDA;
  result: string;
};

@Injectable()
export class MatchDataHelper {

  getSummonerParticipantId(id: string, matchData: any): number {
    for (var eachParticipantIdx = 0; eachParticipantIdx < matchData.participantIdentities.length; eachParticipantIdx++) {
      if (id == matchData.participantIdentities[eachParticipantIdx].player.summonerId) {
        return matchData.participantIdentities[eachParticipantIdx].participantId;
      }
    }
    
    return -1; // error?
  }

  getSummonerChampionId(participantId: number, matchData: any): number {
    return matchData.participants[participantId-1].championId;
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

  getMatchResult(participantId: number, matchData: any): boolean {
    return matchData.participants[participantId-1].stats.win;
  }

  getParticipantName(participantId: number, matchData: any): string {
    return matchData.participantIdentities[participantId-1].player.summonerName;
  }
    
  createMatchDetails(summonerDetails: SummonerDetails, matchData: any): MatchDetails {
    var participantId = this.getSummonerParticipantId(summonerDetails.id, matchData);
    var championId = this.getSummonerChampionId(participantId, matchData);
    var curData = new MatchDetails();

    curData.date = matchData.gameCreation;
    curData.gameMode = matchData.gameMode;
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
           
    return curData;
  }

  constructor() {}
}