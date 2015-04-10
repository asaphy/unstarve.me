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
var lat;
var lng;
var latlng = "42.349851699999995,-71.1069583";

function test (query, callback){ yelp.search({term: "restaurants" + query, sort: "1", ll: latlng, limit: "1", is_closed: 'false'}, function(error, data) {
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

router.post('/postLatLng', function (req, res) {
    lat = req.param("lat");
    lng = req.param("lng");
    latlng = lat + "," + lng;
    console.log(latlng);
});

// router.get('/search', function(req,res,next) {
//   console.log(req.query);
//   test("Boston", run2);
//   //res.render('index', { title: results });
// });

function getData(req, res, next) {
  console.log(req.query);
  console.log(latlng);
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
