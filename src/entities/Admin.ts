import { Entity } from "typeorm";
import { Employee } from "./Employee";

import { User } from './User';

@Entity("Admin", { schema: "Team19" })
export class Admin extends Employee {

}
