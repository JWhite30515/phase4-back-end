import * as bodyParser from "body-parser";
import * as express from "express";
import { Request, Response } from "express";
import { createConnection } from 'typeorm';

import { User } from './entities/User';

import { getCompanies, getCompanyDetail } from './routes/Companies';
import {
  login,
  getUsers,
  registerCustomer,
  registerManager,
  registerManagerCustomer,
  registerUser,
  updateUserStatus,
  getTheaters,
  logVisit,
  getVisits
} from './routes/Users';

import { createMovie, getMovies, scheduleMovie, getMoviePlays, viewMovie, getViewHistory } from './routes/Movies';
import { createTheater, getValidManagers } from './routes/Theaters';

createConnection().then(async connection => {
  // create and setup express app
  const app = express();
  app.use(bodyParser.json());

  // allow access
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  // register routes
  const port = 3001;
  app.listen(port, () => { console.log(`Listening on port ${port}`) });

  // start express server

  // user routes
  app.post('/users/login', login);
  app.post('/users/register-user', registerUser);
  app.post('/users/register-customer', registerCustomer);
  app.post('/users/register-manager', registerManager);
  app.post('/users/register-manager-customer', registerManagerCustomer);
  app.get('/users', getUsers);
  app.post('/users/', updateUserStatus)
  app.get('/users/valid-managers', getValidManagers);
  app.get('/users/theaters', getTheaters);
  app.post('/users/log-visit', logVisit);
  app.post('/users/visits', getVisits);

  // company routes
  app.get('/companies', getCompanies);
  app.post('/companies/company-detail', getCompanyDetail);

  // theaters
  app.post('/theaters', createTheater);

  // movies
  app.post('/movies', createMovie);
  app.post('/movies/schedule-movie', scheduleMovie);
  app.get('/movies', getMovies);
  app.get('/movies/movie-plays', getMoviePlays);
  app.post('/movies/view-movie', viewMovie);
  app.post('/movies/view-history', getViewHistory);

}).catch((error) => { console.error(error) });

