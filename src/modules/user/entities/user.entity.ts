import { Base } from "../../base/entities/base.entity";
import { Role } from "../../base/entities/role.enum";
import { Entity, Column, Index, ManyToOne, OneToMany} from "typeorm";
import { Session } from "../../session/entities/session.entity";

@Entity("users")
@Index(["username"], {unique: true})
@Index(["email"], {unique: true})
export class User extends Base {
  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @Column({
    type: "enum",
    enum: Role,
    default: Role.USER
  }) 
  role: string;

  @OneToMany((type) => Session, (session) => session.user)
  sessions: Session[]

  @Column({type: "boolean", default: true}) 
  active: boolean;
}