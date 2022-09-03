import {
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert
} from 'typeorm';
import { generateId } from "../../../helpers/auth.helper";

@Entity()
export class Base {
  @BeforeInsert()
  setId() {
    this.id = generateId();
  }

  @PrimaryColumn({ type: 'varchar', length: 128 })
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
