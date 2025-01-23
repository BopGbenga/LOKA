import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { products } from "./products";
@Entity()
export class category {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column({ unique: true })
  description!: string;

  @OneToMany(() => products, (product) => product.category)
  products!: products[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
