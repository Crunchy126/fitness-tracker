const express = require("express");
const logger = require("morgan");
const path = require("path");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;

const db = require("./models");
const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", { useNewUrlParser: true });

app.get('/exercise', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/exercise.html'));
});

app.get('/stats', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/stats.html'));
});

app.get('/api/workouts/range', (req, res) => {
  db.Workout.find({}).then( (dbWorkout) => {
    res.json(dbWorkout)
  })
})

app.get('/api/workouts', (req, res) => {
  db.Workout.find({}).then((dbWorkout) => {
    res.json(dbWorkout)
  })
})

app.post('/api/workouts', (req, res) => {
  console.log(req.body);
  db.Workout.create({})
    .then(dbWorkout => {
      console.log("Find", dbWorkout);
      console.log("req",  req.body);

      var id = mongoose.Types.ObjectId(dbWorkout._id);

      console.log("id",id);
      
     db.Workout.findOneAndUpdate(
        { _id: id }, 
        { $push: { exercises: req.body  } }
      ).then((dbWorkout) => {
        console.log("dbWork", dbWorkout);
        res.json(dbWorkout)
      })
     

      //res.json(dbWorkout);
    })
    .catch(err => {
      res.json(err)
    })
})

app.put('/api/workouts/:id', (req, res) => {
  console.log("id", req.params.id);
  console.log("body", req.body);  
  
  var id = mongoose.Types.ObjectId(req.params.id);

  db.Workout.findOneAndUpdate(
    { _id: id }, 
    { $push: { exercises: req.body  } }
  ).then((dbWorkout) => {
    console.log("dbWork", dbWorkout);
    res.json(dbWorkout)
  })

})

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});

