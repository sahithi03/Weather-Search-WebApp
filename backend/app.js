const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
//const http = require('http');
//const app = require('./backend/app');
const port = process.env.PORT || 3000;
const path = require('path');

app.set('port',port);
//const server = http.createServer(app);
//server.listen(port);
app.listen(port);
app.use(cors());

app.use(express.static(path.join(__dirname, 'dist/hw8')));

app.use('/api/autocomplete',(req,res,next) => {
  axios.get("https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" + req.query.input + "&types=(cities)&language=en&key=")
    .then((result) => {
      res.json(result.data);
    });
});

app.use('/api/googleGeocode',(req,res,next) => {
  axios.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + req.query.address + "&key=")
    .then((result) => {
      res.json(result.data);
    });
  });

app.use('/forecast/:api/:lat/:lon',(req,res,next) => {
  var api_key = req.params.api;
  var lat = req.params.lat;
  var lon = req.params.lon;
  
  axios.get("https://api.darksky.net/forecast/" + api_key + "/" + lat + "," + lon)
  .then((result) => {
    res.json(result.data);
  });
});

app.use('/cityphotos/customsearch',(req,res,next) => {
  axios.get("https://www.googleapis.com/customsearch/v1?q=" + req.query.q + "&cx=&imgSize=huge&imgType=news&num=8&searchType=image&key=")
        .then((result) => {
          res.json(result.data);
        });
});


app.use('/api/customsearch',(req,res,next) => {
  axios.get("https://www.googleapis.com/customsearch/v1?q=" + req.query.q + "%20State%20Seal&cx=&imgSize=huge&imgType=news&num=1&searchType=image&key=")
        .then((result) => {
          res.json(result.data);
        });
});



app.use('/api/forecast/:apikey/:vars',(req,res,next) => {
  var api_key = req.params.apikey;
  new_vars = req.params.vars.split(',');
  axios.get("https://api.darksky.net/forecast/" + api_key + "/" + new_vars[0] + "," + new_vars[1] + "," + new_vars[2] )
        .then((result) =>{
          res.json(result.data);
        });
})

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'dist/hw8/index.html'));
});

module.exports = app;

