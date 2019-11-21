import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { Manager } from "./Manager";
import { Theater } from "./Theater";


@Entity("Company", { schema: "Team19" })
export class Company {

  @Column("varchar", {
    nullable: false,
    primary: true,
    length: 50,
    name: "comName"
  })
  comName: string;

  @OneToMany(() => Manager, (Manager: Manager) => Manager.comName, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  managers: Manager[];

  @OneToMany(() => Theater, (Theater: Theater) => Theater.comName, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  theaters: Theater[];

}
