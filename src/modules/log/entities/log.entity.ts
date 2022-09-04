import { Base } from "../../base/entities/base.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { Section } from "../../section/entities/section.entities";
import { User } from "../../user/entities/user.entity";

@Entity("logs")
export class Log extends Base {
  @Column() 
  url: string;

  @Column()
  ip: string;

  @Column({type: "text"})
  content: string;

  @ManyToOne((type) => Section, (section) => section.logs)
  section: Section;

  @ManyToOne((type) => User, (user) => user.logs)
  user: User;
}