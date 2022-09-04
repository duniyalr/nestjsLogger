import { Base } from "../../base/entities/base.entity";
import { Entity, ManyToOne } from "typeorm";
import { Section } from "../../section/entities/section.entities";

@Entity("logs")
export class Log extends Base {
  @ManyToOne((type) => Section, (section) => section.logs)
  section: Section;

  
}