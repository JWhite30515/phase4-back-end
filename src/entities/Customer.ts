import { Entity } from 'typeorm';
import { User } from "./User";


@Entity("Customer", { schema: "Team19" })
export class Customer extends User {

  // @OneToOne(() => User, (User: User) => User.customer, { primary: true, nullable: false, onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  // @JoinColumn({ name: 'username' })
  // username: User | null;

}
