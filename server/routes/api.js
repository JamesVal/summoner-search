const express = require('express');
const router = express.Router();

var riotKey = require('./riotsecret');

// declare axios for making http requests
const axios = require('axios');
const API = 'https://na1.api.riotgames.com';
const DataDragon = 'http://ddragon.leagueoflegends.com/cdn/8.1.1/data/en_US';

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

router.get('/riotAPI/getSummoner/:name', (req, res) => {
  const name = req.params.name;
  
  axios.get(`${API}/lol/summoner/v3/summoners/by-name/${name}?api_key=${riotKey.mykey}`)
    .then(posts => {
      res.status(200).json(posts.data);
    })
    .catch(error => {
      res.status(500).send(error)
    });
});

router.get('/riotAPI/getRecentMatches/:accountId', (req, res) => {
  const accountId = req.params.accountId;
  
  axios.get(`${API}/lol/match/v3/matchlists/by-account/${accountId}/recent?api_key=${riotKey.mykey}`)
    .then(posts => {
      res.status(200).json(posts.data);
    })
    .catch(error => {
      res.status(500).send(error)
    });
});

router.get('/riotAPI/getRecentMatchesByIndex/:accountId', (req, res) => {
  const accountId = req.params.accountId;
  const beginIndex = req.query.beginIndex;
  const endIndex = req.query.endIndex;
  
  axios.get(`${API}/lol/match/v3/matchlists/by-account/${accountId}?api_key=${riotKey.mykey}&beginIndex=${beginIndex}&endIndex=${endIndex}`)
    .then(posts => {
      res.status(200).json(posts.data);
    })
    .catch(error => {
      res.status(500).send(error)
    });
});

router.get('/riotAPI/getMatch/:matchId', (req, res) => {
  const matchId = req.params.matchId;
  
  axios.get(`${API}/lol/match/v3/matches/${matchId}?api_key=${riotKey.mykey}`)
    .then(posts => {
      res.status(200).json(posts.data);
    })
    .catch(error => {
      res.status(500).send(error)
    });
});

/*
// Because the Riot API is heavily rate limited for Static Data, don't use it
router.get('/riotAPI/getChampion/:championId', (req, res) => {
  const championId = req.params.championId;
  
  axios.get(`${API}/lol/static-data/v3/champions/${championId}?api_key=${riotKey.mykey}&tags=image`)
    .then(posts => {
      res.status(200).json(posts.data);
    })
    .catch(error => {
      res.status(500).send(error)
    });
});
*/

module.exports = router;