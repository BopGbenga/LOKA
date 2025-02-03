import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from "typeorm";
import { Order } from "./order";
import { products } from "./products";

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Order, (order) => order.orderItems)
  order!: Order;

  @ManyToOne(() => products, (product) => product.orderItems) // Link to Product
  @JoinColumn({ name: "product_id" })
  product!: products;

  @Column()
  quantity!: number;

  @Column({ type: "decimal" })
  price!: number;
}
