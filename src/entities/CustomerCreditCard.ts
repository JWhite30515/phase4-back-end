import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { User } from "./User";
import { CustomerViewMovie } from "./CustomerViewMovie";


@Entity("CustomerCreditCard", { schema: "Team19" })
@Index("username", ["username",])
export class CustomerCreditCard {

  @Column("char", {
    nullable: false,
    primary: true,
    length: 16,
    name: "creditCardNum"
  })
  creditCardNum: string;

  @ManyToOne(
    () => User,
    (User: User) => User.customerCreditCards,
    { nullable: false, onDelete: 'NO ACTION', onUpdate: 'NO ACTION' }
  )
  @JoinColumn({ name: 'username' })
  username: User | null;

  @OneToMany(
    () => CustomerViewMovie,
    (CustomerViewMovie: CustomerViewMovie) => CustomerViewMovie.creditCardNum,
    { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' }
  )
  customerViewMovies: CustomerViewMovie[];

}
