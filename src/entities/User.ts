import { Column, Entity, OneToMany, OneToOne } from "typeorm";

import { Customer } from './Customer';
import { CustomerCreditCard } from "./CustomerCreditCard";
import { Employee } from "./Employee";
import { UserVisitTheater } from "./UserVisitTheater";

@Entity("User", { schema: "Team19" })
export class User {

  @Column("varchar", {
    nullable: false,
    primary: true,
    length: 50,
    name: "username"
  })
  username: string;


  @Column("enum", {
    nullable: false,
    enum: ["Approved", "Declined", "Pending"],
    name: "status"
  })
  status: string;

  @Column("varchar", {
    nullable: false,
    length: 50,
    name: "password"
  })
  password: string;


  @Column("varchar", {
    nullable: false,
    length: 50,
    name: "firstname"
  })
  firstname: string;


  @Column("varchar", {
    nullable: false,
    length: 50,
    name: "lastname"
  })
  lastname: string;

  @OneToOne(
    () => Customer,
    (Customer: Customer) => Customer.username,
    { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' }
  )
  customer: Customer | null;

  @OneToMany(
    () => CustomerCreditCard,
    (CustomerCreditCard: CustomerCreditCard) => CustomerCreditCard.username,
    { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' }
  )
  customerCreditCards: CustomerCreditCard[];

  @OneToMany(
    () => UserVisitTheater,
    (UserVisitTheater: UserVisitTheater) => UserVisitTheater.username,
    { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' }
  )
  userVisitTheaters: UserVisitTheater[];

  @OneToOne(
    () => Employee,
    (Employee: Employee) => Employee.username,
    { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' }
  )
  employee: Employee | null;

}
