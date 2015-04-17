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

var foursquare = (require('foursquarevenues'))('ZHSGAUGBIV0WWSYMPWXEOA3EZKLV1Q2S0LIZEZXEXNHUVBN5', '5STYIB5J4HOEN0VR45HT2CCZAI2U4CHEG03F3M1Y52T5S1ZF');

var params = {
    "ll": "40.7,-74"
};

foursquare.getVenues(params, function(error, venues) {
    if (!error) {
    }
});

function getValues(obj, key) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getValues(obj[i], key));
        } else if (i == key) {
            objects.push(obj[i]);
        }
    }
    return objects;
}

var GOOGLE_PLACES_API_KEY = "AIzaSyBKRP-IfvvckxTosqdOUK0bHTwBDECsUyA";
var GOOGLE_PLACES_OUTPUT_FORMAT = "json";

var GooglePlaces = require("googleplaces");
var googlePlaces = new GooglePlaces(GOOGLE_PLACES_API_KEY, GOOGLE_PLACES_OUTPUT_FORMAT);
var parameters;
var places_id;


function queryYelp (query, callback){ yelp.search({term: "restaurants", sort: "1", ll: latlng, limit: "1", is_closed: 'false'}, function(error, data) {
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

    parameters = {
      location:[latlng],
      types:"restaurant",
      opennow: "true",
      rankby: "distance"
    };
    googlePlaces.placeSearch(parameters, function (error, response) {
      if (error) throw error;
      places_id = getValues(response.results, "place_id");
      console.log(places_id[0]);
    });
  }
  else{
   results = "Not Found";
   resultAddress = "";
  }
});};

function run() {
  /* GET home page. */
  router.get('/', function(req, res) {
    res.render('index', { title: results, address: resultAddress, lat: resultLat, lon: resultLon, placesID: places_id});
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

function getData(req, res, next) {
  console.log(req.query);
  console.log(latlng);
  queryYelp(JSON.stringify(req.query), next());
}

function renderData(req,res){
  //added delay for asynchronity
  setTimeout(function(){
    res.render('index', { title: results, address: resultAddress, lat: resultLat, lon: resultLon, placesID: places_id });
  },1000);
}

router.get('/search', getData,  renderData);


module.exports = router;
