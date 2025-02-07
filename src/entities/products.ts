import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Category } from "./category";
import { User } from "./users";
import { OrderItem } from "./orderItems";
import { review } from "./entity";

@Entity()
export class products {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column({ unique: true })
  description!: string;

  @Column("decimal")
  price!: string;

  @Column()
  stockQuantity!: number;

  @Column({ type: "text", nullable: false, default: "default-image-url.jpg" })
  images!: string;

  @OneToMany(() => review, (review) => review.products)
  reviews!: review[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems!: OrderItem[];

  @ManyToOne(() => Category, (category) => category.products, { eager: true })
  category!: Category;

  @ManyToOne(() => User, (user) => user.products, { onDelete: "CASCADE" })
  user!: User;

  @Column()
  availability!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
