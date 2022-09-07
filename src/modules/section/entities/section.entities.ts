import { Project } from "../../project/entities/project.entity";
import { Column, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Base } from "../../base/entities/base.entity";
import { Log } from "../../log/entities/log.entity";
import { User } from "../../user/entities/user.entity";
@Entity("sections")
@Index(["name", "project"], {unique: true})
export class Section extends Base{
  @Column()
  name: string;

  @ManyToOne((type) => Project, (project) => project.sections)
  @JoinColumn()
  project: Project;

  @OneToMany((type) => Log, (log) => log.section)
  logs: Log[];

  @OneToMany((type) => User, (user) => user.section)
  users: User[];

  @Column({type: "boolean", default: true})
  active: boolean;

  @DeleteDateColumn()
  deletedAt: Date;
}