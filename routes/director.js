var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();

//Models
const Director = require('../models/Director');

router.get('/', function(req, res, next) {
  const promise = Director.aggregate([
    {
      $lookup: {
        from: 'movies',
        localField: '_id',
        foreignField: 'director_id',
        as: 'movies'
      }
    },
    {
      $unwind: {
        path: '$movies',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $group: {
        _id:{
          _id: '$_id',
          name: '$name',
          surname: '$surname',
          bio: '$bio'
        },
        movie_count:{
          $sum: 1
        },
        movies:{
          $push: '$movies'
        }
      }
    },
    {
      $project: {
        _id: '$_id._id',
        name: '$_id.name',
        surname: '$_id.surname',
        bio: '$_id.bio',
        movie_count: '$movie_count',
        movies: '$movies'
      }
    }
  ]);

  promise.then((data)=>{
    res.json(data);
  }).catch((err)=>{
    res.json(err);
  });
});

router.get('/:director_id', function(req, res, next) {
  const promise = Director.aggregate([
    {
      $match: {
        '_id':mongoose.Types.ObjectId(req.params.director_id)
      }
    },
    {
      $lookup: {
        from: 'movies',
        localField: '_id',
        foreignField: 'director_id',
        as: 'movies'
      }
    },
    {
      $unwind: {
        path: '$movies',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $group: {
        _id:{
          _id: '$_id',
          name: '$name',
          surname: '$surname',
          bio: '$bio'
        },
        movie_count:{
          $sum: 1
        },
        movies:{
          $push: '$movies'
        }
      }
    },
    {
      $project: {
        _id: '$_id._id',
        name: '$_id.name',
        surname: '$_id.surname',
        bio: '$_id.bio',
        movie_count: '$movie_count',
        movies: '$movies'
      }
    }
  ]);

  promise.then((data)=>{
    res.json(data);
  }).catch((err)=>{
    res.json(err);
  });
});

router.post('/', function(req, res, next) {
  const director = new Director(req.body);
  const promise = director.save();

  promise.then((data)=>{
    res.json(data);
  }).catch((err)=>{
    res.json(err);
  });
});

module.exports = router;
