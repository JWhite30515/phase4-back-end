import { Request, Response } from 'express';
import { getConnection, getManager, EntityManager } from 'typeorm';

import { Manager } from '../entities/Manager';
import { Theater } from '../entities/Theater';
import { MoviePlay } from '../entities/MoviePlay';
import { Movie } from '../entities/Movie';

let manager: EntityManager;

const initialize = () => {
  manager = getManager();
}

export async function createTheater(req: Request, res: Response) {
  if (manager === undefined) {
    initialize();
  }

  try {
    console.log(req.body);

    const comName = req.body.company.value;
    const manUsername =  req.body.manager.value;
    const state = req.body.state.value;
    const {
      capacity,
      city,
      name,
      streetAddress,
      zipCode
    } = req.body;

    const theater = new Theater();
    theater.capacity = capacity;
    theater.comName = comName;
    theater.manUsername = manUsername;
    theater.thCity = city;
    theater.thName = name;
    theater.thState = state;
    theater.thStreet = streetAddress;
    theater.thZipcode = zipCode;

    const result = await manager
      .createQueryBuilder()
      .insert()
      .into(Theater)
      .values(theater)
      .execute();

    res.send(result);
  } catch (e) {
    console.error(e);
    res.status(400).send(e);
  }
}

export async function getValidManagers(req: Request, res: Response) {
  if (manager === undefined) {
    initialize();
  }

  try {
    const managers = await manager.getRepository(Manager)
      .createQueryBuilder('m')
      .leftJoinAndSelect('m.username', 'username')
      .leftJoinAndSelect('m.theaters', 'theaters')
      .getMany();

    const validManagers = managers.filter(manager => manager.theaters.length === 0);
    res.send(validManagers);
  } catch (e) {
    console.error(e);
    res.status(400).send(e);
  }
}

export async function getTheaterMovies(req: Request, res: Response) {
  if (manager === undefined) {
    initialize();
  }

  try {
    const { user } = req.body;

    const mgr = await manager.getRepository(Manager)
      .createQueryBuilder('m')
      .leftJoinAndSelect('m.username', 'username')
      .where({
          username: user,
      })
      .getOne();
    
    const theater = await manager.getRepository(Theater)
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.manUsername', 'manUsername')
      .where({
        manUsername: mgr,
      })
      .getOne();
    
    const moviePlays = await manager.getRepository(MoviePlay)
      .find({
        where: {
          thName: theater.thName,
        }
      });

    const movies: { movName: string, duration: string }[] = [];

    for (const moviePlay of moviePlays) {
      const movie = await manager.getRepository(Movie)
        .findOne({
          where: {
            movName: moviePlay.movName,
          }
        });
      
      movies.push({
        ...moviePlay,
        duration: movie.duration,
      })
    }

    const allMovies = await manager.getRepository(Movie)
      .find();
    
    const allMoviePlays = await manager.getRepository(MoviePlay)
      .find();

    const moviesNoPlay = [];
    
    for (const movie of allMovies) {
      const found = allMoviePlays.find(mp => mp.movName === movie.movName);

      if (!found) moviesNoPlay.push(movie);
    }
    
    for (const movie of moviesNoPlay) {
      const found = movies.find(m => m.movName === movie.movName);

      if (!found) movies.push(movie);
    }

    res.send(movies);

  } catch (e) {
    console.error(e);
    res.status(400).send(e);
  }
}