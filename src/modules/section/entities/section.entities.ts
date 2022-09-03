import { Project } from "../../project/entities/project.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Base } from "../../base/entities/base.entity";

@Entity("sections")
@Index(["name"], {unique: true})
export class Section extends Base{
  @Column()
  name: string;

  @ManyToOne((type) => Project, (project) => project.sections)
  @JoinColumn()
  project: Project;

  @Column({type: "boolean", default: true})
  active: boolean;
}