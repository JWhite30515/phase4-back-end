import { Request, Response } from 'express';
import { getConnection, getManager, EntityManager } from 'typeorm';

import { Movie } from '../entities/Movie';
import { Theater } from '../entities/Theater';
import { Manager } from '../entities/Manager';
import { MoviePlay } from '../entities/MoviePlay';
import { CustomerCreditCard } from '../entities/CustomerCreditCard';
import { CustomerViewMovie } from '../entities/CustomerViewMovie';

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

    const hours = Math.floor(Number(duration) / 60);
    const minutes = Number(duration) % 60;
  
    const durationString =
      `${hours}:${minutes}:00`;
  
    const movie = new Movie();
    movie.movName = name;
    movie.duration = durationString;
    
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

export async function getMovies(req: Request, res: Response) {
  if (manager === undefined) {
    initialize();
  }

  try {
    const movies = await manager.getRepository(Movie)
      .find();
    
    res.send(movies);
  } catch (e) {
    console.error(e);
    res.status(400).send(e);
  }
}

export async function scheduleMovie(req: Request, res: Response) {
  if (manager === undefined) {
    initialize();
  }

  try {
    console.log(req);
    const movName = req.body.movie.name.value;
    const {
      playDate,
      releaseDate
    } = req.body.movie;

    const { user }= req.body;

    const mgr = await manager.getRepository(Manager)
      .createQueryBuilder('m')
      .leftJoinAndSelect('m.theaters', 'theaters')
      .leftJoinAndSelect('m.comName', 'comName')
      .leftJoinAndSelect('m.username', 'username')
      .where({
        username: user
      })
      .getOne();
    
    const moviePlay = new MoviePlay();
    moviePlay.thName = (mgr.theaters && mgr.theaters.length === 1) ? mgr.theaters[0].thName : '';
    moviePlay.comName = mgr.comName.comName;

    const movie = await manager.getRepository(Movie)
      .findOne({
        where: {
          movName
        }
      });
    moviePlay.movPlayDate = new Date(playDate);
    moviePlay.movReleaseDate = movie.movReleaseDate;
    moviePlay.movName = movie.movName;

    const result = await manager
      .createQueryBuilder()
      .insert()
      .into(MoviePlay)
      .values(moviePlay)
      .execute();
    res.send(result);
  
  } catch (e) {
    console.error(e);
    res.status(400).send(e);
  }
}

export async function getMoviePlays(req: Request, res: Response) {
  if (manager === undefined) {
    initialize();
  }

  try {
    const moviePlays = await manager.getRepository(MoviePlay)
      .find();
    
    const result = [];
  
    for (const moviePlay of moviePlays) {
      const theater = await manager.getRepository(Theater)
        .findOne({
          where: {
            thName: moviePlay.thName,
          }
        });
      result.push({
        ...moviePlay,
        theater
      })
    }
    res.send(result);
  } catch (e) {
    console.error(e);
    res.status(400).send(e);
  }
}

export async function viewMovie(req: Request, res: Response) {
  if (manager === undefined) {
    initialize();
  }

  try {
    const {
      comName,
      movName,
      movPlayDate,
      movReleaseDate,
      thName
    } = req.body.moviePlay;
    const creditCardNum = req.body.cardNum;
    const username = req.body.user.username;

    const moviesViewedOnDay = await manager.getRepository(CustomerViewMovie)
      .find({
        where: {
          movPlayDate,
          creditCardNum,
        }
      });

    if (moviesViewedOnDay.length >= 3) {
      throw new Error('Max movies per day reached');
    }

    const creditCard = await manager.getRepository(CustomerCreditCard)
      .findOne({
        where: {
          creditCardNum,
          username
        }
      });
    
    const viewMovie = new CustomerViewMovie();
    viewMovie.comName = comName;
    viewMovie.creditCardNum = creditCard;
    viewMovie.movName = movName;
    viewMovie.movPlayDate = movPlayDate;
    viewMovie.movReleaseDate = movReleaseDate;
    viewMovie.thName = thName;

    const result = await manager.createQueryBuilder()
      .insert()
      .into(CustomerViewMovie)
      .values(viewMovie)
      .execute();
    res.send(result);
  } catch (e) {
    console.error(e);
    res.status(400).send(e);
  }
}

export async function getViewHistory(req: Request, res: Response) {
  if (manager === undefined) {
    initialize();
  }

  try {
    const { user } = req.body;

    const creditCards = await manager.getRepository(CustomerCreditCard)
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.username', 'username')
      .where({
        username: user
      })
      .getMany();

    const result = [];

    for (const card of creditCards) {
      const viewedMovies = await manager.getRepository(CustomerViewMovie)
        .createQueryBuilder('v')
        .leftJoinAndSelect('v.creditCardNum', 'creditCardNum')
        .where({
          creditCardNum: card.creditCardNum,
        })
        .getMany();
      for (const viewedMovie of viewedMovies) {
        if (viewedMovie) result.push(viewedMovie);
      }
    }
    res.send(result);

  } catch (e) {
    console.error(e);
    res.status(400).send(e);
  }
}
