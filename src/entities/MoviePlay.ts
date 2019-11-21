import { Column, Entity, Index } from "typeorm";

@Entity("MoviePlay", { schema: "Team19" })
@Index("movName", ["movName", "movReleaseDate",])
export class MoviePlay {

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
