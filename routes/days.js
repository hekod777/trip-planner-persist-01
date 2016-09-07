var router = require('express').Router();
var Day = require('../models/day');
var Meal = require('../models/meal');
var Restaurant = require('../models/restaurant');
var Place = require('../models/place');
var Hotel = require('../models/hotel');
var Activity = require('../models/activity');
var Adventure = require('../models/adventure');
var Stay = require('../models/stay');

module.exports = router;

router.get('/', function(req, res, next){
  var meals = {
    model: Meal,
    include: [ { 
      model: Restaurant,
      include: [ Place ]
    } ]
  };
  Day.findAll({ include: [ meals ]})
    .then(function(days){
      return days.map(function(day){
        var obj = {};
        obj.id = day.id;
        obj.restaurants = day.meals.map(function(meal){ 
          return meal.restaurant;
        });
        obj.hotels = [];
        obj.activities = [];
        return obj;
      });
    })
    .then(function(days){
      res.send(days);
    })
    .catch(next);
});

router.get('/hotels', function(req, res, next){
  Promise.all([Hotel.findAll(), Restaurant.findAll(), Activity.findAll()])
  .then(function(results){
    //var returnObj
    res.send(results);
  })
})

router.post('/newDay', function(req, res, next){
  Day
  .create()
  .catch(next);
});

router.post('/newstuff/:id/type/:type', function(req, res, next){
  if(req.params.type == 'hotels'){
    Stay.create({
      hotelId: req.params.id,
      dayId:1,
    })
      .then(function(newHotel){
        console.log(newHotel);
        res.send(newHotel);
      })
  }
  else if (req.params.type == 'restaurants'){
    Meal.create({
      restaurantId: req.params.id,
      dayId:1,
    })
      .then(function(newMeal){
        console.log(newMeal);
        res.send(newMeal);
      })
  }
  else{
    Adventure.create({
      activityId:req.params.id,
      dayId:1,
    })
      .then(function(newAdventure){
        console.log(newAdventure);
        res.send(newAdventure);
      })

  }
  

})