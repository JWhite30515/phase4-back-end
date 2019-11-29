import * as bodyParser from "body-parser";
import * as express from "express";
import { Request, Response } from "express";
import { createConnection } from 'typeorm';

import { User } from './entities/User';

import { getCompanies, getCompanyDetail } from './routes/Companies';
import { saveCreditCard } from './routes/CustomerCreditCards';
import {
  login,
  getUsers,
  registerCustomer,
  registerManager,
  registerManagerCustomer,
  registerUser,
  updateUserStatus
} from './routes/Users';

import { createMovie } from './routes/Movies';
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

  // credit card routes
  app.post('/credit-card/', saveCreditCard);

  // user routes
  app.post('/users/login', login);
  app.post('/users/register-user', registerUser);
  app.post('/users/register-customer', registerCustomer);
  app.post('/users/register-manager', registerManager);
  app.post('/users/register-manager-customer', registerManagerCustomer);
  app.get('/users', getUsers);
  app.post('/users/', updateUserStatus)
  app.get('/users/valid-managers', getValidManagers);

  // company routes
  app.get('/companies', getCompanies);
  app.post('/companies/company-detail', getCompanyDetail);

  // theaters
  app.post('/theaters', createTheater);

  // movies
  app.post('/movies', createMovie);

}).catch((error) => { console.error(error) });

