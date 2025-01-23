import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { category } from "./category";

@Entity()
export class products {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column({ unique: true })
  desciption!: string;

  @Column("decimal")
  price!: number;

  @Column()
  stockQuality!: number;

  @Column()
  images!: string;

  @ManyToOne(() => category, (category) => category.products, { eager: true })
  category!: category;

  @Column()
  availability!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
