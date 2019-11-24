import * as bodyParser from "body-parser";
import * as express from "express";
import { Request, Response } from "express";
import { createConnection } from 'typeorm';

import { User } from './entities/User';
import { saveCreditCard } from './routes/CustomerCreditCards';

import { login } from './routes/Users';

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

  app.post('/credit-card/', saveCreditCard);

  app.post('/users/login', login);


  // app.get("/users", function(req: Request, res: Response) {
  //     // here we will have logic to return all users
  // });

  // app.get("/users/:id", function(req: Request, res: Response) {
  //     // here we will have logic to return user by id
  // });

  // app.post("/users", function(req: Request, res: Response) {
  //     // here we will have logic to save a user
  // });

  // app.put("/users/:id", function(req: Request, res: Response) {
  //     // here we will have logic to update a user by a given user id
  // });

  // app.delete("/users/:id", function(req: Request, res: Response) {
  //     // here we will have logic to delete a user by a given user id
  // });


}).catch((error) => { console.error(error) });

