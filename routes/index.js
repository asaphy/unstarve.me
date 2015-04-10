var express = require('express');
var router = express.Router();

var yelp = require("yelp").createClient({
  consumer_key: "dlxxTLhSDLdyVGzUGh6orw",
  consumer_secret: "iUUKFgNc3nskzmfMrRB-jwJuyY8",
  token: "RadJP6DVxMqTJak8AY_y6G7cQQ0v_pJF",
  token_secret: "fAkhSzfwIkLmSwFnRHbXoeZwR4s"
});

var results = "";
var resultAddress;
var resultLocation;
var resultLat;
var resultLon;
function test (query, callback){ yelp.search({term: "food", location: query, limit: "1", is_closed: 'false'}, function(error, data) {
  console.log(error);
  if(error == null){
    console.log("gettingdata")
    console.log(data);
    results = data.businesses[0].name;
    resultAddress = data.businesses[0].location.display_address;
    resultLocation = data.businesses[0].location;
    resultLat = resultLocation.coordinate["latitude"]
    resultLon = resultLocation.coordinate["longitude"]
    console.log(results);
    console.log(resultAddress);
    //L.mapbox.accessToken = 'pk.eyJ1IjoiZXJpY3NwYXJrIiwiYSI6ImdNRHBRbEEifQ.7zd5YN-UFOKHwG_bqzhJpQ';
    //var map = new L.mapbox.map('map', 'ericspark.lm0fj82m').setView([42.3645782, -71.0534363],16);
    //L.marker([42.3645782, -71.0534363]).addTo(map);
  }
  else{
   results = "Not Found";
   resultAddress = "";
  }
});};

function run() {
  /* GET home page. */
  router.get('/', function(req, res) {
    res.render('index', { title: results, address: resultAddress, lat: resultLat, lon: resultLon});
  });
}

function run2() {
  console.log("done");
}

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: results });
});

// router.get('/search', function(req,res,next) {
//   console.log(req.query);
//   test("Boston", run2);
//   //res.render('index', { title: results });
// });

function getData(req, res, next) {
  console.log(req.query);
  test(JSON.stringify(req.query), next());
}

function renderData(req,res){
  //added delay for asynchronity
  setTimeout(function(){
    res.render('index', { title: results, address: resultAddress, lat: resultLat, lon: resultLon });
  },1000);
}

router.get('/search', getData,  renderData);


module.exports = router;
