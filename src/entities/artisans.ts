import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./users";

@Entity()
export class ArtisanProfile {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  businessName!: string;

  @Column()
  businessCategory!: string; 

  @Column()
  businessLocation!: string; 

  @Column({ type: "text", nullable: true })
  businessDescription!: string;

  @Column()
  contactInformation!: string; 

  // Relationship with User
  @OneToOne(() => User, (user) => user.artisanProfile, { cascade: true })
  @JoinColumn()
  user!: User;
}
