const MongoLib = require('../lib/mongo');

class MoviesService {
  constructor() {
    this.collection = 'movies';
    this.mongoDB = new MongoLib();
  }

  async getMovies(tags) {
    const query = tags && { tags: { $in: tags } };
    const movies = await this.mongoDB.getAll(this.collection, query);
    return movies || [];
  }

  async getMovie(movieId) {
    const movie = await this.mongoDB.get(this.collection, movieId);
    return movie;
  }

  async createMovie(movie) {
    const movieId = await this.mongoDB.create(this.collection, movie);
    return movieId;
  }

  async updateMovie(movieId, movie) {
    const updatedMovie = await this.mongoDB.update(
      this.collection,
      movieId,
      movie
    );
    return updatedMovie;
  }

  async deleteMovie(movieId) {
    const deletedMovieId = await this.mongoDB.delete(this.collection, movieId);
    return deletedMovieId;
  }
}

module.exports = MoviesService;
