// Objects that represent the responses expected from the Riot API Calls

export interface SummonerDTO {
  profileIconId: number;
  name: string;
  summonerLevel: number;
  revisionDate: number;
  id: number;
  accountId: number;
}

export const testObj = {"id":67972542,"accountId":228054520,"name":"ShuntStick","profileIconId":982,"revisionDate":1515464902000,"summonerLevel":45};