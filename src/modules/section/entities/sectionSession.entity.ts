import { Base } from "../../base/entities/base.entity";
import { Column, Entity, Index, ManyToOne } from "typeorm";
import { Section } from "./section.entity";

@Entity("sectionsessions")
@Index(["session"])
export class SectionSession extends Base {
  @Column()
  session: string;

  @ManyToOne(() => Section, (section) => section.sessions)
  section: Section;
}