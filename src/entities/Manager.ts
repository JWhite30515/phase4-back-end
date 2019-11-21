import { Column, Entity, Index, JoinColumn, OneToMany, ManyToOne } from "typeorm";
import { Employee } from "./Employee";
import { Company } from "./Company";
import { Theater } from "./Theater";

@Entity("Manager", { schema: "Team19" })
@Index("comName", ["comName",])
export class Manager extends Employee {

  @ManyToOne(() => Company, (Company: Company) => Company.managers, { nullable: false, onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  @JoinColumn({ name: 'comName' })
  comName: Company | null;

  @Column("varchar", {
    nullable: false,
    length: 50,
    name: "manStreet"
  })
  manStreet: string;

  @Column("varchar", {
    nullable: false,
    length: 50,
    name: "manCity"
  })
  manCity: string;

  @Column("char", {
    nullable: false,
    length: 2,
    name: "manState"
  })
  manState: string;

  @Column("char", {
    nullable: false,
    length: 9,
    name: "manZipcode"
  })
  manZipcode: string;

  @OneToMany(() => Theater, (Theater: Theater) => Theater.manUsername, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  theaters: Theater[];

}
