var express = require('express');
var router = express.Router();

//Models
const Movie = require('../models/Movie');

/**
 * Get all movies
 */
router.get('/', (req, res) => {
  const promise = Movie.aggregate([
    {
      $lookup: {
        from: 'directors',
        localField: 'director_id',
        foreignField: '_id',
        as: 'director'
      }
    },
    {
      $unwind: '$director'
    }
  ]);
  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });
});

/**
 * Get Top10 Movies by imdb score
 * /:movie_id endpointi üzerine yazdık çünkü diğer türlü movide_id gibi algılıyor
 */
router.get('/top10', (req, res) => {
  const promise = Movie.find({}).limit(10).sort({imdb_score: -1});
  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });
});

/**
 * Get movie by movie_id
 */
router.get('/:movie_id', (req, res, next) => {
  const promise = Movie.findById(req.params.movie_id);
  promise.then((movie) => {
    if(!movie)
      next({message: 'The movie was not found', code: 1}); //app.js line 41
    res.json(movie);
  }).catch((err) => {
    res.json(err);
  });
});

/**
 * Get all movies
 */
router.get('/between/:start_year/:end_year', (req, res) => {
  const { start_year, end_year } = req.params
  const promise = Movie.find(
    {
      year: { "$gte": parseInt(start_year), "$lte": parseInt(end_year) } //$gte = büyük veya eşit | $lte = küçük veya eşit
    }
    );
  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });
});

/**
 * Update by movie_id
 */
router.put('/:movie_id', (req, res, next) => {
  const promise = Movie.findByIdAndUpdate(
    req.params.movie_id, 
    req.body,
    {
      new: true //Yeni datayı döndürür
    });
  promise.then((movie) => {
    if(!movie)
      next({message: 'The movie was not found', code: 1}); //app.js line 41
    res.json({ status: 1, data: movie});
  }).catch((err) => {
    res.json(err);
  });
});

/**
 * Delete by movie_id
 */
router.delete('/:movie_id', (req, res, next) => {
  const promise = Movie.findByIdAndRemove(req.params.movie_id);
  promise.then((movie) => {
    if(!movie)
      next({message: 'The movie was not found', code: 1}); //app.js line 41
    res.json({status: 1});
  }).catch((err) => {
    res.json(err);
  });
});

/**
 * Add new movie
 */
router.post('/', (req, res, next) => {
  //const { title, imdb_score, category, country, year } = req.body;

  const movie = new Movie(req.body);

  // movie.save((err, data) =>{
  //   if(err)
  //     res.json(err);

  //     res.json({status:1});
  // });

  const promise = movie.save();

  promise.then((data) => {
    res.json({ status: 1 });
  }).catch((err) => {
    res.json(err);
  });
});

module.exports = router;