const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const { config } = require('./config');
const moviesApi = require('./routes/movies');
const userMoviesApi = require('./routes/userMovies');
const authApi = require('./routes/auth');
const {
  logErrors,
  wrapErrors,
  errorHandler,
} = require('./utils/middlewares/errorHandlers');
const notFoundHandler = require('./utils/middlewares/notFoundHandler');
const app = express();

const corsOptions = { origin: config.cors };
app.use(cors(corsOptions));

//body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());

authApi(app);
moviesApi(app);
userMoviesApi(app);

// Catch 404
app.use(notFoundHandler);

//errors handlers
app.use(logErrors);
app.use(wrapErrors);
app.use(errorHandler);

app.listen(config.port, (err) => {
  if (err) throw Error('express not running');
  console.log('running on port', config.port);
});
