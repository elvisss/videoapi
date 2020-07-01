const express = require('express');
const passport = require('passport');
const MoviesService = require('../services/movies');
const {
  movieIdSchema,
  createMovieSchema,
  updateMovieSchema,
} = require('../utils/schemas/movies');
const validationHandler = require('../utils/middlewares/validationHandler');
const cacheResponse = require('../utils/cacheResponse');
const {
  FIVE_MINUTES_IN_SECONDS,
  SIXTY_MINUTES_IN_SECONDS,
} = require('../utils/time');

// JWT strategy
require('../utils/auth/strategies/jwt');

const moviesApi = (app) => {
  const router = express.Router();
  app.use('/api/movies', router);

  const moviesService = new MoviesService();

  router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
      cacheResponse(res, FIVE_MINUTES_IN_SECONDS);
      const { tags } = req.query;
      try {
        const movies = await moviesService.getMovies(tags);
        res.status(200).json({
          data: movies,
          message: 'success',
        });
      } catch (err) {
        next(err);
      }
    }
  );

  router.get(
    '/:movieId',
    passport.authenticate('jwt', { session: false }),
    validationHandler({ movieId: movieIdSchema }, 'params'),
    async (req, res, next) => {
      cacheResponse(res, SIXTY_MINUTES_IN_SECONDS);
      const { movieId } = req.params;
      try {
        const movie = await moviesService.getMovie(movieId);
        if (movie) {
          res.status(200).json({
            data: movie,
            message: 'success',
          });
        } else {
          res.status(404).json({
            message: 'Movie not found',
          });
        }
      } catch (err) {
        next(err);
      }
    }
  );

  router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    validationHandler(createMovieSchema),
    async (req, res, next) => {
      const { body: movie } = req;
      try {
        const createMovieId = await moviesService.createMovie(movie);
        res.status(201).json({
          data: createMovieId,
          message: 'success',
        });
      } catch (err) {
        next(err);
      }
    }
  );

  router.put(
    '/:movieId',
    passport.authenticate('jwt', { session: false }),
    validationHandler({ movieId: movieIdSchema }, 'params'),
    validationHandler(updateMovieSchema),
    async (req, res, next) => {
      const { body: movie } = req;
      const { movieId } = req.params;
      try {
        const updatedMovie = await moviesService.updateMovie(movieId, movie);
        res.status(200).json({
          data: updatedMovie,
          message: 'success',
        });
      } catch (err) {
        next(err);
      }
    }
  );

  router.delete(
    '/:movieId',
    passport.authenticate('jwt', { session: false }),
    validationHandler({ movieId: movieIdSchema }, 'params'),
    async (req, res, next) => {
      const { movieId } = req.params;
      try {
        const deletedMovieId = await moviesService.deleteMovie(movieId);
        res.status(200).json({
          data: deletedMovieId,
          message: 'success',
        });
      } catch (err) {
        next(err);
      }
    }
  );
};

module.exports = moviesApi;
