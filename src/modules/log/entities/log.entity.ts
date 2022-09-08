import { Base } from "../../base/entities/base.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { Section } from "../../section/entities/section.entity";
import { User } from "../../user/entities/user.entity";
import { ContentType } from "../dtos/createLog.dto";

@Entity("logs")
export class Log extends Base {
  @Column() 
  url: string;

  @Column()
  ip: string;

  @Column({type: "text"})
  content: string;

  @Column({type: "enum", enum: ContentType, default: ContentType.TEXT})
  contentType: ContentType;

  @ManyToOne((type) => Section, (section) => section.logs)
  section: Section;

}