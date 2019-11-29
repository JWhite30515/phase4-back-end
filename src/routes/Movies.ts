import { Request, Response } from 'express';
import { getConnection, getManager, EntityManager } from 'typeorm';

import { Movie } from '../entities/Movie';

let manager: EntityManager;

const initialize = () => {
  manager = getManager();
}

export async function createMovie(req: Request, res: Response) {
  if (manager === undefined) {
    initialize();
  }

  try {
    const {
      name,
      duration,
      date
    } = req.body;
  
    const movie = new Movie();
    movie.movName = name;
    movie.duration = duration;
    movie.movReleaseDate = new Date(date);
    
    const result = await manager
      .createQueryBuilder()
      .insert()
      .into(Movie)
      .values(movie)
      .execute();
    res.send(result);

  } catch (e) {
    console.error(e);
    res.status(400).send(e);
  }

}