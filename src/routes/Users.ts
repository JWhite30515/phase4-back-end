import { Request, Response } from 'express';
import { getConnection, getManager, EntityManager } from 'typeorm';

import { Admin } from '../entities/Admin';
import { Customer } from '../entities/Customer';
import { Employee } from '../entities/Employee';
import { Manager } from '../entities/Manager';
import { User } from '../entities/User';

let manager: EntityManager;

const initialize = () => {
  manager = getManager();
}

export enum UserType {
  manager = 'MANAGER',
  customer = 'CUSTOMER',
  user = 'USER',
  managerCustomer = 'MANAGER_CUSTOMER',
  admin = 'ADMIN'
}

export async function login(req: Request, res: Response) {
  if (manager === undefined) {
    initialize();
  }
  const { username, password } = req.body;

  let result: { user: User, type: UserType };

  const foundUser = await manager.getRepository(User)
    .findOne({
      where: { username, password }
    });

  if (foundUser) {
    const foundManager = await manager.getRepository(Manager)
      .findOne({
        where: {
          username: {
            username,
            password
          }
        }
      });
    const foundCustomer = await manager.getRepository(Customer)
      .findOne({
        where: {
          username: {
            username,
            password
          }
        }
      });
    const foundAdmin = await manager.getRepository(Admin)
      .findOne({
        where: {
          username: {
            username,
            password
          }
        }
      });

    if (foundManager && foundCustomer) {
      result = {
        user: foundUser,
        type: UserType.managerCustomer
      };
      res.send(result);
      return;
    } else if (foundManager) {
      result = {
        user: foundUser,
        type: UserType.manager
      };
      res.send(result);
      return;
    } else if (foundCustomer) {
      result = {
        user: foundUser,
        type: UserType.customer
      };
      res.send(result);
      return;
    } else if (foundAdmin) {
      result = {
        user: foundUser,
        type: UserType.admin
      }
      res.send(result);
      return;
    }

    result = {
      user: foundUser,
      type: UserType.user
    };
    res.send(result);
    return;
  }

  res.send(null);
  return;
}