import { Request, Response } from 'express';
import { getConnection, getManager, EntityManager } from 'typeorm';

import { Manager } from '../entities/Manager';
import { Theater } from '../entities/Theater';

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