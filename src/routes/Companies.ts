import { Request, Response } from 'express';
import { getConnection, getManager, EntityManager } from 'typeorm';

import { Company } from '../entities/Company';
import { Employee } from '../entities/Employee';
import { Theater } from '../entities/Theater';
import { Manager } from '../entities/Manager';

let manager: EntityManager;

const initialize = () => {
  manager = getManager();
}

export interface ICompanyTableEntry {
  comName: string;
  numTheaters: number;
  numCities: number;
  numEmployees: number;
}

export async function getCompanies(req: Request, res: Response) {
  if (manager === undefined) {
    initialize();
  }

  try {
    const companies = await manager.getRepository(Company)
      .find();

    const companiesToReturn: ICompanyTableEntry[] = [];

    for (const company of companies) {
      const theaters = await manager.getRepository(Theater)
        .find({
          where: {
            comName: company
          }
        });
      
      const cities = new Set<{ city: string, state: string }>();
      theaters.forEach(theater => {
        cities.add({ city: theater.thCity, state: theater.thState });
      });

      const managers = await manager.getRepository(Manager)
        .find({
          where: {
            comName: company,
          }
        });
      
      companiesToReturn.push({
        comName: company.comName,
        numCities: cities.size,
        numTheaters: theaters.length,
        numEmployees: managers.length,
      });
    }
    res.send(companiesToReturn);
  } catch (e) {
    console.error(e);
    res.status(400).send(e);
  }
}

export async function getCompanyDetail(req: Request, res: Response) {
  if (manager === undefined) {
    initialize();
  }

  try {
    const { comName } = req.body;

    const company = await manager.getRepository(Company)
      .findOne({
        comName,
      });
    const theaters = await manager.getRepository(Theater)
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.manUsername', 'manUsername')
      .leftJoinAndSelect('manUsername.username', 'username')
      .where({
        comName: company,
      })
      .getMany();

    const employees = await manager.getRepository(Manager)
      .createQueryBuilder('e')
      .leftJoinAndSelect('e.username', 'username')
      .where({
        comName: company,
      })
      .getMany();

    res.send({
      company,
      theaters,
      employees,
    });
  } catch (e) {
    console.error(e);
    res.status(400).send(e);
  }
}