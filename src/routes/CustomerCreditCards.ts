import { Request, Response } from 'express';
import { getConnection, getManager, EntityManager, Repository } from 'typeorm';
import { CustomerCreditCard } from '../entities/CustomerCreditCard';

let repository: Repository<CustomerCreditCard>;
let Manager: EntityManager;


const initialize = () => {
  const connection = getConnection();
  repository = connection.getRepository(CustomerCreditCard);
}

export const saveCreditCard = async (req: Request, res: Response) => {
  if (repository === undefined) {
    initialize();
  }

  const creditCard = new CustomerCreditCard();
  console.log(req);
  console.log('hello');


}