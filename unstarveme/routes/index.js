var express = require('express');
var router = express.Router();

var yelp = require("yelp").createClient({
  consumer_key: "dlxxTLhSDLdyVGzUGh6orw",
  consumer_secret: "iUUKFgNc3nskzmfMrRB-jwJuyY8",
  token: "RadJP6DVxMqTJak8AY_y6G7cQQ0v_pJF",
  token_secret: "fAkhSzfwIkLmSwFnRHbXoeZwR4s"
});

var results = "";

function test (query, callback){ yelp.search({term: "food", location: query, limit: "1", is_closed: 'false'}, function(error, data) {
  //console.log(error);
  console.log("gettingdata")
  console.log(data);
  results = data.businesses[0].name;
  console.log(results);
});};

test("Montreal", run);

function run() {
  /* GET home page. */
  router.get('/', function(req, res) {
    res.render('index', { title: results });
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
    res.render('index', { title: results });
  },1000);
}

router.get('/search', getData,  renderData);


module.exports = router;
