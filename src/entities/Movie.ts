import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from "typeorm";

@Entity('Movie', { schema: 'Team19' })
export class Movie {

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

  @Column("time", {
    nullable: false,
    name: "duration"
  })
  duration: string;

}
