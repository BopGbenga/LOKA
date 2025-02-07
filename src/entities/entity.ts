import {
  Column,
  PrimaryColumnOptions,
  ManyToOne,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

import { User } from "./users";
import { products } from "./products";
import { string } from "joi";

@Entity()
export class review {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.reviews)
  user!: User;

  @ManyToOne(() => products, (product) => product.reviews)
  products!: products;

  @Column({ type: "int", width: 1 })
  rating!: number;

  @Column({ type: "text", nullable: true })
  comment!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
