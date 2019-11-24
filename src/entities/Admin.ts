import { Entity, JoinColumn, OneToOne } from "typeorm";
import { Employee } from "./Employee";

@Entity("Admin", { schema: "Team19" })
export class Admin extends Employee {

  // @OneToOne(
  //   () => Employee,
  //   (Employee: Employee) => Employee.admin,
  //   {
  //     primary: true,
  //     nullable: false,
  //     onDelete: 'NO ACTION',
  //     onUpdate: 'NO ACTION'
  //   }
  // )
  // @JoinColumn({ name: 'username' })
  // username: Employee["username"] | null;
}
