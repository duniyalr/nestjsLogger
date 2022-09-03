import { BeforeInsert, Column, Entity, JoinColumn, OneToMany, ManyToOne, CreateDateColumn, Index } from "typeorm";
import { Base } from "../../base/entities/base.entity";
import { generateSession } from "../../../helpers/auth.helper";
import { User } from "../../user/entities/user.entity";

@Entity("sessions")
@Index(["session"], {unique: true})
export class Session extends Base{
  @BeforeInsert()
  setSession() {
    this.session = generateSession();    
  }

  @Column() 
  session: string;

  @Column({type: "timestamp", nullable: true})
  expiredAt: Date;

  @ManyToOne((type) => User, (user) => user.sessions) 
  @JoinColumn()
  user: User;
}