import { Entity, JoinColumn, OneToOne } from "typeorm";

import { Admin } from "./Admin";
import { Manager } from "./Manager";
import { User } from "./User";

@Entity("Employee", { schema: "Team19" })
export class Employee {
  @OneToOne(
    () => User,
    (User: User) => User.employee,
    {
      primary: true,
      nullable: false,
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION'
    })
  @JoinColumn({ name: 'username' })
  username: User | null;

  // @OneToOne(
  //   () => Admin,
  //   (Admin: Admin) => Admin.username,
  //   {
  //     onDelete: 'NO ACTION',
  //     onUpdate: 'NO ACTION'
  //   }
  // )
  // admin: Admin | null;

  // @OneToOne(
  //   () => Manager,
  //   (Manager: Manager) => Manager.username,
  //   {
  //     onDelete: 'NO ACTION',
  //     onUpdate: 'NO ACTION'
  //   }
  // )
  // manager: Manager | null;
}
