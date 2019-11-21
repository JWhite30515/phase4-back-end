import * as bodyParser from "body-parser";
import * as express from "express";
import { Request, Response } from "express";
import { createConnection } from 'typeorm';

import { User } from './entities/User';

createConnection().then(async connection => {
  // create and setup express app
  const app = express();
  app.use(bodyParser.json());

  // register routes

  const port = 3000;
  app.listen(port, () => { console.log(`Listening on port ${port}`) });

  let userRepository = connection.getRepository(User);
  let test = await userRepository.find();
  console.log(test);
  // start express server


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

