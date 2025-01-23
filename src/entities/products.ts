import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Category } from "./category";

@Entity()
export class products {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column({ unique: true })
  description!: string;

  @Column("decimal")
  price!: number;

  @Column()
  stockQuantity!: number;

  @Column()
  images!: string;

  @ManyToOne(() => Category, (category) => category.products, { eager: true })
  category!: Category;

  @Column()
  availability!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
