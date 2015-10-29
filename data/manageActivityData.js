module.exports = function(server, db) {

  var validateRequest = require("../auth/validateRequest");
  server.get("/api/v1/mydiaryapp/activityData/data/list", function(req, res, next) {
    validateRequest.validate(req, res, db, function() {
      db.activityData.find({
        user: req.params.token,
        startDate: req.params.startDate
      }, function(err, list) {
        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8'
        });
        res.end(JSON.stringify(list));
      });
    });
    return next();
  });
  server.get("/api/v1/mydiaryapp/activityData/data/list/all", function(req, res, next) {
    validateRequest.validate(req, res, db, function() {
      db.activityData.find({
        user: req.params.token,
        startDate: req.params.startDate
      }, function(err, list) {
        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8'
        });
        res.end(JSON.stringify(list));
      });
    });
    return next();
  });

  server.get("/api/v1/mydiaryapp/activityData/data/list/allValues", function(req, res, next) {
    // var allDateListObj = JSON.parse(req.params.allDateList);
    var allDateListObj = req.params.allDateList.split(",");

    validateRequest.validate(req, res, db, function() {
      db.activityData.aggregate(

        // Pipeline
        [
          // Stage 1
          {
            $match: {
            user: req.params.token
            }
          },

          // Stage 2
          {
            $match: {
            "startDate": {
                		$in: allDateListObj
              }
            }
          },

          // Stage 3
          {
            $group: {
              _id : "$startDate", items:{$push : "$$ROOT"}
            }

          },
          // Stage 4
          {
            $sort: {
            _id: 1
            }
          }

        ], function(err, list) {
          res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8'
          });
          res.end(JSON.stringify(list));
        });
      // db.activityData.find({
      //   user: req.params.token,
      //   startDate: req.params.startDate
      // }, function(err, list) {
      //   res.writeHead(200, {
      //     'Content-Type': 'application/json; charset=utf-8'
      //   });
      //   res.end(JSON.stringify(list));
      // });
    });
    return next();
  });

  server.get("/api/v1/mydiaryapp/activityData/data/datesWithData", function(req, res, next) {
    validateRequest.validate(req, res, db, function() {
      db.activityData.distinct("startDate",{
        user: req.params.token,
      }, function(err, list) {
        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8'
        });
        res.end(JSON.stringify(list));
      });
    });
    return next();
  });
  server.get('/api/v1/mydiaryapp/activityData/existing/:id', function(req, res, next) {
    validateRequest.validate(req, res, db, function() {
      db.activityData.find({
        _id: db.ObjectId(req.params.id)
      }, function(err, data) {
        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8'
        });
        res.end(JSON.stringify(data));
      });
    });
    return next();
  });
  server.post('/api/v1/mydiaryapp/activityData/data/item', function(req, res, next) {
    validateRequest.validate(req, res, db, function() {
      var item = req.params;

      db.activityData.save(item,
        function(err, data) {
          res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8'
          });
          res.end(JSON.stringify(data));
        });
    });
    return next();
  });
  server.put('/api/v1/mydiaryapp/activityData/data/item/:id', function(req, res, next) {
    validateRequest.validate(req, res, db, function() {
      db.activityData.findOne({
        _id: db.ObjectId(req.params.id)
      }, function(err, data) {
        // merge req.params/product with the server/product
        var updProd = {}; // updated products
        // logic similar to jQuery.extend(); to merge 2 objects.
        for (var n in data) {
          updProd[n] = data[n];
        }
        for (var n in req.params) {
          if (n != "_id")
            updProd[n] = req.params[n];
        }
        db.activityData.update({
          _id: db.ObjectId(req.params.id)
        }, updProd, {
          multi: false
        }, function(err, data) {
          res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8'
          });
          res.end(JSON.stringify(data));
        });
      });
    });
    return next();
  });
  server.del('/api/v1/mydiaryapp/activityData/data/item/:id', function(req, res, next) {
    validateRequest.validate(req, res, db, function() {
      db.activityData.remove({
        _id: db.ObjectId(req.params.id)
      }, function(err, data) {
        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8'
        });
        res.end(JSON.stringify(data));
      });
      return next();
    });
  });
}
