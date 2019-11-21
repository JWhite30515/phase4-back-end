import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { CustomerCreditCard } from "./CustomerCreditCard";


@Entity("CustomerViewMovie", { schema: "Team19" })
@Index("thName", ["thName", "comName", "movName", "movReleaseDate", "movPlayDate",])
export class CustomerViewMovie {

  @ManyToOne(
    () => CustomerCreditCard,
    (CustomerCreditCard: CustomerCreditCard) => CustomerCreditCard.customerViewMovies,
    { primary: true, nullable: false, onDelete: 'NO ACTION', onUpdate: 'NO ACTION' }
  )
  @JoinColumn({ name: 'creditCardNum' })
  creditCardNum: CustomerCreditCard | null;


  @Column("varchar", {
    nullable: false,
    primary: true,
    length: 50,
    name: "thName"
  })
  thName: string;


  @Column("varchar", {
    nullable: false,
    primary: true,
    length: 50,
    name: "comName"
  })
  comName: string;


  @Column("varchar", {
    nullable: false,
    primary: true,
    length: 50,
    name: "movName"
  })
  movName: string;


  @Column("date", {
    nullable: false,
    primary: true,
    name: "movReleaseDate"
  })
  movReleaseDate: string;


  @Column("date", {
    nullable: false,
    primary: true,
    name: "movPlayDate"
  })
  movPlayDate: string;

}
