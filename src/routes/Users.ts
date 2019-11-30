import { Request, Response } from 'express';
import { getConnection, getManager, EntityManager } from 'typeorm';

import { Admin } from '../entities/Admin';
import { Company } from '../entities/Company';
import { Customer } from '../entities/Customer';
import { CustomerCreditCard } from '../entities/CustomerCreditCard';
import { Employee } from '../entities/Employee';
import { Manager } from '../entities/Manager';
import { User } from '../entities/User';
import { Theater } from '../entities/Theater';
import { UserVisitTheater } from '../entities/UserVisitTheater';


let manager: EntityManager;

const initialize = () => {
  manager = getManager();
}

export enum UserType {
  manager = 'MANAGER',
  customer = 'CUSTOMER',
  user = 'USER',
  managerCustomer = 'MANAGER_CUSTOMER',
  admin = 'ADMIN',
  adminCustomer = 'ADMIN_CUSTOMER',
}

export enum UserStatus {
  pending = 'Pending',
  approved = 'Approved',
  declined = 'Declined',
}

interface UserTableEntry {
  username: string;
  creditCardCount: number;
  userType: UserType;
  userStatus: UserStatus;
}

export async function getUsers(req: Request, res: Response) {
  if (manager === undefined) {
    initialize();
  }

  const returnUsers: UserTableEntry[] = [];
  try {
    const users = await manager.getRepository(User)
      .find();
    for (const user of users) {
      let userType: UserType = await determineUserType(user);
      let creditCardCount = 0;
      let userStatus: UserStatus = null;

      if (userType === (UserType.customer || UserType.adminCustomer || UserType.managerCustomer)) {
        const creditCards = await manager.getRepository(CustomerCreditCard)
          .createQueryBuilder('cc')
          .leftJoinAndSelect('cc.username', 'username')
          .where({
            username: user,
          })
          .getMany();
        // console.log(creditCards);
        creditCardCount = creditCards ? creditCards.length : 0;
      }

      if (user.status === UserStatus.pending) {
        userStatus = UserStatus.pending;
      } else if (user.status === UserStatus.approved) {
        userStatus = UserStatus.approved;
      } else if (user.status === UserStatus.declined) {
        userStatus = UserStatus.declined;
      }
      returnUsers.push({
        username: user.username,
        creditCardCount,
        userType,
        userStatus: userStatus,
      });
    }

  } catch (e) {
    console.error(e);
    res.status(400).send(e);
  }
  res.send(returnUsers);
  return;
}

export async function determineUserType(user: User) {
  let userType: UserType;

  const foundManager = await manager.getRepository(Manager)
    .createQueryBuilder('m')
    .leftJoinAndSelect('m.username', 'username')
    .where({
      username: user
    })
    .getOne();
  const foundCustomer = await manager.getRepository(Customer)
    .createQueryBuilder('c')
    .leftJoinAndSelect('c.username', 'username')
    .where({
      username: user
    })
    .getOne();

  const foundAdmin = await manager.getRepository(Admin)
    .createQueryBuilder('a')
    .leftJoinAndSelect('a.username', 'username')
    .where({
      username: user
    })
    .getOne();

  if (foundManager && foundCustomer) {
    userType = UserType.managerCustomer;
  } else if (foundManager) {
    userType = UserType.manager;
  } else if (foundAdmin && foundCustomer) {
    userType = UserType.adminCustomer;
  } else if (foundCustomer) {
    userType = UserType.customer
  } else if (foundAdmin) {
    userType = UserType.admin;
  } else {
    userType = UserType.user;
  }
  return userType;
}

export async function login(req: Request, res: Response) {
  if (manager === undefined) {
    initialize();
  }
  const { username, password } = req.body;

  let result: { user: User, type: UserType, creditCards: CustomerCreditCard[] };

  try {
    const foundUser = await manager.getRepository(User)
      .findOne({
        where: { username, password }
      });
  
    if (foundUser) {
      let userType = await determineUserType(foundUser);
      const creditCards = await manager.getRepository(CustomerCreditCard)
        .createQueryBuilder('c')
        .leftJoinAndSelect('c.username', 'username')
        .where({
          username: foundUser,
        })
        .getMany();
  
      result = {
        user: foundUser,
        type: userType,
        creditCards,
      };
      res.send(result);
    }
  } catch (e) {
    res.status(400).send(e);
  }
}

export async function updateUserStatus(req: Request, res: Response) {
  if (manager === undefined) {
    initialize();
  }

  const { username, status } = req.body;

  try {
    const result = await manager.createQueryBuilder()
      .update(User)
      .set({ username, status })
      .where({ username })
      .execute();
    
    res.send(result);
  } catch (e) {
    console.error(e);
    res.status(400).send(e);
  }
}

export async function registerUser(req: Request, res: Response) {
  if (manager === undefined) {
    initialize();
  }

  const {
    username,
    firstname,
    lastname,
    password,
  } = req.body;
  try {
    const result = await manager
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({
        username,
        firstname,
        lastname,
        password,
        status: UserStatus.pending,
      })
      .execute();
    res.send(result);
  } catch (e) {
    console.error(e);
    res.status(400).send(e);
  }
}

