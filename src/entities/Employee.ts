import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { User } from "./User";
import { Admin } from "./Admin";
import { Manager } from "./Manager";


@Entity("Employee", { schema: "Team19" })
export class Employee extends User {
  
}
