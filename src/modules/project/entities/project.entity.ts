import { Section } from "../../section/entities/section.entities";
import { Entity, Column, Index, DeleteDateColumn, OneToMany, JoinColumn } from "typeorm";
import { Base } from "../../base/entities/base.entity";

@Entity("projects")
@Index(["name"], {unique: true})
export class Project extends Base {
  @Column()
  name: string;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany((type) => Section, (section) => section.project)
  sections: Section[]
}