export async function registerManager(req: Request, res: Response) {
  if (manager === undefined) {
    initialize();
  }

  const {
    username,
    firstname,
    lastname,
    password,
    company,
    streetAddress,
    state,
    city,
    zipCode
  } = req.body;

  const user = new User();
  user.username = username;
  user.firstname = firstname;
  user.lastname = lastname;
  user.password = password;
  user.status = UserStatus.pending;
  try {
    await manager
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(user)
      .execute();

    const foundCompany = await manager.getRepository(Company)
      .findOne({ where: { comName: company.value } })

    await manager
      .createQueryBuilder()
      .insert()
      .into(Employee)
      .values({
        username: user,
      })
      .execute();

    const result = await manager
      .createQueryBuilder()
      .insert()
      .into(Manager)
      .values({
        username: user,
        manCity: city,
        manStreet: streetAddress,
        manState: state.value,
        manZipcode: zipCode,
        comName: foundCompany,
      })
      .execute();
    res.send(result);
  } catch (e) {
    console.error(e);
    res.status(400).send(e);
  }
}

export async function registerManagerCustomer(req: Request, res: Response) {
  if (manager === undefined) {
    initialize();
  }

  const {
    username,
    firstname,
    lastname,
    password,
    company,
    streetAddress,
    state,
    city,
    zipCode,
    creditCards
  } = req.body;


  const user = new User();
  user.username = username;
  user.firstname = firstname;
  user.lastname = lastname;
  user.password = password;
  user.status = UserStatus.pending;

  try {
    await manager
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(user)
      .execute();

    await manager
      .createQueryBuilder()
      .insert()
      .into(Customer)
      .values({ username: user })
      .execute();

    await addCreditCards(creditCards, user);

    const foundCompany = await manager.getRepository(Company)
      .findOne({ where: { comName: company.value } })

    await manager
      .createQueryBuilder()
      .insert()
      .into(Employee)
      .values({
        username: user,
      })
      .execute();

    const result = await manager
      .createQueryBuilder()
      .insert()
      .into(Manager)
      .values({
        username: user,
        manCity: city,
        manStreet: streetAddress,
        manState: state.value,
        manZipcode: zipCode,
        comName: foundCompany,
      })
      .execute();

    res.send(result);
  } catch (e) {
    console.error(e);
    res.status(400).send(e);
  }
}

export async function registerCustomer(req: Request, res: Response) {
  if (manager === undefined) {
    initialize();
  }

  const {
    username,
    firstname,
    lastname,
    password,
    creditCards,
  } = req.body;

  const user = new User();
  user.username = username;
  user.firstname = firstname;
  user.lastname = lastname;
  user.password = password;
  user.status = UserStatus.pending;
  try {
    await manager
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(user)
      .execute();

    const result = await manager
      .createQueryBuilder()
      .insert()
      .into(Customer)
      .values({ username: user })
      .execute();

    await addCreditCards(creditCards, user);

    res.send(result);
  } catch (e) {
    console.error(e);
    res.status(400).send(e);
  }
}

async function addCreditCards(creditCards: string[], user: User) {
  if (manager === undefined) {
    initialize();
  }

  creditCards.forEach(async card => {
    await manager
      .createQueryBuilder()
      .insert()
      .into(CustomerCreditCard)
      .values({
        creditCardNum: card,
        username: user
      })
      .execute();
  });
}

export async function getCreditCards(req: Request, res: Response) {
  if (manager === undefined) {
    initialize();
  }
  try {
    const result = await manager.getRepository(CustomerCreditCard)
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.username', 'username') 
    res.send(result);

  } catch (e) {
    console.error(e);
    res.status(400).send(e);
  }
}

export async function getTheaters(req: Request, res: Response) {
  if (manager === undefined) {
    initialize();
  }
  try {
    const result = await manager.getRepository(Theater)
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.comName', 'comName') 
      .getMany();

    res.send(result);
  } catch (e) {
    console.error(e);
    res.status(400).send(e);
  }
}

export async function logVisit(req: Request, res: Response) {
  if (manager === undefined) {
    initialize();
  }
  try {
    const { thName, comName, user, visitDate } = req.body.visit;


    const allVisits = await manager.getRepository(UserVisitTheater)
      .find();
    
    let max = 0;
    allVisits.forEach(visit => {
      if (Number(visit.visitId) > max) {
        max = Number(visit.visitId);
      }
    });

        
    const newVisit = new UserVisitTheater;
    newVisit.comName = comName;
    newVisit.thName = thName;
    newVisit.username = user;
    newVisit.visitDate = new Date(visitDate);
    newVisit.visitId = max + 1;
  
    const result = await manager.createQueryBuilder()
      .insert()
      .into(UserVisitTheater)
      .values(newVisit)
      .execute();
    res.send(result);
  } catch (e) {
    console.error(e);
    res.status(400).send(e);
  }
}

export async function getVisits(req: Request, res: Response) {
  if (manager === undefined) {
    initialize();
  }
  try {
    const { user } = req.body;

    const visits = await manager.getRepository(UserVisitTheater)
      .createQueryBuilder('v')
      .leftJoinAndSelect('v.username', 'username')
      .where({
        username: user,
      })
      .getMany();

    const results = [];

    for (const visit of visits) {
      const theater = await manager.getRepository(Theater)
        .findOne({
          where: {
            thName: visit.thName,
          }
        });
      results.push({
        ...visit,
        theater
      });
    }
    res.send(results);
  } catch (e) {
    console.error(e);
    res.status(400).send(e);
  }
}