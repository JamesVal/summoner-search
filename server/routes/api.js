const express = require('express');
const router = express.Router();

var riotKey = require('./riotsecret');

// declare axios for making http requests
const axios = require('axios');
const API = 'https://na1.api.riotgames.com';

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

router.get('/riotAPI/byName/:name', (req, res) => {
  const name = req.params.name;
  
  axios.get(`${API}/lol/summoner/v3/summoners/by-name/${name}?api_key=${riotKey.mykey}`)
    .then(posts => {
      res.status(200).json(posts.data);
    })
    .catch(error => {
      res.status(500).send(error)
    });
});

module.exports = router;