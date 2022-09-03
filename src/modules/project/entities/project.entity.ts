import { Entity, Column, Index, DeleteDateColumn } from "typeorm";
import { Base } from "../../base/entities/base.entity";

@Entity("projects")
@Index(["name"], {unique: true})
export class Project extends Base {
  @Column()
  name: string;

  @DeleteDateColumn()
  deletedAt: Date;
}