import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { User } from "./User";


@Entity("UserVisitTheater", { schema: "Team19" })
@Index("username", ["username",])
@Index("thName", ["thName", "comName",])
export class UserVisitTheater {

  @Column("decimal", {
    nullable: false,
    primary: true,
    precision: 10,
    scale: 0,
    name: "visitId"
  })
  visitId: number;

  @ManyToOne(
    () => User,
    (User: User) => User.userVisitTheaters,
    { nullable: false, onDelete: 'NO ACTION', onUpdate: 'NO ACTION' }
  )
  @JoinColumn({ name: 'username' })
  username: User | null;


  @Column("varchar", {
    nullable: false,
    length: 50,
    name: "thName"
  })
  thName: string;


  @Column("varchar", {
    nullable: false,
    length: 50,
    name: "comName"
  })
  comName: string;


  @Column("date", {
    nullable: false,
    name: "visitDate"
  })
  visitDate: Date;

}
