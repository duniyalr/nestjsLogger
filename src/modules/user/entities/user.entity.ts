import { Base } from "../../base/entities/base.entity";
import { Role } from "../../base/entities/role.enum";
import { Entity, Column, Index, ManyToOne, OneToMany} from "typeorm";
import { Session } from "../../session/entities/session.entity";
import { Section } from "../../section/entities/section.entities";
import { Log } from "../../log/entities/log.entity";

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

  @ManyToOne((type) => Section, (section) => section.users)
  section: Section;

  @OneToMany((type) => Log, (log) => log.user)
  logs: Log[]
  
  @Column({type: "boolean", default: true}) 
  active: boolean;
}