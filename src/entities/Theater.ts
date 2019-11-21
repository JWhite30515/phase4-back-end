import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { Company } from "./Company";
import { Manager } from "./Manager";


@Entity("Theater", { schema: "Team19" })
@Index("comName", ["comName",])
// @Index("manUsername", ["manUsername"])
export class Theater {

  @Column("varchar", {
    nullable: false,
    primary: true,
    length: 50,
    name: "thName"
  })
  thName: string;


  @ManyToOne(() => Company, (Company: Company) => Company.theaters, { primary: true, nullable: false, onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  @JoinColumn({ name: 'comName' })
  comName: Company | null;


  @Column("decimal", {
    nullable: false,
    precision: 4,
    scale: 0,
    name: "capacity"
  })
  capacity: string;


  @Column("varchar", {
    nullable: false,
    length: 50,
    name: "thStreet"
  })
  thStreet: string;


  @Column("varchar", {
    nullable: false,
    length: 50,
    name: "thCity"
  })
  thCity: string;


  @Column("char", {
    nullable: false,
    length: 2,
    name: "thState"
  })
  thState: string;


  @Column("char", {
    nullable: false,
    length: 9,
    name: "thZipcode"
  })
  thZipcode: string;


  @ManyToOne(() => Manager, (Manager: Manager) => Manager.theaters, { nullable: false, onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  @JoinColumn({ name: 'manUsername' })
  manUsername: Manager | null;

}
